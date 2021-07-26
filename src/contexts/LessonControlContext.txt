import React, {useEffect, useReducer, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {lessonControlState} from '../state/LessonControlState';
import {lessonControlReducer} from '../reducers/LessonControlReducer';
import * as customQueries from '../customGraphql/customQueries';
import * as customSubscriptions from '../customGraphql/customSubscriptions';
// import { API, graphqlOperation } from 'aws-amplify';
import API, {graphqlOperation} from '@aws-amplify/api';
import {standardTheme} from './GlobalContext';
import {createFilterToFetchSpecificItemsOnly, getClientKey} from '../utilities/strings';
import * as queries from '../graphql/queries';

interface LessonControlProps {
  children: React.ReactNode;
}

interface LessonObject {
  [key: string]: any;
}

export const LessonControlContext = React.createContext(null);

export const LessonControlContextProvider = ({children}: LessonControlProps) => {
  const [state, dispatch] = useReducer(lessonControlReducer, lessonControlState);
  const theme = standardTheme;

  // const location = useLocation();
  const history = useHistory();
  const urlParams: any = useParams();

  // Subscription for student->teacher interaction
  let subscription: any;

  // Dictionary
  const userLanguage = /*state.user.language ||*/ 'EN'; // TODO: add 'user' property & info to state
  const uLang = userLanguage;
  const clientKey = getClientKey();

  const [lesson, setLesson] = useState<LessonObject>();
  const [updatedLesson, setUpdatedLesson] = useState<any>();

  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);

  const [recentQuestionOp, setRecentQuestionOp] = useState<string>('');
  const [checkpointIdList, setCheckpointIdList] = useState<string[]>(['']);
  const [checkpointsLoaded, setCheckpointsLoaded] = useState<boolean>(false);
  const [checkpointsItems, setCheckpointsItems] = useState<any[]>([]);
  const [checkpointsSequence, setCheckpointsSequence] = useState<string[]>(['']);
  const [checkpointsQuestionsSequence, setCheckpointsQuestionsSequence] = useState<
    {[key: string]: string[]}[]
  >([]);
  const [reordered, setReordered] = useState<boolean>(false);

  /**
   *
   *
   * HELP SECTION:
   *
   *  On mount ->
   *  1.
   *
   */
  // useEffect(() => {
  //   if (Object.keys(state.data).length > 0 && state.data.lesson && state.pages) {
  //     setLessonDataLoaded(true);
  //   }
  // }, [state.data]);

  // async function getSyllabusLesson() {
  //   const {lessonID} = urlParams;
  //   if (lessonID) {
  //     try {
  //       const classroom: any = await API.graphql(
  //         graphqlOperation(customQueries.getSyllabusLesson, {id: lessonID})
  //       );
  //
  //       setLesson(classroom.data.getSyllabusLesson);
  //
  //       subscription = subscribeToStudentData();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     history.push('/dashboard/lesson-planner');
  //   }
  // }

  // useEffect(() => {
  //   getSyllabusLesson();
  //
  //   return function cleanup() {
  //     if (subscription) {
  //       subscription.unsubscribe();
  //     }
  //     dispatch({type: 'CLEANUP'});
  //   };
  // }, []);

  /**
   * Function and useEffect for getting/setting checkpoints if
   * condition is met and lesson plans include
   * checkpoints in their name
   */
  // const getAllCheckpointQuestionsSequence = async (cpIdList: string[]) => {
  //   const questionSequences = Promise.all(
  //     cpIdList.map(async (cpId: string) => {
  //       const questionSequences: any = await API.graphql(
  //         graphqlOperation(queries.getCSequences, {id: `Ch_Ques_${cpId}`})
  //       );
  //       return {[`${cpId}`]: questionSequences.data.getCSequences.sequence};
  //     })
  //   );
  //   return questionSequences;
  // };

  // const getAllCheckpointSequence = () => {
  //   return state.data.lesson.lessonPlan.map((lessonPlanObj: any) => {
  //     return {[`${lessonPlanObj.LessonComponentID}`]: lessonPlanObj.sequence};
  //   });
  // };

  // const getAllCheckpoints = async (cpIdList: string[]) => {
  //   if (cpIdList.length > 0) {
  //     try {
  //       const checkpoints: any = await API.graphql(
  //         graphqlOperation(customQueries.listCheckpoints, {
  //           filter: {...createFilterToFetchSpecificItemsOnly(cpIdList, 'id')},
  //         })
  //       );
  //
  //       const items = checkpoints.data.listCheckpoints.items;
  //       setCheckpointsItems(items);
  //       setUpdatedLesson({
  //         ...lesson,
  //         lesson: {...lesson.lesson, checkpoints: checkpoints.data.listCheckpoints},
  //       });
  //     } catch (e) {
  //       console.error('err fetch checkpoints ::: ', e);
  //     } finally {
  //       setCheckpointsLoaded(true);
  //     }
  //   } else {
  //     setCheckpointsLoaded(false);
  //   }
  // };

  // const reorderCheckpoints = (checkpointsArray: any[], orderArray: string[]) => {
  //   const ordered = orderArray.map((seqObj: any) => {
  //     const key = Object.keys(seqObj);
  //     const val: string[] = Object.values(seqObj);
  //     const findCP = checkpointsArray.find((cpObj: any) => cpObj.id === key[0]);
  //     return findCP;
  //   });
  //   return ordered;
  // };

  // const reorderCheckpointQuestions = (
  //   checkpointQuestions: any[],
  //   orderArray: string[]
  // ) => {
  //   const ordered = orderArray.map((qStr: string) => {
  //     const findQ = checkpointQuestions.find((qObj: any) => qObj.question.id === qStr);
  //     return findQ;
  //   });
  //   return ordered;
  // };

  // const setCheckpointsToLessonData = (checkpointsArray: any[]) => {
  //   setCheckpointsItems(checkpointsArray);
  // };

  // useEffect(() => {
  //   const reorderProcess = async () => {
  //     if (checkpointsLoaded && checkpointsItems) {
  //       if (state.data.lesson.type !== 'lesson') {
  //         if (checkpointsSequence.length === checkpointsItems.length) {
  //           const ordered = reorderCheckpoints(checkpointsItems, checkpointsSequence);
  //           setCheckpointsToLessonData(ordered);
  //         }
  //       }
  //     }
  //   };
  //
  //   const reorderProcess2 = async () => {
  //     if (checkpointsLoaded && checkpointsQuestionsSequence.length > 0) {
  //       const mapCheckpointQuestions = checkpointsItems.map((checkpoint: any) => {
  //         const questions = checkpoint.questions.items;
  //         const questionsOrder = checkpointsQuestionsSequence.reduce(
  //           (acc: any[], seqObj: any) => {
  //             const key = Object.keys(seqObj);
  //             const val: string[] = Object.values(seqObj);
  //             if (key[0] === checkpoint.id) {
  //               //@ts-ignore
  //               return [...acc, ...val[0]];
  //             } else {
  //               return acc;
  //             }
  //           },
  //           []
  //         );
  //
  //         if (questionsOrder) {
  //           // @ts-ignore
  //           const ordered = reorderCheckpointQuestions(questions, questionsOrder);
  //           return {...checkpoint, questions: {...checkpoint.questions, items: ordered}};
  //         } else {
  //           return checkpoint;
  //         }
  //       });
  //
  //       setCheckpointsToLessonData(mapCheckpointQuestions);
  //     } else {
  //       console.log('skipped reorderProcess2()');
  //     }
  //   };
  //
  //   const process = async () => {
  //     await reorderProcess();
  //     await reorderProcess2();
  //   };
  //
  //   if (checkpointsLoaded && checkpointsQuestionsSequence.length > 0) {
  //     process();
  //     setReordered(true);
  //   }
  // }, [checkpointsLoaded, checkpointsSequence, checkpointsQuestionsSequence]);

  /**
   * GET additional data / checkpoints separately
   */
  // useEffect(() => {
  //   const getAdditionalLessonData = async () => {
  //     if (state.data && state.data.lessonPlan) {
  //       await getAllCheckpoints(checkpointIdList);
  //     }
  //     if (lessonDataLoaded && state.data.lesson.type !== 'lesson') {
  //       const checkpointSequences = await getAllCheckpointSequence();
  //       setCheckpointsSequence(checkpointSequences);
  //     }
  //     if (lessonDataLoaded && state.data.lesson.type !== 'lesson') {
  //       const questionSequences = await getAllCheckpointQuestionsSequence(
  //         checkpointIdList
  //       );
  //       setCheckpointsQuestionsSequence(questionSequences);
  //     }
  //   };
  //   if (!checkpointsLoaded && checkpointIdList.length > 0) {
  //     getAdditionalLessonData();
  //   }
  // }, [checkpointIdList]);

  // const getAllCheckpointIds = () => {
  //   return state.data.lessonPlan.reduce((acc: string[], lessonPlanObj: any) => {
  //     const isCheckpoint = lessonPlanObj.stage.includes('checkpoint');
  //     if (isCheckpoint) {
  //       const matchArray = lessonPlanObj.stage.match(/checkpoint\?id=(.*)/);
  //       return [...acc, matchArray[1]];
  //     } else {
  //       return acc;
  //     }
  //   }, []);
  // };
  //
  // useEffect(() => {
  //   if (lessonDataLoaded && state.data.hasOwnProperty('lessonPlan')) {
  //     setCheckpointIdList(getAllCheckpointIds);
  //   }
  // }, [lessonDataLoaded, state.data]);

  // useEffect(() => {
  //   if (lesson) {
  //     const {lessonID} = urlParams;
  //     dispatch({
  //       type: 'INITIAL_LESSON_SETUP',
  //       payload: {
  //         syllabusLessonID: lessonID,
  //         pages: lesson.lessonPlan,
  //         data: lesson,
  //         students: [],
  //         open: lesson?.status === 'Active',
  //         complete: lesson?.complete,
  //         startDate: lesson?.startDate ? lesson?.startDate : '',
  //         endDate: lesson?.endDate ? lesson?.endDate : '',
  //       },
  //     });
  //   }
  // }, [lesson]);

  useEffect(() => {
    if (lesson) {
      dispatch({
        type: 'UPDATE_LESSON_DATA',
        payload: {
          data: updatedLesson,
        },
      });
    }
  }, [updatedLesson]);

  /**
   * SUBSCRIBE TO STUDENT STUFF
   */
  // const subscribeToStudentData = () => {
  //   const {lessonID} = urlParams;
  //
  //   const studentDataSubscription = API.graphql(
  //     graphqlOperation(customSubscriptions.onChangeStudentData, {
  //       syllabusLessonID: lessonID,
  //     })
  //     // @ts-ignore
  //   ).subscribe({
  //     next: (studentData: any) => {
  //       let updatedData = studentData.value.data.onChangeStudentData;
  //
  //       dispatch({type: 'UPDATE_STUDENT_DATA', payload: updatedData});
  //     },
  //   });
  //
  //   return studentDataSubscription;
  // };

  return (
    <LessonControlContext.Provider
      value={{
        state,
        dispatch,
        theme,
        userLanguage,
        uLang,
        clientKey,
        checkpointsItems,
      }}>
      {children}
    </LessonControlContext.Provider>
  );
};