import React, {useContext, useEffect, useState} from 'react';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import FloatingSideMenu from '../Dashboard/FloatingSideMenu/FloatingSideMenu';
import ErrorBoundary from '../Error/ErrorBoundary';
import {GlobalContext} from '../../contexts/GlobalContext';
import {exampleUniversalLesson} from './UniversalLessonBuilder/example_data/exampleUniversalLessonData';
import Foot from './Foot/Foot';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';
import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentPageInput,
  UniversalLessonPage,
} from '../../interfaces/UniversalLessonInterfaces';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import * as customQueries from '../../customGraphql/customQueries';
import * as queries from '../../graphql/queries';

const LessonApp = () => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const history = useHistory();
  const match = useRouteMatch();
  const urlParams: any = useParams();

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //
  const [overlay, setOverlay] = useState<string>('');
  //  NAVIGATION CONSTANTS
  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  // ##################################################################### //
  // ######################### SUBSCRIPTION SETUP ######################## //
  // ##################################################################### //
  let subscription: any;
  const [subscriptionData, setSubscriptionData] = useState<any>();

  // ----------- 1 ---------- //
  //  PUT LESSON SUBSCRIPTION FUNCTION IN CONTEXT  //

  // useEffect(() => {
  //   if (lesson) {
  //     dispatch({
  //       type: 'SET_INITIAL_STATE',
  //       payload: {
  //         subscribeFunc: subscribeToPlanner,
  //       },
  //     });
  //   }
  // }, [lesson]);

  // ----------- 2 ---------- //
  //  UPDATE CONTEXT WITH SUBSCRIPTION DATA  //

  const subscribeToPlanner = () => {
    // const {lessonID} = urlParams;
    //
    // const syllabusLessonSubscription = API.graphql(
    //   graphqlOperation(customSubscriptions.onChangeSyllabusLesson, {id: lessonID})
    //   // @ts-ignore
    // ).subscribe({
    //   next: (syllabusLessonData: any) => {
    //     const updatedLessonPlan = syllabusLessonData.value.data.onChangeSyllabusLesson;
    //     // @ts-ignore
    //     API.graphql(
    //       graphqlOperation(customQueries.getSyllabusLesson, {id: lessonID})
    //       // @ts-ignore
    //     ).then((sLessonData: any) => {
    //       const sLessonDataData = sLessonData.data.getSyllabusLesson;
    //       setSubscriptionData(sLessonDataData);
    //     });
    //   },
    // });
    //
    // dispatch({
    //   type: 'SET_SUBSCRIPTION',
    //   payload: {
    //     subscription: syllabusLessonSubscription,
    //   },
    // });
    //
    // return syllabusLessonSubscription;
  };

  // ----------- 3 ---------- //

  const updateOnIncomingSubscriptionData = (subscriptionData: any) => {
    // dispatch({
    //   type: 'UPDATE_LESSON_PLAN',
    //   payload: {
    //     pages: subscriptionData.lessonPlan.filter(
    //       (item: {disabled: boolean; [key: string]: any}) => {
    //         return !item.disabled;
    //       }
    //     ),
    //
    //     displayData: {
    //       ...subscriptionData.displayData
    //     },
    //     viewing: subscriptionData.viewing,
    //   },
    // });
  };

  // ----------- 4 ---------- //
  /**
   * Once step 2 updates subscriptionData,
   * this useEffect will invoke the function
   * at step 3
   *
   */

  // useEffect(() => {
  //   if (subscriptionData) {
  //     updateOnIncomingSubscriptionData(subscriptionData);
  //   }
  // }, [subscriptionData]);

  // ##################################################################### //
  // ############################ LESSON FETCH ########################### //
  // ##################################################################### //
  const getSyllabusLesson = async (lessonID?: string) => {
    // lessonID will be undefined for testing
    if (lessonID !== '') {
      const universalLesson: any = await API.graphql(
        graphqlOperation(queries.getUniversalLesson, {id: lessonID})
      );
      const response = universalLesson.data.getUniversalLesson;
      console.log('first custom lesson load ::', response);
      setTimeout(() => {
        lessonDispatch({type: 'SET_LESSON_DATA', payload: response});
      }, 1000);

      // subscription = subscribeToStudentData(lessonID);
    } else {
      setTimeout(() => {
        lessonDispatch({type: 'SET_LESSON_DATA', payload: exampleUniversalLesson});
      }, 1000);
    }
  };

  useEffect(() => {
    const {lessonID} = urlParams;
    if (lessonID) {
      lessonDispatch({type: 'SET_INITIAL_STATE', payload: {universalLessonID: lessonID}});
      getSyllabusLesson(lessonID).then((_: void) =>
        console.log('Lesson Mount - ', 'Lesson fetched!')
      );
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      lessonDispatch({type: 'CLEANUP'});
    };
  }, []);

  // ~~~~~~~~~~~ RESPONSE TO FETCH ~~~~~~~~~~ //
  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (lessonState.lessonData) {
      setLessonDataLoaded(true);
    }
    if (CURRENT_PAGE !== '' && CURRENT_PAGE !== undefined) {
      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: CURRENT_PAGE});
      history.push(`${match.url}/${CURRENT_PAGE}`);
    } else {
      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: 0});
      history.push(`${match.url}/${0}`);
    }
  }, [lessonState.lessonData]);

  // ##################################################################### //
  // ###################### INITIALIZE STUDENT DATA ###################### //
  // ##################################################################### //
  const [studentDataInitialized, setStudentDataInitialized] = useState<boolean>(false);

  // ~~~~~~~~ INITIALIZE STUDENTDATA ~~~~~~~ //
  useEffect(() => {
    if (studentDataInitialized === false && PAGES) {
      const mappedPages = PAGES.map((page: UniversalLessonPage) => {
        const allPageParts = page.pageContent;
        const initialPageData = allPageParts.reduce(
          (pageData: StudentPageInput[], pagePart: PagePart) => {
            const pagePartContent = pagePart.partContent.reduce(
              (pagePartAcc: any[], partContent: PartContent) => {
                const isForm = /form/g.test(partContent.type);
                const isOtherInput = /input/g.test(partContent.type);
                if (isForm) {
                  // map through partContent sub array
                  return [
                    ...pagePartAcc,
                    ...partContent.value.map((partContentSub: PartContentSub) => {
                      return {
                        domID: partContentSub.id,
                        input: [''],
                      };
                    }),
                  ];
                } else if (isOtherInput) {
                  return [
                    ...pagePartAcc,
                    {
                      domID: partContent.id,
                      input: [''],
                    },
                  ];
                } else {
                  return pagePartAcc;
                }
              },
              []
            );
            return [...pageData, ...pagePartContent];
          },
          []
        );
        return initialPageData;
      });
      lessonDispatch({type: 'SET_INITIAL_STUDENT_DATA', payload: mappedPages});
      setStudentDataInitialized(true);
    }
  }, [lessonState.lessonData.lessonPlan]);

  // ~~ CREATE NEW OR UPDATE STUDENT DATA ~~ //
  const getOrCreateStudentData = async () => {
    const {lessonID} = urlParams;

    // try {
    //   const studentData: any = await API.graphql(
    //     graphqlOperation(customQueries.getStudentData, {
    //       syllabusLessonID: lessonID,
    //       studentID: studentID,
    //     })
    //   );
    //
    //   if (!studentData.data.getStudentData) {
    //     const newStudentData: any = await API.graphql(
    //       graphqlOperation(customMutations.createStudentData, {
    //         input: {
    //           lessonProgress: 0,
    //           currentLocation: 0,
    //           status: 'ACTIVE',
    //           syllabusLessonID: lessonID,
    //           studentID: studentID,
    //           studentAuthID: studentAuthID,
    //         },
    //       })
    //     );
    //     dispatch({
    //       type: 'SET_STUDENT_INFO',
    //       payload: {
    //         studentDataID: newStudentData.data.createStudentData.id,
    //         studentUsername: newStudentData.data.createStudentData.studentID,
    //         studentAuthID: newStudentData.data.createStudentData.studentAuthID,
    //       },
    //     });
    //     return setData(newStudentData.data.createStudentData);
    //   }
    //   dispatch({
    //     type: 'SET_STUDENT_INFO',
    //     payload: {
    //       studentDataID: studentData.data.getStudentData.id,
    //       studentUsername: studentData.data.getStudentData.studentID,
    //       studentAuthID: studentData.data.getStudentData.studentAuthID,
    //     },
    //   });
    //   return setData(studentData.data.getStudentData);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const [personLocationObj, setPersonLocationObj] = useState<any>();

  const createPersonLocation = async () => {
    const newLocation = {
      personAuthID: state.user.authId,
      personEmail: state.user.email,
      syllabusLessonID: lessonState.syllabusLessonID,
      roomID: '0',
      currentLocation: lessonState.currentPage,
      lessonProgress: lessonState.lessonProgress,
    };
    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.createPersonLocation, {input: newLocation})
      );
    } catch (e) {
      console.error('createPersonLocation - ', e);
    } finally {
      try {
        const getNewLocation = await getPersonLocation();
        console.log('getNewLocation - ', getNewLocation);
      } catch (e) {
        console.log('getNewLocation after Create - ', e);
      }
    }
  };

  const getPersonLocation = async () => {
    try {
      let userInfo: any = await API.graphql(
        graphqlOperation(customQueries.getPersonLocation, {
          personAuthID: state.user.authId,
          personEmail: state.user.email,
        })
      );
      userInfo = userInfo.data.getPersonLocation;
      return userInfo || null;
    } finally {
      console.log('getPersonLocation funnction completed');
    }
  };

  const updatePersonLocation = async () => {
    const updatedLocation = {
      id: personLocationObj && personLocationObj.id ? personLocationObj.id : '',
      personAuthID: state.user.authId,
      personEmail: state.user.email,
      syllabusLessonID: lessonState.syllabusLessonID,
      roomID: '0',
      currentLocation: lessonState.currentPage,
      lessonProgress: lessonState.lessonProgress,
    };

    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, {input: updatedLocation})
      );
    } catch (e) {
      console.error('updatePersonLocation - ', e);
    } finally {
      setPersonLocationObj(updatedLocation);
    }
  };

  const handleUpdatePersonLocation = async (locationObj: any) => {
    if (locationObj && Object.keys(locationObj).length > 0 && locationObj.id !== '') {
      await updatePersonLocation();
    } else {
      const getLocation = await getPersonLocation();
      if (getLocation !== null) {
        setPersonLocationObj(getLocation);
      } else {
        await createPersonLocation();
      }
    }
  };

  useEffect(() => {
    handleUpdatePersonLocation(personLocationObj);
  }, [lessonState.currentPage]);

  return (
    <>
      <FloatingSideMenu />
      <div className={`${theme.bg} w-full flex flex-col items-start`}>
        <LessonHeaderBar
          lessonDataLoaded={lessonDataLoaded}
          overlay={overlay}
          setOverlay={setOverlay}
        />
        {/*<NotificationBar />*/}

        <ErrorBoundary fallback={<h1>Error in the Lesson App</h1>}>
          {/*{lessonDataLoaded && <Body />}*/}
          {/* ADD LESSONWRAPPER HERE */}
          <CoreUniversalLesson />
        </ErrorBoundary>

        {lessonDataLoaded && <Foot />}
      </div>
    </>
  );
};

export default LessonApp;