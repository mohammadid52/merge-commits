import React, {useContext, useEffect, useState} from 'react';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import composePartContent from '../../../UniversalLessonBlockComponents/composePartContent';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {BuilderRowWrapper} from '../../../UniversalLessonBuilder/views/CoreBuilder/BuilderRowWrapper';

const LessonRowComposer = () => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const [activePageData, setActivePageData] = useState<any>();

  useEffect(() => {
    const PAGES = lessonState.lessonData.lessonPlan;
    if (PAGES) {
      const CURRENT_PAGE = lessonState.currentPage;
      const ACTIVE_PAGE_DATA = PAGES[CURRENT_PAGE];
      setActivePageData(ACTIVE_PAGE_DATA);
    }
  }, [lessonState.lessonData]);

  return (
    <>
      {activePageData &&
        activePageData.pageContent.map((pagePart: PagePart, idx: number): any => (
          <div key={`row_pagepart_${idx}`} className="relative">
            <div
              className={`w-auto bottom-${
                idx === activePageData.pageContent.length - 1 ? 2 : 4
              } right-2 z-100`}>
              <BuilderRowWrapper
                mode={'lesson'}
                hasContent={pagePart.partContent.length > 0}
                contentID={pagePart.id}
                classString={pagePart.class}
                dataIdAttribute={pagePart.id}
                pagePart={pagePart}>
                {pagePart.partContent.length > 0 &&
                  pagePart.partContent.map((content: PartContent, idx2: number) => {
                    if (content.value.length > 0) {
                      return (
                        <div className={content.class} id={content.id}>
                          {composePartContent(
                            content.id,
                            content.type,
                            content.value,
                            `pp_${idx}_pc_${idx2}`,
                            content.class,
                            pagePart.id,
                            'lesson'
                          )}
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
              </BuilderRowWrapper>
            </div>
          </div>
        ))}
    </>
  );
};

export default LessonRowComposer;
