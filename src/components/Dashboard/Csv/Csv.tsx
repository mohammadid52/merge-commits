import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Modal from '@components/Atoms/Modal';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import Table, {ITableProps} from '@components/Molecules/Table';
import usePagination from '@customHooks/usePagination';
import {logError} from 'graphql-functions/functions';
import {getFormatedDate} from '@utilities/time';
import {Card, Col, Divider, Row, Statistic} from 'antd';
import {UniversalLessonPlan} from 'API';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import {getStudentResponse, getUniversalLesson} from 'customGraphql/customQueries';
import useAuth from 'customHooks/useAuth';
import {listUniversalArchiveData, listUniversalSurveyStudentData} from 'graphql/queries';
import PageLayout from 'layout/PageLayout';
import React, {lazy, useEffect, useRef, useState} from 'react';
import {RiErrorWarningLine} from 'react-icons/ri';
import {createFilterToFetchSpecificItemsOnly} from 'utilities/strings';
import useCsv from './Hooks/useCsv';
import ErrorBoundary from '@components/Error/ErrorBoundary';
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
      <span className="text-sm mb-1 text-medium ">{title}</span>
      <span className="text-dark font-medium text-left w-auto text-sm">{content}</span>
    </div>
  );
};

const Csv = () => {
  const [selectedInst, setSelectedInst] = useState<any>(null);

  const [selectedClassRoom, setSelectedClassRoom] = useState<any>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<any>(null);

  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const [surveys, setSurveys] = useState<any[]>([]);

  const [selectedSurvey, setSelectedsurvey] = useState<any>(null);

  const [surveyQuestions, setSurveyQuestions] = useState<any[]>([]);

  const [demographicsQuestions, setDemographicsQuestions] = useState<any[]>([]);

  const [classStudents, setClassStudents] = useState<any[]>([]);

  const [isCSVReady, setIsCSVReady] = useState<any>(false);

  const [lessonPDFData, setLessonPDFData] = useState<any[]>([]);

  const [SCQAnswers, setSCQAnswers] = useState<any[]>([]);

  const [DCQAnswers, setDCQAnswers] = useState<any[]>([]);

  const [_3, setCsvGettingReady] = useState<any>(false);

  const [showTestData, setShowTestData] = useState(false);
  const [responseValue, setResponseValue] = useState(true);

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
      graphqlOperation(getStudentResponse, {
        filter: {
          ...createFilterToFetchSpecificItemsOnly(checkpointIds, 'checkpointID'),
          syllabusLessonID: {eq: syllabusLessonID},
          ...createFilterToFetchSpecificItemsOnly(studentsEmails, 'email')
        },
        limit: SEARCH_LIMIT
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
        graphqlOperation(getUniversalLesson, {
          id: lessonId
        })
      );
      let lessonObject = universalLesson.data.getUniversalLesson;
      setLessonPDFData(lessonObject.lessonPlan);

      let questionsListdata = getQuestionListFromLesson(lessonObject);

      let sanitizedQuestions = questionsListdata.flat(2).filter(Boolean).flat();

      if (sanitizedQuestions) {
        sanitizedQuestions = sanitizedQuestions.map((item: unknown) => ({
          question: item
        }));
      }

      setSurveyQuestions(sanitizedQuestions);

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
  const getQuestionListFromLesson = (lessonObj: any) => {
    if (lessonObj?.lessonPlan) {
      const mappedPages = lessonObj?.lessonPlan.map((page: UniversalLessonPlan) => {
        const pageParts = page.pageContent;
        const mappedPageParts = pageParts?.map((pagePart: any) => {
          if (pagePart?.partContent) {
            const partInputs = pagePart.partContent.map((partContent: any) => {
              const isForm = /form/g.test(partContent.type);
              const isOtherInput = /input/g.test(partContent.type);
              if (isForm) {
                return partContent.value.map((formInput: any) => {
                  return {
                    id: formInput.id,
                    question: formInput.label,
                    type: formInput.type,
                    options: formInput.options
                  };
                });
              } else if (isOtherInput) {
                return {
                  id: partContent.id,
                  question: partContent.label,
                  type: partContent.type,
                  options: partContent.options
                };
              } else {
                return null;
              }
            });

            return partInputs;
          }
        });

        return mappedPageParts;
      });

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
    lessonId: string,
    nextToken?: string,
    outArray = []
  ) => {
    setCsvGettingReady(true);
    let studsEmails = classStudents?.map((stu: any) => stu.email);
    let universalSurveyStudentData: any = await API.graphql(
      graphqlOperation(listUniversalSurveyStudentData, {
        nextToken: nextToken,
        limit: SEARCH_LIMIT,
        filter: {
          lessonID: {eq: lessonId},
          ...createFilterToFetchSpecificItemsOnly(studsEmails, 'studentEmail')
        }
      })
    );
    let studentsAnswersSurveyQuestionsData =
      universalSurveyStudentData.data.listUniversalSurveyStudentData.items;

    let newNextToken =
      universalSurveyStudentData.data.listUniversalSurveyStudentData.nextToken;

    let combined: any = [...studentsAnswersSurveyQuestionsData, ...outArray];

    if (Boolean(newNextToken)) {
      combined = await getStudentsSurveyQuestionsResponse(
        lessonId,
        newNextToken,
        combined
      );
    }

    /**
     * combination of last fetch results
     * && current fetch results
     */

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
      graphqlOperation(listUniversalArchiveData, {
        nextToken: nextToken,
        limit: SEARCH_LIMIT,
        filter: {
          lessonID: {eq: lessonId},
          ...createFilterToFetchSpecificItemsOnly(studsEmails, 'studentEmail')
        }
      })
    );
    let studentsAnswersSurveyQuestionsData =
      universalSurveyStudentData.data.listUniversalArchiveData.items;

    let newNextToken = universalSurveyStudentData.data.listUniversalArchiveData.nextToken;

    /**
     * combination of last fetch results
     * && current fetch results
     */
    let combined: any = [...studentsAnswersSurveyQuestionsData, ...outArray];

    if (Boolean(newNextToken)) {
      combined = await getStudentsSurveyQuestionsResponseFromArchiveTable(
        lessonId,
        newNextToken,
        combined
      );
    }

    return combined;
  };

  useEffect(() => {
    const el = document?.getElementById('csv-download-button');

    el?.addEventListener('click', () => {
      setShowWarnModal(true);
    });
  }, []);

  const [showWarnModal, setShowWarnModal] = useState<any>(false);

  const {clearCSVData, mappedHeaders, isCSVDownloadReady, statistics, CSVData} = useCsv({
    classStudents,
    isCSVReady,
    setIsCSVReady,
    DCQAnswers,
    selectedInst,
    selectedClassRoom,
    showTestData,
    responseValue,
    selectedCurriculum,
    selectedSurvey,
    selectedUnit,
    surveyQuestions,
    demographicsQuestions,
    SCQAnswers
  });

  const dataList = CSVData.map((listItem, idx) => ({
    no: idx + 1,
    onClick: () => {},
    id: listItem.id,
    name: `${listItem.firstName} ${listItem.lastName}`,
    email: listItem.email,
    takenSurvey: listItem?.hasTakenSurvey ? 'Yes' : 'No',
    completedDate: getFormatedDate(listItem?.last)
  }));

  const {allAsProps} = usePagination(CSVData, CSVData.length);

  const tableConfig: ITableProps = {
    headers: ['No', 'Id', 'Name', 'Email', 'Completed Date', 'Taken Survey'],
    dataList,
    config: {
      dataList: {
        pagination: {
          showPagination: true,
          config: {
            allAsProps: {
              ...allAsProps,
              pageCount: 20
            }
          }
        },
        loading: !isCSVDownloadReady || !isCSVReady
      }
    }
  };

  const instituteDropdownRef = useRef<any>(null);
  const classroomDropdownRef = useRef<any>(null);
  const unitDropdownRef = useRef<any>(null);
  const surveyDropdownRef = useRef<any>(null);

  return (
    <ErrorBoundary componentName="CSV">
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
          <p className="text-medium  pt-0 p-4 text-center">
            If you will be using this file to upload results to the app, please do not
            change column header or tab names
          </p>
        </div>
      </Modal>

      <PageLayout hideGoBack hideInstProfile>
        <div className="">
          <DownloadCsvTitleComponent
            setSCQAnswers={setSCQAnswers}
            listQuestions={listQuestions}
            selectedClassRoom={selectedClassRoom}
            selectedUnit={selectedUnit}
            selectedSurvey={selectedSurvey}
            selectedInst={selectedInst}
            surveys={surveys}
            setSelectedCurriculum={setSelectedCurriculum}
            setSelectedClassRoom={setSelectedClassRoom}
            getStudentsDemographicsQuestionsResponse={
              getStudentsDemographicsQuestionsResponse
            }
            instituteDropdownRef={instituteDropdownRef}
            classroomDropdownRef={classroomDropdownRef}
            unitDropdownRef={unitDropdownRef}
            surveyDropdownRef={surveyDropdownRef}
            setSurveys={setSurveys}
            setSelectedsurvey={setSelectedsurvey}
            setDemographicsQuestions={setDemographicsQuestions}
            setClassStudents={setClassStudents}
            setSelectedInst={setSelectedInst}
            resetInstitution={resetInstitution}
            setSelectedUnit={setSelectedUnit}
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
            setShowTestData={setShowTestData}
            setResponseValue={setResponseValue}
            showTestData={showTestData}
            responseValue={responseValue}
          />
          <Divider />
          <div className="w-full">
            <div className="w-auto my-4">
              <SectionTitleV3 title={'Survey Results'} />
            </div>
            {Boolean(selectedSurvey) ? (
              <Table {...tableConfig} />
            ) : (
              <Card className="min-h-56 flex-col flex items-center justify-center text-base text-center">
                <p>Select filters options to populate data</p>
              </Card>
            )}
          </div>

          <AnimatedContainer show={isCSVDownloadReady}>
            <SectionTitleV3 title={'Statistics'} />

            <Card>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="Survey First"
                    value={getFormatedDate(statistics.surveyFirst)}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Survey Last"
                    value={getFormatedDate(statistics.surveyLast)}
                  />
                </Col>
                <Col span={6}>
                  <Statistic title="Taken Survey" value={statistics.takenSurvey} />
                </Col>
                <Col span={6}>
                  <Statistic title="Not Taken Survey" value={statistics.notTakenSurvey} />
                </Col>
              </Row>
            </Card>
          </AnimatedContainer>
        </div>
      </PageLayout>
    </ErrorBoundary>
  );
};

export default Csv;
