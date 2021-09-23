import NotesFab from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesFab';
import {filter} from 'lodash';
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
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
  const gContext = useContext(GlobalContext);

  const gState = gContext.state;
  const {user, lessonPage} = gState;
  const [activePageData, setActivePageData] = useState<UniversalLessonPage>();

  const [currentLesson, setCurrentLesson] = useState<any>();

  const getSeparateData = (id: string) =>
    activePageData && activePageData.pageContent && activePageData.pageContent.length > 0
      ? filter(activePageData.pageContent, (f) => f.id.includes(id))
      : [];

  const downloadables = getSeparateData('downloadable-files');
  const notes = getSeparateData('notes-container');

  const getRemovedDownloadablesFromlist = useCallback(() => {
    const removeDownloadablesFromlist: any[] = [];
    activePageData && activePageData.pageContent && activePageData.pageContent.length > 0
      ? activePageData.pageContent.forEach((a) => {
          const objArray: any[] = [];
          a.partContent.forEach((b) => {
            if (!b.type.includes('Download') && !b.type.includes('notes-form')) {
              objArray.push(b);
            }
          });
          removeDownloadablesFromlist.push({...a, partContent: objArray});
        })
      : [];

    return removeDownloadablesFromlist;
  }, [activePageData]);

  const removeDownloadablesFromlist = useMemo(() => getRemovedDownloadablesFromlist(), [
    activePageData,
  ]);

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
  const [showNotesModal, setShowNotesModal] = useState(false);

  useEffect(() => {
    const lessonState = gContext.lessonState;
    const PAGES = lessonState.lessonData.lessonPlan;
    if (PAGES) {
      const CURRENT_PAGE = lessonState.currentPage;
      const ACTIVE_PAGE_DATA = PAGES[CURRENT_PAGE];
      setActivePageData(ACTIVE_PAGE_DATA);
    }
    if (lessonState.lessonData) {
      setCurrentLesson(lessonState.lessonData);
    }
  }, [gContext.lessonState.lessonData, gContext.lessonState.currentPage]);

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
                            id={`${content.type === 'notes-form' ? '' : content.id}`}>
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
          <div className="fab-container space-y-4 w-16  lg:w-18 xl:w-20 z-50 flex flex-col fixed bottom-5 right-8">
            {notes && notes.length > 0 && (
              <div id="fab-download">
                <NotesFab
                  currentLesson={currentLesson}
                  notes={notes}
                  darkMode={currentLesson?.darkMode || true}
                  pageTitle={activePageData.title}
                  showNotesModal={showNotesModal}
                  setShowNotesModal={setShowNotesModal}
                />
              </div>
            )}
            {downloadables && downloadables.length > 0 && (
              <div id="fab-notes">
                <Downloadables
                  downloadables={downloadables}
                  showDownloadMenu={showDownloadMenu}
                  setShowDownloadMenu={setShowDownloadMenu}
                />
              </div>
            )}
          </div>
          <LessonModule currentLesson={currentLesson} />
        </>
      )}
    </div>
  );
};

export default LessonRowComposer;
