import React, { useEffect, useState } from 'react';
import { LessonActions } from '../reducers/LessonReducer';
// import { LessonStateType } from '../state/LessonState';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';

// import { FaSatellite } from 'react-icons/fa';

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

  useEffect(() => {
    console.log(params.state.subscription);
  }, [params.state.subscription]);

  useEffect(() => {
    if (params.state.studentStatus === 'ACTIVE' && params.state.subscription._state === 'ready') {
      // clearAllTimers()
      // startTimer()
      // updateStudentData('status')
    }

    if (params.state.studentStatus === 'ACTIVE' && params.state.subscription._state === 'closed') {
      params.subscribeFunc();

      // startTimer()

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
    if (params.state.viewing) {
      startAutoSave();
    }

    if (!params.state.viewing) {
      clearAutoSave();
    }
  }, [params.state.viewing]);

  useEffect(() => {
    if (params.state.viewing) {
      // console.log(params.state.saveCount);
      updateStudentData('autosave');
    }
  }, [params.state.saveCount]);

  const updateStudentData = async (saveType?: string) => {
    let lessonProgress =
      params.state.pages[params.state.lessonProgress].stage === ''
        ? 'intro'
        : params.state.pages[params.state.lessonProgress].stage;

    let currentLocation =
      params.state.pages[params.state.currentPage].stage === ''
        ? 'intro'
        : params.state.pages[params.state.currentPage].stage;

    /**
     * The warmupData ternary condition should be improved
     * so that it doesn't look specifically for the truthGame object
     * but can also return any other additional object from new components
     */

    //TODO: clean up the warmUpData ternary condition below

    let data = {
      id: state.studentDataID,
      lessonProgress: lessonProgress,
      currentLocation: currentLocation,
      saveType: saveType,
      status: params.state.studentStatus,
      classroomID: params.state.classroomID,
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
  };

  const changeParams = (key: string, updatedValue: any) => {
    setParams((prev) => {
      return {
        ...prev,
        [key]: updatedValue,
      };
    });
  };

  const startTimer = () => {
    console.log('started');

    clearTimeout(params.activeTimer);
    clearTimeout(params.idleTimer);
    params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE' });

    params.activeTimer = setTimeout(() => {
      clearTimeout(params.activeTimer);
      params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'IDLE' });
    }, 60000);

    params.idleTimer = setTimeout(() => {
      clearTimeout(params.idleTimer);
      params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'OFFLINE' });
    }, 60000);
  };

  const startAutoSave = () => {
    clearTimeout(params.activeTimer);
    clearTimeout(params.idleTimer);
    params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE' });
    params.dispatch({ type: 'INCREMENT_SAVE_COUNT' });
    // callback()
    // console.log('save');

    params.autoSaveInterval = setInterval(() => {
      // console.log('save');
      params.dispatch({ type: 'INCREMENT_SAVE_COUNT' });
      // callback()
    }, 3000);
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
    startTimer,
    startAutoSave,
    clearAutoSave,
    clearAllTimers,
    changeParams,
  };
};

export default useStudentTimer;
