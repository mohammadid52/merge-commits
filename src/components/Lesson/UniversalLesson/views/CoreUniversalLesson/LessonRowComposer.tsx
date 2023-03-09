import PageTimer from '@components/Lesson/Components/PageTimer';
import {getLocalStorageData, setLocalStorageData} from '@utilities/localStorage';
import {TeachingStyle} from 'API';
import AllEmotions from 'components/Lesson/AllEmotions';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  PagePart,
  PartContent,
  UniversalLessonPage
} from 'interfaces/UniversalLessonInterfaces';
import {filter} from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import composePartContent from '../../../UniversalLessonBlockComponents/composePartContent';
import {FORM_TYPES} from '../../../UniversalLessonBuilder/UI/common/constants';
import Downloadables from '../../../UniversalLessonBuilder/UI/UIComponents/Downloadables';
import {BuilderRowWrapper} from '../../../UniversalLessonBuilder/views/CoreBuilder/BuilderRowWrapper';
import LessonModule from './LessonModule';
import TranslationModule from './TranslationModule';

const LessonRowComposer = () => {
  const gContext = useGlobalContext();

  const gState = gContext.state;
  const {user, lessonPage} = gState;
  const [activePageData, setActivePageData] = useState<UniversalLessonPage>();
  const getRoomData = getLocalStorageData('room_info');

  const teachingStyle = getRoomData.teachingStyle;

  const isStudent =
    user.role !== 'ST' && teachingStyle === TeachingStyle.PERFORMER
      ? true
      : user.role === 'ST';

  const getSeparateData = (id: string) =>
    activePageData && activePageData.pageContent && activePageData.pageContent.length > 0
      ? filter(activePageData.pageContent, (f) => f.id.includes(id))
      : [];

  const getSeparateDataInPartContent = (id: string) => {
    let result: any[] = [];
    activePageData &&
      activePageData?.pageContent &&
      activePageData?.pageContent?.length > 0 &&
      activePageData?.pageContent?.forEach((f) => {
        f?.partContent?.forEach((d) => {
          if (d?.type === id) {
            let newPartContent = f?.partContent?.filter((_d) => _d.type === id);
            result.push({
              ...f,
              partContent: newPartContent
            });
          }
        });
      });

    return result;
  };

  const downloadables = getSeparateData('downloadable-files');
  const notes = getSeparateData('notes-container');
  const notesFromPartContent = getSeparateDataInPartContent('notes-form');

  const getRemovedDownloadablesFromlist = useCallback(() => {
    const removeDownloadablesFromlist: any[] = [];
    activePageData && activePageData?.pageContent && activePageData.pageContent.length > 0
      ? activePageData?.pageContent?.forEach((a) => {
          const objArray: any[] = [];
          a.partContent.forEach((b) => {
            if (!b?.type?.includes('Download')) {
              objArray.push(b);
            }
          });
          removeDownloadablesFromlist.push({...a, partContent: objArray});
        })
      : [];

    return removeDownloadablesFromlist;
  }, [activePageData]);

  const removeDownloadablesFromlist = useMemo(() => getRemovedDownloadablesFromlist(), [
    activePageData
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

  const lessonState = gContext.lessonState;
  const PAGES = lessonState?.lessonData?.lessonPlan || [];

  const isLastPage = PAGES?.length - 1 === lessonState.currentPage;

  const estTime = Number(PAGES[lessonState.currentPage]?.estTime || 1); // unit of time here is minutes
  const estTimeInSeconds = estTime * 60;

  useEffect(() => {
    if (PAGES) {
      const CURRENT_PAGE = lessonState.currentPage;
      const ACTIVE_PAGE_DATA = PAGES[CURRENT_PAGE];
      setActivePageData(ACTIVE_PAGE_DATA);
    }
  }, [lessonState.lessonData, PAGES, lessonState.currentPage]);

  // this is only for header component
  const paddingForHeader = (type: any) => (type.includes('header') ? 'px-0 mb-3' : '');

  const paddingForDarkBg = (type: any) => {
    switch (type) {
      case 'video':
      case FORM_TYPES.WRITING_EXERCISE:
        return 'p-4';
      default:
        return '';
    }
  };

  const [shouldShowLessonModule, setShouldShowLessonModule] = useState(false);

  const updateOverviewList = (oldList: any[]) => {
    const updatedList: any[] =
      Boolean(oldList) && Array.isArray(oldList) && oldList.length > 0
        ? [...oldList]
        : [];

    updatedList.push(lessonState.lessonData.id);

    setLocalStorageData('overviewChecked', updatedList);
  };

  useEffect(() => {
    const overviewChecked = getLocalStorageData('overviewChecked');

    // if its null or undefined..  then show module
    if (Boolean(overviewChecked)) {
      if (
        overviewChecked &&
        Array.isArray(overviewChecked) &&
        overviewChecked.length > 0
      ) {
        if (!overviewChecked.includes(lessonState?.lessonData?.id)) {
          setShouldShowLessonModule(true);
          updateOverviewList(overviewChecked);
        } else {
          setShouldShowLessonModule(false);
        }
      } else {
        setShouldShowLessonModule(true);
        updateOverviewList(overviewChecked);
      }
    } else {
      setShouldShowLessonModule(true);
      updateOverviewList(overviewChecked);
    }
  }, []);

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
                            } ${paddingForDarkBg(content.type)} `}
                            id={`${content.type === 'notes-form' ? '' : content.id}`}>
                            <SingleContentRow
                              content={content}
                              idx={idx}
                              idx2={idx2}
                              pagePart={pagePart}
                              notes={[...notes, ...notesFromPartContent]}
                            />
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

      {isLastPage && <AllEmotions />}

      {isStudent && (
        <>
          <div className="fab-container space-y-4 w-16  lg:w-18 xl:w-20 z-50 flex flex-col fixed bottom-5 right-8">
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

          {shouldShowLessonModule && (
            <LessonModule currentLesson={lessonState?.lessonData} />
          )}
        </>
      )}

      {user.role === 'ST' && <TranslationModule />}
      {isStudent && <PageTimer startTime={estTimeInSeconds} />}
    </div>
  );
};

interface ISingleRowProps {
  content: PartContent;
  idx: number;
  idx2: number;
  pagePart: PagePart;
  notes: any[];
}

const SingleContentRow = React.memo((props: ISingleRowProps) => {
  const {content, idx, idx2, pagePart, notes} = props;

  return (
    <>
      {content &&
        pagePart &&
        composePartContent(
          content.id,
          content.type,
          content.value,
          `pp_${idx}_pc_${idx2}`,
          content.class,
          pagePart.id,
          'lesson',
          undefined, // function related to builder
          undefined, // position number related to builder
          content.type === 'notes-form' && notes && notes.length > 0 ? notes : [],
          true // isStudent,
        )}
    </>
  );
});

export default LessonRowComposer;
