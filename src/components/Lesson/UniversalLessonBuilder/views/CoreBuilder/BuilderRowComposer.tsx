import {FORM_TYPES} from '@UlbUI/common/constants';
import Buttons from 'atoms/Buttons';
import composePartContent from 'components/Lesson/UniversalLessonBlockComponents/composePartContent';
import EditOverlayBlock from 'components/Lesson/UniversalLessonBlockComponents/UtilityBlocks/EditOverlayBlock';
import {usePageBuilderContext} from 'contexts/PageBuilderContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import {RowComposerProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {
  PagePart,
  PartContent,
  UniversalLessonPage
} from 'interfaces/UniversalLessonInterfaces';
import {useState} from 'react';
import {BuilderRowWrapper} from './BuilderRowWrapper';

const BuilderRowComposer = (props: RowComposerProps) => {
  const {
    mode,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    handleEditBlockContent,
    handleModalPopToggle
  } = props;

  const {selectedComponent, setNavState, navState} = usePageBuilderContext();

  const [editedID, setEditedID] = useState<string>('');

  const handleEditBlockToggle = (dataID: string) => {
    if (dataID) {
      if (editedID !== dataID) {
        setEditedID(dataID);
      } else {
        setEditedID('');
      }
    }
  };

  const openNewContentWindow = () => {
    setNavState('addContent');
  };

  const {selectedPageID, universalLessonDetails} = useULBContext();

  const selectedPageDetails = universalLessonDetails.lessonPlan.find(
    (page: UniversalLessonPage) => page.id === selectedPageID
  );

  // this is only for header component

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
              key={`row_pagepart_${pagePart.id}`}
              className={`relative ${
                selectedComponent?.pageContentID && !selectedComponent?.partContentID
                  ? `opacity-${
                      pagePart.id === selectedComponent?.pageContentID ? '100' : '50'
                    } `
                  : ''
              } transition-opacity duration-200`}>
              <EditOverlayBlock
                mode={mode}
                isPagePart={true}
                classString={pagePart?.class || ''}
                createNewBlockULBHandler={createNewBlockULBHandler}
                deleteFromULBHandler={deleteFromULBHandler}
                updateFromULBHandler={updateFromULBHandler}
                contentID={`${pagePart.id}`}
                pageContentID={pagePart?.id || ''}
                editedID={editedID}
                handleEditBlockToggle={() => handleEditBlockToggle(pagePart?.id || '')}
                section="pageContent">
                <BuilderRowWrapper
                  mode={mode}
                  hasContent={pagePart?.partContent?.length > 0}
                  contentID={pagePart.id}
                  classString={`${pagePart.class}`}
                  dataIdAttribute={`${pagePart.id}`}
                  pagePart={pagePart}>
                  {pagePart?.partContent?.length > 0 ? (
                    <ul className={`${pagePart.class} `}>
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
                            mode={mode}
                            classString={content.class}
                            contentID={content.id}
                            editedID={editedID}
                            pageContentID={pagePart.id}
                            contentType={content.type}
                            handleModalPopToggle={handleModalPopToggle}
                            contentValue={content.value}
                            partContentID={content.id}
                            isComponent={true}
                            isLast={idx2 === pagePart.partContent?.length - 1}
                            handleEditBlockToggle={() =>
                              handleEditBlockToggle(content.id)
                            }
                            handleEditBlockContent={() => {
                              handleEditBlockContent?.(
                                content?.value &&
                                  content?.value[0]?.type === FORM_TYPES.ATTACHMENTS
                                  ? FORM_TYPES.ATTACHMENTS
                                  : content?.type || '',
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
                              <div
                                className={`${
                                  content.type === FORM_TYPES.JUMBOTRON
                                    ? 'px-0 pt-4'
                                    : content.type === 'header' ||
                                      content.type === 'image' ||
                                      content.type === 'customVideo' ||
                                      content.type === 'divider'
                                    ? ''
                                    : content.class
                                } ${
                                  (content.type.includes('form') &&
                                    content.type !== 'notes-form') ||
                                  content.type.includes(FORM_TYPES.POEM) ||
                                  content.type.includes(FORM_TYPES.WRITING_EXERCISE)
                                    ? ''
                                    : 'space-y-4'
                                } mt-4 `}
                                id={`${content.type === 'notes-form' ? '' : content.id}`}>
                                {composePartContent(
                                  content.id,
                                  content.type || '',
                                  content.value,
                                  `pp_${idx}_pc_${idx2}`,
                                  content.class,
                                  pagePart.id,
                                  mode,
                                  updateBlockContentULBHandler,
                                  idx2,
                                  undefined, // notesData
                                  false // isStudent,
                                )}
                              </div>
                            ) : null}
                          </EditOverlayBlock>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div
                      style={{minHeight: '60px'}}
                      className="flex w-auto items-center justify-center text-lg text-medium ">
                      {/* Add this to dictionary */}
                      <h1 className={`w-auto text-center`}>This block has no content</h1>
                    </div>
                  )}
                </BuilderRowWrapper>
              </EditOverlayBlock>
            </div>
          ))
        ]
      ) : (
        <div className="flex flex-col items-center justify-center w-auto">
          <h1 className={`w-full text-white my-2 mb-4 text-center`}>
            {navState !== 'addContent'
              ? 'No content added yet. Click on the button to add content.'
              : 'Now select a component type'}
          </h1>
          {navState !== 'addContent' && (
            <Buttons label={'Add now'} onClick={openNewContentWindow} />
          )}
        </div>
      )}
    </div>
  );
};

export default BuilderRowComposer;
