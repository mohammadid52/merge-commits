import React, {useState} from 'react';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../interfaces/UniversalLessonInterfaces';
import {StringifyBlock} from './Blocks/StringifyBlock';
import {RowWrapper} from './RowWrapper';
import {HeaderBlock} from './Blocks/HeaderBlock';
import {ParagraphBlock} from './Blocks/ParagraphBlock';
import {FormBlock} from './Blocks/FormBlock';
import {VideoBlock} from './Blocks/VideoBlock';
import {RowComposerProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayBlock from './UtilityBlocks/EditOverlayBlock';
import {AddNewBlock} from './UtilityBlocks/AddNewBlock';
import {AddNewBlockMini} from './UtilityBlocks/AddNewBlockMini';
import {JumbotronBlock} from './Blocks/JumbotronBlock';
import { ImageBlock } from './Blocks/ImageBlock';
import KeywordBlock from './Blocks/KeywordBlock';
import {useULBContext} from '../../../contexts/UniversalLessonBuilderContext';

const RowComposer = (props: RowComposerProps) => {
  const {
    mode,
    deleteFromULBHandler,
    updateFromULBHandler,
    universalLessonDetails,
    selectedPageID,
    setTargetID,
    handleModalPopToggle,
  } = props;
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

  const composePartContent = (id: string, type: string, value: any, inputKey: string) => {
    if (type.includes('jumbotron')) {
      return <JumbotronBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('keyword')) {
      return <KeywordBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('header')) {
      return <HeaderBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('paragraph')) {
      return <ParagraphBlock id={id} type={type} value={value || []} mode={mode} />;
    } else if (type.includes('form')) {
      return <FormBlock id={id} value={value} mode={mode} />;
    }else if (type.includes('image')) {
      return (
        <ImageBlock
          key={inputKey}
          id={id}
          dataIdAttribute={inputKey}
          value={value[0]}
          mode={mode}
        />
      );
    }else if (type.includes('video')) {
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

  const {previewMode} = useULBContext();

  const LastBlock = ({selectedPageDetails}: any) => {
    return !previewMode ? (
      <EditOverlayBlock
        mode={mode}
        key={`pp_addNew`}
        contentID={`addNewRow`}
        editedID={editedID}
        handleEditBlockToggle={() => handleEditBlockToggle(`addNewRow`)}>
        <RowWrapper mode={mode} hasContent={false} dataIdAttribute={`addNewRow`}>
          <AddNewBlock
            idx={selectedPageDetails.pageContent.length - 1}
            mode={mode}
            handleModalPopToggle={(dialogToToggle) =>
              handleModalPopToggle(dialogToToggle, selectedPageDetails.pageContent.length, 'pageContent', selectedPageID)
            }
          />
        </RowWrapper>
      </EditOverlayBlock>
    ) : (
      <div />
    );
  };

  return (
    <>
      {selectedPageID &&
      selectedPageDetails &&
      selectedPageDetails.pageContent.length > 0 ? (
        [
          selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number): any => (
            // ONE ROW
            <React.Fragment key={`row_pagepart_${idx}`}>
              <EditOverlayBlock
                key={`pp_${idx}`}
                mode={mode}
                isPagePart={true}
                classString={pagePart.class}
                deleteFromULBHandler={deleteFromULBHandler}
                updateFromULBHandler={updateFromULBHandler}
                contentID={`${pagePart.id}`}
                editedID={editedID}
                handleEditBlockToggle={() => handleEditBlockToggle(pagePart.id)}>
                <RowWrapper
                  mode={mode}
                  hasContent={pagePart.partContent.length > 0}
                  contentID={pagePart.id}
                  classString={pagePart.class}
                  dataIdAttribute={`${pagePart.id}`}
                  pagePart={pagePart}>
                  {pagePart.partContent.length > 0 ? (
                    pagePart.partContent.map((content: PartContent, idx2: number) => (
                      <EditOverlayBlock
                        key={`pp_${idx}_pc_${idx2}`}
                        mode={mode}
                        contentID={content.id}
                        editedID={editedID}
                        isComponent={true}
                        isLast={idx2 === pagePart.partContent.length - 1}
                        handleEditBlockToggle={() => handleEditBlockToggle(content.id)}
                        deleteFromULBHandler={deleteFromULBHandler}>
                        {content.value.length > 0 ? (
                          composePartContent(
                            content.id,
                            content.type,
                            content.value,
                            `pp_${idx}_pc_${idx2}`
                          )
                        ) : (
                          <p>No content</p>
                        )}
                      </EditOverlayBlock>
                    ))
                  ) : (
                    <h1 className={`w-full text-center`}>
                      This pagepart has no content.
                    </h1>
                  )}
                  {!previewMode && 
                    <div className="my-2">
                      <AddNewBlockMini
                        mode={mode}
                        handleModalPopToggle={(dialogToToggle) =>
                          handleModalPopToggle(
                            dialogToToggle,
                            pagePart.partContent.length + 1,
                            'partContent',
                            pagePart.id
                          )
                        }
                      />
                    </div>
                  }
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
            </React.Fragment>
          )),
          // MAIN OVERLAY BLOCK AT BOTTOM OF PAGE
          <LastBlock selectedPageDetails={selectedPageDetails} />,
        ]
      ) : (
        <>
          <h1 className={`w-full text-center`}>This page has no layout information.</h1>
          <EditOverlayBlock
            mode={mode}
            key={`pp_addNew`}
            contentID={`addNewRow`}
            editedID={editedID}
            handleEditBlockToggle={() => handleEditBlockToggle(`addNewRow`)}>
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
