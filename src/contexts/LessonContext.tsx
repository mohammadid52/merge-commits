import React, { useEffect, useReducer, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { lessonState } from '../state/LessonState';
import { lessonReducer } from '../reducers/LessonReducer';
import * as customSubscriptions from '../customGraphql/customSubscriptions';
import * as customMutations from '../customGraphql/customMutations';
import * as mutations from '../graphql/mutations';
import * as customQueries from '../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import { standardTheme } from './GlobalContext';
import * as queries from '../graphql/queries';
import { createFilterToFetchSpecificItemsOnly, getClientKey } from '../utilities/strings';

interface LessonProps {
  children: React.ReactNode;
}

interface LessonObject {
  [key: string]: any;
}

interface DataObject {
  [key: string]: any;
}

export const LessonContext = React.createContext(null);

export const LessonContextProvider: React.FC = ({ children }: LessonProps) => {
  const [state, dispatch] = useReducer(lessonReducer, lessonState);
  const theme = standardTheme;
  // const location = useLocation();
  const history = useHistory();
  const urlParams: any = useParams();

  // Subscription for teacher/syllabusLesson changes
  let subscription: any;

  // Dictionary
  const userLanguage = /*state.user.language ||*/ 'EN'; // TODO: add 'user' property & info to state
  const uLang = userLanguage;
  const clientKey = getClientKey();

  const [data, setData] = useState<DataObject>();
  const [lesson, setLesson] = useState<DataObject>();
  const [subscriptionData, setSubscriptionData] = useState<any>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [personLocationObj, setPersonLocationObj] = useState<any>();
  const [recentOp, setRecentOp] = useState<string>('');
  const [recentQuestionOp, setRecentQuestionOp] = useState<string>('');
  const [checkpointsLoaded, setCheckpointsLoaded] = useState<boolean>(false);

  // INIT PERSON LOCATION STATE
  useEffect(() => {
    loadPersonData();
  }, []);

  useEffect(() => {
    if (loaded && state.syllabusLessonID && state.studentAuthID) {
      if (recentOp === 'created' || recentOp === 'updated') {
        if (personLocationObj && personLocationObj.currentLocation) {
          updatePersonLocation();
        }
      }
      if (recentOp === '') {
        createPersonLocation();
      }
    }
  }, [loaded, state.syllabusLessonID, state.studentAuthID]);

  useEffect(() => {
    if (recentOp !== '') {
      updatePersonLocation();
    }
  }, [state.currentPage]);

  // CREATE LOCATION RECORD or UPDATE
  async function loadPersonData() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        const { email, sub } = user.attributes;
        let userInfo: any = await API.graphql(
          graphqlOperation(customQueries.getPersonLocation, { personEmail: email, personAuthID: sub })
        );
        userInfo = userInfo.data.getPersonLocation;
        if (userInfo !== null) setRecentOp('updated');
        setPersonLocationObj(userInfo);
      }
    } catch (e) {
      console.error(e);
    } finally {
      //console.log('loaded...');
      setLoaded(true);
    }
  }

  async function createPersonLocation() {
    const newLocation = {
      personAuthID: state.studentAuthID,
      personEmail: state.studentUsername,
      syllabusLessonID: state.syllabusLessonID,
      roomID: '0',
      currentLocation: state.currentPage,
      lessonProgress: state.lessonProgress,
    };
    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.createPersonLocation, { input: newLocation })
      );
    } catch (e) {
      console.error('create PersonLocation : ', e);
    } finally {
      setRecentOp('created');
    }
  }

  async function updatePersonLocation() {
    const updatedLocation = {
      id: personLocationObj && personLocationObj.id ? personLocationObj.id : '',
      personAuthID: state.studentAuthID,
      personEmail: state.studentUsername,
      syllabusLessonID: state.syllabusLessonID,
      roomID: '0',
      currentLocation: state.currentPage,
      lessonProgress: state.lessonProgress,
    };
    try {
      if (recentOp === 'created') {
        await loadPersonData();
      }
      // console.log('updated', personLocationObj);
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, { input: updatedLocation })
      );
      setPersonLocationObj(updatedLocation);
      // console.log('updated person location...');
    } catch (e) {
      console.error('update PersonLocation : ', e);
    } finally {
      setRecentOp('updated');
    }
  }

  //  END OF LOCATION TRACKING SCRIPT

  /**
   * GET or CREATE STUDENT DATA
   */
  async function getOrCreateStudentData() {
    const { lessonID } = urlParams;
    let studentID: string;
    let studentAuthID: string;

    await Auth.currentAuthenticatedUser().then((user) => {
      // console.log(user);
      studentID = user.attributes.email;
      studentAuthID = user.attributes.sub;
    });

    try {
      const studentData: any = await API.graphql(
        graphqlOperation(customQueries.getStudentData, {
          syllabusLessonID: lessonID,
          studentID: studentID,
        })
      );

      if (!studentData.data.getStudentData) {
        const newStudentData: any = await API.graphql(
          graphqlOperation(customMutations.createStudentData, {
            input: {
              lessonProgress: '0',
              currentLocation: '0',
              status: 'ACTIVE',
              syllabusLessonID: lessonID,
              studentID: studentID,
              studentAuthID: studentAuthID,
            },
          })
        );
        dispatch({
          type: 'SET_STUDENT_INFO',
          payload: {
            studentDataID: newStudentData.data.createStudentData.id,
            studentUsername: newStudentData.data.createStudentData.studentID,
            studentAuthID: newStudentData.data.createStudentData.studentAuthID,
          },
        });
        return setData(newStudentData.data.createStudentData);
      }
      dispatch({
        type: 'SET_STUDENT_INFO',
        payload: {
          studentDataID: studentData.data.getStudentData.id,
          studentUsername: studentData.data.getStudentData.studentID,
          studentAuthID: studentData.data.getStudentData.studentAuthID,
        },
      });
      return setData(studentData.data.getStudentData);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Function and useEffect for getting/setting checkpoints if
   * condition is met and lesson plans include
   * checkpoints in their name
   */
  const getAllCheckpoints = async () => {
    const allCheckpointIDS = state.data.lessonPlan.reduce((acc: string[], lessonPlanObj: any, i: number) => {
      const isCheckpoint = lessonPlanObj.stage.includes('checkpoint');
      if (isCheckpoint) {
        return [...acc, lessonPlanObj.stage.match(/checkpoint\?id=(.*)/)[1]];
      } else {
        return acc;
      }
    }, []);
    if (allCheckpointIDS.length > 0) {
      try {
        const checkpoints: any = await API.graphql(graphqlOperation(customQueries.listCheckpoints, {
          filter: { ...createFilterToFetchSpecificItemsOnly(allCheckpointIDS, 'id') },
        }));



        const items = checkpoints.data.listCheckpoints.items;
        const orderCorrected = allCheckpointIDS.map((checkpointID: string, idx: number) => {
          const pickCheckpointObj = items.find((targetCheckpointObj: any) => targetCheckpointObj.id === checkpointID)
          return pickCheckpointObj;
        })

        // console.log('checkpoints --> ', items)
        // console.log('checkpoints --> ordered --> ',orderCorrected)
        const listCheckpoints = {...checkpoints.data.listCheckpoints, items: orderCorrected}

        setLesson({ ...lesson, lesson: { ...lesson.lesson, checkpoints:  listCheckpoints}});

        // INIT CONTEXT WITH EMPTY QUESTIONDATA!
        const initCheckpointsObj = listCheckpoints.items.reduce((acc: any, checkpointObj: any) => {
          return { ...acc, [checkpointObj.id]: {} };
        }, {});

        dispatch({
          type: 'SET_QUESTION_DATA',
          payload: {
            data: initCheckpointsObj,
          },
        });

      } catch (e) {
        console.error('err fetch checkpoints ::: ', e);
      } finally {
        setCheckpointsLoaded(true);
      }
    } else {
      setCheckpointsLoaded(false);
    }
  };

  /**
   * GET or CREATE QUESTION DATA
   */
  const createQuestionData = async (responseObj: any) => {
    try {
      const newQuestionData = await API.graphql(
        graphqlOperation(customMutations.createQuestionData, { input: responseObj }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateQuestionData = async () => {
    let studentID: string;
    let studentAuthID: string;

    await Auth.currentAuthenticatedUser().then((user) => {
      studentID = user.attributes.email;
      studentAuthID = user.attributes.sub;
    });

    if (typeof state.questionData === 'object') {
      let checkpointIdKeys = Object.keys(state.questionData); // doFirst, checkpoint_1
      await checkpointIdKeys.reduce((_: any, key: string) => {
        let responseObject = {
          syllabusLessonID: state.syllabusLessonID,
          checkpointID: key,
          componentType: state.data.lesson.type,
          lessonID: state.data.lesson.id,
          authID: studentAuthID,
          email: studentID,
          responseObject: state.questionData[key],
        };

        createQuestionData(responseObject);
      }, null);
      setRecentQuestionOp('created');
    }
  }

  async function getOrCreateQuestionData() {
    const { lessonID } = urlParams;
    let studentID: string;
    let studentAuthID: string;

    await Auth.currentAuthenticatedUser().then((user) => {
      studentID = user.attributes.email;
      studentAuthID = user.attributes.sub;
    });

    // console.log('getOrCreateQuestionData -> recentQuestionOp, ', recentQuestionOp)

    try {
      const questionDatas: any = await API.graphql(
        graphqlOperation(queries.listQuestionDatas, {
          filter: {
            syllabusLessonID: { eq: lessonID },
            email: { eq: studentID },
          },
        }),
      );
      const questionDataUpdateArray = questionDatas.data.listQuestionDatas.items.reduce((acc: any[], val: any) => {
        return [...acc, {
          id: val.id,
          checkpointID: val.checkpointID,
        }];
      }, []);

      const noQuestionDatas = questionDatas.data.listQuestionDatas.items.length === 0;
      const existQuestionDatas = questionDatas.data.listQuestionDatas.items.length > 0;

      if (noQuestionDatas && recentQuestionOp === '') {
        await handleCreateQuestionData();
      }

      if (
        existQuestionDatas && recentQuestionOp === '' ||
        existQuestionDatas && recentQuestionOp === 'created'
      ) {
        dispatch({ type: 'SET_QUESTION_DATA_UPDATE', payload: { data: questionDataUpdateArray } });
        setRecentQuestionOp('fetched');
      }
    } catch (e) {
      console.error('getOrCreateQuestionData -> ', e);
    }
  }

  // Collect and fetch checkpoints when lesson loaded
  // useEffect(() => {
  //   const getAdditionalLessonData = async () => {
  //     if (state.data && state.data.lessonPlan) {
  //       await getAllCheckpoints();
  //     }
  //   };
  //   if (!checkpointsLoaded) {
  //     getAdditionalLessonData();
  //   }
  // }, [state.data.lesson]);

  useEffect(() => {
    const getAdditionalLessonData = async () => {
      if (state.data && state.data.lessonPlan) {
        await getAllCheckpoints();
      }
    };
    if (!checkpointsLoaded && state.status === 'loaded') {
      getAdditionalLessonData();
    }
  }, [state.status]);



  // Init questionData in DB if necessary
  useEffect(() => {
    const initQuestionDataDB = async () => {
      await getOrCreateQuestionData();
    };
    if (checkpointsLoaded && state.data.lesson.type === 'lesson') {
      if (recentQuestionOp === '' || recentQuestionOp === 'created') {
        getOrCreateQuestionData();
      }
    }
  }, [checkpointsLoaded, recentQuestionOp]);

  /**
   * GET SYLLABUS LESSON
   */
  async function getSyllabusLesson() {
    const { lessonID } = urlParams;
    if (lessonID) {
      try {
        const classroom: any = await API.graphql(
          graphqlOperation(customQueries.getSyllabusLesson, { id: lessonID }),
        );
        setLesson(classroom.data.getSyllabusLesson);
        getOrCreateStudentData();
        subscription = subscribeToSyllabusLesson();
      } catch (error) {
        console.error(error);
      }
    } else {
      history.push('/dashboard');
    }
  }


  /**
   * SUBSCRIBE TO SYLLABUS LESSON
   */
  const subscribeToSyllabusLesson = () => {
    const { lessonID } = urlParams;
    // @ts-ignore
    const syllabusLessonSubscription = API.graphql( graphqlOperation(customSubscriptions.onChangeSyllabusLesson, { id: lessonID }) ).subscribe({
      next: (syllabusLessonData: any) => {
        const updatedLessonPlan = syllabusLessonData.value.data.onChangeSyllabusLesson;
        // @ts-ignore
        API.graphql(graphqlOperation(customQueries.getSyllabusLesson, { id: lessonID })).then(
          (sLessonData: any) => {
            const sLessonDataData = sLessonData.data.getSyllabusLesson;
            setSubscriptionData(sLessonDataData)
          }
        );
      },
    });

    dispatch({
      type: 'SET_SUBSCRIPTION',
      payload: {
        subscription: syllabusLessonSubscription,
      },
    });

    return syllabusLessonSubscription;
  };

  useEffect(() => {
    getSyllabusLesson();

    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe();
      }
      dispatch({ type: 'CLEANUP' });
    };
  }, []);

  useEffect(() => {
    if(subscriptionData){

      dispatch({
        type: 'UPDATE_LESSON_PLAN',
        payload: {
          pages: subscriptionData.lessonPlan.filter((item: { disabled: boolean; [key: string]: any }) => {
            return !item.disabled;
          }),
          //@ts-ignore
          displayData: {...subscriptionData.displayData, breakdownComponent: state.pages[subscriptionData.displayData.breakdownComponent]?.stage},
          viewing: subscriptionData.viewing,
        },
      });
    }
  }, [subscriptionData]);

  useEffect(() => {
    if (data) {
      let initialComponentState: any = {};
      let initialComponentStateSecondary: any = { notes: '' };
      lesson.lessonPlan.forEach((item: { type: string; stage: string }) => {
        initialComponentState[item.type] = data[item.stage];
      });
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE_FROM_DB',
        payload: { ...initialComponentState, ...initialComponentStateSecondary },
      });
    }
  }, [data]);

  useEffect(() => {
    if (lesson) {
      dispatch({
        type: 'SET_INITIAL_STATE',
        payload: {
          syllabusLessonID: lesson.id,
          data: lesson,
          pages: lesson.lessonPlan.filter((item: { disabled: boolean; [key: string]: any }) => {
            return !item.disabled;
          }),
          displayData: lesson.displayData,
          word_bank: [''],
          subscribeFunc: subscribeToSyllabusLesson,
        },
      });
    }
  }, [lesson]);




  return (
    <LessonContext.Provider
      value={{
        state,
        dispatch,
        theme,
        subscription,
        subscribeToSyllabusLesson,
        userLanguage,
        uLang,
        clientKey
      }}>
      {children}
    </LessonContext.Provider>
  );
};
