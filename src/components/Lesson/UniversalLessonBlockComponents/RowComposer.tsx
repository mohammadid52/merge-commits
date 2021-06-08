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
import {RowComposerProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayBlock from './UtilityBlocks/EditOverlayBlock';
import {AddNewBlock} from './UtilityBlocks/AddNewBlock';
import {AddNewBlockMini} from './UtilityBlocks/AddNewBlockMini';
import {JumbotronBlock} from './Blocks/JumbotronBlock';

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
    } else if (type.includes('header')) {
      return <HeaderBlock id={id} type={type} value={value} mode={mode} />;
    } else if (type.includes('paragraph')) {
      return <ParagraphBlock id={id} type={type} value={value || []} mode={mode} />;
    } else if (type.includes('form')) {
      return <FormBlock id={id} value={value} mode={mode} />;
    } else {
      return <StringifyBlock key={inputKey} id={id} anyObj={value} mode={mode} />;
    }
  };

  const selectedPageDetails = universalLessonDetails.universalLessonPages.find(
    (page: UniversalLessonPage) => page.id === selectedPageID
  );

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
                </RowWrapper>
              </EditOverlayBlock>

              {/* MINI "ADD NEW BLOCK" SHOWN AFTER ROW only displayed if not last row */}
              {idx < selectedPageDetails.pageContent.length - 1 && (
                <AddNewBlockMini
                  mode={mode}
                  handleModalPopToggle={handleModalPopToggle}
                />
              )}
            </React.Fragment>
          )),
          // MAIN OVERLAY BLOCK AT BOTTOM OF PAGE
          <EditOverlayBlock
            mode={mode}
            key={`pp_addNew`}
            contentID={`addNewRow`}
            editedID={editedID}
            handleEditBlockToggle={() => handleEditBlockToggle(`addNewRow`)}>
            <RowWrapper mode={mode} hasContent={false} dataIdAttribute={`addNewRow`}>
              <AddNewBlock mode={mode} handleModalPopToggle={handleModalPopToggle} />
            </RowWrapper>
          </EditOverlayBlock>,
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
              <AddNewBlock mode={mode} handleModalPopToggle={handleModalPopToggle} />
            </RowWrapper>
          </EditOverlayBlock>
        </>
      )}
    </>
  );
};

export default RowComposer;
