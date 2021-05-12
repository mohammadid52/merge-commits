import React, {useContext} from 'react';
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

  const composePartContent = (id: string, type: string, value: any, inputKey: string) => {
    if (type.includes('header')) {
      return <HeaderBlock key={inputKey} id={id} type={type} value={value} />;
    } else if (type.includes('paragraph')) {
      return <ParagraphBlock key={inputKey} id={id} type={type} value={value} />;
    } else if (type.includes('form')) {
      return <FormBlock key={inputKey} value={value} />;
    } else {
      return <StringifyBlock key={inputKey} id={id} anyObj={value} />;
    }
  };

  return (
    <>
      {selectedPageDetails && selectedPageDetails.pageContent.length > 0 ? (
        selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number): any => (
          // ONE ROW
          <RowWrapper key={`pp_${idx}`} pagePart={pagePart} mode={mode}>
            {pagePart.partContent.length > 0 ? (
              pagePart.partContent.map((content: PartContent, idx2: number) => (
                <div id={content.id} key={`pp_${idx}_pc_${idx2}`}>
                  {content.value.length > 0 ? (
                    content.value.map((value: any, idx3: number) => (
                      <EditOverlayBlock mode={mode}>
                        {composePartContent(
                          content.id,
                          content.type,
                          value,
                          `pp_${idx}_pc_${idx2}_cv_${idx3}`
                        )}
                      </EditOverlayBlock>
                    ))
                  ) : (
                    <p>No content</p>
                  )}
                </div>
              ))
            ) : (
              <h1 className={`w-full text-center`}>This pagepart has no content.</h1>
            )}
          </RowWrapper>
        ))
      ) : (
        <h1 className={`w-full text-center`}>This page has no layout information.</h1>
      )}
    </>
  );
};

export default RowComposer;
