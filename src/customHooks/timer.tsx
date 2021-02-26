import React, { useEffect, useState } from 'react';
import { LessonActions } from '../reducers/LessonReducer';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';
import { type } from 'os';
import { AnthologyContentInterface } from '../components/Dashboard/Anthology/Anthology';
import * as customQueries from '../customGraphql/customQueries';
import { createFilterToFetchSpecificItemsOnly } from '../utilities/strings';
import * as mutations from '../graphql/mutations';
import { Auth } from '@aws-amplify/auth';
import * as queries from '../graphql/queries';
import { useParams } from 'react-router-dom';



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
  const urlParams: any = useParams()
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

  const [updatedQuestionDataObj, setUpdateQuestionDataObj] = useState<any>();

  // SAVING
  //PAGE SWITCH => SAVE TTRIGGER after 10 secs
  useEffect(() => {
    const isLesson = state.data.lesson.type === 'lesson';
    if(isLesson) {
      if (!state.viewing) {
        if (typeOfTimeout === '') {
          console.log('%c save timer: ', 'background: #222; color: #bada55', 'page switch save triggered after 10s');

          setTypeOfTimeout('pageSwitch');

          const pageEditTimeout = setTimeout(() => {
            dispatch({ type: 'INCREMENT_SAVE_COUNT' });
            setTypeOfTimeout('');
            console.log('%c save timer: ', 'background: #222; color: #bada55', 'saved');
          }, 10000);
        }
      }
    }
  }, [state.currentPage]);

  // TEACHER VIEWING & STUDENT EDIT => SAVE TRIGGER after 1 secs
  useEffect(() => {
    const isLesson = state.data.lesson.type === 'lesson';
    if(isLesson) {
      if (state.viewing) {
        clearTimeout(activityTimeout);
        setactivityTimeout(setTimeout(() => dispatch({ type: 'INCREMENT_SAVE_COUNT' }), 1000));
      }
      if (!state.viewing) {
        if (typeOfTimeout === '') {
          console.log('%c save timer: ', 'background: #bada55; color: #25362a', 'edit save triggered after 60s');

          setTypeOfTimeout('edit');

          const editTimeout = setTimeout(() => {
            dispatch({ type: 'INCREMENT_SAVE_COUNT' });
            setTypeOfTimeout('');
            console.log('%c save timer: ', 'background: #00FF00; color: #bada55', 'saved');
          }, 60000);
        }
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
    getQuestionDataOnly()
    // getAllCheckpoints()
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


  /**
   * Function and useEffect for getting/setting checkpoints if
   * condition is met and lesson plans include
   * checkpoints in their name
   */
  const getAllCheckpoints = async () => {
    const allCheckpointIDS = state.data.lessonPlan.reduce((acc: string[], lessonPlanObj: any) => {
      const isCheckpoint = lessonPlanObj.stage.includes('checkpoint');
      if (isCheckpoint) {
        return [...acc, lessonPlanObj.stage.match(/checkpoint\?id=(.*)/)[1]];
      } else {
        return acc;
      }
    }, []);
    try {
      const checkpoints: any = await API.graphql(graphqlOperation(customQueries.listCheckpoints, {
        filter: { ...createFilterToFetchSpecificItemsOnly(allCheckpointIDS, 'id') },
      }));

      console.log('checkpoints timer', checkpoints)

    } catch (e) {
      console.error('err fetch checkpoints ::: ', e);
    }
  };


  /**
   * GET or CREATE QUESTION DATA
   */
  const updateQuestionData = async (responseObj: any) => {
    try {
      const updatedQuestionData = await API.graphql(
        graphqlOperation(mutations.updateQuestionData, { input: responseObj }),
      );
      console.log('responseObj -> ', responseObj);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (typeof state.questionData === 'object') {
      let checkpointIdKeys = Object.keys(state.questionData); // doFirst, checkpoint_1
      console.log('handleCreate Checkpoint -> idKeys -> ', state.questionData);
      await checkpointIdKeys.reduce((_: any, key: string) => {
        let responseObject = {
          syllabusLessonID: state.syllabusLessonID,
          checkpointID: key,
          componentType: state.data.lesson.type,
          lessonID: state.data.lesson.id,
          authID: state.studentAuthID,
          email: state.studentUsername,
          responseObject: state.questionData[key],
        };

        // updateQuestionData(responseObject);
      }, null);
    }
  }


  async function getQuestionDataOnly() {
    const { lessonID } = urlParams;
    let studentID: string;
    let studentAuthID: string;

    await Auth.currentAuthenticatedUser().then((user) => {
      // console.log(user);
      studentID = user.attributes.email;
      studentAuthID = user.attributes.sub;
    });

    try {
      const questionDatas: any = await API.graphql(
        graphqlOperation(queries.listQuestionDatas, {
          filter: {
            syllabusLessonID: { eq: lessonID },
            email: { eq: studentID },
          },
        }),
      );

      if (questionDatas.data.listQuestionDatas.items.length > 0) {
        console.log('NO question data, creating -> ', Object.keys(state.questionData));

        /**
         *
         *
         * MODIFY INCOMING QUESTION DATAS HERE
         * SAVE THEM BACK TO DATABASE
         *
         *
         */


        // handleUpdate();
      }
    } catch (e) {
      console.error('getOrCreateQuestionData -> ', e);
    }
  }


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
