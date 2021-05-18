import React, {useState} from 'react';
import {PagePart, PartContent} from '../../../interfaces/UniversalLessonInterfaces';
import {StringifyBlock} from './Blocks/StringifyBlock';
import {RowWrapper} from './RowWrapper';
import {HeaderBlock} from './Blocks/HeaderBlock';
import {ParagraphBlock} from './Blocks/ParagraphBlock';
import {FormBlock} from './Blocks/FormBlock';
import {RowComposerProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayBlock from './UtilityBlocks/EditOverlayBlock';
import {AddNewBlock} from './UtilityBlocks/AddNewBlock';

const RowComposer = (props: RowComposerProps) => {
  const {mode, selectedPageDetails, handleModalPopToggle} = props;
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
    if (type.includes('header')) {
      return (
        <HeaderBlock
          key={inputKey}
          id={id}
          dataIdAttribute={inputKey}
          type={type}
          value={value}
          mode={mode}
        />
      );
    } else if (type.includes('paragraph')) {
      return (
        <ParagraphBlock
          key={inputKey}
          id={id}
          dataIdAttribute={inputKey}
          type={type}
          value={value}
          mode={mode}
        />
      );
    } else if (type.includes('form')) {
      return (
        <FormBlock
          key={inputKey}
          id={id}
          dataIdAttribute={inputKey}
          value={value}
          mode={mode}
        />
      );
    } else {
      return (
        <StringifyBlock
          key={inputKey}
          id={id}
          dataIdAttribute={inputKey}
          anyObj={value}
          mode={mode}
        />
      );
    }
  };

  return (
    <>
      {selectedPageDetails && selectedPageDetails.pageContent.length > 0 ? (
        [
          selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number): any => (
            // ONE ROW
            <EditOverlayBlock
              mode={mode}
              key={`pp_${idx}`}
              contentID={`pp_${idx}`}
              editedID={editedID}>
              <RowWrapper
                mode={mode}
                hasContent={pagePart.partContent.length > 0}
                contentID={`pp_${idx}`}
                dataIdAttribute={`pp_${idx}`}
                pagePart={pagePart}>
                {pagePart.partContent.length > 0 ? (
                  pagePart.partContent.map((content: PartContent, idx2: number) => (
                    <EditOverlayBlock
                      key={`pp_${idx}_pc_${idx2}`}
                      mode={mode}
                      contentID={`pp_${idx}_pc_${idx2}`}
                      editedID={editedID}
                      isComponent={true}
                      handleEditBlockToggle={handleEditBlockToggle}>
                      {content.value.length > 0 ? (
                        content.value.map((value: any, idx3: number) =>
                          composePartContent(
                            content.id,
                            content.type,
                            value,
                            `pp_${idx}_pc_${idx2}_cv_${idx3}`
                          )
                        )
                      ) : (
                        <p>No content</p>
                      )}
                    </EditOverlayBlock>
                  ))
                ) : (
                  <h1 className={`w-full text-center`}>This pagepart has no content.</h1>
                )}
              </RowWrapper>
            </EditOverlayBlock>
          )),
          <EditOverlayBlock
            mode={mode}
            key={`pp_addNew`}
            contentID={`addNewRow`}
            editedID={editedID}>
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
            editedID={editedID}>
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
