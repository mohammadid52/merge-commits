import {useQuery} from '@customHooks/urlParam';
import {CreateUniversalArchiveDataInput, PartInput, TeachingStyle} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  createUniversalArchiveData,
  createUniversalSurveyStudentData
} from 'graphql/mutations';
import {listUniversalSurveyStudentData} from 'graphql/queries';

import {
  PagePart,
  PartContent,
  PartContentSub,
  StudentPageInput,
  UniversalLessonPage,
  UniversalLessonStudentData
} from 'interfaces/UniversalLessonInterfaces';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getLocalStorageData} from 'utilities/localStorage';
import {v4 as uuidV4} from 'uuid';
import {SEARCH_LIMIT} from './constants';
import {ILessonSurveyApp} from './Lesson';
import LessonSurveyAppWrapper from './LessonSurveyAppWrapper';

const SurveyApp = (props: ILessonSurveyApp) => {
  const {getLessonCurrentPage} = props;
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //

  const gContext = useGlobalContext();
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;

  const lessonDispatch = gContext.lessonDispatch;

  // ~~~~~~~~~~~~~~~~ OTHER ~~~~~~~~~~~~~~~~ //

  const getRoomData = getLocalStorageData('room_info');
  const urlParams: any = useParams();
  const {lessonID} = urlParams;

  // ##################################################################### //
  // ######################### BASIC UI CONTROLS ######################### //
  // ##################################################################### //

  const PAGES = lessonState?.lessonData?.lessonPlan;

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
          const reducedPageInputs = pageParts?.reduce(
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
                    const isForm = /form/g.test(partContent.type || '');

                    const isOtherInput = /input/g.test(partContent?.type || '');

                    // -------- IF FORM ------- //
                    if (isForm) {
                      const formSubInputs = partContent.value.reduce(
                        // @ts-ignore
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
                          // @ts-ignore
                          ...formSubInputs.reqId
                        ],
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          // @ts-ignore
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
            required: [...inputs.required, reducedPageInputs?.requiredIdAcc],
            initialized: [
              ...inputs.initialized,
              // @ts-ignore
              ...reducedPageInputs?.pageInputAcc
            ]
          };
        },

        {required: [], initialized: []}
      );

      const exerciseData = lessonState.exerciseData;

      lessonDispatch({
        type: 'SET_INITIAL_STUDENT_DATA',
        payload: {
          requiredInputs: mappedPages.required,
          studentData: mappedPages.initialized,
          exerciseData
        }
      });

      setStudentDataInitialized(true);
    }
  };

  // ##################################################################### //
  // ################# GET OR CREATE STUDENT DATA RECORDS ################ //
  // ##################################################################### //

  // ~~~~~ CREATE DB DATA ID REFERENCES ~~~~ //
  const surveyDataId = (
    surveyDataRowObj: any
  ): {
    id: string;
    pageIdx: number;
    lessonPageID: string;
    update: boolean;
  }[] => {
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
        graphqlOperation(createUniversalSurveyStudentData, {
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

  const fetchSurveyDataRow = async (
    filterObj: any,
    nextToken: string | undefined,
    outArray: any[]
  ): Promise<any> => {
    let combined;
    setLessonDataLoaded(false);
    try {
      let surveyData: any = await API.graphql(
        graphqlOperation(listUniversalSurveyStudentData, {
          ...filterObj,
          nextToken: nextToken,
          limit: SEARCH_LIMIT
        })
      );

      let surveyDataRow = surveyData.data.listUniversalSurveyStudentData.items;

      let theNextToken = surveyData.data.listUniversalSurveyStudentData?.nextToken;

      combined = [...outArray, ...surveyDataRow];

      if (theNextToken) {
        combined = await fetchSurveyDataRow(filterObj, theNextToken, combined);
      }
      setLessonDataLoaded(true);
      return combined;
    } catch (e) {
      console.error('loopFetchStudentData - ', e);
      return [];
    }
  };

  const teachingStyle = getRoomData.teachingStyle;

  const isStudent =
    user.role !== 'ST' && teachingStyle === TeachingStyle.PERFORMER
      ? true
      : user.role === 'ST';

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
          if (createNewRecords && createNewRecords?.length > 0) {
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
        const finalData: any = [...surveyDataResponses, ...extraQuestions];

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
      initializeSurveyData().then(() => {
        lessonDispatch({type: 'LESSON_LOADED', payload: true});
      });
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

  // ##################################################################### //
  // ######################### NAVIGATION CONTROL ######################## //
  // ##################################################################### //

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
      undefined,
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
        graphqlOperation(createUniversalArchiveData, {
          input
        })
      );
      console.info('\x1b[33m *Archiving rest of the pages... \x1b[0m');

      returnedData = newStudentData.data.createUniversalArchiveData;

      return returnedData;
    });

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
      return null;
    }
  };

  return (
    <LessonSurveyAppWrapper
      type="survey"
      lessonDataLoaded={lessonDataLoaded}
      createJournalData={createStudentArchiveData}
      {...props}
    />
  );
};

export default SurveyApp;
