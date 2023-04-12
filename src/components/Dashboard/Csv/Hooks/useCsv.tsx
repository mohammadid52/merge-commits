import useAuth from '@customHooks/useAuth';
import {logError} from 'graphql-functions/functions';
import {getSeparatedHeaders} from '@utilities/functions';
import {cleanString} from '@utilities/strings';
import {orderBy} from 'lodash';
import {useEffect, useState} from 'react';

const useCsv = ({
  DCQAnswers,
  selectedInst,
  selectedClassRoom,
  selectedCurriculum,

  selectedSurvey,
  isCSVReady,
  selectedUnit,

  classStudents,
  surveyQuestions,
  demographicsQuestions,
  setIsCSVReady,
  SCQAnswers,
  showTestData,
  responseValue
}: {
  classStudents: any[];
  surveyQuestions: any[];
  SCQAnswers: any[];
  DCQAnswers: any[];
  demographicsQuestions: any[];

  selectedInst: any;
  isCSVReady: boolean;
  selectedCurriculum: any;
  selectedUnit: any;
  selectedClassRoom: any;
  selectedSurvey: any;
  showTestData: boolean;
  responseValue: boolean;
  setIsCSVReady: any;
}) => {
  const [csvGettingReady, setCsvGettingReady] = useState(false);

  const [isCSVDownloadReady, setIsCSVDownloadReady] = useState(false);

  const [CSVHeaders, setCSVHeaders] = useState<any[]>([]);

  const [CSVData, setCSVData] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    surveyFirst: '-',
    surveyLast: '-',
    takenSurvey: 0,
    notTakenSurvey: 0
  });

  const {authId, email} = useAuth();

  const clearCSVData = () => {
    setIsCSVReady(false);
    setIsCSVDownloadReady(false);
    setCSVData([]);
    setCSVHeaders([]);
  };

  const getCSVReady = async () => {
    try {
      setCsvGettingReady(true);
      let students = classStudents;

      if (!showTestData) {
        // filter students with isZoiq flag true or status as TRAINING
        // remove test data
        students = students.filter(
          (student) => !Boolean(student.isZoiq) || student.status !== 'TRAINING'
        );
      } else {
        students = classStudents;
      }

      let qids: any = [];
      let takenSurvey = 0;
      let notTakenSurvey = 0;
      let surveyDates: any = [];
      // creating an array of question Ids and creating a object to store all question options.
      let surveyQuestionOptions: any = {};

      let surveyQuestionHeaders = surveyQuestions.map((ques: any) => {
        qids.push(ques.question.id);
        surveyQuestionOptions[ques.question.id] = ques.question.options;
        return {
          label: `${ques.question.question}-s-${ques.question.id}`,
          key: `${ques.question.id}`
        };
      });
      /* Enable this code if demographics questions */

      let demographicsQuestionHeaders = demographicsQuestions.map((ques: any) => {
        qids.push(ques.question.id);
        return {
          label: `${ques.question.question}-d-${ques.question.id} (demographic)`,
          key: `${ques.question.id}`
        };
      });

      setCSVHeaders([
        {label: 'AuthId', key: 'authId'},
        {label: 'Email', key: 'email'},
        {label: 'First Name', key: 'firstName'},
        {label: 'Last Name', key: 'lastName'},
        {label: 'Institute', key: 'institute'},
        {label: 'Curriculum', key: 'curriculum'},
        {label: 'Unit', key: 'unit'},
        {label: 'UnitID', key: 'unitId'},
        {label: 'Classroom', key: 'classroom'},
        {label: 'Survey name', key: 'surveyName'},
        {label: 'SurveyID', key: 'surveyId'},
        {label: 'UniversalSurveyStudentID', key: 'universalSurveyStudentID'},
        {label: 'DemographicsDataID', key: 'demographicsDataID'},
        ...demographicsQuestionHeaders, // Enable this line for demographics question
        ...surveyQuestionHeaders
      ]);

      const label = responseValue ? 'label' : 'text';

      let data = students.map((stu: any) => {
        let surveyAnswerDates: any = [];
        let studentAnswers: any = {};
        let hasTakenSurvey = false;
        let universalSurveyStudentID = '';
        let demographicsDataID = '';

        SCQAnswers[0].forEach((answerArray: any) => {
          if (answerArray.studentID === stu.authId) {
            answerArray?.surveyData?.forEach((singleAnswer: any) => {
              //! hasTakenSurvey = true; <-- not here
              //! universalSurveyStudentID = answerArray.id; <-- not here

              if (
                singleAnswer &&
                singleAnswer?.input &&
                singleAnswer.input[0] === 'Not-taken-yet'
              ) {
                hasTakenSurvey = false;
                universalSurveyStudentID = 'Not-taken-yet';
                return;
              }

              if (singleAnswer && qids.indexOf(singleAnswer.domID) >= 0) {
                //! surveyAnswerDates.push(answerArray.updatedAt) //  <-- not here;
                //! surveyDates.push(answerArray.updatedAt); //  <-- not here;
                if (
                  surveyQuestionOptions[singleAnswer.domID] &&
                  Array.isArray(surveyQuestionOptions[singleAnswer.domID]) &&
                  surveyQuestionOptions[singleAnswer.domID].length
                ) {
                  if (
                    Array.isArray(singleAnswer.input) &&
                    singleAnswer.input.length &&
                    singleAnswer.input[0].length
                  ) {
                    let selectedOption = surveyQuestionOptions[singleAnswer.domID].filter(
                      (option: any) => {
                        return option.id === singleAnswer.input[0];
                      }
                    );

                    if (Array.isArray(selectedOption) && selectedOption.length) {
                      surveyAnswerDates.push(answerArray.updatedAt); // * <== but here
                      surveyDates.push(answerArray.updatedAt); // * <== but here
                      hasTakenSurvey = true; // * <== but here
                      universalSurveyStudentID = answerArray.id; // * <== but here-

                      // get the answer index from the options array

                      if (responseValue) {
                        const answerIndex = surveyQuestionOptions[
                          singleAnswer.domID
                        ].findIndex((option: any) => option.id === singleAnswer.input[0]);

                        if (answerIndex === -1) {
                          studentAnswers[singleAnswer.domID] = cleanString(
                            selectedOption[0]['text']
                          );
                        } else {
                          studentAnswers[singleAnswer.domID] = (
                            answerIndex + 1
                          ).toString();
                        }
                      } else {
                        studentAnswers[singleAnswer.domID] = cleanString(
                          selectedOption[0]['text']
                        );
                      }
                    } else {
                      studentAnswers[singleAnswer.domID] = '';
                    }
                  } else {
                    studentAnswers[singleAnswer.domID] = '';
                  }
                } else {
                  // cleanup here
                  studentAnswers[singleAnswer.domID] =
                    Array.isArray(singleAnswer.input) && singleAnswer.input.length
                      ? cleanString(singleAnswer.input[0])
                      : '';
                }
              }
            });
          }
        });

        /* Enable this code if demographics questions */
        DCQAnswers.forEach((ans: any) => {
          if (ans.person.id === stu.id) {
            demographicsDataID = ans.id;
            ans.responseObject.forEach((resp: any) => {
              if (qids.indexOf(resp.qid) >= 0) {
                studentAnswers[resp.qid] =
                  Array.isArray(resp.response) && resp.response.length
                    ? cleanString(resp.response[0])
                    : '';
              }
            });
          }
        });

        surveyAnswerDates = surveyAnswerDates.sort(
          // @ts-ignore
          (a: any, b: any) => new Date(b) - new Date(a)
        );

        if (hasTakenSurvey) {
          takenSurvey++;
        } else {
          notTakenSurvey++;
        }

        return {
          ...stu,
          institute: selectedInst.name,
          curriculum: selectedCurriculum.name,
          unit: selectedUnit.name,
          unitId: selectedUnit.id,
          classroom: selectedClassRoom.name,
          surveyName: selectedSurvey.name,
          surveyId: selectedSurvey.id,
          universalSurveyStudentID: universalSurveyStudentID
            ? universalSurveyStudentID
            : 'Not-taken-yet',
          demographicsDataID: demographicsDataID
            ? demographicsDataID
            : 'No-demographics-data',
          ...studentAnswers,
          hasTakenSurvey,
          first:
            (surveyAnswerDates[surveyAnswerDates.length - 1] &&
              new Date(surveyAnswerDates[surveyAnswerDates.length - 1]).toLocaleString(
                'en-US'
              )) ||
            '-',
          last:
            (surveyAnswerDates[0] &&
              new Date(surveyAnswerDates[0]).toLocaleString('en-US')) ||
            '-'
        };
      });

      surveyDates = surveyDates.sort(
        // @ts-ignore
        (a: any, b: any) => new Date(b) - new Date(a)
      );
      setCSVData(orderBy(data, ['firstName'], ['asc']));
      setStatistics({
        surveyFirst:
          (surveyDates[surveyDates.length - 1] &&
            new Date(surveyDates[surveyDates.length - 1]).toLocaleString('en-US')) ||
          '-',
        surveyLast:
          (surveyDates[0] && new Date(surveyDates[0]).toLocaleString('en-US')) || '-',
        takenSurvey,
        notTakenSurvey
      });
      setIsCSVDownloadReady(true);
      setCsvGettingReady(false);
    } catch (err) {
      logError(err, {authId, email}, 'Csv @getCsvRead');
      console.error('error', err);
    }
  };

  const mappedHeaders = getSeparatedHeaders(CSVHeaders);

  useEffect(() => {
    if (isCSVReady) {
      getCSVReady();
    }
  }, [isCSVReady, responseValue, showTestData]);

  return {
    mappedHeaders,

    isCSVDownloadReady,
    csvGettingReady,
    setCSVData,
    clearCSVData,
    statistics,
    CSVData
  };
};

export default useCsv;
