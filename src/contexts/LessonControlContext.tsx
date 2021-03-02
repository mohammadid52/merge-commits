import React, { useEffect, useReducer, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { lessonControlState } from '../state/LessonControlState';
import { lessonControlReducer } from '../reducers/LessonControlReducer';
import queryString from 'query-string';
import * as customQueries from '../customGraphql/customQueries';
import * as customSubscriptions from '../customGraphql/customSubscriptions';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import { standardTheme } from './GlobalContext';
import { Auth } from '@aws-amplify/auth';
import * as mutations from '../graphql/mutations';
import { createFilterToFetchSpecificItemsOnly } from '../utilities/strings';

interface LessonControlProps {
  children: React.ReactNode;
}

interface LessonObject {
  [key: string]: any;
}

export const LessonControlContext = React.createContext(null);

export const LessonControlContextProvider = ({ children }: LessonControlProps) => {
  const [state, dispatch] = useReducer(lessonControlReducer, lessonControlState);
  const [lesson, setLesson] = useState<LessonObject>();
  const [updatedLesson, setUpdatedLesson] = useState<any>();
  const history = useHistory();
  const location = useLocation();
  const urlParams: any = useParams()
  //console.log('urlParams', urlParams)

  let subscription: any;

  const theme = standardTheme;

  async function getSyllabusLesson() {
    const { lessonID } = urlParams
    if (lessonID) {
      try {
        const classroom: any = await API.graphql(
          graphqlOperation(customQueries.getSyllabusLesson, { id: lessonID })
        );

        setLesson(classroom.data.getSyllabusLesson);
        dispatch({
          type: 'INITIAL_LESSON_SETUP',
          payload: {
            syllabusLessonID: lessonID,
            pages: classroom.data.getSyllabusLesson.lessonPlan,
            data: classroom.data.getSyllabusLesson,
            students: [],
            open: classroom.data.getSyllabusLesson?.status === 'Active',
            complete: classroom.data.getSyllabusLesson?.complete,
            startDate: classroom.data.getSyllabusLesson?.startDate ? classroom.data.getSyllabusLesson?.startDate : '',
            endDate: classroom.data.getSyllabusLesson?.endDate ? classroom.data.getSyllabusLesson?.endDate : '',
          },
        });
        subscription = subscribeToStudentData();
      } catch (error) {
        console.error(error);
      }
    } else {
      history.push('/dashboard/lesson-planner');
    }
  }

  /**
   * Function and useEffect for getting/setting checkpoints if
   * condition is met and lesson plans include
   * checkpoints in their name
   */
  const getAllCheckpoints = async () => {
    const allCheckpointIDS = state.data.lessonPlan.reduce((acc: string[], lessonPlanObj: any) => {
      const isCheckpoint = lessonPlanObj.stage.includes('checkpoint');
      if (isCheckpoint) {
        return [...acc, lessonPlanObj.stage.match(/[^?id=]*$/g)[0]];
      } else {
        return acc;
      }
    }, []);
    try {
      const checkpoints: any = await API.graphql(graphqlOperation(customQueries.listCheckpoints, {
        filter: { ...createFilterToFetchSpecificItemsOnly(allCheckpointIDS, 'id') },
      }));

      setUpdatedLesson({ ...lesson, lesson: { ...lesson.lesson, checkpoints: checkpoints.data.listCheckpoints } });
    } catch (e) {
      console.error('err fetch checkpoints ::: ', e);
    }
  };

  /**
   * GET additional data / checkpoints separately
   */
  useEffect(() => {
    const getAdditionalLessonData = async () => {
      if (state.data && state.data.lessonPlan) {
        await getAllCheckpoints();
        // await getOrCreateQuestionData();
      }
    };
    getAdditionalLessonData();
  }, [state.data.lessonPlan]);
  //
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
  const subscribeToStudentData = () => {
    const { lessonID } = urlParams
    // @ts-ignore
    const studentDataSubscription = API.graphql( graphqlOperation(customSubscriptions.onChangeStudentData, { syllabusLessonID: lessonID }) ).subscribe({
      next: (studentData: any) => {
        let updatedData = studentData.value.data.onChangeStudentData;

        dispatch({ type: 'UPDATE_STUDENT_DATA', payload: updatedData });
      },
    });

    return studentDataSubscription;
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

  return <LessonControlContext.Provider value={{ state, dispatch, theme }}>{children}</LessonControlContext.Provider>;
};
