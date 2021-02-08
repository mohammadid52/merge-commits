import React, { useEffect, useState } from 'react';
import { LessonActions } from '../reducers/LessonReducer';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';
import { type } from 'os';

interface inputs {
  subscription?: any;
  subscribeFunc?: () => any;
  dispatch: React.Dispatch<LessonActions>;
  callback?: () => Promise<void>;
  state?: any;
}

interface timerStateType {
  subscription?: any;
  subscribeFunc?: () => any;
  dispatch: React.Dispatch<LessonActions>;
  callback?: () => Promise<void>;
  state?: any;
  activeTimer?: any;
  idleTimer?: any;
  autoSaveInterval?: any;
}

const useStudentTimer = (inputs?: inputs) => {
  const { subscription, subscribeFunc, dispatch, callback, state } = inputs;
  const [params, setParams] = useState<timerStateType>({
    subscription: subscription,
    subscribeFunc: subscribeFunc,
    dispatch: dispatch,
    callback: callback,
    state: state,
    activeTimer: null,
    idleTimer: null,
    autoSaveInterval: null,
  });

  const [activityTimeout, setactivityTimeout] = useState<any>();
  const [typeOfTimeout, setTypeOfTimeout] = useState<'pageSwitch' | 'edit' | ''>('');

  // SAVING
  //PAGE SWITCH => SAVE TTRIGGER after 10 secs
  useEffect(() => {
    console.log('state.currentPage', state.currentPage);
    if (!state.viewing) {
      if (typeOfTimeout === 'edit' || typeOfTimeout === '') {
        console.log('%c save timer: ', 'background: #222; color: #bada55', 'current save timeout interrupted');
        console.log('%c save timer: ', 'background: #222; color: #bada55', 'page switch save triggered after 10s');
        clearTimeout(activityTimeout);
        setTypeOfTimeout('pageSwitch');
        setactivityTimeout(
          setTimeout(() => {
            dispatch({ type: 'INCREMENT_SAVE_COUNT' });
            setTypeOfTimeout('');
            console.log('%c save timer: ', 'background: #222; color: #bada55', 'saved');
          }, 10000)
        );
      }
    }
    return () => clearTimeout(activityTimeout);
  }, [state.viewing, state.currentPage]);

  // TEACHER VIEWING & STUDENT EDIT => SAVE TRIGGER after 1 secs
  useEffect(() => {
    if (state.viewing) {
      clearTimeout(activityTimeout);
      setactivityTimeout(setTimeout(() => dispatch({ type: 'INCREMENT_SAVE_COUNT' }), 1000));
    }
    if (!state.viewing) {
      if (typeOfTimeout === '') {
        console.log('%c save timer: ', 'background: #222; color: #bada55', 'edit save triggered after 60s');
        clearTimeout(activityTimeout);
        setTypeOfTimeout('edit');
        setactivityTimeout(
          setTimeout(() => {
            dispatch({ type: 'INCREMENT_SAVE_COUNT' });
            setTypeOfTimeout('');
            console.log('%c save timer: ', 'background: #222; color: #bada55', 'saved');
          }, 120000)
        );
      }
    }
    return () => clearTimeout(activityTimeout);
  }, [state.viewing, state.componentState]);

  useEffect(() => {
    if (params.state.studentStatus === 'ACTIVE' && params.state.subscription._state === 'closed') {
      params.subscribeFunc();
      updateStudentData('status');
    }

    if (params.state.studentStatus === 'IDLE' || params.state.studentStatus === 'OFFLINE') {
      updateStudentData('status');
    }

    if (params.subscription && params.state.studentStatus === 'OFFLINE') {
      clearAllTimers();
      params.subscription.unsubscribe();
      console.log('unsubscribed', params.state.subscription);
    }
  }, [params.state.studentStatus]);

  useEffect(() => {
    // console.log('teacher viewing savecount: ', params.state.saveCount);
    updateStudentData('autosave');
  }, [params.state.saveCount]);

  const updateStudentData = async (saveType?: string) => {
    if (state.studentDataID) {
      let data = {
        id: state.studentDataID,
        lessonProgress: params.state.lessonProgress,
        currentLocation: params.state.currentPage,
        saveType: saveType,
        status: params.state.studentStatus,
        syllabusLessonID: params.state.syllabusLessonID,
        studentID: params.state.studentUsername,
        studentAuthID: params.state.studentAuthID,
        warmupData: params.state.componentState.story
          ? params.state.componentState.story
          : typeof params.state.componentState.truthGame?.truthGameArray !== 'undefined'
          ? { truthGame: params.state.componentState.truthGame.truthGameArray }
          : typeof params.state.componentState.poll?.pollInputs !== 'undefined'
          ? { poll: params.state.componentState.poll.pollInputs, additional: params.state.componentState.poll.additional }
          : null,
        corelessonData: params.state.componentState.lyrics ? params.state.componentState.lyrics : null,
        activityData: params.state.componentState.poem ? params.state.componentState.poem : null,
      };
  
      try {
        console.log(' timer save: ', data);
        const dataObject: any = await API.graphql(graphqlOperation(customMutations.updateStudentData, { input: data }));
  
        dispatch({ type: 'SAVED_CHANGES' });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('studentDataID not yet created')
    }
  };

  const changeParams = (key: string, updatedValue: any) => {
    setParams((prev) => {
      return {
        ...prev,
        [key]: updatedValue,
      };
    });
  };

  const startAutoSave = () => {
    clearTimeout(params.activeTimer);
    clearTimeout(params.idleTimer);
    params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE' });
    params.dispatch({ type: 'INCREMENT_SAVE_COUNT' });
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
  };
};

export default useStudentTimer;
