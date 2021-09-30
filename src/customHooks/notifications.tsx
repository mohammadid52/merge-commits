import {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../contexts/GlobalContext';
import {NotificationListItem} from '../interfaces/GlobalInfoComponentsInterfaces';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData} from '@utilities/localStorage';
import {
  getSessionStorageData,
  removeSessionStorageData,
  setSessionStorageData,
} from '@utilities/sessionStorage';

// ##################################################################### //
// ######################## GLOBAL NOTIFICATIONS ####################### //
// ##################################################################### //

const useGlobalNotifications = () => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const state = gContext.state;
  const dispatch = gContext.dispatch;
  const history = useHistory();

  // ~~~~~~~~~~ NOTIFICATION LIST ~~~~~~~~~~ //
  const watchList = [
    {
      check: state.user.image === null || state.user.image === '',
      notification: {
        label: 'Avatar not set',
        message: 'Please set up your avatar to complete your profile!',
        type: 'alert',
        cta: 'Change Now',
      },
      action: () => {
        history.push('/dashboard/profile');
        dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'profile'}});
      },
      cancel: () => {
        //
      },
    },
  ];

  const collectNotifications = (list: NotificationListItem[]) => {
    return list.reduce((acc: NotificationListItem[], val: NotificationListItem) => {
      if (val.check) {
        return [...acc, val];
      } else {
        return acc;
      }
    }, []);
  };

  return {
    globalNotifications: collectNotifications(watchList),
  };
};

// ##################################################################### //
// ######################## LESSON NOTIFICATIONS ####################### //
// ##################################################################### //

const useLessonNotifications = () => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const lessonPlan = lessonState.lessonData.lessonPlan;
  const lessonDispatch = gContext.lessonDispatch;

  // ~~~~~~~~~~~~~ ROUTER STUFF ~~~~~~~~~~~~ //
  const history = useHistory();
  const match = useRouteMatch();
  const getNavigationState = getSessionStorageData('navigation_state');

  // ~~~~~~~~ FUNCTIONS - NAVIGATION ~~~~~~~ //
  const navigateAway = () => {
    setSessionStorageData('navigation_state', {
      fromIdx: lessonState?.currentPage,
      fromLabel: getPageLabel(lessonState.currentPage),
      fromUrl: `${match.url}/${lessonState.currentPage}`,
    });
    history.push(`${match.url}/${getPageIdx(lessonState.displayData[0].lessonPageID)}`);
    lessonDispatch({
      type: 'SET_CURRENT_PAGE',
      payload: getPageIdx(lessonState.displayData[0].lessonPageID),
    });
  };

  const navigateBack = () => {
    history.push(getNavigationState?.fromUrl);
    lessonDispatch({
      type: 'SET_CURRENT_PAGE',
      payload: getNavigationState.fromIdx,
    });
    removeSessionStorageData('navigation_state');
  };

  const navigateCancel = () => {
    removeSessionStorageData('navigation_state');
  };

  // ~~~~~~~ FUNCTIONS - LABELS ETC. ~~~~~~~ //
  const getPageIdx = (pageID: string) => {
    if (lessonPlan) {
      if (!pageID) {
        return null;
      } else {
        return lessonPlan.findIndex((lessonPage: any) => lessonPage.id === pageID);
      }
    } else {
      return null;
    }
  };

  const getPageLabel = (pageIdx: number) => {
    if (lessonPlan && pageIdx) {
      return lessonPlan[pageIdx]?.label;
    } else {
      return null;
    }
  };

  const getSharedStudenName = (authID: string) => {
    const studentList = getLocalStorageData('student_list');
    const findStudent = studentList.find(
      (studentObj: any) => studentObj.student.authId === authID
    )?.student;
    if (findStudent && authID) {
      return findStudent.firstName + ' ' + findStudent.lastName;
    }
  };

  // ~~~~~~~~~~~~~ LOGIC CHECKS ~~~~~~~~~~~~ //
  const iAmViewed = lessonState.studentViewing === user.authId;
  const iAmShared = lessonState.displayData[0].studentAuthID === user.authId;
  const anyPageIsShared = lessonState.displayData[0].lessonPageID !== '';
  const thisPageIsShared =
    lessonPlan &&
    lessonState.displayData[0].lessonPageID === lessonPlan[lessonState.currentPage].id;
  const canNavigateBack =
    !anyPageIsShared && getNavigationState && getNavigationState.fromUrl;

  // ~~~~~~~~~~ NOTIFICATION LIST ~~~~~~~~~~ //
  const watchList = [
    {
      check: iAmViewed && !iAmShared,
      notification: {
        label: 'Teacher is viewing you',
        message: null,
        type: 'positive',
        cta: '',
      },
      action: () => {
        //
      },
      cancel: () => {
        //
      },
    },
    {
      check: anyPageIsShared && !iAmShared && !thisPageIsShared,
      notification: {
        label: 'Teacher is sharing a page',
        message: ` by "${getSharedStudenName(lessonState.displayData[0].studentAuthID)}"`,
        type: 'alert',
        cta: 'Go There Now',
      },
      action: () => {
        navigateAway();
      },
    },
    {
      check: iAmShared && !thisPageIsShared,
      notification: {
        label: 'Teacher is sharing your page',
        message: `"${getPageLabel(getPageIdx(lessonState.displayData[0].lessonPageID))}"`,
        type: 'alert',
        cta: 'Go There Now',
      },
      action: () => {
        navigateAway();
      },
      cancel: () => {
        //
      },
    },
    {
      check: canNavigateBack,
      notification: {
        label: 'Return to the previous page?',
        message: ``,
        type: 'alert',
        cta: 'Go Back',
      },
      action: () => {
        navigateBack();
      },
      cancel: () => {
        navigateCancel();
      },
    },
    {
      check: thisPageIsShared && iAmShared,
      notification: {
        label: 'Teacher is sharing your data for this page',
        message: null,
        type: 'info',
        cta: '',
      },
      action: () => {
        //
      },
      cancel: () => {
        //
      },
    },
    {
      check: thisPageIsShared && !iAmShared,
      notification: {
        label: 'You are viewing this page',
        message: `by "${getSharedStudenName(lessonState.displayData[0].studentAuthID)}"`,
        type: 'info',
        cta: '',
      },
      action: () => {
        //
      },
      cancel: () => {
        //
      },
    },
  ];

  const collectNotifications = (list: NotificationListItem[]) => {
    return list.reduce((acc: NotificationListItem[], val: NotificationListItem) => {
      if (val.check) {
        return [...acc, val];
      } else {
        return acc;
      }
    }, []);
  };

  return {lessonNotifications: collectNotifications(watchList)};
};

// ##################################################################### //
// ############################# MAIN HOOK ############################# //
// ##################################################################### //

const useNotifications = (props: 'lesson' | 'lessonControl' | 'global') => {
  const globalNotifications = () => useGlobalNotifications().globalNotifications;

  const lessonNotifications = () => useLessonNotifications().lessonNotifications;

  const notifications = (switchByContext: string) => {
    switch (switchByContext) {
      case 'global':
        return globalNotifications();
      case 'lesson':
        return lessonNotifications();
      default:
        return null;
    }
  };

  return {notifications: notifications(props)};
};

export default useNotifications;
