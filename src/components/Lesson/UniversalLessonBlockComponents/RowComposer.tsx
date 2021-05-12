import React, {useContext, useState} from 'react';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '../../../interfaces/UniversalLessonInterfaces';
import {StringifyBlock} from './Blocks/StringifyBlock';
import {RowWrapper} from './RowWrapper';
import {LessonPageWrapper} from './LessonPageWrapper';
import {HeaderBlock} from './Blocks/HeaderBlock';
import {ParagraphBlock} from './Blocks/ParagraphBlock';
import {FormBlock} from './Blocks/FormBlock';
import {AddNewBlock} from './UtilityBlocks/AddNewBlock';
import {RowComposerProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayBlock from './UtilityBlocks/EditOverlayBlock';

const RowComposer = (props: RowComposerProps) => {
  const {mode, selectedPageDetails, handleModalPopToggle} = props;
  const [hoveredID, setHoveredID] = useState<string>('');

  const handleMouseOverToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    const t = e.currentTarget as HTMLElement;

    if (t.id) {
      console.log('id under mouse -- ', t.id);
      if (hoveredID !== t.id) {
        setHoveredID(t.id);
      } else {
        setHoveredID('');
      }
    }
  };

  const composePartContent = (
    id: string,
    type: string,
    value: any,
    inputKey: string,
    handleMouseOverToggle?: any
  ) => {
    if (type.includes('header')) {
      return (
        <HeaderBlock
          key={inputKey}
          id={id}
          type={type}
          value={value}
          mode={mode}
          handleMouseOverToggle={handleMouseOverToggle}
        />
      );
    } else if (type.includes('paragraph')) {
      return (
        <ParagraphBlock
          key={inputKey}
          id={id}
          type={type}
          value={value}
          mode={mode}
          handleMouseOverToggle={handleMouseOverToggle}
        />
      );
    } else if (type.includes('form')) {
      return (
        <FormBlock
          key={inputKey}
          value={value}
          mode={mode}
          handleMouseOverToggle={handleMouseOverToggle}
        />
      );
    } else {
      return (
        <StringifyBlock
          key={inputKey}
          id={id}
          anyObj={value}
          mode={mode}
          handleMouseOverToggle={handleMouseOverToggle}
        />
      );
    }
  };

  return (
    <>
      {selectedPageDetails && selectedPageDetails.pageContent.length > 0 ? (
        selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number): any => (
          // ONE ROW
          <EditOverlayBlock
            mode={mode}
            key={`pp_${idx}`}
            contentID={`pp_${idx}`}
            hoveredID={hoveredID}>
            <RowWrapper
              contentID={`pp_${idx}`}
              pagePart={pagePart}
              mode={mode}
              handleMouseOverToggle={handleMouseOverToggle}>
              {pagePart.partContent.length > 0 ? (
                pagePart.partContent.map((content: PartContent, idx2: number) => (
                  <EditOverlayBlock
                    key={`pp_${idx}_pc_${idx2}`}
                    mode={mode}
                    contentID={content.id}
                    hoveredID={hoveredID}>
                    {content.value.length > 0 ? (
                      content.value.map((value: any, idx3: number) =>
                        composePartContent(
                          content.id,
                          content.type,
                          value,
                          `pp_${idx}_pc_${idx2}_cv_${idx3}`,
                          handleMouseOverToggle
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
        ))
      ) : (
        <h1 className={`w-full text-center`}>This page has no layout information.</h1>
      )}
    </>
  );
};

export default RowComposer;
