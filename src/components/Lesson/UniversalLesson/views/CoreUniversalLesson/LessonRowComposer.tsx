import {filter, reject} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import composePartContent from '../../../UniversalLessonBlockComponents/composePartContent';
import {FORM_TYPES} from '../../../UniversalLessonBuilder/UI/common/constants';
import Downloadables from '../../../UniversalLessonBuilder/UI/UIComponents/Downloadables';
import {BuilderRowWrapper} from '../../../UniversalLessonBuilder/views/CoreBuilder/BuilderRowWrapper';
import LessonModule from './LessonModule';

const LessonRowComposer = () => {
  const {
    state: {user, lessonPage = {}},

    lessonState,
  } = useContext(GlobalContext);
  const [activePageData, setActivePageData] = useState<UniversalLessonPage>();

  const [currentLesson, setCurrentLesson] = useState<any>();

  const downloadables =
    activePageData && activePageData.pageContent && activePageData.pageContent.length > 0
      ? filter(activePageData.pageContent, (f) => f.id.includes('downloadable-files'))
      : [];

  const removeDownloadablesFromlist =
    activePageData && activePageData.pageContent && activePageData.pageContent.length > 0
      ? reject(activePageData.pageContent, (f) => f.id.includes('downloadable-files'))
      : [];

  useEffect(() => {
    const parentContainer = document.querySelector('html');
    if (parentContainer) {
      if (lessonPage) {
        if (lessonPage.theme === 'dark') {
          parentContainer.classList.add('dark');
        } else {
          parentContainer.classList.remove('dark');
        }
      }
    }
  }, [lessonPage]);

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    const PAGES = lessonState.lessonData.lessonPlan;
    if (PAGES) {
      const CURRENT_PAGE = lessonState.currentPage;
      const ACTIVE_PAGE_DATA = PAGES[CURRENT_PAGE];
      setActivePageData(ACTIVE_PAGE_DATA);
    }
    if (lessonState.lessonData) {
      setCurrentLesson(lessonState.lessonData);
    }
  }, [lessonState.lessonData, lessonState.currentPage]);

  // this is only for header component
  const paddingForHeader = (type: any) => (type.includes('header') ? 'px-4 mb-3' : '');
  return (
    <div>
      {removeDownloadablesFromlist &&
        removeDownloadablesFromlist.map((pagePart: PagePart, idx: number): any => (
          <div key={`row_pagepart_${idx}`} className="relative">
            <div
              className={`w-auto bottom-${
                idx === removeDownloadablesFromlist.length - 1 ? 2 : 4
              } right-2 z-100`}>
              <BuilderRowWrapper
                mode={'lesson'}
                hasContent={pagePart.partContent?.length > 0}
                contentID={pagePart.id}
                classString={pagePart.class}
                dataIdAttribute={pagePart.id}
                pagePart={pagePart}>
                {pagePart.partContent?.length > 0 &&
                  pagePart.partContent.map((content: PartContent, idx2: number) => {
                    if (content.value.length > 0) {
                      return (
                        <div
                          key={`row_pagepart_${idx}_${idx2}`}
                          className={`${paddingForHeader(content.type)}`}>
                          <div
                            className={`${
                              content.type === FORM_TYPES.JUMBOTRON ? 'px-4 pt-4' : ''
                            }`}
                            id={content.id}>
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

      {user.role === 'ST' && (
        <>
          {downloadables && downloadables.length > 0 && (
            <Downloadables
              downloadables={downloadables}
              showDownloadMenu={showDownloadMenu}
              setShowDownloadMenu={setShowDownloadMenu}
            />
          )}

          <LessonModule currentLesson={currentLesson} />
        </>
      )}
    </div>
  );
};

export default LessonRowComposer;
