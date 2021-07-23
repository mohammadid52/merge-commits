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

  /**
   *
   * TIMERS & TRIGGERS
   *
   */
  //PAGE SWITCH => SAVE TTRIGGER after 10 secs
  useEffect(() => {
    const isLesson = true; // UPDATE IN FUTURE FOR ULB-SURVEYS/LESSONS
    if (isLesson) {
      if (lessonState.viewing) {
        clearTimeout(activityTimeout);
        setactivityTimeout(
          setTimeout(() => {
            console.log('VIEWING -> page switch -> save');
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
          }, 2000)
        );
      } else if (!lessonState.viewing) {
        if (typeOfTimeout === '') {
          console.log(
            '%c save timer: ',
            'background: #222; color: #bada55',
            'page switch save triggered after 10s'
          );

          setTypeOfTimeout('pageSwitch');

          const pageEditTimeout = setTimeout(() => {
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
            setTypeOfTimeout('');
            console.log('%c save timer: ', 'background: #222; color: #bada55', 'saved');
          }, 5000);
        }
      }
    }
    return () => resetParams();
  }, [lessonState.currentPage]);

  // TEACHER VIEWING & STUDENT EDIT => SAVE TRIGGER after 1 secs
  // COMPONENT CHANGE --> save after 60 secs
  // COMPONENT CHANGE --> checkpoint in lesson && lesson
  useEffect(() => {
    const isLesson = true; // UPDATE IN FUTURE FOR ULB-SURVEYS/LESSONS
    if (isLesson) {
      if (lessonState.viewing) {
        clearTimeout(activityTimeout);
        setactivityTimeout(
          setTimeout(() => {
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
            console.log('VIEWING -> EDIT -> save');
          }, 2000)
        );
      } else if (!lessonState.viewing && lessonState.updated) {
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
          }, 2000);
        }
      }
    }
    return () => resetParams();
  }, [lessonState.viewing, lessonState.studentData]);

  /**
   *
   * SAVE TRIGGER
   *
   */
  useEffect(() => {
    if (!lessonState.viewing && currentSaveCount < lessonState.saveCount) {
      setCurrentSaveCount(lessonState.saveCount);
      updateStudentData('autosave');
    }
    if (lessonState.viewing) {
      if (currentSaveCount < lessonState.saveCount) {
        setCurrentSaveCount(lessonState.saveCount);
      }
      updateStudentData('autosave');
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
            // syllabusLessonID: state.activeSyllabus,
            // lessonID: lessonID,
            // lessonPageID: lessonState.lessonData.lessonPlan[lessonState.currentPage].id,
            // studentID: authId,
            // studentAuthID: authId,
            // studentEmail: email,
            // currentLocation: lessonState.currentPage,
            // lessonProgress: '0',
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
            if (idx === lessonState.universalStudentDataID.length - 1) {
              lessonDispatch({type: 'COMPLETE_STUDENT_UPDATE'});
            }
          }

          console.log('updateStudentData - timer - ', data);
        }
      },
      []
    );

    // console.log(
    //   'lessonState.universalStudentDataID - ',
    //   lessonState.universalStudentDataID
    // );
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
