import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Modal from '@components/Atoms/Modal';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import Table from '@components/Molecules/Table';
import {logError} from '@graphql/functions';
import {getFormatedDate} from '@utilities/utils';
import {Divider} from 'antd';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import * as customQueries from 'customGraphql/customQueries';
import useAuth from 'customHooks/useAuth';
import * as queries from 'graphql/queries';
import React, {lazy, useEffect, useState} from 'react';
import {RiErrorWarningLine} from 'react-icons/ri';
import {createFilterToFetchSpecificItemsOnly} from 'utilities/strings';
import useCsv from './Hooks/useCsv';
const DownloadCsvButtons = lazy(
  () => import('components/Dashboard/Csv/Components/DownloadCsvButtons')
);
const DownloadCsvTitleComponent = lazy(
  () => import('@components/Dashboard/Csv/Components/DownloadCsvTitleComponent')
);

export const DataValue = ({
  title,
  content,
  withBg = false,
  className = ''
}: {
  title: string;
  className?: string;
  content: string | React.ReactNode;
  withBg?: boolean;
}) => {
  return (
    <div
      className={` w-auto flex mb-2 flex-col items-start justify-start ${
        withBg ? 'bg-white rounded-md px-4 py-2' : ''
      } ${className}`}>
      <span className="text-sm mb-1 text-gray-500">{title}</span>
      <span className="text-dark-gray font-medium text-left w-auto text-sm">
        {content}
      </span>
    </div>
  );
};

const Card = ({keyItem, value}: any) => {
  return (
    <div className="flex relative bg-white rounded-lg  justify-center items-center h-20 shadow inner_card">
      <p className={`text-sm text-semibold text-gray-500 w-auto mr-2 text-md`}>
        {keyItem}:
      </p>
      <p className={`text-dark-gray font-medium text-center w-auto text-md`}>{value}</p>
    </div>
  );
};

