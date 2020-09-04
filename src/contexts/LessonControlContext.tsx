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

const students = [
  {
      status: 'ONLINE',
      progress: 'intro',
      data: {
          dofirst: 'I am from Texas, and I love it here...'
      },
      info: {
          "id": "142892e8-c5c2-4636-97c7-a22cc8f1dd35",
          "authId": "0a79c33f-83e8-4db9-9b46-c818ce5f8ade",
          "email": "marlon.lizama@iconoclastartists.org",
          "firstName": "Marlon",
          "language": "EN",
          "lastName": "Lizama",
          "phone": "1234567890",
          "role": "ADM",
          "status": "ACTIVE",
      },
  },
  {
      status: 'ONLINE',
      progress: 'warmup',
      data: {
          dofirst: 'I am from Houston. Houston is the most populous city in Texas and the fourth largest in the U.S. Comprising a total area of 637.4 square miles (1,651 km2), Houston is the eighth most expansive city in the United States'
      },
      info: {
          "id": "0b8a03d6-8b79-4eb1-b967-47b36fcd58bb",
          "authId": "8c3be880-15e8-42b9-90b4-71d6cb27cc53",
          "email": "claudia.crane@iconoclastartists.org",
          "firstName": "Claudia",
          "language": "EN",
          "lastName": "Crane",
          "phone": "1234567890",
          "role": "ADM",
          "status": "ACTIVE",
      },
  },
  {
      status: 'IDLE',
      progress: 'intro',
      data: {
          dofirst: 'I\'m from Texas. It is the best state in the country. We have all the best things, like barbecue and steak',
      },
      info: {
          "id": "e437b65f-9f67-4e7f-bbf4-747c11a07165",
          "authId": "4030cc63-cb29-442c-ba44-b8cb62e37916",
          "email": "michael.russell@zoiq.io",
          "firstName": "Michael",
          "language": "EN",
          "lastName": "Russell",
          "phone": "+420770642500",
          "role": "ADM",
          "status": "ACTIVE",
      },
  },
  {
      status: 'OFFLINE',
      progress: '',
      data: {
          dofirst: ''
      },
      info: {
          "id": "e56d032c-5e8b-4327-9008-0a98bb738e95",
          "authId": "c8e25b37-103a-41e5-998b-56145bbd94c9",
          "email": "and.d.markham@gmail.com",
          "firstName": "Andrew",
          "language": "EN",
          "lastName": "Markham",
          "phone": "1234567890",
          "preferredName": "Andy",
          "role": "ADM",
          "status": "ACTIVE",
      },
  },
  {
      status: 'OFFLINE',
      progress: '',
      data: {

      },
      info: {
          "id": "0ab04955-105e-4425-86d7-f0762d0b72a8",
          "authId": "9178ab95-33cb-403f-8a65-c8269a25bed5",
          "birthdate": "2010-01-25",
          "email": "jayne.phillips61@gmail.com",
          "firstName": "Jayne",
          "language": "ES",
          "lastName": "Phillips",
          "phone": "000555",
          "preferredName": "Jayney",
          "role": "BLD",
          "status": "ACTIVE",
      },
  },
]

export const LessonControlContext = React.createContext(null);

export const LessonControlContextProvider = ({ children }: LessonControlProps) => {
    const [ state, dispatch ] = useReducer(lessonControlReducer, lessonControlState);
    const [ lesson, setLesson ] = useState<LessonObject>()
    const [ studentData, setStudentData ] = useState<{[key: string]: any}>();
    const [ lightOn, setLightOn ] = useState(false);
    const location = useLocation();

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
          subscribeToStudentData()
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
    }

    useEffect(() => {
      getClassroom()
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

