import composePartContent from '@components/Lesson/UniversalLessonBlockComponents/composePartContent';
import {AddNewBlock} from '@components/Lesson/UniversalLessonBlockComponents/UtilityBlocks/AddNewBlock';
import EditOverlayBlock from '@components/Lesson/UniversalLessonBlockComponents/UtilityBlocks/EditOverlayBlock';
import {GlobalContext} from '@contexts/GlobalContext';
import {usePageBuilderContext} from '@contexts/PageBuilderContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import {RowComposerProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '@interfaces/UniversalLessonInterfaces';
import {FORM_TYPES} from '@UlbUI/common/constants';
import React, {useContext, useState} from 'react';
import {BuilderRowWrapper} from './BuilderRowWrapper';

const BuilderRowComposer = (props: RowComposerProps) => {
  const {
    mode,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    handleEditBlockContent,
    handleModalPopToggle,
  } = props;

  const {selectedComponent} = usePageBuilderContext();

  const [editedID, setEditedID] = useState<string>('');
  const {
    state: {userlessonPage: {themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

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
    selectedPageID,
    universalLessonDetails,
    previewMode,
    updateMovableList,
  } = useULBContext();

  const LastBlock = ({selectedPageDetails}: any) => {
    return !previewMode ? (
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
    ) : (
      <div />
    );
  };

  const selectedPageDetails = universalLessonDetails.lessonPlan.find(
    (page: UniversalLessonPage) => page.id === selectedPageID
  );

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
    <div>
      {selectedPageID &&
      selectedPageDetails &&
      selectedPageDetails.pageContent &&
      selectedPageDetails.pageContent.length > 0 ? (
        [
          selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number): any => (
            // ONE ROW
            <div
              key={`row_pagepart_${idx}`}
              className={`relative ${
                selectedComponent?.pageContentID && !selectedComponent?.partContentID
                  ? `opacity-${
                      pagePart.id === selectedComponent?.pageContentID ? '100' : '50'
                    } transition-opacity duration-200`
                  : ''
              }`}>
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
                    <ul className={pagePart.class}>
                      {pagePart.partContent.map((content: PartContent, idx2: number) => (
                        <li
                          key={content.id}
                          className={
                            selectedComponent?.pageContentID &&
                            selectedComponent?.partContentID
                              ? `transition-opacity duration-200 opacity-${
                                  selectedComponent?.partContentID === content.id
                                    ? '100'
                                    : '50'
                                } `
                              : ''
                          }>
                          <EditOverlayBlock
                            key={`pp_${idx}_pc_${idx2}`}
                            mode={mode}
                            classString={content.class}
                            contentID={content.id}
                            editedID={editedID}
                            pageContentID={pagePart.id}
                            contentType={content.type}
                            contentValue={content.value}
                            partContentID={content.id}
                            isComponent={true}
                            isLast={idx2 === pagePart.partContent?.length - 1}
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
                            createNewBlockULBHandler={createNewBlockULBHandler}
                            deleteFromULBHandler={deleteFromULBHandler}
                            updateFromULBHandler={updateFromULBHandler}>
                            {content.value.length > 0 ? (
                              <div className={`${paddingForHeader(content.type)}`}>
                                <div
                                  className={`${
                                    content.type === FORM_TYPES.JUMBOTRON ||
                                    content.type.includes('writing-exercise')
                                      ? 'px-4 pt-4'
                                      : content.type === 'header'
                                      ? ''
                                      : content.class
                                  }`}
                                  id={`${
                                    content.type === 'notes-form' ? '' : content.id
                                  }`}>
                                  {composePartContent(
                                    content.id,
                                    content.type,
                                    content.value,
                                    `pp_${idx}_pc_${idx2}`,
                                    content.class,
                                    pagePart.id,
                                    mode,
                                    updateBlockContentULBHandler,
                                    idx2,
                                    undefined, // notesData
                                    false // isStudent
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </EditOverlayBlock>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div
                      style={{minHeight: '60px'}}
                      className="flex w-auto items-center justify-center text-lg text-gray-600">
                      {/* Add this to dictionary */}
                      <h1 className={`w-auto text-center`}>This block has no content</h1>
                    </div>
                  )}
                </BuilderRowWrapper>
              </EditOverlayBlock>
            </div>
          )),
        ]
      ) : (
        <>
          <h1 className={`w-full ${themeTextColor} my-2 text-center`}>
            This page has no layout information.
          </h1>
        </>
      )}
    </div>
  );
};

export default BuilderRowComposer;
