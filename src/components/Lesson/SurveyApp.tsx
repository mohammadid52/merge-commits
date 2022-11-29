import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useQuery} from '@customHooks/urlParam';
import useAuth from '@customHooks/useAuth';
import {CreateUniversalArchiveDataInput, PartInput} from 'API';
import {GlobalContext} from 'contexts/GlobalContext';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';

import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentPageInput,
  UniversalLessonPage,
  UniversalLessonStudentData
} from 'interfaces/UniversalLessonInterfaces';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData} from 'utilities/localStorage';
import {v4 as uuidV4} from 'uuid';
import ErrorBoundary from '../Error/ErrorBoundary';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import Foot from './Foot/Foot';
import {ILessonSurveyApp} from './Lesson';
import LessonPageLoader from './LessonPageLoader';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';

const SurveyApp = ({
  personLoading,
  personLessonData,
  setPersonLessonData,
  canContinue,
  setPersonLoading,
  validateRequired,
  invokeRequiredField,
  pageStateUpdated,
  updatePageInLocalStorage,

  getLessonCurrentPage,
  handleMutationOnPageChange
}: ILessonSurveyApp) => {
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
  const isOnDemand = user.onDemand;

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //

  const [overlay, setOverlay] = useState<string>('');
  const [isAtEnd, setisAtEnd] = useState<boolean>(false);

  const PAGES = lessonState?.lessonData?.lessonPlan;

  const topLessonRef = useRef();

  // ~~~~~~~~~~~~~~ GET LESSON ~~~~~~~~~~~~~ //
  useEffect(() => {
    const leaveUnload = () => {
      lessonDispatch({type: 'CLEANUP'});
    };
    console.log('survey loaded....');
    return () => {
      leaveUnload();
    };
  }, []);

  // ~~~~~~~~~~ RESPONSE TO FETCH ~~~~~~~~~~ //

  // ~~~~~~~~~~~~~ LESSON SETUP ~~~~~~~~~~~~ //

  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);

  // ##################################################################### //
  // ###################### INITIALIZE STUDENT DATA ###################### //
  // ##################################################################### //
  const [studentDataInitialized, setStudentDataInitialized] = useState<boolean>(false);

  // ~~~~~~~~ INITIALIZE STUDENTDATA ~~~~~~~ //

  const initializeSurveyData = async () => {
    if (!studentDataInitialized && PAGES) {
      const mappedPages = PAGES.reduce(
        (
          inputs: {
            required: any[];
            initialized: any[];
          },
          page: UniversalLessonPage
        ) => {
          const pageParts = page.pageContent;
          const reducedPageInputs = pageParts.reduce(
            (
              pageInputsAcc: {
                requiredIdAcc: string[];
                pageInputAcc: StudentPageInput[];
              },
              pagePart: PagePart
            ) => {
              if (pagePart.hasOwnProperty('partContent')) {
                const partInputs = pagePart.partContent.reduce(
                  (
                    partInputAcc: {
                      requiredIdAcc: string[];
                      pageInputAcc: any[];
                    },
                    partContent: PartContent
                  ) => {
                    //  CHECK WHICH INPUT TYPE  //
                    const isForm = /form/g.test(partContent.type);
                    const isOtherInput = /input/g.test(partContent.type);

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
                                input: ['']
                              }
                            ]
                          };
                        },
                        {reqId: [], pgInput: []}
                      );

                      return {
                        requiredIdAcc: [
                          ...partInputAcc.requiredIdAcc,
                          ...formSubInputs.reqId
                        ],
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          ...formSubInputs.pgInput
                        ]
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
                            input: ['']
                          }
                        ]
                      };
                    } else {
                      return partInputAcc;
                    }
                  },
                  {requiredIdAcc: [], pageInputAcc: []}
                );

                return {
                  requiredIdAcc: [
                    ...pageInputsAcc.requiredIdAcc,
                    ...partInputs.requiredIdAcc
                  ],
                  pageInputAcc: [
                    ...pageInputsAcc.pageInputAcc,
                    ...partInputs.pageInputAcc
                  ]
                };
              } else {
                return pageInputsAcc;
              }
            },
            {requiredIdAcc: [], pageInputAcc: []}
          );

          return {
            required: [...inputs.required, reducedPageInputs.requiredIdAcc],
            initialized: [...inputs.initialized, ...reducedPageInputs.pageInputAcc]
          };
        },

        {required: [], initialized: []}
      );

      lessonDispatch({
        type: 'SET_INITIAL_STUDENT_DATA',
        payload: {
          requiredInputs: mappedPages.required,
          studentData: mappedPages.initialized
        }
      });
      setStudentDataInitialized(true);
    }
  };

  // ##################################################################### //
  // ################# GET OR CREATE STUDENT DATA RECORDS ################ //
  // ##################################################################### //

  // ~~~~~ CREATE DB DATA ID REFERENCES ~~~~ //
  const surveyDataId = (surveyDataRowObj: any) => {
    return [
      {
        id: surveyDataRowObj.id,
        pageIdx: 0,
        lessonPageID: '',
        update: false
      }
    ];
  };

  // ~~~~~~~~ FILTER EXTRA QUESTIONS ~~~~~~~ //

  const filterExtraQuestions = (initialDataFlattened: any[], surveyData: any[]) => {
    //@ts-ignore
    const extraQuestionsArray = initialDataFlattened.reduce(
      (extraQuestions: any[], question: PartInput) => {
        const findInStudentDataRecords = surveyData.find(
          //@ts-ignore
          (data: partInput) => data.domID === question.domID
        );

        if (findInStudentDataRecords === undefined) {
          return [...extraQuestions, question];
        } else {
          return extraQuestions;
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
        // id: `${authId}-${getRoomData.id}-${lessonID}-${less.id}`,
        studentID: authId,
        studentAuthID: authId,
        studentEmail: email,
        roomID: getRoomData.id,
        currentLocation: '0',
        lessonProgress: '0',
        surveyData: initialDataFlattened.flat()
      };

      const newSurveyData: any = await API.graphql(
        graphqlOperation(mutations.createUniversalSurveyStudentData, {
          input
        })
      );

      const returnedData = newSurveyData.data.createUniversalSurveyStudentData;

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

  // const fetchSurveyDataRow = async (
  //   filterObj: any,
  //   nextToken: string,
  //   outArray: any[]
  // ): Promise<any> => {
  //   let combined;
  //   setLessonDataLoaded(false);
  //   try {
  //     let surveyData: any = await API.graphql(
  //       graphqlOperation(queries.listUniversalSurveyStudentData, {
  //         ...filterObj,
  //         nextToken: nextToken
  //       })
  //     );

  //     let surveyDataRow = surveyData.data.listUniversalSurveyStudentData.items;

  //     let theNextToken = surveyData.data.listUniversalSurveyStudentData?.nextToken;

  //     combined = [...outArray, ...surveyDataRow];

  //     if (theNextToken) {
  //       // console.log('nextToken fetching more - ', nextToken);
  //       combined = await fetchSurveyDataRow(filterObj, theNextToken, combined);
  //     }
  //     setLessonDataLoaded(true);
  //     return combined;
  //   } catch (e) {
  //     console.error('loopFetchStudentData - ', e);
  //     return [];
  //   }
  // };

  const fetchSurveyDataRow = async (
    filterObj: any,
    nextToken: string,
    outArray: any[]
  ): Promise<any> => {
    let combined;
    setLessonDataLoaded(false);
    try {
      let surveyData: any = await API.graphql(
        graphqlOperation(queries.listUniversalSurveyStudentData, {
          ...filterObj,
          nextToken: nextToken
        })
      );

      let surveyDataRow = surveyData.data.listUniversalSurveyStudentData.items;

      let theNextToken = surveyData.data.listUniversalSurveyStudentData?.nextToken;

      combined = [...outArray, ...surveyDataRow];

      if (theNextToken) {
        // console.log('nextToken fetching more - ', nextToken);
        combined = await fetchSurveyDataRow(filterObj, theNextToken, combined);
      }
      setLessonDataLoaded(true);
      return combined;
    } catch (e) {
      console.error('loopFetchStudentData - ', e);
      return [];
    }
  };

  const {isStudent} = useAuth();

  const params = useQuery(location.search);

  const getOrCreateSurveyData = async () => {
    // TRY TRY TRY
    try {
      // existing student rows

      // existing student rows

      const dynamicUser = isStudent ? user : {authId: params.get('sId')};

      const listFilter = {
        filter: {
          studentAuthID: {eq: dynamicUser.authId},
          lessonID: {eq: lessonID},
          syllabusLessonID: {eq: getRoomData.activeSyllabus},
          roomID: {eq: getRoomData.id}
        }
      };

      // existing student rows
      const surveyDataRow = await fetchSurveyDataRow(listFilter, undefined, []); // table object

      const surveyDataResponses = surveyDataRow[0]?.surveyData
        ? surveyDataRow[0].surveyData
        : []; // flat 1D - array
      const extraQuestions = filterExtraQuestions(
        lessonState?.studentData,
        surveyDataResponses
      ); //  flat 1D - array
      if (surveyDataRow === undefined || (surveyDataRow && surveyDataRow?.length === 0)) {
        if (isStudent) {
          const createNewRecords = await createSurveyData(
            lessonState?.studentData,
            lessonID,
            user.authId,
            user.email
          );
          if (createNewRecords) {
            const newRecords = await Promise.all(createNewRecords);

            if (newRecords?.length > 0) {
              lessonDispatch({
                type: 'LOAD_SURVEY_DATA',
                payload: {
                  dataIdReferences: surveyDataId(newRecords)
                }
              });
            }
          }
        }
      } else {
        const finalData = [...surveyDataResponses, ...extraQuestions];
        // console.log('loaded finaldata - ', finalData);

        lessonDispatch({
          type: 'LOAD_SURVEY_DATA',
          payload: {
            dataIdReferences: surveyDataId(surveyDataRow[0]),
            surveyData: finalData
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ~~ INITIALIZE STUDENT DATA STRUCTURE ~~ //

  useEffect(() => {
    if (!lessonState.loaded && PAGES.length > 0) {
      initializeSurveyData();
    }
  }, [PAGES]);

  // ~~~~~ GET & CREATE DB DATA RECORDS ~~~~ //

  useEffect(() => {
    if (
      !lessonState.loaded &&
      lessonState.studentData &&
      lessonState.studentData?.length > 0
    ) {
      getOrCreateSurveyData();
    }
  }, [lessonState.studentData]);

  // ##################################################################### //
  // ####################### MANAGE PERSON LOCATION ###################### //
  // ##################################################################### //

  useEffect(() => {
    if (!personLoading) {
      const pages = personLessonData?.pages || '{}';
      const lessonProgress = JSON.parse(pages).lessonProgress || 0;

      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: lessonProgress});

      history.push(`${match.url}/${lessonProgress}`);
    }
  }, [personLoading]);

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

  useEffect(() => {
    handleMutationOnPageChange();
  }, [lessonState.currentPage]);

  const loopCreateStudentArchiveAndExcerciseData = async () => {
    const listFilter = {
      filter: {
        studentAuthID: {eq: user.authId},
        lessonID: {eq: lessonID},
        syllabusLessonID: {eq: getRoomData.activeSyllabus},
        roomID: {eq: getRoomData.id}
      }
    };

    const studentDataRows: UniversalLessonStudentData[] = await fetchSurveyDataRow(
      listFilter,
      null,
      []
    );

    const currentPageLocation = await getLessonCurrentPage();
    const lessonPageID = PAGES[currentPageLocation].id;

    const result = studentDataRows.map(async (item: any) => {
      const input: CreateUniversalArchiveDataInput = {
        id: uuidV4(),
        syllabusLessonID: item.syllabusLessonID,
        lessonID: item.lessonID,
        lessonPageID: lessonPageID,
        studentID: item.studentID,
        studentAuthID: item.studentAuthID,
        studentEmail: item.studentEmail,
        roomID: item.roomID,
        currentLocation: currentPageLocation.toString(),
        lessonProgress: (PAGES.length - 1).toString(),
        pageData: item.surveyData
      };
      let newStudentData: any;
      let returnedData: any;

      newStudentData = await API.graphql(
        graphqlOperation(mutations.createUniversalArchiveData, {
          input
        })
      );
      console.info('\x1b[33m *Archiving rest of the pages... \x1b[0m');

      returnedData = newStudentData.data.createUniversalArchiveData;

      return returnedData;
    });

    // updateJournalData(studentDataRows);
    return result;
  };

  const createStudentArchiveData = async (onSuccessCallback?: () => void) => {
    try {
      const result = await loopCreateStudentArchiveAndExcerciseData();
      if (onSuccessCallback && typeof onSuccessCallback === 'function') {
        onSuccessCallback();
      }
      return result;
    } catch (e) {
      console.error(
        'error @createStudentArchiveData in LessonApp.tsx creating journal data - ',
        e
      );
    }
  };

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  return (
    <>
      {/* 
      TODO: Add this again later
      */}
      {/* <FloatingSideMenu /> */}
      <div
        id="survey-app-container"
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
            pageStateUpdated={pageStateUpdated}
            createJournalData={createStudentArchiveData}
            setOverlay={setOverlay}
            canContinue={canContinue}
            updatePageInLocalStorage={updatePageInLocalStorage}
            personLessonData={personLessonData}
            isAtEnd={isAtEnd}
            setPersonLessonData={setPersonLessonData}
            setisAtEnd={setisAtEnd}
            validateRequired={validateRequired}
            handleRequiredNotification={handleRequiredNotification}
          />
        </div>
        <div
          className={`${
            breakpoint === 'xs' || breakpoint === 'sm' ? 'top-2' : 'top-6'
          } relative lesson-body-container`}>
          {!lessonDataLoaded ? (
            <div className="mt-4 mb-8 lesson-page-container">
              <LessonPageLoader />
            </div>
          ) : (
            <ErrorBoundary fallback={<h1>Error in the Lesson App</h1>}>
              {/* ADD LESSONWRAPPER HERE */}
              <div className="mt-4 mb-8 lesson-page-container ">
                <CoreUniversalLesson
                  invokeRequiredField={() => {
                    invokeRequiredField();
                    handleRequiredNotification();
                  }}
                  canContinue={canContinue}
                />
              </div>
            </ErrorBoundary>
          )}

          {/* <StudentNavigationForMobile /> */}

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
