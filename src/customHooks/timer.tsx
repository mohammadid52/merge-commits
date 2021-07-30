import React, {useEffect, useState} from 'react';
import {LessonActions} from '../reducers/LessonReducerOLD';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';
import {AnthologyContentInterface} from '../components/Dashboard/Anthology/Anthology';
import * as mutations from '../graphql/mutations';
import {useParams} from 'react-router-dom';
import {lessonStateOLD} from '../state/LessonStateOLD';
import {lessonState} from '../state/LessonState';
import {globalState} from '../state/GlobalState';
import {Auth} from '@aws-amplify/auth';

interface inputs {
  subscription?: any;
  subscribeFunc?: () => any;
  dispatch: React.Dispatch<LessonActions>;
  callback?: () => Promise<void>;
  state?: any;
  lessonState?: any;
  lessonDispatch?: any;
}

interface timerStateType {
  subscription?: any;
  subscribeFunc?: () => any;
  dispatch: React.Dispatch<LessonActions>;
  callback?: () => Promise<void>;
  state?: any;
  lessonState?: any;
  activeTimer?: any;
  idleTimer?: any;
  autoSaveInterval?: any;
}

const timerInitialParams: timerStateType = {
  subscription: null,
  subscribeFunc: null,
  dispatch: null,
  callback: null,
  state: globalState,
  lessonState: lessonState,
  activeTimer: null,
  idleTimer: null,
  autoSaveInterval: null,
};

const useStudentTimer = (inputs?: inputs) => {
  const urlParams: any = useParams();
  const {
    subscription,
    subscribeFunc,
    dispatch,
    callback,
    state,
    lessonState,
    lessonDispatch,
  } = inputs;
  const [params, setParams] = useState<timerStateType>({
    subscription: subscription,
    subscribeFunc: subscribeFunc,
    dispatch: dispatch,
    callback: callback,
    state: state,
    lessonState: lessonState,
    activeTimer: null,
    idleTimer: null,
    autoSaveInterval: null,
  });

  const [currentSaveCount, setCurrentSaveCount] = useState<number>(0);

  const [activityTimeout, setactivityTimeout] = useState<any>();
  const [typeOfTimeout, setTypeOfTimeout] = useState<'pageSwitch' | 'edit' | ''>('');

  const [iAmViewed, setiAmViewed] = useState<boolean>(false);

  const viewingLogic = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const authId = user.attributes.sub;

    if (lessonState.studentViewing && lessonState.studentViewing === authId) {
      if (!iAmViewed) {
        setiAmViewed(true);
      }
    }
    if (lessonState.studentViewing !== authId) {
      if (iAmViewed) {
        setiAmViewed(false);
      }
    }
  };

  useEffect(() => {
    if (lessonState.studentViewing !== '') {
      viewingLogic();
    }
  }, [lessonState.studentViewing, state.user.authId]);

  /**
   *
   * TIMERS & TRIGGERS
   *
   */

  // TEACHER VIEWING & STUDENT EDIT => SAVE TRIGGER after 1 secs
  // COMPONENT CHANGE --> save after 60 secs
  // COMPONENT CHANGE --> checkpoint in lesson && lesson
  useEffect(() => {
    const isLesson = true; // UPDATE IN FUTURE FOR ULB-SURVEYS/LESSONS
    if (isLesson) {
      if (iAmViewed) {
        clearTimeout(activityTimeout);
        setactivityTimeout(
          setTimeout(() => {
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
            console.log('VIEWING -> EDIT -> save');
          }, 1000)
        );
      } else if (!iAmViewed && lessonState.updated) {
        if (typeOfTimeout === '') {
          console.log(
            '%c save timer: ',
            'background: #bada55; color: #25362a',
            'edit save triggered after 60s'
          );

          setTypeOfTimeout('edit');

          const editTimeout = setTimeout(() => {
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
            setTypeOfTimeout('');
            console.log(
              '%c save timer: ',
              'background: #00FF00; color: #bada55',
              'saved'
            );
          }, 4000);
        }
      }
    }
    return () => resetParams();
  }, [iAmViewed, lessonState.studentData]);

  /**
   *
   * SAVE TRIGGER
   *
   */
  useEffect(() => {
    if (iAmViewed) {
      if (currentSaveCount < lessonState.saveCount) {
        setCurrentSaveCount(lessonState.saveCount);
      }
      // lessonDispatch({type: 'COMPLETE_STUDENT_UPDATE'});
      const liveUpdate = updateStudentData('autosave');
      Promise.resolve(liveUpdate).then((_: void) => {
        setTimeout(() => {
          lessonDispatch({type: 'COMPLETE_STUDENT_UPDATE'});
          console.log('liveUpdate - ', 'done');
        }, 1000);
      });
    }

    if (!iAmViewed && currentSaveCount < lessonState.saveCount) {
      setCurrentSaveCount(lessonState.saveCount);
      const standardUpdate = updateStudentData('autosave');
      Promise.resolve(standardUpdate).then((_: void) => {
        setTimeout(() => {
          lessonDispatch({type: 'COMPLETE_STUDENT_UPDATE'});
          console.log('standardUpdate - ', 'done');
        }, 2000);
      });
    }

    return () => resetParams();
  }, [lessonState.saveCount]);

  /**
   *
   * COLLECT DATA & CONTENT FROM CONTEXT - SAVE
   *
   */

  /**
   *
   * FUNCTIONS - SAVE
   *
   */
  const updateStudentData = async (saveType?: string) => {
    const {lessonID} = urlParams;
    const user = await Auth.currentAuthenticatedUser();
    const authId = user.attributes.sub;
    const email = user.attributes.email;

    const loopOverDataId = lessonState.universalStudentDataID.reduce(
      async (acc: any[], currentIdObj: any, idx: number) => {
        if (currentIdObj.update) {
          let data = {
            id: currentIdObj.id,
            pageData: lessonState.studentData[currentIdObj.pageIdx],
          };

          try {
            let updatedStudentData: any = await API.graphql(
              graphqlOperation(mutations.updateUniversalLessonStudentData, {input: data})
            );
          } catch (e) {
            console.error('update universal student data - ', encodeURI);
          } finally {
            console.log('updateStudentData - finally - ', idx);
          }

          console.log('updateStudentData - timer - ', data);
        }
      },
      []
    );
  };

  /**
   *
   * LEGACY CODE
   *
   */
  const changeParams = (key: string, updatedValue: any) => {
    setParams((prev) => {
      return {
        ...prev,
        [key]: updatedValue,
      };
    });
  };

  const resetParams = () => {
    setParams(timerInitialParams);
    clearTimeout(activityTimeout);
  };

  const startAutoSave = () => {
    clearTimeout(params.activeTimer);
    clearTimeout(params.idleTimer);
    params.dispatch({type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE'});
    params.dispatch({type: 'INCREMENT_SAVE_COUNT'});
  };

  const clearAutoSave = () => {
    clearInterval(params.autoSaveInterval);
    console.log('cleared');
  };

  const clearAllTimers = () => {
    clearInterval(params.autoSaveInterval);
    clearTimeout(params.activeTimer);
    clearTimeout(params.idleTimer);
  };

  return {
    // startTimer,
    startAutoSave,
    clearAutoSave,
    clearAllTimers,
    changeParams,
    resetParams,
  };
};

export default useStudentTimer;
