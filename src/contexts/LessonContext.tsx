import React, {useEffect, useReducer, useRef, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import * as customQueries from 'customGraphql/customQueries';
import * as customSubscriptions from 'customGraphql/customSubscriptions';
// import { API, graphqlOperation } from 'aws-amplify';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Auth} from '@aws-amplify/auth';
import {lessonReducerOLD} from 'reducers/LessonReducerOLD';
import {lessonStateOLD} from 'state/LessonStateOLD';
import {getClientKey} from 'utilities/strings';
import {standardTheme} from 'contexts/GlobalContext';

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

export const LessonContextProvider: React.FC = ({children}: LessonProps) => {
  const [state, dispatch] = useReducer(lessonReducerOLD, lessonStateOLD);
  const theme = standardTheme;
  // const location = useLocation();

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
  const [disableNext, setDisableNext] = useState(false);

  const pageList = [
    {
      id: 0,
      name: 'message',
      tooltipText: 'Message'
    },

    {
      id: 1,
      name: 'instructions',
      tooltipText: 'Instruction'
    },

    {
      id: 2,
      name: 'checkpoints',
      tooltipText: 'Checkpoints'
    },

    {
      id: 3,
      name: 'closing',
      tooltipText: 'Closing'
    }
  ];

  const initialPage = pageList[0];

  const [currentPage, setCurrentPage] = useState(initialPage);
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
        const {email, sub} = user.attributes;
        let userInfo: any = await API.graphql(
          graphqlOperation(customQueries.getPersonLocation, {
            personEmail: email,
            personAuthID: sub
          })
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

  function setInitialComponentState(data: any) {
    let initialComponentState: any = {};
    let initialComponentStateSecondary: any = {notes: ''};
    lesson?.lessonPlan.forEach((item: {type: string; stage: string}) => {
      initialComponentState[item.type] = data[item.stage];
    });
    dispatch({
      type: 'SET_INITIAL_COMPONENT_STATE_FROM_DB',
      payload: {...initialComponentState, ...initialComponentStateSecondary}
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
    // const {lessonID} = urlParams;
    // const queryObj = {
    //   name: 'customQueries.getSyllabusLesson',
    //   valueObj: {id: lessonID},
    // };
    // if (lessonID) {
    //   try {
    //     const classroom = await handleFetchAndCache(queryObj);
    //     setLesson(classroom.data.getSyllabusLesson);
    //     getOrCreateStudentData();
    //     subscription = subscribeToSyllabusLesson();
    //   } catch (error) {
    //     console.error(error);
    //   }
    // } else {
    //   history.push('/dashboard');
    // }
  }

  useEffect(() => {
    getSyllabusLesson();

    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe();
      }
      dispatch({type: 'CLEANUP'});
    };
  }, []);

  useEffect(() => {
    if (lesson) {
      dispatch({
        type: 'SET_INITIAL_STATE',
        payload: {
          syllabusLessonID: lesson.id,
          data: lesson,
          pages: lesson.lessonPlan.filter(
            (item: {disabled: boolean; [key: string]: any}) => {
              return !item.disabled;
            }
          ),
          displayData: lesson.displayData,
          word_bank: [''],
          subscribeFunc: subscribeToSyllabusLesson
        }
      });
    }
  }, [lesson]);

  /**
   * SUBSCRIBE TO SYLLABUS LESSON
   */
  const subscribeToSyllabusLesson = () => {
    const {lessonID} = urlParams;

    const syllabusLessonSubscription = API.graphql(
      graphqlOperation(customSubscriptions.onChangeSyllabusLesson, {id: lessonID})
      // @ts-ignore
    ).subscribe({
      next: (syllabusLessonData: any) => {
        const updatedLessonPlan = syllabusLessonData.value.data.onChangeSyllabusLesson;
        // @ts-ignore
        API.graphql(
          graphqlOperation(customQueries.getUniversalLesson, {id: lessonID})
          // @ts-ignore
        ).then((sLessonData: any) => {
          const sLessonDataData = sLessonData.data.getUniversalLesson;
          setSubscriptionData(sLessonDataData);
        });
      }
    });

    dispatch({
      type: 'SET_SUBSCRIPTION',
      payload: {
        subscription: syllabusLessonSubscription
      }
    });

    return syllabusLessonSubscription;
  };

  const updateOnIncomingSubscriptionData = (subscriptionData: any) => {
    dispatch({
      type: 'UPDATE_LESSON_PLAN',
      payload: {
        pages: subscriptionData.lessonPlan.filter(
          (item: {disabled: boolean; [key: string]: any}) => {
            return !item.disabled;
          }
        ),

        displayData: {
          ...subscriptionData.displayData,
          breakdownComponent:
            // @ts-ignore
            state.pages[subscriptionData.displayData.breakdownComponent]?.stage
        },
        viewing: subscriptionData.viewing
      }
    });
  };

  const saveJournalData = useRef();

  useEffect(() => {
    if (subscriptionData) {
      updateOnIncomingSubscriptionData(subscriptionData);
    }
  }, [subscriptionData]);

  return (
    <LessonContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        state,
        dispatch,
        setDisableNext,
        disableNext,
        pageList,
        theme,
        lesson,
        saveJournalData,
        setLesson,
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
export const useLessonContext = () => React.useContext(LessonContext);
