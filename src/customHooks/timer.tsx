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

interface inputs {
  subscription?: any;
  subscribeFunc?: () => any;
  dispatch: React.Dispatch<LessonActions>;
  callback?: () => Promise<void>;
  state?: any;
  lessonState?: any;
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
  const {subscription, subscribeFunc, dispatch, callback, state, lessonState} = inputs;
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
      } else if (!lessonState.viewing) {
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
  }, [
    params.lessonState.viewing,
    params.lessonState.componentState,
    params.lessonState.questionData,
  ]);

  /**
   *
   * SAVE TRIGGER
   *
   */
  useEffect(() => {
    if (!lessonState.viewing && currentSaveCount < lessonState.saveCount) {
      setCurrentSaveCount(lessonState.saveCount);
      updateStudentData('autosave');

      // TODO: put normal exercise data and question data in context
      //////////////////////////////
      //////////////////////////////
      //////////////////////////////
      //////////////////////////////
      ////////////////////////////// handleUpdateQuestionData();
    }
    if (lessonState.viewing) {
      if (currentSaveCount < lessonState.saveCount) {
        setCurrentSaveCount(lessonState.saveCount);
      }
      updateStudentData('autosave');

      // TODO: put normal exercise data and question data in context
      //////////////////////////////
      //////////////////////////////
      //////////////////////////////
      //////////////////////////////
      ////////////////////////////// handleUpdateQuestionData();
    }

    return () => resetParams();
  }, [lessonState.saveCount]);

  /**
   *
   * COLLECT DATA & CONTENT FROM CONTEXT - SAVE
   *
   */
  // const getWarmupDataSource = () => {
  //   const warmupType = lessonState.data.lesson.warmUp.type;
  //   switch (warmupType) {
  //     case 'story':
  //     case 'list':
  //       return params.lessonState.componentState.story;
  //     case 'truthgame':
  //       return {truthGame: params.lessonState.componentState.truthGame.truthGameArray};
  //     case 'poll':
  //       return {
  //         poll: params.lessonState.componentState.poll.pollInputs,
  //         additional: params.lessonState.componentState.poll.additional,
  //       };
  //     case 'adventure':
  //     default:
  //       return {};
  //   }
  // };

  // const getAnthologyContent = () => {
  //   const template: AnthologyContentInterface = {
  //     type: 'work',
  //     subType: '',
  //     title: '',
  //     subTitle: '',
  //     description: '',
  //     content: '',
  //   };
  //   return Object.keys(params.lessonState.componentState).reduce(
  //     (acc: AnthologyContentInterface[], componentKey: string) => {
  //       const output = () => {
  //         switch (componentKey) {
  //           case 'story':
  //             return {
  //               ...template,
  //               subType: 'story',
  //               title: params.lessonState.componentState?.story
  //                 ? params.lessonState.componentState?.story.title
  //                 : '',
  //               content: params.lessonState.componentState?.story
  //                 ? params.lessonState.componentState.story.story
  //                 : '',
  //             };
  //           case 'poem':
  //             return {
  //               ...template,
  //               subType: 'poem',
  //               title: params.lessonState.componentState?.poem
  //                 ? params.lessonState.componentState?.poem.title
  //                 : '',
  //               content: params.lessonState.componentState?.poem
  //                 ? params.lessonState.componentState.poem?.editInput
  //                 : '',
  //             };
  //           case 'notes':
  //             return {
  //               ...template,
  //               type: 'notes',
  //               subType: 'notes',
  //               title: params.lessonState.componentState?.notes
  //                 ? params.lessonState.data.lesson.title
  //                 : '',
  //               content: params.lessonState.componentState?.notes
  //                 ? params.lessonState.componentState.notes?.content
  //                 : '',
  //             };
  //           default:
  //             return {};
  //         }
  //       };
  //
  //       if (Object.keys(output()).length > 0) {
  //         return [...acc, output()];
  //       } else {
  //         return acc;
  //       }
  //     },
  //     []
  //   );
  // };

  /**
   *
   * FUNCTIONS - SAVE
   *
   */
  const updateStudentData = async (saveType?: string) => {
    let data = {
      id: params.lessonState.studentDataID,
      universalLessonID: params.lessonState.id,
      // universalLessonPageID: params.lessonState.lessonPlan[params.lessonState.currentPage]?.id,
      saveType: saveType,
      status: 'ACTIVE',
      syllabusLessonID: params.lessonState.syllabusLessonID,
      studentAuthID: params.state.user.authId,
      studentID: params.state.user.email,
      currentLocation: params.lessonState.currentPage,
      lessonProgress: params.lessonState.lessonProgress,
      pageData: params.lessonState.studentData[params.lessonState.currentPage]
    };

    console.log('updateStudentData - data - ', data);

    if (lessonState.studentDataID && lessonState.syllabusLessonID !== '') {
      try {
        // TODO: enable this once all student data can be saved
        // const dataObject: any = await API.graphql(
        //   graphqlOperation(customMutations.updateStudentData, {input: data})
        // );
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
      // TODO: enable this once all student data can be saved
      // const updatedQuestionData = await API.graphql(
      //   graphqlOperation(mutations.updateQuestionData, {input: responseObj})
      // );
      console.log('updateQuestionData responseObj -> ', responseObj);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuestionData = async () => {
    if (Object.keys(lessonState.questionData).length > 0) {
      let questionDataUpdateArray = lessonState.questionDataUpdate;
      if (questionDataUpdateArray) {
        await questionDataUpdateArray.reduce((_: any, val: any) => {
          let responseObject = {
            id: val.id,
            syllabusLessonID: lessonState.syllabusLessonID,
            checkpointID: val.checkpointID,
            componentType: lessonState.data.lesson.type,
            lessonID: lessonState.data.lesson.id,
            authID: lessonState.studentAuthID,
            email: lessonState.studentUsername,
            responseObject: lessonState.questionData[val.checkpointID],
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
