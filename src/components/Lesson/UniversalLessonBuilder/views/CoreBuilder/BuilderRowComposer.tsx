import React, {useContext, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import {RowComposerProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {BuilderRowWrapper} from './BuilderRowWrapper';
import EditOverlayBlock from '../../../UniversalLessonBlockComponents/UtilityBlocks/EditOverlayBlock';
import {AddNewBlock} from '../../../UniversalLessonBlockComponents/UtilityBlocks/AddNewBlock';
import {AddNewBlockMini} from '../../../UniversalLessonBlockComponents/UtilityBlocks/AddNewBlockMini';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {findIndex, update} from 'lodash';
import composePartContent from '../../../UniversalLessonBlockComponents/composePartContent';
import { GlobalContext } from '../../../../../contexts/GlobalContext';

const BuilderRowComposer = (props: RowComposerProps) => {
  const {
    mode,
    createNewBlockULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    handleEditBlockContent,
    handleModalPopToggle,
    handleTagModalOpen,
  } = props;
  const [editedID, setEditedID] = useState<string>('');
  const {
    state: {lessonPage: {themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const {previewMode, updateMovableList, enableDnD} = useULBContext();

  const handleEditBlockToggle = (dataID: string) => {
    if (dataID) {
      if (editedID !== dataID) {
        setEditedID(dataID);
      } else {
        setEditedID('');
      }
    }
  };

  const {
    getCurrentPageIdx,
    selectedPageID,
    universalLessonDetails,
    setUniversalLessonDetails,
    getPartContent,
    getPageContent,
  } = useULBContext();

  const updateOnSave = (inputID: string, updatedText: string, pagePartId: string) => {
    const pageIdx = getCurrentPageIdx(selectedPageID);
    const pageContent = getPageContent(pageIdx);
    const pageContentIdx = findIndex(pageContent, (d: any) => d.id === pagePartId);
    const partContent = getPartContent(pageIdx, pageContentIdx);
    const partContentIdx = findIndex(partContent, (d: any) => d.id === inputID);

    const PATH_TO_PARTCONTENT = `lessonPlan[${pageIdx}].pageContent[${pageContentIdx}].partContent[${partContentIdx}].value`;

    update(universalLessonDetails, PATH_TO_PARTCONTENT, () => [updatedText]);
    setUniversalLessonDetails({...universalLessonDetails});
  };

  const selectedPageDetails = universalLessonDetails.lessonPlan.find(
    (page: UniversalLessonPage) => page.id === selectedPageID
  );

  const LastBlock = ({selectedPageDetails}: any) => {
    return !previewMode ? (
      <EditOverlayBlock
        mode={mode}
        key={`pp_addNew`}
        contentID={`addNewRow`}
        editedID={editedID}
        handleEditBlockToggle={() => handleEditBlockToggle(`addNewRow`)}
        createNewBlockULBHandler={createNewBlockULBHandler}
        updateFromULBHandler={updateFromULBHandler}>
        <BuilderRowWrapper mode={mode} hasContent={false} dataIdAttribute={`addNewRow`}>
          <AddNewBlock
            idx={selectedPageDetails.pageContent.length - 1}
            mode={mode}
            handleModalPopToggle={(dialogToToggle) =>
              handleModalPopToggle(
                dialogToToggle,
                selectedPageDetails.pageContent.length,
                'pageContent',
                selectedPageID
              )
            }
          />
        </BuilderRowWrapper>
      </EditOverlayBlock>
    ) : (
      <div />
    );
  };

  const handleOnDragEnd = (result: any, pageContentId: string, partContent: any) => {
    if (!result.destination) return;
    const items = Array.from(partContent);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateMovableList(items, 'pageContent', selectedPageID, pageContentId);
  };

  // this is only for header component
  const paddingForHeader = (type: any) => (type.includes('header') ? 'px-4 mb-3' : '');

  return (
    <>
      {selectedPageID &&
      selectedPageDetails &&
      selectedPageDetails.pageContent.length > 0 ? (
        [
          selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number): any => (
            // ONE ROW
            <div key={`row_pagepart_${idx}`} className="relative">
              <EditOverlayBlock
                key={`pp_${idx}`}
                mode={mode}
                isPagePart={true}
                classString={pagePart.class}
                createNewBlockULBHandler={createNewBlockULBHandler}
                deleteFromULBHandler={deleteFromULBHandler}
                updateFromULBHandler={updateFromULBHandler}
                contentID={`${pagePart.id}`}
                pageContentID={pagePart.id}
                editedID={editedID}
                handleEditBlockToggle={() => handleEditBlockToggle(pagePart.id)}
                section="pageContent">
                <BuilderRowWrapper
                  mode={mode}
                  hasContent={pagePart?.partContent?.length > 0}
                  contentID={pagePart.id}
                  classString={`${pagePart.class}`}
                  dataIdAttribute={`${pagePart.id}`}
                  pagePart={pagePart}>
                  {pagePart?.partContent?.length > 0 ? (
                    <DragDropContext
                      onDragEnd={(result) =>
                        handleOnDragEnd(result, pagePart.id, pagePart?.partContent)
                      }>
                      <Droppable isDropDisabled={!enableDnD} droppableId="partContent">
                        {(provided) => {
                          const partContent = pagePart?.partContent || [];
                          return (
                            <ul
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={pagePart.class}>
                              {partContent.map((content: PartContent, idx2: number) => (
                                <Draggable
                                  isDragDisabled={!enableDnD}
                                  draggableId={`pagePart_tree_${idx}_${idx2}`}
                                  index={idx2}
                                  key={`pagePart_tree_${idx}_${idx2}`}>
                                  {(provided) => {
                                    return (
                                      <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>
                                        <EditOverlayBlock
                                          key={`pp_${idx}_pc_${idx2}`}
                                          mode={mode}
                                          classString={content.class}
                                          contentID={content.id}
                                          editedID={editedID}
                                          pageContentID={pagePart.id}
                                          partContentID={content.id}
                                          isComponent={true}
                                          isLast={idx2 === partContent?.length - 1}
                                          handleEditBlockToggle={() =>
                                            handleEditBlockToggle(content.id)
                                          }
                                          handleEditBlockContent={() => {
                                            handleEditBlockContent(
                                              content.type,
                                              'partContent',
                                              content.value,
                                              pagePart.id,
                                              idx2,
                                              content.class
                                            );
                                          }}
                                          createNewBlockULBHandler={
                                            createNewBlockULBHandler
                                          }
                                          deleteFromULBHandler={deleteFromULBHandler}
                                          updateFromULBHandler={updateFromULBHandler}>
                                          {content.value.length > 0 ? (
                                            <div
                                              className={`${paddingForHeader(
                                                content.type
                                              )} ${content.class} `}
                                              id={content.id}>
                                              {composePartContent(
                                                content.id,
                                                content.type,
                                                content.value,
                                                `pp_${idx}_pc_${idx2}`,
                                                content.class,
                                                pagePart.id,
                                                mode,
                                                updateOnSave
                                              )}
                                            </div>
                                          ) : (
                                            <AddNewBlock
                                              idx={-1}
                                              mode={mode}
                                              handleModalPopToggle={(dialogToToggle) =>
                                                handleModalPopToggle(
                                                  dialogToToggle,
                                                  idx2,
                                                  'partContent',
                                                  pagePart.id
                                                )
                                              }
                                            />
                                          )}
                                        </EditOverlayBlock>
                                      </li>
                                    );
                                  }}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </ul>
                          );
                        }}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <div
                      style={{minHeight: '60px'}}
                      className="flex w-auto items-center justify-center text-lg text-gray-600">
                      {/* Add this to dictionary */}
                      <h1 className={`w-auto text-center`}>This block has no content</h1>
                    </div>
                  )}

                  {!previewMode && (
                    <div className="my-2 grid grid-cols-1">
                      <AddNewBlockMini
                        mode={mode}
                        handleModalPopToggle={(dialogToToggle) =>
                          handleModalPopToggle(
                            dialogToToggle,
                            pagePart?.partContent?.length,
                            'partContent',
                            pagePart.id
                          )
                        }
                      />
                    </div>
                  )}
                </BuilderRowWrapper>
              </EditOverlayBlock>

              {/* MINI "ADD NEW BLOCK" SHOWN AFTER ROW only displayed if not last row */}
              {/* {idx < selectedPageDetails.pageContent.length - 1 && !previewMode && (
                <AddNewBlockMini
                  mode={mode}
                  idx={idx}
                  handleModalPopToggle={(dialogToToggle) =>
                    handleModalPopToggle(dialogToToggle, idx + 1)
                  }
                />
              )} */}
            </div>
          )),
          // MAIN OVERLAY BLOCK AT BOTTOM OF PAGE
          <LastBlock selectedPageDetails={selectedPageDetails} key="last-block" />,
        ]
      ) : (
        <>
          <h1 className={`w-full ${themeTextColor} my-2 text-center`}>
            This page has no layout information.
          </h1>
          <h1 className={`w-full ${themeTextColor} my-2 text-center`}>
            Click on the below button to add components
          </h1>
          <EditOverlayBlock
            mode={mode}
            key={`pp_addNew`}
            contentID={`addNewRow`}
            editedID={editedID}
            handleEditBlockToggle={() => handleEditBlockToggle(`addNewRow`)}
            createNewBlockULBHandler={createNewBlockULBHandler}
            updateFromULBHandler={updateFromULBHandler}>
            <BuilderRowWrapper
              mode={mode}
              hasContent={false}
              dataIdAttribute={`addNewRow`}>
              <AddNewBlock
                idx={-1}
                mode={mode}
                handleModalPopToggle={handleModalPopToggle}
              />
            </BuilderRowWrapper>
          </EditOverlayBlock>
        </>
      )}
    </>
  );
};

export default BuilderRowComposer;
