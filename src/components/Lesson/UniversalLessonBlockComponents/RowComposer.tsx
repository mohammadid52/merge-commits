import React, {useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../interfaces/UniversalLessonInterfaces';
import {RowComposerProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';
import Buttons from '../../Atoms/Buttons';
import {StringifyBlock} from './Blocks/StringifyBlock';
import {RowWrapper} from './RowWrapper';
import {HeaderBlock} from './Blocks/HeaderBlock';
import {ParagraphBlock} from './Blocks/ParagraphBlock';
import {FormBlock} from './Blocks/FormBlock';
import {VideoBlock} from './Blocks/VideoBlock';
import EditOverlayBlock from './UtilityBlocks/EditOverlayBlock';
import {AddNewBlock} from './UtilityBlocks/AddNewBlock';
import {AddNewBlockMini} from './UtilityBlocks/AddNewBlockMini';
import TagBlock from './UtilityBlocks/TagBlock';
import {JumbotronBlock} from './Blocks/JumbotronBlock';
import {ImageBlock} from './Blocks/ImageBlock';
import KeywordBlock from './Blocks/KeywordBlock';
import {useULBContext} from '../../../contexts/UniversalLessonBuilderContext';
import PoemBlock from './Blocks/PoemBlock';
import HighlighterBlock from './Blocks/HighlighterBlock';
import LinksBlock from './Blocks/LinksBlock';
import {findIndex, update} from 'lodash';

const RowComposer = (props: RowComposerProps) => {
  const {
    mode,
    createNewBlockULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    setTargetID,
    handleEditBlockContent,
    handleModalPopToggle,
    handleTagModalOpen,
  } = props;
  const [editedID, setEditedID] = useState<string>('');
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

  const composePartContent = (
    id: string,
    type: string,
    value: any,
    inputKey: string,
    classString: string = '',
    pagePartId: string
  ) => {
    if (type.includes('jumbotron')) {
      return <JumbotronBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('keyword')) {
      return <KeywordBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('highlighter')) {
      return <HighlighterBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('poem')) {
      return <PoemBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('links')) {
      return <LinksBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('header')) {
      return (
        <HeaderBlock
          id={id}
          type={type}
          classString={classString}
          value={value}
          mode={mode}
          updateOnSave={updateOnSave}
          pagePartId={pagePartId}
        />
      );
    } else if (type.includes('paragraph')) {
      return (
        <ParagraphBlock
          updateOnSave={updateOnSave}
          id={id}
          pagePartId={pagePartId}
          type={type}
          value={value || []}
          mode={mode}
        />
      );
    } else if (type.includes('form')) {
      return <FormBlock id={id} value={value} mode={mode} />;
    } else if (type.includes('image')) {
      return (
        <ImageBlock
          key={inputKey}
          id={id}
          dataIdAttribute={inputKey}
          value={value[0]}
          mode={mode}
        />
      );
    } else if (type.includes('video')) {
      return (
        <VideoBlock
          key={inputKey}
          id={id}
          dataIdAttribute={inputKey}
          value={value[0]}
          mode={mode}
        />
      );
    } else {
      return <StringifyBlock key={inputKey} id={id} anyObj={value} mode={mode} />;
    }
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
        <RowWrapper mode={mode} hasContent={false} dataIdAttribute={`addNewRow`}>
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
        </RowWrapper>
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

    updateMovableList(items, selectedPageID, pageContentId);
  };

  return (
    <>
      {selectedPageID &&
      selectedPageDetails &&
      selectedPageDetails.pageContent.length > 0 ? (
        [
          selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number): any => (
            // ONE ROW
            <div key={`row_pagepart_${idx}`} className="relative">
              <div
                className={`absolute w-auto bottom-${
                  idx === selectedPageDetails.pageContent.length - 1 || previewMode
                    ? 2
                    : 4
                } right-2 z-100`}>
                {pagePart.tags && pagePart.tags.filter(Boolean).length ? (
                  <TagBlock
                    tags={pagePart.tags}
                    handleEditTag={() =>
                      handleTagModalOpen(pagePart.id, {tags: pagePart.tags || []})
                    }
                  />
                ) : !previewMode ? (
                  <button
                    className=" flex items-center
                      w-auto 
                      px-2
                      cursor-pointer 
                      text-xs text-center bg-blue-200 text-blue-700 rounded-lg z-100 .-mb-2"
                    style={{marginBottom: '-6px'}}
                    onClick={() =>
                      handleTagModalOpen(pagePart.id, {tags: pagePart.tags || []})
                    }>
                    <span className="w-8 h-8 flex items-center">
                      <FaPlus />
                    </span>
                    Add tag
                  </button>
                ) : null}
              </div>

              <EditOverlayBlock
                key={`pp_${idx}`}
                mode={mode}
                isPagePart={true}
                classString={pagePart.class}
                createNewBlockULBHandler={createNewBlockULBHandler}
                deleteFromULBHandler={deleteFromULBHandler}
                updateFromULBHandler={updateFromULBHandler}
                contentID={`${pagePart.id}`}
                editedID={editedID}
                handleEditBlockToggle={() => handleEditBlockToggle(pagePart.id)}
                section="pageContent">
                <RowWrapper
                  mode={mode}
                  hasContent={pagePart.partContent.length > 0}
                  contentID={pagePart.id}
                  classString={`${pagePart.class}`}
                  dataIdAttribute={`${pagePart.id}`}
                  pagePart={pagePart}>
                  {pagePart.partContent.length > 0 ? (
                    <DragDropContext
                      onDragEnd={(result) =>
                        handleOnDragEnd(result, pagePart.id, pagePart.partContent)
                      }>
                      <Droppable isDropDisabled={!enableDnD} droppableId="partContent">
                        {(provided) => {
                          const partContent = pagePart.partContent;
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
                                          isComponent={true}
                                          isLast={idx2 === partContent.length - 1}
                                          handleEditBlockToggle={() =>
                                            handleEditBlockToggle(content.id)
                                          }
                                          handleEditBlockContent={() =>
                                            handleEditBlockContent(
                                              content.type,
                                              'partContent',
                                              content.value,
                                              pagePart.id,
                                              idx2
                                            )
                                          }
                                          createNewBlockULBHandler={
                                            createNewBlockULBHandler
                                          }
                                          deleteFromULBHandler={deleteFromULBHandler}
                                          updateFromULBHandler={updateFromULBHandler}>
                                          {content.value.length > 0 ? (
                                            <div
                                              className={content.class}
                                              id={content.id}>
                                              {composePartContent(
                                                content.id,
                                                content.type,
                                                content.value,
                                                `pp_${idx}_pc_${idx2}`,
                                                content.class,
                                                pagePart.id
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
                    // ) : (
                    // <></>
                    // <ul className={pagePart.class}>
                    //   {pagePart.partContent.map(
                    //     (content: PartContent, idx2: number) => (
                    //       <li>
                    //         <EditOverlayBlock
                    //           key={`pp_${idx}_pc_${idx2}`}
                    //           mode={mode}
                    //           classString={content.class}
                    //           contentID={content.id}
                    //           editedID={editedID}
                    //           isComponent={true}
                    //           isLast={idx2 === pagePart.partContent.length - 1}
                    //           handleEditBlockToggle={() =>
                    //             handleEditBlockToggle(content.id)
                    //           }
                    //           handleEditBlockContent={() =>
                    //             handleEditBlockContent(
                    //               content.type,
                    //               'partContent',
                    //               content.value,
                    //               pagePart.id,
                    //               idx2
                    //             )
                    //           }
                    //           createNewBlockULBHandler={createNewBlockULBHandler}
                    //           deleteFromULBHandler={deleteFromULBHandler}
                    //           updateFromULBHandler={updateFromULBHandler}>
                    //           {content.value.length > 0 ? (
                    //             <div className={content.class} id={content.id}>
                    //               {composePartContent(
                    //                 content.id,
                    //                 content.type,
                    //                 content.value,
                    //                 `pp_${idx}_pc_${idx2}`,
                    //                 content.class
                    //               )}
                    //             </div>
                    //           ) : (
                    //             <AddNewBlock
                    //               idx={-1}
                    //               mode={mode}
                    //               handleModalPopToggle={(dialogToToggle) =>
                    //                 handleModalPopToggle(
                    //                   dialogToToggle,
                    //                   idx2,
                    //                   'partContent',
                    //                   pagePart.id
                    //                 )
                    //               }
                    //             />
                    //           )}
                    //         </EditOverlayBlock>
                    //       </li>
                    //     )
                    //   )}
                    // </ul>
                    // )
                    <h1 className={`w-full text-center`}>
                      This pagepart has no content.
                    </h1>
                  )}

                  {!previewMode && (
                    <div className="my-2 grid grid-cols-1">
                      <AddNewBlockMini
                        mode={mode}
                        handleModalPopToggle={(dialogToToggle) =>
                          handleModalPopToggle(
                            dialogToToggle,
                            pagePart.partContent.length,
                            'partContent',
                            pagePart.id
                          )
                        }
                      />
                    </div>
                  )}
                </RowWrapper>
              </EditOverlayBlock>

              {/* MINI "ADD NEW BLOCK" SHOWN AFTER ROW only displayed if not last row */}
              {idx < selectedPageDetails.pageContent.length - 1 && !previewMode && (
                <AddNewBlockMini
                  mode={mode}
                  idx={idx}
                  handleModalPopToggle={(dialogToToggle) =>
                    handleModalPopToggle(dialogToToggle, idx + 1)
                  }
                />
              )}
            </div>
          )),
          // MAIN OVERLAY BLOCK AT BOTTOM OF PAGE
          <LastBlock selectedPageDetails={selectedPageDetails} key="last-block" />,
        ]
      ) : (
        <>
          <h1 className={`w-full text-center`}>This page has no layout information.</h1>
          <EditOverlayBlock
            mode={mode}
            key={`pp_addNew`}
            contentID={`addNewRow`}
            editedID={editedID}
            handleEditBlockToggle={() => handleEditBlockToggle(`addNewRow`)}
            createNewBlockULBHandler={createNewBlockULBHandler}
            updateFromULBHandler={updateFromULBHandler}>
            <RowWrapper mode={mode} hasContent={false} dataIdAttribute={`addNewRow`}>
              <AddNewBlock
                idx={-1}
                mode={mode}
                handleModalPopToggle={handleModalPopToggle}
              />
            </RowWrapper>
          </EditOverlayBlock>
        </>
      )}
    </>
  );
};

export default RowComposer;