const Csv = () => {
  const [selectedInst, setSelectedInst] = useState<any>(null);

  const [classRoomsList, setClassRoomsList] = useState<any[]>([]);

  const [selectedClassRoom, setSelectedClassRoom] = useState<any>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<any>(null);

  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const [surveys, setSurveys] = useState<any[]>([]);

  const [selectedSurvey, setSelectedsurvey] = useState<any>(null);

  const [surveyQuestions, setSurveyQuestions] = useState<any[]>([]);
  const [demographicsQuestions, setDemographicsQuestions] = useState<any[]>([]);

  const [classStudents, setClassStudents] = useState<any[]>([]);

  const [isCSVReady, setIsCSVReady] = useState(false);

  const [lessonPDFData, setLessonPDFData] = useState<any[]>([]);

  const [SCQAnswers, setSCQAnswers] = useState<any[]>([]);
  const [DCQAnswers, setDCQAnswers] = useState<any[]>([]);

  const [_3, setCsvGettingReady] = useState(false);

  // methods to clear state data
  const resetInstitution = () => {
    clearClassRooms();
    clearClass();
    setSelectedUnit(null);
    setSelectedCurriculum(null);
    setSelectedsurvey(null);
    setSurveyQuestions([]);
    clearStudentsAnswers();
    clearCSVData();
  };

  const clearClassRooms = () => {
    setClassRoomsList([]);
    setSelectedClassRoom(null);
  };
  const clearClass = () => {
    setClassStudents([]);
  };

  const clearStudentsAnswers = () => {
    setSCQAnswers([]);
    setDCQAnswers([]);
  };

  const {authId, email} = useAuth();

  const getStudentsDemographicsQuestionsResponse = async (
    checkpointIds: any,
    syllabusLessonID: string,
    studentsEmails: any
  ) => {
    let curriculumData: any = await API.graphql(
      graphqlOperation(customQueries.getStudentResponse, {
        filter: {
          ...createFilterToFetchSpecificItemsOnly(checkpointIds, 'checkpointID'),
          syllabusLessonID: {eq: syllabusLessonID},
          ...createFilterToFetchSpecificItemsOnly(studentsEmails, 'email')
        },
        limit: 1000
      })
    );
    let studentsAnswersDemographicsCheckpointsQuestions =
      curriculumData?.data?.listQuestionData?.items || [];
    setDCQAnswers(studentsAnswersDemographicsCheckpointsQuestions);
  };

  const listQuestions = async (lessonId: string) => {
    try {
      setCsvGettingReady(true);
      let universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId
        })
      );
      let lessonObject = universalLesson.data.getUniversalLesson;
      setLessonPDFData(lessonObject.lessonPlan);
      let questionsListdata = await getQuestionListFromLesson(lessonObject);
      let questionList = questionsListdata.questionList;
      // console.log('questionList', questionList)
      let questions: any = [];
      if (questionList) {
        questionList.map((listItem: any) => {
          listItem.map((item: any) => {
            questions.push({
              question: {
                id: item.questionID,
                question: item.questionString,
                type: item.type,
                options: item.options
              }
            });
          });
        });
      }

      setSurveyQuestions(questions);

      if (classStudents) {
        let response = await getStudentsSurveyQuestionsResponse(lessonId, undefined, []);

        if (response.length === 0) {
          response = await getStudentsSurveyQuestionsResponseFromArchiveTable(
            lessonId,
            undefined,
            []
          );
        }

        setSCQAnswers((prevState: any) => {
          return [...prevState, response];
        });

        setIsCSVReady(true);
        setCsvGettingReady(false);
      }
    } catch (err) {
      logError(err, {authId, email}, 'Csv @listQuestions');
      console.error('list questions error', err);
    }
  };

  // ##################################################################### //
  // ########## LOOP OVER LESSONPLAN AND GENERATE QUESTION LIST ########## //
  // ##################################################################### //
  const getQuestionListFromLesson = async (lessonObj: any) => {
    if (lessonObj?.lessonPlan) {
      const mappedPages = lessonObj?.lessonPlan.reduce(
        (
          inputs: {
            questionList: any[];
          },
          page: any
        ) => {
          const pageParts = page.pageContent;
          const reducedPageInputs = pageParts.reduce(
            (
              pageInputsAcc: {
                pageInputAcc: any[];
              },
              pagePart: any
            ) => {
              if (pagePart.hasOwnProperty('partContent')) {
                const partInputs = pagePart.partContent.reduce(
                  (
                    partInputAcc: {
                      pageInputAcc: any[];
                    },
                    partContent: any
                  ) => {
                    //  CHECK WHICH INPUT TYPE  //
                    const isForm = /form/g.test(partContent.type);
                    const isOtherInput = /input/g.test(partContent.type);

                    // -------- IF FORM ------- //
                    if (isForm) {
                      const formSubInputs = partContent.value.reduce(
                        (subPartAcc: {pgInput: any[]}, partContentSub: any) => {
                          return {
                            ...subPartAcc,

                            pgInput: [
                              ...subPartAcc.pgInput,
                              {
                                questionID: partContentSub.id,
                                type: partContentSub.type,
                                questionString: partContentSub.label,
                                options: partContentSub.options
                              }
                            ]
                          };
                        },
                        {pgInput: []}
                      );

                      return {
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          ...formSubInputs.pgInput
                        ]
                      };
                    }
                    // ---- IF OTHER INPUT ---- //
                    else if (isOtherInput) {
                      return {
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          {
                            questionID: partContent.id,
                            type: partContent.type,
                            questionString: partContent.label,
                            options: partContent.options
                          }
                        ]
                      };
                    } else {
                      return partInputAcc;
                    }
                  },
                  {pageInputAcc: []}
                );

                return {
                  pageInputAcc: [
                    ...pageInputsAcc.pageInputAcc,
                    ...partInputs.pageInputAcc
                  ]
                };
              } else {
                return pageInputsAcc;
              }
            },
            {pageInputAcc: []}
          );

          return {
            questionList: [...inputs.questionList, reducedPageInputs.pageInputAcc]
          };
        },

        {questionList: []}
      );

      return mappedPages;
    }
  };

  // ##################################################################### //
  // ############################# TEMP CODE ############################# //
  // ##################################################################### //

  // ##################################################################### //
  // ########################## END OF TEMP CODE ######################### //
  // ##################################################################### //

  const getStudentsSurveyQuestionsResponse = async (
    lessonId: String,
    nextToken?: string,
    outArray = []
  ) => {
    setCsvGettingReady(true);
    let studsEmails = classStudents?.map((stu: any) => stu.email);
    let universalSurveyStudentData: any = await API.graphql(
      graphqlOperation(queries.listUniversalSurveyStudentData, {
        nextToken: nextToken,
        limit: 200,
        filter: {
          lessonID: {eq: lessonId},
          ...createFilterToFetchSpecificItemsOnly(studsEmails, 'studentEmail')
        }
      })
    );
    let studentsAnswersSurveyQuestionsData =
      universalSurveyStudentData.data.listUniversalSurveyStudentData.items;

    /**
     * combination of last fetch results
     * && current fetch results
     */
    let combined: any = [...studentsAnswersSurveyQuestionsData, ...outArray];

    return combined;
  };

  const getStudentsSurveyQuestionsResponseFromArchiveTable = async (
    lessonId: String,
    nextToken?: string,
    outArray = []
  ) => {
    setCsvGettingReady(true);
    let studsEmails = classStudents.map((stu: any) => stu.email);
    let universalSurveyStudentData: any = await API.graphql(
      graphqlOperation(queries.listUniversalArchiveData, {
        nextToken: nextToken,
        limit: 200,
        filter: {
          lessonID: {eq: lessonId},
          ...createFilterToFetchSpecificItemsOnly(studsEmails, 'studentEmail')
        }
      })
    );
    let studentsAnswersSurveyQuestionsData =
      universalSurveyStudentData.data.listUniversalArchiveData.items;

    /**
     * combination of last fetch results
     * && current fetch results
     */
    let combined: any = [...studentsAnswersSurveyQuestionsData, ...outArray];

    return combined;
  };

  const [hoveringItem, setHoveringItem] = useState<{name?: string}>({});

  const currentSelectedClassroomData =
    hoveringItem &&
    hoveringItem?.name &&
    classRoomsList?.find((_c) => _c.name === hoveringItem?.name);

  useEffect(() => {
    const el = document?.getElementById('csv-download-button');

    el?.addEventListener('click', () => {
      setShowWarnModal(true);
    });
  }, []);

  const [showWarnModal, setShowWarnModal] = useState(false);

  const {clearCSVData, mappedHeaders, isCSVDownloadReady, statistics, CSVData} = useCsv({
    classStudents,
    isCSVReady,
    setIsCSVReady,
    DCQAnswers,
    selectedInst,
    selectedClassRoom,
    selectedCurriculum,
    selectedSurvey,
    selectedUnit,
    surveyQuestions,
    demographicsQuestions,
    SCQAnswers
  });

  const dataList = CSVData.map((listItem, idx) => ({
    no: idx + 1,
    id: listItem.id,
    name: `${listItem.firstName} ${listItem.lastName}`,

    email: listItem.email,
    takenSurvey: listItem?.hasTakenSurvey ? 'Yes' : 'No',
    completedDate: getFormatedDate(listItem?.last)
  }));

  const tableConfig = {
    headers: ['No', 'Id', 'Name', 'Email', 'Completed Date', 'Taken Survey'],
    dataList,
    config: {
      isFirstIndex: true,
      dataList: {
        loading: !isCSVDownloadReady || !isCSVReady,

        emptyText: 'no data found',
        customWidth: {
          id: 'w-72',
          takenSurvey: 'w-48',
          completedDate: 'w-48',
          email: 'w-72 break-all'
        },
        maxHeight: 'max-h-196'
      }
    }
  };

  return (
    <>
      <Modal
        open={showWarnModal}
        closeAction={() => setShowWarnModal(false)}
        closeOnBackdrop
        showFooter={false}
        showHeader={true}
        title="Csv Download">
        <div className="flex flex-col justify-center items-center gap-y-4">
          <RiErrorWarningLine fontSize={'4rem'} className="text-yellow-500 animate-y" />
          <hr />
          <p className="text-gray-600 pt-0 p-4 text-center">
            If you will be using this file to upload results to the app, please do not
            change column header or tab names
          </p>
        </div>
      </Modal>

      <div className="flex flex-col overflow-h-auto w-full h-full px-8 py-4">
        <DownloadCsvTitleComponent
          setSCQAnswers={setSCQAnswers}
          listQuestions={listQuestions}
          selectedClassRoom={selectedClassRoom}
          selectedCurriculum={selectedCurriculum}
          selectedUnit={selectedUnit}
          selectedSurvey={selectedSurvey}
          selectedInst={selectedInst}
          currentSelectedClassroomData={currentSelectedClassroomData}
          surveys={surveys}
          setSelectedCurriculum={setSelectedCurriculum}
          setSelectedClassRoom={setSelectedClassRoom}
          getStudentsDemographicsQuestionsResponse={
            getStudentsDemographicsQuestionsResponse
          }
          setSurveys={setSurveys}
          setSelectedsurvey={setSelectedsurvey}
          setDemographicsQuestions={setDemographicsQuestions}
          setClassStudents={setClassStudents}
          setSelectedInst={setSelectedInst}
          resetInstitution={resetInstitution}
          setSelectedUnit={setSelectedUnit}
          hoveringItem={hoveringItem}
          setHoveringItem={setHoveringItem}
          clearCSVData={clearCSVData}
        />

        <Divider />

        <DownloadCsvButtons
          isCSVDownloadReady={isCSVDownloadReady}
          selectedSurvey={selectedSurvey}
          selectedClassRoom={selectedClassRoom}
          CSVData={CSVData}
          mappedHeaders={mappedHeaders}
          lessonPDFData={lessonPDFData}
        />
        <Divider />
        <div className="w-full">
          <div className="w-auto my-4">
            <SectionTitleV3 title={'Survey Results'} />
          </div>
          {Boolean(selectedSurvey) ? (
            <Table {...tableConfig} />
          ) : (
            <div className="bg-white flex justify-center items-center inner_card h-30 overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="w-5/10">
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Select filters options to populate data
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <AnimatedContainer show={isCSVDownloadReady}>
          {isCSVDownloadReady && (
            <div className="w-full">
              <div className="w-auto my-4">
                <SectionTitleV3 title={'Statistics'} />
              </div>

              <div className={`grid grid-cols-2 md:grid-cols-4 gap-6`}>
                {/* @Aman change the value:{value} */}
                <Card
                  keyItem="Survey First"
                  value={getFormatedDate(statistics.surveyFirst)}
                />
                <Card
                  keyItem="Survey Last"
                  value={getFormatedDate(statistics.surveyLast)}
                />
                <Card keyItem="Taken Survey" value={statistics.takenSurvey} />
                <Card keyItem="Not Taken Survey" value={statistics.notTakenSurvey} />
              </div>
            </div>
          )}
        </AnimatedContainer>
      </div>
    </>
  );
};

export default Csv;
