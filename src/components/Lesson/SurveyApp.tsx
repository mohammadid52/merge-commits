import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import useAuth from '@customHooks/useAuth';
import {PartInput, UniversalSurveyStudentData} from 'API';
import {GlobalContext} from 'contexts/GlobalContext';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentPageInput,
  UniversalLessonPage
} from 'interfaces/UniversalLessonInterfaces';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {v4 as uuidV4} from 'uuid';
import ErrorBoundary from '../Error/ErrorBoundary';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import Foot from './Foot/Foot';
import LessonPageLoader from './LessonPageLoader';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';
import useLessonFunctions from './useLessonFunctions';

const SurveyApp = () => {
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
  const CURRENT_PAGE = lessonState.currentPage;

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
  const [pageStateUpdated, setPageStateUpdated] = useState(false);
  const {lessonData, misc} = lessonState;
  useEffect(() => {
    if (
      misc?.personLessonData &&
      misc?.personLessonData?.lessonID &&
      misc?.personLessonData?.lessonID === lessonData?.id
    ) {
      const data = misc?.personLessonData?.data[0];

      const pages = data?.pages || '{}';
      const lessonProgress = JSON.parse(pages).lessonProgress || 0;

      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: lessonProgress});
      setPageStateUpdated(true);
      history.push(`${match.url}/${lessonProgress}`);
    }
  }, [lessonData.id, misc?.personLessonData?.lessonID]);

  // ##################################################################### //
  // ###################### INITIALIZE STUDENT DATA ###################### //
  // ##################################################################### //
  const [studentDataInitialized, setStudentDataInitialized] = useState<boolean>(false);

  // ~~~~~~~~ INITIALIZE STUDENTDATA ~~~~~~~ //

  const initializeSurveyData = async () => {
    if (studentDataInitialized === false && PAGES) {
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
    initialDataFlattened: any[] = [],
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

  const fetchSurveyDataRow = async (): Promise<UniversalSurveyStudentData[]> =>
    new Promise(async (resolve) => {
      try {
        setLessonDataLoaded(false);
        // fetch by pages

        let result: any = [];

        await Promise.all(
          PAGES.map(async (page: any, idx: number) => {
            let studentData: any = await API.graphql(
              graphqlOperation(queries.getUniversalLessonStudentData, {
                id: `${user.authId}-${getRoomData.id}-${lessonID}-${page.id}`
                // filter: {...filterObj.filter, lessonPageID: {eq: page.id}}
              })
            );

            let studentDataObject = studentData.data.getUniversalLessonStudentData;
            result.push(studentDataObject);
          })
        );

        /**
         * combination of last fetch results
         * && current fetch results
         */

        lessonDispatch({type: 'LESSON_LOADED', payload: true});

        // console.log('no more - ', combined);
        setLessonDataLoaded(true);
        resolve(result);
      } catch (e) {
        console.error('loopFetchStudentData - ', e);
        return [];
      }
    });

  const {isStudent} = useAuth();
  const getOrCreateSurveyData = async () => {
    // TRY TRY TRY
    try {
      // existing student rows

      // existing student rows
      const surveyDataRow = await (await fetchSurveyDataRow()).filter(Boolean); // table object
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
          if (createNewRecords?.surveyData?.length > 0) {
            lessonDispatch({
              type: 'LOAD_SURVEY_DATA',
              payload: {
                dataIdReferences: surveyDataId(createNewRecords)
              }
            });
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
    if (
      !lessonState.loaded &&
      lessonState.lessonData.lessonPlan &&
      lessonState.lessonData.lessonPlan.length > 0
    ) {
      initializeSurveyData();
    }
  }, [lessonState.lessonData.lessonPlan]);

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

  const [getted, setGetted] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [created, setCreated] = useState(false);

  const getLocationData = getLocalStorageData('person_location');

  const [personLocationObj, setPersonLocationObj] = useState<any>({
    id: '',
    personAuthID: '',
    personEmail: '',
    lessonID: '',
    syllabusLessonID: '',
    roomID: '',
    currentLocation: '',
    lessonProgress: ''
  });

  // ~~~~~~~~~~~~~~~~ 1 INIT ~~~~~~~~~~~~~~~ //

  useEffect(() => {
    if (!isOnDemand && personLocationObj.id === '' && isStudent) {
      initializeLocation();
    }
  }, [lessonState.lessonData.id, isStudent]);

  // ~~~~~~~~~~~~ 2 PAGE CHANGE ~~~~~~~~~~~~ //

  useEffect(() => {
    if (!isOnDemand && created && lessonState.currentPage >= 0 && isStudent) {
      const pageChangeLocation = {
        ...getLocationData,
        currentLocation: lessonState.currentPage,
        lessonProgress: lessonState.lessonProgress
      };
      setPersonLocationObj(pageChangeLocation);
      updatePersonLocation(pageChangeLocation);
      setLocalStorageData('person_location', pageChangeLocation);
      //@ts-ignore
      topLessonRef?.current?.scrollIntoView();
    }
  }, [created, lessonState.currentPage, isStudent]);

  const initializeLocation = async () => {
    if (!getted) {
      const getLocation = await getPersonLocation();

      if (getLocation === undefined || getLocation === null) {
        await createPersonLocation();
      } else {
        if (getLocation.lessonID === lessonID) {
          await updatePersonLocation(getLocation);
        } else {
          await leaveRoomLocation(user.authId, user.email);
          await createPersonLocation();
        }
      }
    }
  };

  // ~~~~~~ LESSON LOAD LOCATION FETC ~~~~~~ //

  const getPersonLocation = async () => {
    try {
      const getUserLocation: any = await API.graphql(
        graphqlOperation(queries.getPersonLocation, {
          personEmail: user.email,
          personAuthID: user.authId
        })
      );
      const response = getUserLocation.data.getPersonLocation;

      return response;
    } catch (e) {
      // console.error('createPersonLocation - ', e);
    } finally {
      setGetted(true);
    }
  };

  const createPersonLocation = async () => {
    const {lessonID} = urlParams;

    const newLocation = {
      personAuthID: user?.authId,
      personEmail: user?.email,
      syllabusLessonID: getRoomData.activeSyllabus,
      lessonID: lessonID,
      roomID: getRoomData.id,
      currentLocation: '0',
      lessonProgress: '0'
    };
    try {
      const newUserLocation: any = await API.graphql(
        graphqlOperation(mutations.createPersonLocation, {input: newLocation})
      );
      const response = newUserLocation.data.createPersonLocation;
      const newLocationObj = {
        ...newLocation,
        id: response.id
      };
      setPersonLocationObj(newLocationObj);
      setLocalStorageData('person_location', newLocationObj);
    } catch (e) {
      // console.error('createPersonLocation - ', e);
    } finally {
      setCreated(true);
    }
  };

  // ~~~~~~~~~~ LOCATION UPDATING ~~~~~~~~~~ //

  const updatePersonLocation = async (updatedLocationObj: any) => {
    const locationUpdateProps = {
      id: updatedLocationObj.id,
      personAuthID: updatedLocationObj.personAuthID,
      personEmail: updatedLocationObj.personEmail,
      lessonID: updatedLocationObj.lessonID,
      syllabusLessonID: updatedLocationObj.syllabusLessonID,
      roomID: updatedLocationObj.roomID,
      currentLocation: updatedLocationObj.currentLocation,
      lessonProgress: updatedLocationObj.lessonProgress
    };
    try {
      await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, {input: locationUpdateProps})
      );
      setLocalStorageData('person_location', locationUpdateProps);
    } catch (e) {
      console.error('updatePersonLocation - ', e);
    }
  };

  const leaveRoomLocation = async (inputAuthId: string, inputEmail: string) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.deletePersonLocation, {
          input: {
            personEmail: inputEmail,
            personAuthID: inputAuthId
          }
        })
      );
    } catch (e) {
      console.error('error deleting location record - ', e);
    } finally {
      setCleared(true);
    }
  };

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
    handleSurveyMutateData();
  }, [lessonState.currentPage]);

  const getPersonLessonsDataId = (): string =>
    lessonState?.misc?.personLessonData?.data?.find((_d: any) => _d.lessonID === lessonID)
      ?.id || '';

  const handleSurveyMutateData = async () => {
    try {
      let payload;
      let existingLesson: any;

      const personLessonData = lessonState?.misc?.personLessonData;
      const isSameAndDataExists =
        personLessonData?.lessonID === lessonID && personLessonData?.data?.length > 0;

      if (isSameAndDataExists) {
        existingLesson = personLessonData?.data;
      } else {
        existingLesson = await API.graphql(
          graphqlOperation(queries.listPersonLessonsData, {
            filter: {
              lessonID: {eq: lessonID},
              studentAuthID: {eq: user.authId},
              studentEmail: {eq: user.email},
              roomId: {eq: getRoomData.id}
            }
          })
        );
        lessonDispatch({
          type: 'SET_PERSON_LESSON_DATA',
          payload: {
            lessonID: lessonID,
            data: existingLesson?.data?.listPersonLessonsData?.items || []
          }
        });
      }

      const items = isSameAndDataExists
        ? existingLesson
        : existingLesson?.data?.listPersonLessonsData?.items || [];

      if (!items.length) {
        payload = {
          id: uuidV4(),
          studentAuthID: user.authId,
          roomId: getRoomData.id,
          studentEmail: user.email,
          lessonID: lessonID,
          lessonType: lessonState.lessonData?.type,
          //prettier-ignore
          pages: `{
            "currentPage":${JSON.stringify(lessonState.currentPage)},
            "totalPages":${JSON.stringify(lessonState.lessonData?.lessonPlan?.length - 1)},
            "lessonProgress":${JSON.stringify(lessonState.currentPage)}
            }`.replace(/(\s\s+|[\t\n])/g, ' ').trim(),
          ratings: 0
        };

        if (isStudent) {
          await API.graphql(
            graphqlOperation(mutations.createPersonLessonsData, {input: payload})
          );
        }
      } else {
        payload = {
          id: items?.find((_d: any) => _d.lessonID === lessonID)?.id,

          pages: `{
            "currentPage":${JSON.stringify(lessonState.currentPage)},
            "totalPages":${JSON.stringify(
              lessonState.lessonData?.lessonPlan?.length - 1
            )},
            "lessonProgress":${JSON.stringify(lessonState.currentPage)}
            }`
            .replace(/(\s\s+|[\t\n])/g, ' ')
            .trim()
        };

        if (isStudent) {
          await API.graphql(
            graphqlOperation(mutations.updatePersonLessonsData, {
              input: payload
            })
          );
        }
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: SurveyApp.tsx ~ line 652 ~ handleSurveyMutateData ~ error',
        error
      );
    }
  };

  // ~~~~~~~~~~~ RESPONSIVE CHECK ~~~~~~~~~~ //
  const {breakpoint} = useTailwindBreakpoint();

  const {getLessonCompletedValue} = useLessonFunctions();
  const _getLessonCompletedValue = async () =>
    await getLessonCompletedValue({
      id: getPersonLessonsDataId(),
      filter: {
        lessonID: {eq: lessonID},
        studentEmail: {eq: user.email},
        studentAuthId: {eq: user.authId}
      }
    });

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
            getLessonCompletedValue={
              lessonState?.misc?.personLessonData?.lessonID && _getLessonCompletedValue
            }
            setOverlay={setOverlay}
            isAtEnd={isAtEnd}
            setisAtEnd={setisAtEnd}
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
                <CoreUniversalLesson />
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
