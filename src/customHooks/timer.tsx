import React, {useEffect, useState} from 'react';
import {LessonActions} from '../reducers/LessonReducerOLD';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';
import {AnthologyContentInterface} from '../components/Dashboard/Anthology/Anthology';
import * as mutations from '../graphql/mutations';
import {useParams} from 'react-router-dom';
import {lessonStateOLD} from '../state/LessonStateOLD';

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

const timerInitialParams: timerStateType = {
  subscription: null,
  subscribeFunc: null,
  dispatch: null,
  callback: null,
  state: lessonStateOLD,
  activeTimer: null,
  idleTimer: null,
  autoSaveInterval: null,
};

const useStudentTimer = (inputs?: inputs) => {
  const urlParams: any = useParams();
  const {subscription, subscribeFunc, dispatch, callback, state} = inputs;
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
    const isLesson = false;
    if (isLesson) {
      if (state.viewing) {
        clearTimeout(activityTimeout);
        setactivityTimeout(
          setTimeout(() => {
            console.log('VIEWING -> page switch -> save');
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
          }, 2000)
        );
      } else if (!state.viewing) {
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
  }, [state.currentPage]);

  // TEACHER VIEWING & STUDENT EDIT => SAVE TRIGGER after 1 secs
  // COMPONENT CHANGE --> save after 60 secs
  // COMPONENT CHANGE --> checkpoint in lesson && lesson
  useEffect(() => {
    const isLesson = false;
    if (isLesson) {
      if (state.viewing) {
        clearTimeout(activityTimeout);
        setactivityTimeout(
          setTimeout(() => {
            dispatch({type: 'INCREMENT_SAVE_COUNT'});
            console.log('VIEWING -> EDIT -> save');
          }, 2000)
        );
      } else if (!state.viewing) {
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
          }, 30000);
        }
      }
    }
    return () => resetParams();
  }, [state.viewing, state.componentState, state.questionData]);

  /**
   *
   * SAVE TRIGGER
   *
   */
  useEffect(() => {
    if(!state.viewing && currentSaveCount < params.state.saveCount){
      console.log('currentSaveCount - ', currentSaveCount)
      console.log('params.state.saveCount - ', params.state.saveCount)
      setCurrentSaveCount(params.state.saveCount)
      updateStudentData('autosave');
      handleUpdateQuestionData();
    }
    if(state.viewing){
      if(currentSaveCount < params.state.saveCount){
        setCurrentSaveCount(params.state.saveCount)
      }
      updateStudentData('autosave');
      handleUpdateQuestionData();
    }

    return () => resetParams();
  }, [params.state.saveCount]);

  /**
   *
   * CONTENT - SAVE
   *
   */
  const getWarmupDataSource = () => {
    const warmupType = state.data.lesson.warmUp.type;
    switch (warmupType) {
      case 'story':
      case 'list':
        return params.state.componentState.story;
      case 'truthgame':
        return {truthGame: params.state.componentState.truthGame.truthGameArray};
      case 'poll':
        return {
          poll: params.state.componentState.poll.pollInputs,
          additional: params.state.componentState.poll.additional,
        };
      case 'adventure':
      default:
        return {};
    }
  };

  const getAnthologyContent = () => {
    const template: AnthologyContentInterface = {
      type: 'work',
      subType: '',
      title: '',
      subTitle: '',
      description: '',
      content: '',
    };
    return Object.keys(params.state.componentState).reduce(
      (acc: AnthologyContentInterface[], componentKey: string) => {
        const output = () => {
          switch (componentKey) {
            case 'story':
              return {
                ...template,
                subType: 'story',
                title: params.state.componentState?.story
                  ? params.state.componentState?.story.title
                  : '',
                content: params.state.componentState?.story
                  ? params.state.componentState.story.story
                  : '',
              };
            case 'poem':
              return {
                ...template,
                subType: 'poem',
                title: params.state.componentState?.poem
                  ? params.state.componentState?.poem.title
                  : '',
                content: params.state.componentState?.poem
                  ? params.state.componentState.poem?.editInput
                  : '',
              };
            case 'notes':
              return {
                ...template,
                type: 'notes',
                subType: 'notes',
                title: params.state.componentState?.notes
                  ? params.state.data.lesson.title
                  : '',
                content: params.state.componentState?.notes
                  ? params.state.componentState.notes?.content
                  : '',
              };
            default:
              return {};
          }
        };

        if (Object.keys(output()).length > 0) {
          return [...acc, output()];
        } else {
          return acc;
        }
      },
      []
    );
  };

  /**
   *
   * FUNCTIONS - SAVE
   *
   */
  const updateStudentData = async (saveType?: string) => {
    if (state.studentDataID && params.state.syllabusLessonID !== "") {
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
        corelessonData: params.state.componentState.lyrics
          ? params.state.componentState.lyrics
          : null,
        activityData: params.state.componentState.poem
          ? params.state.componentState.poem
          : null,
        anthologyContent: getAnthologyContent(),
      };

      // console.log('updateStudentData - data - ', data)

      try {
        const dataObject: any = await API.graphql(
          graphqlOperation(customMutations.updateStudentData, {input: data})
        );
        dispatch({type: 'SAVED_CHANGES'});
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('studentDataID not yet created');
    }
  };

  /**
   * GET or CREATE QUESTION DATA
   */
  const updateQuestionData = async (responseObj: any) => {
    try {
      const updatedQuestionData = await API.graphql(
        graphqlOperation(mutations.updateQuestionData, {input: responseObj})
      );
      // console.log('updateQuestionData responseObj -> ', responseObj);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuestionData = async () => {
    if (Object.keys(state.questionData).length > 0) {
      let questionDataUpdateArray = state.questionDataUpdate;
      if (questionDataUpdateArray) {
        await questionDataUpdateArray.reduce((_: any, val: any) => {
          let responseObject = {
            id: val.id,
            syllabusLessonID: state.syllabusLessonID,
            checkpointID: val.checkpointID,
            componentType: state.data.lesson.type,
            lessonID: state.data.lesson.id,
            authID: state.studentAuthID,
            email: state.studentUsername,
            responseObject: state.questionData[val.checkpointID],
          };

          updateQuestionData(responseObject);
        }, null);
      }
    }
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
