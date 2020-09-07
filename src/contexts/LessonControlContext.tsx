import React, { useState, useReducer, useEffect } from 'react';
import { lessonControlState } from '../state/LessonControlState';
import { lessonControlReducer } from '../reducers/LessonControlReducer';
import queryString from 'query-string';
import * as customQueries from '../customGraphql/customQueries';
import * as customSubscriptions from '../customGraphql/customSubscriptions';
import { API, graphqlOperation } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import { pageThemes } from './GlobalContext';

interface LessonControlProps {
    children: React.ReactNode;
}

interface LessonObject {
  [key: string]: any;
}

export const LessonControlContext = React.createContext(null);

export const LessonControlContextProvider = ({ children }: LessonControlProps) => {
    const [ state, dispatch ] = useReducer(lessonControlReducer, lessonControlState);
    const [ lesson, setLesson ] = useState<LessonObject>()
    const [ lightOn, setLightOn ] = useState(false);
    const location = useLocation();
    let subscription: any;

    const lightSwitch = () => {
        setLightOn(prev => {
            return !prev
        })
    }

    const theme = lightOn ? pageThemes.light : pageThemes.dark;

    async function getClassroom() {
      let queryParams = queryString.parse(location.search)
      
      try {
          // this any needs to be changed once a solution is found!!!
          const classroom: any = await API.graphql(graphqlOperation(customQueries.getClassroom, { id: queryParams.id }))
          console.log('classroom data', classroom);
          setLesson(classroom.data.getClassroom)
          dispatch({
            type: 'INITIAL_LESSON_SETUP', 
            payload: { 
              pages: classroom.data.getClassroom.lessonPlan, 
              data: classroom.data.getClassroom,
              students: classroom.data.getClassroom.data.items
          }})
          subscription = subscribeToStudentData()
      } catch (error) {
          console.error(error)
      }
    }

    // const listStudentData = async () => {
    //   const studentData: any = await API.graphql(graphqlOperation(customQueries))
    // }

    const subscribeToStudentData = () => {
      let queryParams = queryString.parse(location.search)

      // @ts-ignore
      const studentDataSubscription = API.graphql(graphqlOperation(customSubscriptions.onChangeStudentData, { classroomID: queryParams.id })).subscribe({
          next: (studentData: any) => console.log(studentData)
      });

      console.log('sub', studentDataSubscription)

      return studentDataSubscription
    }

    useEffect(() => {
      getClassroom()

      return function cleanup() {
        subscription.unsubscribe();
        dispatch({ type: 'CLEANUP' })
      }
    }, [])


    useEffect(() => {
      console.log(lesson);
      
      
    }, [lesson])


    return (
        <LessonControlContext.Provider value={{ state, dispatch, theme }}>
            { children }
        </LessonControlContext.Provider>
    )
}

