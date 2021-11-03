import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import {UniversalLessonStudentData} from '../../interfaces/UniversalLessonInterfaces';
import {GlobalContext} from '../../contexts/GlobalContext';
import * as customQueries from '../../customGraphql/customQueries';
import * as customSubscriptions from '../../customGraphql/customSubscriptions';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';
import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentExerciseData,
  StudentPageInput,
  UniversalLessonPage,
} from '../../interfaces/UniversalLessonInterfaces';
import {getLocalStorageData, setLocalStorageData} from '../../utilities/localStorage';
import FloatingSideMenu from '../Dashboard/FloatingSideMenu/FloatingSideMenu';
import ErrorBoundary from '../Error/ErrorBoundary';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import Foot from './Foot/Foot';
import SaveQuit from './Foot/SaveQuit';
import LessonPageLoader from './LessonPageLoader';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';
import {partInput} from 'API';
import {ILessonSurveyApp} from './Lesson';

const SurveyApp = ({getSyllabusLesson}: ILessonSurveyApp) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //

  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const theme = gContext.theme;

  const history = useHistory();
  const match = useRouteMatch();

  // ~~~~~~~~~~~~~~~~ OTHER ~~~~~~~~~~~~~~~~ //

  const getRoomData = getLocalStorageData('room_info');
  const urlParams: any = useParams();
  const {lessonID} = urlParams;

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //

  const [overlay, setOverlay] = useState<string>('');
  const [isAtEnd, setisAtEnd] = useState<boolean>(false);

  const PAGES = lessonState?.lessonData?.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  const topLessonRef = useRef();

  // ~~~~~~~~~~~~~~ GET LESSON ~~~~~~~~~~~~~ //
  useEffect(() => {
    const {lessonID} = urlParams;

    const leaveUnload = () => {
      lessonDispatch({type: 'CLEANUP'});
    };

    if (lessonID) {
      lessonDispatch({type: 'SET_INITIAL_STATE', payload: {universalLessonID: lessonID}});
      getSyllabusLesson(lessonID).then((_: void) => {
        //
      });
    }

    return () => {
      leaveUnload();
    };
  }, []);

  // ~~~~~~~~~~ RESPONSE TO FETCH ~~~~~~~~~~ //

  // ~~~~~~~~~~~~~ LESSON SETUP ~~~~~~~~~~~~ //

  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (lessonState.lessonData && lessonState.lessonData.id) {
      setLessonDataLoaded(true);
      if (CURRENT_PAGE !== '' && CURRENT_PAGE !== undefined) {
        lessonDispatch({type: 'SET_CURRENT_PAGE', payload: CURRENT_PAGE});
        history.push(`${match.url}/${CURRENT_PAGE}`);
      } else {
        lessonDispatch({type: 'SET_CURRENT_PAGE', payload: 0});
        history.push(`${match.url}/${0}`);
      }
    }
  }, [lessonState.lessonData.id]);

  // ##################################################################### //
  // ###################### INITIALIZE STUDENT DATA ###################### //
  // ##################################################################### //
  const [studentDataInitialized, setStudentDataInitialized] = useState<boolean>(false);

  // ~~~~~~~~ INITIALIZE STUDENTDATA ~~~~~~~ //

  const initializeStudentData = async () => {
    if (studentDataInitialized === false && PAGES) {
      const mappedPages = PAGES.reduce(
        (
          inputs: {
            required: any[];
            initialized: any[];
            exercises: any[];
          },
          page: UniversalLessonPage
        ) => {
          const pageParts = page.pageContent;
          const reducedPageInputs = pageParts.reduce(
            (
              pageInputsAcc: {
                requiredIdAcc: string[];
                pageInputAcc: StudentPageInput[];
                pageExerciseAcc: any[];
              },
              pagePart: PagePart
            ) => {
              if (pagePart.hasOwnProperty('partContent')) {
                const partInputs = pagePart.partContent.reduce(
                  (
                    partInputAcc: {
                      requiredIdAcc: string[];
                      pageInputAcc: any[];
                      pageExerciseAcc: any[];
                    },
                    partContent: PartContent
                  ) => {
                    //  CHECK WHICH INPUT TYPE  //
                    const isForm = /form/g.test(partContent.type);
                    const isOtherInput = /input/g.test(partContent.type);
                    const isExercise = /exercise/g.test(partContent.type);

                    // -------- IF FORM ------- //
                    if (isForm) {
                      const formSubInputs = partContent.value.reduce(
                        (
                          subPartAcc: {reqId: string[]; pgInput: any[]},
                          partContentSub: PartContentSub
                        ) => {
                          return {
                            ...subPartAcc,
                            reqId: partContentSub.isRequired
                              ? [...subPartAcc.reqId, partContentSub.id]
                              : subPartAcc.reqId,
                            pgInput: [
                              ...subPartAcc.pgInput,
                              {
                                domID: partContentSub.id,
                                input: [''],
                              },
                            ],
                          };
                        },
                        {reqId: [], pgInput: []}
                      );

                      const exerciseObj = {
                        id: partContent.id,
                        entryData: formSubInputs.pgInput,
                      };

                      return {
                        requiredIdAcc: [
                          ...partInputAcc.requiredIdAcc,
                          ...formSubInputs.reqId,
                        ],
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          ...formSubInputs.pgInput,
                        ],
                        pageExerciseAcc: isExercise
                          ? [...partInputAcc.pageExerciseAcc, exerciseObj]
                          : partInputAcc.pageExerciseAcc,
                      };
                    }
                    // ---- IF OTHER INPUT ---- //
                    else if (isOtherInput) {
                      return {
                        requiredIdAcc: partContent.isRequired
                          ? [...partInputAcc.requiredIdAcc, partContent.id]
                          : partInputAcc.requiredIdAcc,
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          {
                            domID: partContent.id,
                            input: [''],
                          },
                        ],
                        pageExerciseAcc: partInputAcc.pageExerciseAcc,
                      };
                    } else {
                      return partInputAcc;
                    }
                  },
                  {requiredIdAcc: [], pageInputAcc: [], pageExerciseAcc: []}
                );

                return {
                  requiredIdAcc: [
                    ...pageInputsAcc.requiredIdAcc,
                    ...partInputs.requiredIdAcc,
                  ],
                  pageInputAcc: [
                    ...pageInputsAcc.pageInputAcc,
                    ...partInputs.pageInputAcc,
                  ],
                  pageExerciseAcc: [
                    ...pageInputsAcc.pageExerciseAcc,
                    ...partInputs.pageExerciseAcc,
                  ],
                };
              } else {
                return pageInputsAcc;
              }
            },
            {requiredIdAcc: [], pageInputAcc: [], pageExerciseAcc: []}
          );

          return {
            required: [...inputs.required, reducedPageInputs.requiredIdAcc],
            initialized: [...inputs.initialized, reducedPageInputs.pageInputAcc],
            exercises: [...inputs.exercises, reducedPageInputs.pageExerciseAcc],
          };
        },

        {required: [], initialized: [], exercises: []}
      );

      // console.log('mappedPages - ', mappedPages);

      lessonDispatch({
        type: 'SET_INITIAL_STUDENT_DATA',
        payload: {
          requiredInputs: mappedPages.required,
          studentData: mappedPages.initialized,
          exerciseData: mappedPages.exercises,
        },
      });
      setStudentDataInitialized(true);
    }
  };

  // ##################################################################### //
  // ################# GET OR CREATE STUDENT DATA RECORDS ################ //
  // ##################################################################### //

  // ~~~~~ CREATE DB DATA ID REFERENCES ~~~~ //
  const studentDataIdArray = (studentDataArray: any[]) => {
    const idArr = studentDataArray
      .reduce((acc: any[], studentDataIdObj: any, idx: number) => {
        const indexOfPage = lessonState?.lessonData?.lessonPlan?.findIndex(
          (lessonPlanPage: UniversalLessonPage) =>
            lessonPlanPage.id === studentDataIdObj.lessonPageID
        );
        const idObj = {
          id: studentDataIdObj.id,
          pageIdx: indexOfPage,
          lessonPageID: studentDataIdObj.lessonPageID,
          update: false,
        };
        return [...acc, idObj];
      }, [])
      .sort((dataID1: any, dataID2: any) => {
        if (dataID1.pageIdx < dataID2.pageIdx) {
          return -1;
        }
        if (dataID1.pageIdx > dataID2.pageIdx) {
          return 1;
        }
      });
    return idArr;
  };

  // ~~~~~~~~ FILTER EXTRA QUESTIONS ~~~~~~~ //

  const filterExtraQuestions = (initialDataFlattened: any[], surveyData: any[]) => {
    //@ts-ignore
    const extraQuestionsArray = initialDataFlattened.reduce(
      (extraQuestionArray: any[], question: partInput) => {
        const findInStudentDataRecords = surveyData.find(
          //@ts-ignore
          (data: partInput) => data.domID === question.domID
        );
        if (findInStudentDataRecords === undefined) {
          return [...extraQuestionArray, question];
        } else {
          return extraQuestionsArray;
        }
      },
      []
    );

    if (extraQuestionsArray) {
      return extraQuestionsArray;
    } else {
      return [];
    }
  };

  // ~~~~~~~ RECORD CREATION FUNTION ~~~~~~~ //

  const createSurveyData = async (
    initialDataFlattened: any[],
    lessonID: string,
    authId: string,
    email: string
  ) => {
    try {
      const input = {
        syllabusLessonID: getRoomData.activeSyllabus,
        lessonID: lessonID,
        studentID: authId,
        studentAuthID: authId,
        studentEmail: email,
        roomID: getRoomData.id,
        currentLocation: '0',
        lessonProgress: '0',
        surveyData: initialDataFlattened,
      };

      const newStudentData: any = await API.graphql(
        graphqlOperation(mutations.createUniversalSurveyStudentData, {
          input,
        })
      );

      const returnedData = newStudentData.data.createUniversalSurveyStudentData;

      return returnedData;
    } catch (e) {
      console.error('error creating survey data - ', e);
      return {};
    }
  };

  // ~~~~~~~~~~~ THE MAIN FUNTION ~~~~~~~~~~ //
  /******************************************
   * GETS THE PREVIOUSLY SAVED STUDENT DATA *
   * IF THERE IS ANY, AND SETS IT IN STATE  *
   ******************************************/

  const fetchSurveyDataRow = async (
    filterObj: any,
    nextToken: string,
    outArray: any[]
  ) => {
    if (filterObj) {
      try {
        let surveyData: any = await API.graphql(
          graphqlOperation(customQueries.listUniversalLessonStudentDatas, {
            ...filterObj,
            nextToken: nextToken,
          })
        );
        let surveyDataRow = surveyData.data.listUniversalLessonStudentDatas.items[0];
        let theNextToken = surveyData.data.listUniversalLessonStudentDatas?.nextToken;

        if (surveyDataRow && theNextToken) {
          console.log('nextToken fetching more - ', nextToken);
          fetchSurveyDataRow(filterObj, theNextToken, []);
        } else {
          return surveyDataRow;
        }
      } catch (e) {
        console.error('loopFetchStudentData - ', e);
        return [];
      }
    } else {
      return [];
    }
  };

  const getOrCreateStudentData = async () => {
    // flatten all questions first
    const initialDataFlattened = lessonState?.studentData.reduce(
      (inputAcc: partInput[], pageInputData: partInput[]) => {
        return [...inputAcc, ...pageInputData];
      },
      []
    );

    // TRY TRY TRY
    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: user.authId},
          lessonID: {eq: lessonID},
          syllabusLessonID: {eq: getRoomData.activeSyllabus},
          roomID: {eq: getRoomData.id},
        },
      };

      // existing student rows
      const surveyDataRow = await fetchSurveyDataRow(listFilter, undefined, []); // table object
      const surveyDataResponses =
        surveyDataRow.data.listUniversalSurveyData.items[0]?.surveyData; // flat 1D - array
      const extraQuestions = filterExtraQuestions(initialDataFlattened, surveyDataRow); //  flat 1D - array

      if (surveyDataRow?.length === 0) {
        const createNewRecords = await createSurveyData(
          initialDataFlattened,
          lessonID,
          user.authId,
          user.email
        );
        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: studentDataIdArray(createNewRecords),
          },
        });
      } else if (surveyDataRow?.length > 0) {
        const finalData = [...surveyDataResponses, ...extraQuestions];

        lessonDispatch({
          type: 'LOAD_STUDENT_DATA',
          payload: {
            dataIdReferences: studentDataIdArray(surveyDataRow),
            filteredStudentData: finalData,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ~~ INITIALIZE STUDENT DATA STRUCTURE ~~ //

  useEffect(() => {
    if (
      !lessonState.loaded &&
      lessonState.lessonData.lessonPlan &&
      lessonState.lessonData.lessonPlan.length > 0
    ) {
      initializeStudentData();
    }
  }, [lessonState.lessonData.lessonPlan]);

  // ~~~~~ GET & CREATE DB DATA RECORDS ~~~~ //
  useEffect(() => {
    if (
      !lessonState.loaded &&
      lessonState.studentData &&
      lessonState.studentData?.length === PAGES?.length
    ) {
      getOrCreateStudentData();
    }
  }, [lessonState.studentData]);

  // ##################################################################### //
  // ######################### NAVIGATION CONTROL ######################## //
  // ##################################################################### //

  const [showRequiredNotification, setShowRequiredNotification] = useState<boolean>(
    false
  );
  const handleRequiredNotification = () => {
    if (!showRequiredNotification) {
      setShowRequiredNotification(true);
      setTimeout(() => {
        setShowRequiredNotification(false);
      }, 1250);
    }
  };

  const userAtEnd = () => {
    return lessonState.currentPage === lessonState.lessonData?.lessonPlan?.length - 1;
  };

  return (
    <>
      {/* 
      TODO: Add this again later
      */}
      {/* <FloatingSideMenu /> */}
      <div
        className={`${theme.bg} w-full h-full flex flex-col items-start dark-scroll overflow-y-auto`}
        ref={topLessonRef}>
        <div
          className={`opacity-${
            showRequiredNotification
              ? '100 translate-x-0 transform z-100'
              : '0 translate-x-10 transform'
          } absolute bottom-5 right-5 w-96 py-4 px-6 rounded-md shadow bg-gray-800 duration-300 transition-all`}>
          <p className="text-white font-medium tracking-wide">
            <span className="text-red-500">*</span>Please fill all the required fields
          </p>
        </div>

        <div className="fixed " style={{zIndex: 5000}}>
          <LessonHeaderBar
            lessonDataLoaded={lessonDataLoaded}
            overlay={overlay}
            setOverlay={setOverlay}
            isAtEnd={isAtEnd}
            setisAtEnd={setisAtEnd}
            handleRequiredNotification={handleRequiredNotification}
          />
        </div>
        <div className="relative top-6 lesson-body-container">
          {!lessonDataLoaded ? (
            <div className="mt-4 mb-8 lesson-page-container">
              <LessonPageLoader />
            </div>
          ) : (
            <ErrorBoundary fallback={<h1>Error in the Lesson App</h1>}>
              {/* ADD LESSONWRAPPER HERE */}
              <div className="mt-4 mb-8 lesson-page-container">
                <CoreUniversalLesson />
                {userAtEnd() ? <SaveQuit roomID={getRoomData?.id} /> : null}
              </div>
            </ErrorBoundary>
          )}

          {lessonDataLoaded && (
            <Foot
              isAtEnd={isAtEnd}
              setisAtEnd={setisAtEnd}
              handleRequiredNotification={handleRequiredNotification}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SurveyApp;
