import React, { useContext } from 'react';
import { PagePart, PartContent, UniversalLessonPage } from '../../../interfaces/UniversalLessonInterfaces';
import { StringifyBlock } from './Blocks/StringifyBlock';
import { RowWrapper } from './RowWrapper';
import { PageWrapper } from './PageWrapper';
import { HeaderBlock } from './Blocks/HeaderBlock';

const RowComposer = (props: { selectedPageDetails: UniversalLessonPage }) => {
  const { selectedPageDetails } = props;

  const composePartContent = (id: string, type: string, value: any, inputKey: string) => {
    if (type.includes('header')) {
      return <HeaderBlock key={inputKey} id={id} type={type} value={value} />;
    } else {
      return <StringifyBlock key={inputKey} id={id} anyObj={value} />;
    }
  };

  return selectedPageDetails ? (
    <PageWrapper selectedPageDetails={selectedPageDetails}>
      {/* ONE PAGE */}

      {selectedPageDetails.pageContent.length > 0 &&
        selectedPageDetails.pageContent.map((pagePart: PagePart, idx: number) => (
          // ONE ROW
          <RowWrapper key={`pp_${idx}`} pagePart={pagePart}>
            <p>PARTCONTENT:</p>
            {pagePart.partContent.length > 0 ? (
              pagePart.partContent.map((content: PartContent, idx2: number) => (
                <div id={content.id} key={`pp_${idx}_pc_${idx2}`}>
                  <p>{content.type}</p>
                  {content.value.length > 0 ? (
                    content.value.map((value: any, idx3: number) =>
                      composePartContent(content.id, content.type, value, `pp_${idx}_pc_${idx2}_cv_${idx3}`)
                    )
                  ) : (
                    <p>No content</p>
                  )}
                </div>
              ))
            ) : (
              <h1>This pagepart has no content.</h1>
            )}
          </RowWrapper>
        ))}
    </PageWrapper>
  ) : (
    <h1>This page has no layout information.</h1>
  );
};

export default RowComposer;
