import React, { useEffect, useReducer, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { lessonState, PagesType } from '../state/LessonState';
import { lessonReducer } from '../reducers/LessonReducer';
import * as customSubscriptions from '../customGraphql/customSubscriptions';
import * as customMutations from '../customGraphql/customMutations';
import * as mutations from '../graphql/mutations';
import * as customQueries from '../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import queryString from 'query-string';
import { standardTheme } from './GlobalContext';

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
  const [subscriptionData, setSubscriptionData] = useState<any>();

  const [state, dispatch] = useReducer(lessonReducer, lessonState);
  const location = useLocation();
  const history = useHistory();
  let subscription: any;

  const theme = standardTheme;

  const [loaded, setLoaded] = useState<boolean>(false);
  const [personLocationObj, setPersonLocationObj] = useState<any>();
  const [recentOp, setRecentOp] = useState<string>('');

  const [activityInterval, setActivityInterval] = useState<any>();

  // SAVE TRIGGER TIMING
  useEffect(()=>{
    if(state.viewing){
      clearTimeout(activityInterval)
      console.log('interval set at LessonContext.tsx')
      setActivityInterval( setTimeout(
        () => dispatch({ type: 'INCREMENT_SAVE_COUNT' })
        , 1000))
    }
      return ()=> clearTimeout(activityInterval)
  },[state.viewing, state.componentState])


  // INIT PERSON LOCATION COOKIS & STATE
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
      console.log('loaded...');
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
      console.log('created', newLocation);
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.createPersonLocation, { input: newLocation })
      );
    } catch (e) {
      console.error('create PersonLocation : ', e);
    } finally {
      setRecentOp('created');
    }
  }
  //

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
              lessonProgress: '0',
              currentLocation: '0',
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
        // console.log('classroom data', classroom);
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

  // TODO: rename to subscribeToSyllabusLesson
  const subscribeToSyllabusLesson = () => {
    let queryParams = queryString.parse(location.search);

    // console.log('subscription params: ', queryParams);
    // @ts-ignore
    const syllabusLessonSubscription = API.graphql( graphqlOperation(customSubscriptions.onChangeSyllabusLesson, { id: queryParams.id }) ).subscribe({
      next: (syllabusLessonData: any) => {
        const updatedLessonPlan = syllabusLessonData.value.data.onChangeSyllabusLesson;
        // @ts-ignore
        API.graphql(graphqlOperation(customQueries.getSyllabusLesson, { id: queryParams.id })).then(
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
    if (lesson) {
      const wordBank: Array<string> = ['Mimo provoz'];

      dispatch({
        type: 'SET_INITIAL_STATE',
        payload: {
          syllabusLessonID: lesson.id,
          data: lesson,
          pages: lesson.lessonPlan.filter((item: { disabled: boolean; [key: string]: any }) => {
            return !item.disabled;
          }),
          displayData: lesson.displayData,
          word_bank: wordBank,
          subscribeFunc: subscribeToSyllabusLesson,
        },
      });
    }
  }, [lesson]);

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
        subscribeToSyllabusLesson,
      }}>
      {children}
    </LessonContext.Provider>
  );
};
