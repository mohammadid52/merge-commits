import React, { useEffect, useReducer, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { lessonControlState } from '../state/LessonControlState';
import { lessonControlReducer } from '../reducers/LessonControlReducer';
import queryString from 'query-string';
import * as customQueries from '../customGraphql/customQueries';
import * as customSubscriptions from '../customGraphql/customSubscriptions';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import { standardTheme } from './GlobalContext';

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
  const history = useHistory();
  const location = useLocation();
  let subscription: any;

  const theme = standardTheme;

  async function getSyllabusLesson() {
    let queryParams = queryString.parse(location.search);
    if (Object.keys(queryParams).length && queryParams.id) {
      try {
        const classroom: any = await API.graphql(
          graphqlOperation(customQueries.getSyllabusLesson, { id: queryParams.id })
        );

        console.log('getSyllabusLesson - ', classroom.data.getSyllabusLesson);

        setLesson(classroom.data.getSyllabusLesson);
        dispatch({
          type: 'INITIAL_LESSON_SETUP',
          payload: {
            syllabusLessonID: queryParams.id,
            pages: classroom.data.getSyllabusLesson.lessonPlan,
            data: classroom.data.getSyllabusLesson,
            students: [] /*classroom.data.getSyllabusLesson?.data.items*/,
            open: classroom.data.getSyllabusLesson?.status === 'Active',
            complete: classroom.data.getSyllabusLesson?.complete,
            startDate: classroom.data.getSyllabusLesson?.startDate ? classroom.data.getSyllabusLesson?.startDate : '',
            endDate: classroom.data.getSyllabusLesson?.endDate ? classroom.data.getSyllabusLesson?.endDate : '',
          },
        });
        // subscription = subscribeToStudentData();
      } catch (error) {
        console.error(error);
      }
    } else {
      history.push('/dashboard/lesson-planner');
    }
  }

  const subscribeToStudentData = () => {
    let queryParams = queryString.parse(location.search);

    // @ts-ignore
    const studentDataSubscription = API.graphql( graphqlOperation(customSubscriptions.onChangeStudentData, { classroomID: queryParams.id }) ).subscribe({
      next: (studentData: any) => {
        let updatedData = studentData.value.data.onChangeStudentData;
        console.log('studentDataSubscription : ', updatedData);

        dispatch({ type: 'UPDATE_STUDENT_DATA', payload: updatedData });
        // console.log(found)
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

  useEffect(() => {
    // console.log(lesson);
  }, [lesson]);

  return <LessonControlContext.Provider value={{ state, dispatch, theme }}>{children}</LessonControlContext.Provider>;
};
