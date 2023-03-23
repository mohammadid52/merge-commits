import {useQuery} from '@customHooks/urlParam';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {Breadcrumb} from 'antd';
import {useGlobalContext} from 'contexts/GlobalContext';
import useLessonControls from 'customHooks/lessonControls';

import React, {useEffect} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {getLocalStorageData} from 'utilities/localStorage';

interface IProgressBarProps {
  handleHome?: () => void;
  updatePageInLocalStorage?: (pageIdx: number) => void;
  validateRequired?: (pageIdx: number) => boolean;
  handleRequiredNotification?: () => void;
  pages?: any[];
  currentPage?: number;
  studentData?: any[];
  requiredInputs?: any[];
  canContinue?: boolean;
}

const ProgressBar = ({
  handleHome,
  handleRequiredNotification,
  pages = [],
  currentPage,
  updatePageInLocalStorage,
  validateRequired,
  canContinue
}: IProgressBarProps) => {
  const gContext = useGlobalContext();
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;

  const user = gContext.state.user;

  const getRoomData = getLocalStorageData('room_info');

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //

  // ~~~~~~~~~ SIMPLE LOGIC CHECKS ~~~~~~~~~ //
  /************************************************
   * THIS CAN PROBABLY BE REFACTORED SO THAT ONLY *
   *  THE CODE FROM THE ELSE - IF AFTER LINE 58   *
   *     IS USED FOR CHECKING REQUIRED FIELDS     *
   ************************************************/

  const nextRequiredIdx = pages
    ? pages.reduce((nextIdx: number, currIdx: number) => {
        if (nextIdx === null) {
          if (validateRequired?.(currIdx)) {
            return nextIdx;
          } else {
            return currIdx;
          }
        } else {
          return nextIdx;
        }
      }, null)
    : null;

  /**
   * Explanation
   *
   * state.currentPage = number of current page from 0 - total nr of pages
   */
  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //

  // ~~~~~~~~~~~~ SHARING CHECK ~~~~~~~~~~~~ //
  const isOnDemand = user.onDemand;
  const isTeacherPresenting = lessonState.displayData[0].isTeacher === true;

  const router: any = useRouteMatch();
  const lessonId = router.params.lessonID || '999';

  const isClosedLocalStorage =
    getRoomData?.completedLessons?.findIndex(
      (item: {lessonID?: string | null; time?: string | null}) =>
        item.lessonID === lessonId
    ) > -1;

  const isClosed = lessonState?.displayData[0]?.studentAuthID === 'closed';

  const {resetViewAndShare} = useLessonControls();

  const reset = async () => {
    await resetViewAndShare();
  };

  useEffect(() => {
    // reset displayData
    if (!isClosedLocalStorage && isClosed) {
      reset();
    }
  }, [isClosed, isClosedLocalStorage]);

  const isNotClickable = (pageIdx: number, page: any) =>
    pageIdx === 0 ||
    isOnDemand ||
    ((nextRequiredIdx !== null ? pageIdx <= nextRequiredIdx : true) &&
      page.open !== false);

  const items = pages?.map((page: UniversalLessonPage, key: number) => ({
    title: page.label,
    url: `/lesson/${lessonId}/${key}`,
    disabled: isTeacherPresenting || !isNotClickable(key, page),
    index: key
  }));

  // add item at the end of the array
  items?.push({title: 'Exit', url: '/home', disabled: false, index: items.length + 1});

  const params = useQuery(location.search);

  const scrollUp = () => {
    const domID = {
      lesson: 'lesson-app-container',
      survey: 'survey-app-container'
    } as any;
    const container = document.getElementById(domID[lessonState.lessonData.type]);

    if (container) {
      container.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const history = useHistory();
  const match = useRouteMatch();

  const lessonProgress = lessonState.lessonProgress;
  const handleLink = (pageNr: number) => {
    const isNotMovingForward = pageNr < lessonProgress;
    if (canContinue || isNotMovingForward) {
      scrollUp();
      const sId = params.get('sId');
      const sEmail = params.get('sId');

      const dynamicQuery = sId && sEmail ? `?sId=${sId}&sEmail=${sEmail}` : '';
      history.push(`${match.url}/${pageNr}${dynamicQuery}`);

      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageNr});

      updatePageInLocalStorage?.(pageNr);
    } else {
      handleRequiredNotification && handleRequiredNotification();
    }
  };

  return (
    <div className="flex">
      <Breadcrumb
        className="lesson-progress-breadcrumb"
        itemRender={(route: any) => {
          const active = route.index === currentPage;
          const another = lessonProgress >= route.index;
          const isExitBtn = route.title === 'Exit';
          return (
            <span
              onClick={() => (isExitBtn ? handleHome?.() : handleLink(route.index))}
              className={`${isExitBtn ? '!text-red-500' : ''} ${
                another ? '!text-gray-600' : ''
              } ${!active ? '!text-gray-500' : 'theme-text:400'} ${
                route.disabled
                  ? '!text-gray-600 pointer-events-none cursor-not-allowed'
                  : '!text-gray-500 cursor-pointer'
              }`}>
              {route.title}
            </span>
          );
        }}
        items={items}
      />
    </div>
  );
};

export default React.memo(ProgressBar);
