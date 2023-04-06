import {ILessonSurveyApp} from '@components/Lesson/Lesson';
import {useQuery} from '@customHooks/urlParam';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {scrollUp} from '@utilities/functions';
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
  getValidatedPages: ILessonSurveyApp['getValidatedPages'];
}

const ProgressBar = ({
  handleHome,
  handleRequiredNotification,
  pages = [],
  currentPage,
  updatePageInLocalStorage,
  validateRequired,
  getValidatedPages
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

  const lessonType = lessonState.lessonData.type;

  const history = useHistory();
  const match = useRouteMatch();

  const moveToPage = (pageNr: number) => {
    scrollUp(lessonType);
    const sId = params.get('sId');
    const sEmail = params.get('sId');

    const dynamicQuery = sId && sEmail ? `?sId=${sId}&sEmail=${sEmail}` : '';
    history.push(`${match.url}/${pageNr}${dynamicQuery}`);
    lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageNr});

    updatePageInLocalStorage?.(pageNr);
  };

  const lessonProgress = lessonState.lessonProgress;
  const handleLink = (pageNr: number) => {
    // check validated pages
    const validatedPages = getValidatedPages?.();

    const indexOfFirstInvalidPage = validatedPages?.findIndex(
      (item: {isValid: boolean}) => item.isValid === false
    );

    // if the page number in validated pages is true then we can continue
    const canContinue =
      validatedPages?.[pageNr].isValid === true || indexOfFirstInvalidPage === pageNr;

    // check the index of isValid false in validated pages and if the current page is that index then do nothing else

    if (
      indexOfFirstInvalidPage &&
      indexOfFirstInvalidPage !== -1 &&
      indexOfFirstInvalidPage !== lessonState.currentPage
    ) {
      moveToPage(indexOfFirstInvalidPage);
    } else if (canContinue) {
      moveToPage(pageNr);
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
                another ? '!text-medium ' : ''
              } ${!active ? '!text-medium ' : 'theme-text:400'} ${
                route.disabled
                  ? '!text-medium  pointer-events-none cursor-not-allowed'
                  : '!text-medium  cursor-pointer'
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
