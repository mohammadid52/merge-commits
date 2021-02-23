import React, { useEffect, useState } from 'react';
import { LessonActions } from '../reducers/LessonReducer';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';
import { type } from 'os';
import { AnthologyContentInterface } from '../components/Dashboard/Anthology/Anthology';



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
  // useEffect(() => {
  //   if (!state.viewing) {
  //     if (typeOfTimeout === '') {
  //       console.log('%c save timer: ', 'background: #222; color: #bada55', 'page switch save triggered after 10s');
  //
  //       setTypeOfTimeout('pageSwitch');
  //
  //       const pageEditTimeout = setTimeout(() => {
  //         dispatch({ type: 'INCREMENT_SAVE_COUNT' });
  //         setTypeOfTimeout('');
  //         console.log('%c save timer: ', 'background: #222; color: #bada55', 'saved');
  //       }, 10000);
  //     }
  //   }
  //   // return () => clearTimeout(activityTimeout);
  // }, [state.currentPage]);

  // TEACHER VIEWING & STUDENT EDIT => SAVE TRIGGER after 1 secs
  // useEffect(() => {
  //   if (state.viewing) {
  //     clearTimeout(activityTimeout);
  //     setactivityTimeout(setTimeout(() => dispatch({ type: 'INCREMENT_SAVE_COUNT' }), 1000));
  //   }
  //   if (!state.viewing) {
  //     if (typeOfTimeout === '') {
  //       console.log('%c save timer: ', 'background: #bada55; color: #25362a', 'edit save triggered after 60s');
  //
  //       setTypeOfTimeout('edit');
  //
  //       const editTimeout = setTimeout(() => {
  //         dispatch({ type: 'INCREMENT_SAVE_COUNT' });
  //         setTypeOfTimeout('');
  //         console.log('%c save timer: ', 'background: #00FF00; color: #bada55', 'saved');
  //       }, 60000);
  //     }
  //   }
  //   return () => clearTimeout(activityTimeout);
  // }, [state.viewing, state.componentState]);

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

  const getWarmupDataSource = () => {
    const warmupType = state.data.lesson.warmUp.type;
    switch(warmupType){
      case 'story':
      case 'list':
        return params.state.componentState.story;
      case 'truthgame':
        return { truthGame: params.state.componentState.truthGame.truthGameArray };
      case 'poll':
        return {
          poll: params.state.componentState.poll.pollInputs,
          additional: params.state.componentState.poll.additional,
        };
      case 'adventure':
      default:
        return {};
    }
  }

  const getAnthologyContent = () => {
    const lessonPlan = state.data.lessonPlan;
    return lessonPlan.reduce((acc: AnthologyContentInterface[], lessonPlanObj: { disabled: boolean; open: boolean; active: boolean; stage: string; type: string; displayMode: string }) => {
      if (lessonPlanObj.type === 'story' || lessonPlanObj.type === 'poem') {
        const template: AnthologyContentInterface = {
          type: lessonPlanObj.type,
          title: '',
          subTitle: '',
          description: '',
          content: '',
        };
        const templateOutput = () => {
          switch (lessonPlanObj.type) {
            case 'story':
              return {
                ...template,
                title: (params.state.componentState?.story) ? params.state.componentState?.story.title : '',
                content: (params.state.componentState?.story) ? params.state.componentState.story.story : '',
              };
            case 'poem':
              return {
                ...template,
                title: (params.state.componentState?.poem) ? params.state.componentState?.poem.title : '',
                content: (params.state.componentState?.poem) ? params.state.componentState.poem?.editInput : '',
              };
          }
        };
        return [...acc, templateOutput()];
      } else {
        return acc;
      }
    }, []);
  };

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
        warmupData: getWarmupDataSource(),
        corelessonData: params.state.componentState.lyrics ? params.state.componentState.lyrics : null,
        activityData: params.state.componentState.poem ? params.state.componentState.poem : null,
        anthologyContent: getAnthologyContent(),
      };
  
      try {
        // console.log(' timer save: ', data);
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
