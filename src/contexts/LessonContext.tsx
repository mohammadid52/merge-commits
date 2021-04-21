import React, { useEffect, useReducer, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import { getClientKey } from '../utilities/strings';

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

  /**
   *
   *
   * HELP SECTION:
   *
   * On mount ->
   *  1. loadPersonData();
   *  2. getSyllabusLesson();
   *
   * Then ->
   *  3. updatePersonLocation() -OR- createPersonLocation()
   *  4. updateStudentData() -OR- createStudentData()
   *
   * Then ->
   *  5. setInitialComponentState()
   *  6. subscribeToSyllabusLesson()
   *
   *  Then ->
   *  7. updateOnIncomingSubscriptionData()
   *
   */

  // INIT PERSON LOCATION STATE

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

  useEffect(() => {
    loadPersonData();
  }, []);

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

  function setInitialComponentState(data: any) {
    let initialComponentState: any = {};
    let initialComponentStateSecondary: any = { notes: '' };
    lesson?.lessonPlan.forEach((item: { type: string; stage: string }) => {
      initialComponentState[item.type] = data[item.stage];
    });
    dispatch({
      type: 'SET_INITIAL_COMPONENT_STATE_FROM_DB',
      payload: { ...initialComponentState, ...initialComponentStateSecondary },
    });
  }

  useEffect(() => {
    if (data) {
      setInitialComponentState(data);
    }
  }, [data]);

  /**
   * GET SYLLABUS LESSON
   */
  async function getSyllabusLesson() {
    const { lessonID } = urlParams;
    if (lessonID) {
      try {
        const classroom: any = await API.graphql(graphqlOperation(customQueries.getSyllabusLesson, { id: lessonID }));
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

  /**
   * SUBSCRIBE TO SYLLABUS LESSON
   */
  const subscribeToSyllabusLesson = () => {
    const { lessonID } = urlParams;

    const syllabusLessonSubscription = API.graphql(
      graphqlOperation(customSubscriptions.onChangeSyllabusLesson, { id: lessonID })
      // @ts-ignore
    ).subscribe({
      next: (syllabusLessonData: any) => {
        const updatedLessonPlan = syllabusLessonData.value.data.onChangeSyllabusLesson;
        // @ts-ignore
        API.graphql(graphqlOperation(customQueries.getSyllabusLesson, { id: lessonID })).then((sLessonData: any) => {
          const sLessonDataData = sLessonData.data.getSyllabusLesson;
          setSubscriptionData(sLessonDataData);
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

  const updateOnIncomingSubscriptionData = (subscriptionData: any) => {
    dispatch({
      type: 'UPDATE_LESSON_PLAN',
      payload: {
        pages: subscriptionData.lessonPlan.filter((item: { disabled: boolean; [key: string]: any }) => {
          return !item.disabled;
        }),

        displayData: {
          ...subscriptionData.displayData,
          //@ts-ignore
          breakdownComponent: state.pages[subscriptionData.displayData.breakdownComponent]?.stage,
        },
        viewing: subscriptionData.viewing,
      },
    });
  };

  useEffect(() => {
    if (subscriptionData) {
      updateOnIncomingSubscriptionData(subscriptionData);
    }
  }, [subscriptionData]);

  return (
    <LessonContext.Provider
      value={{
        state,
        dispatch,
        theme,
        lesson,
        setLesson,
        subscription,
        subscribeToSyllabusLesson,
        userLanguage,
        uLang,
        clientKey,
      }}>
      {children}
    </LessonContext.Provider>
  );
};
