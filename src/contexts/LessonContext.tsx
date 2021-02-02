import React, { useReducer, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { lessonState, PagesType } from '../state/LessonState';
import { lessonReducer } from '../reducers/LessonReducer';
import { useCookies } from 'react-cookie';
import * as customSubscriptions from '../customGraphql/customSubscriptions';
import * as customMutations from '../customGraphql/customMutations';
import * as mutations from '../graphql/mutations';
import * as customQueries from '../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { standardTheme } from './GlobalContext';
import { initRosterSyllabusLessons } from '../uniqueScripts/InitRoster_in_SyllabusLessons';
import { create } from 'domain';

const removeDisabled = (array: PagesType): any[] => {
  let updatedArray = array.filter((item: { disabled: boolean; [key: string]: any }) => {
    return !item.disabled;
  });

  return updatedArray;
};

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
  const [data, setData] = useState<DataObject>();
  const [lesson, setLesson] = useState<DataObject>();

  // const [ cookies ] = useCookies(['auth']);
  const [state, dispatch] = useReducer(lessonReducer, lessonState);
  const location = useLocation();
  const history = useHistory();
  let subscription: any;

  const theme = standardTheme;

  const [cookies, setCookie] = useCookies([`location`]);
  const [personLocationObj, setPersonLocationObj] = useState<any>();

  const queryParams = queryString.parse(location.search);
  const newPersonLocation = {
    syllabusLessonID: queryParams.id,
    currentLocation: state.currentPage,
    lessonProgress: state.lessonProgress,
    personEmail: state.studentUsername,
    personAuthID: state.studentAuthID,
    roomID: '0',
  };

  // INIT PERSON LOCATION COOKIS & STATE
  useEffect(() => {
    const initLocation = () => {
      if (!cookies.location) {
        getPersonLocation();
      }
      if(cookies.location){
          if(cookies.location.hasOwnProperty('id')){
            setPersonLocationObj(cookies.location);
          } else {
            getPersonLocation();
          }
      }
    };

    if (state.studentAuthID) initLocation();
  }, [state.studentAuthID]);

  useEffect(()=>{
   if(personLocationObj === null) {
     createPersonLocation();
   }
   if(personLocationObj !== null && personLocationObj?.hasOwnProperty('id')){
     updatePersonLocation()
   }
  }, [personLocationObj])

  useEffect(()=>{
    updatePersonLocation();
  },[state.currentPage])


  async function getPersonLocation() {
    const personAuthID = state.studentAuthID;
    const personEmail = state.studentUsername;
    try {
      const personLocation: any = await API.graphql(
        graphqlOperation(customQueries.getPersonLocation, { personAuthID: personAuthID, personEmail: personEmail })
      );
      setPersonLocationObj(personLocation?.data?.getPersonLocation);
      setCookie('location', personLocation?.data?.getPersonLocation);
    } catch (e) {
      console.log('getPersonLocation error: ', e);
    }
  }

  // CREATE LOCATION RECORD or UPDATE
  async function createPersonLocation() {
    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.createPersonLocation, { input: newPersonLocation })
      );
      setCookie('location', { ...cookies.location, ...newPersonLocation });
    } catch (e) {
      console.error('create PersonLocation : ', e);
    }
  }

  async function updatePersonLocation() {
    setCookie('location', {
      ...cookies.location,
      currentLocation: state.currentPage,
      lessonProgress: state.lessonProgress,
    });
    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, { input: { ...cookies.location, ...newPersonLocation } }),
      );
    } catch (e) {
      console.error('update PersonLocation : ', e);
    }
  }

  //  END OF LOCATION TRACKING SCRIPT
  async function getOrCreateStudentData() {
    let queryParams = queryString.parse(location.search);
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
          syllabusLessonID: queryParams.id,
          studentID: studentID,
        })
      );

      if (!studentData.data.getStudentData) {
        const newStudentData: any = await API.graphql(
          graphqlOperation(customMutations.createStudentData, {
            input: {
              lessonProgress: 'intro',
              currentLocation: 'intro',
              status: 'ACTIVE',
              syllabusLessonID: queryParams.id,
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

  async function getSyllabusLesson() {
    let queryParams = queryString.parse(location.search);
    if (Object.keys(queryParams).length && queryParams.id) {
      try {
        const classroom: any = await API.graphql(
          graphqlOperation(customQueries.getSyllabusLesson, { id: queryParams.id })
        );
        console.log('classroom data', classroom);
        setLesson(classroom.data.getSyllabusLesson);
        getOrCreateStudentData();
        subscription = subscribeToClassroom();
      } catch (error) {
        console.error(error);
      }
    } else {
      history.push('/dashboard');
    }
  }

  // TODO: rename to subscribeToSyllabusLesson
  const subscribeToClassroom = () => {
    let queryParams = queryString.parse(location.search);

    // @ts-ignore
    const syllabusLessonSubscription = API.graphql(graphqlOperation(customSubscriptions.onUpdateSyllabusLesson, { id: queryParams.id })).subscribe({
      next: (syllabusLessonData: any) => {
        const updatedLessonPlan = syllabusLessonData.value.data.onUpdateClassroom;

        dispatch({
          type: 'UPDATE_LESSON_PLAN',
          payload: {
            pages: removeDisabled(updatedLessonPlan.lessonPlan),
            displayData: updatedLessonPlan.displayData,
            viewing: updatedLessonPlan.viewing,
          },
        });
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
    if (lesson) {
      const wordBank: Array<string> = ['Mimo provoz'];

      dispatch({
        type: 'SET_INITIAL_STATE',
        payload: {
          syllabusLessonID: lesson.id,
          data: lesson,
          pages: removeDisabled(lesson.lessonPlan),
          displayData: lesson.displayData,
          word_bank: wordBank,
          subscribeFunc: subscribeToClassroom,
        },
      });
    }
  }, [lesson]);

  useEffect(() => {
    if (data) {
      let initialComponentState: any = {};
      lesson.lessonPlan.forEach((item: { type: string; stage: string }) => {
        initialComponentState[item.type] = data[item.stage];
      });
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE_FROM_DB',
        payload: initialComponentState,
      });
    }
  }, [data]);

  return (
    <LessonContext.Provider
      value={{
        state,
        dispatch,
        theme,
        subscription,
        subscribeToClassroom,
      }}>
      {children}
    </LessonContext.Provider>
  );
};
