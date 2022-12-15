import Loader from 'atoms/Loader';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import useAuth from 'customHooks/useAuth';
import * as queries from 'graphql/queries';
import {Transition} from '@headlessui/react';
import {PDFDownloadLink} from '@react-pdf/renderer';
import {getImageFromS3Static} from 'utilities/services';
import {orderBy, uniqBy} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {CSVLink} from 'react-csv';
import {BsDownload} from 'react-icons/bs';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {createFilterToFetchSpecificItemsOnly} from 'utilities/strings';
import Selector from 'atoms/Form/Selector';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import DateAndTime from '../DateAndTime/DateAndTime';
import SurveyPDF from './SurveyPDF';
import {logError} from '@graphql/functions';

interface ICsvProps {
  institutionId?: string;
}

const Csv = ({institutionId}: ICsvProps) => {
  const {state, clientKey, userLanguage} = useContext(GlobalContext);
  const {CsvDict} = useDictionary(clientKey);
  const [institutions, setInstitutions] = useState([]);
  const [selectedInst, setSelectedInst] = useState(null);

  const [instClassRooms, setInstClassRooms] = useState([]);
  const [classRoomsList, setClassRoomsList] = useState([]);

  const [selectedClassRoom, setSelectedClassRoom] = useState(null);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [surveys, setSurveys] = useState([]);
  const [syllabusLessonsData, setSyllabusLessonsData] = useState([]);
  const [selectedSurvey, setSelectedsurvey] = useState(null);

  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [demographicsQuestions, setDemographicsQuestions] = useState([]);

  const [classStudents, setClassStudents] = useState([]);

  const [isCSVReady, setIsCSVReady] = useState(false);
  const [isCSVDownloadReady, setIsCSVDownloadReady] = useState(false);
  const [CSVHeaders, setCSVHeaders] = useState([]);
  const [CSVData, setCSVData] = useState([]);
  const [lessonPDFData, setLessonPDFData] = useState<any[]>([]);

  const [SCQAnswers, setSCQAnswers] = useState([]);
  const [DCQAnswers, setDCQAnswers] = useState([]);

  const [institutionsLoading, setInstitutionsLoading] = useState(false);
  const [classRoomLoading, setClassRoomLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [surveysLoading, setSurveysLoading] = useState(false);
  const [csvGettingReady, setCsvGettingReady] = useState(false);
  const [statistics, setStatistics] = useState({
    surveyFirst: '-',
    surveyLast: '-',
    takenSurvey: 0,
    notTakenSurvey: 0
  });

  // methods to clear state data
  const resetInstitution = () => {
    setInstClassRooms([]);

    clearClassRooms();

    clearClass();

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
    setSelectedClass(null);
    setClassStudents([]);
  };
  const clearCSVData = () => {
    setIsCSVReady(false);
    setIsCSVDownloadReady(false);
    setCSVData([]);
    setCSVHeaders([]);
  };
  const clearStudentsAnswers = () => {
    setSCQAnswers([]);
    setDCQAnswers([]);
  };

  // starting
  useEffect(() => {
    listInstitutions();
  }, []);

  const listInstitutions = async () => {
    try {
      setInstitutionsLoading(true);
      let institutions: any = await API.graphql(
        graphqlOperation(customQueries.getInstitutionsList)
      );
      institutions = institutions?.data.listInstitutions?.items || [];
      institutions = institutions.map((inst: any) => {
        return {
          id: inst.id,
          name: inst.name,
          value: inst.name
        };
      });
      setInstitutions(institutions);
    } catch (error) {
      logError(error, {authId, email}, 'Csv @listInstitutions');
      console.log('🚀 ~ file: Csv.tsx ~ line 122 ~ listInstitutions ~ error', error);
    } finally {
      setInstitutionsLoading(false);
    }
  };

  const getBasicInstitutionInfo = async (institutionId: string) => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getInstitutionBasicInfo, {
          id: institutionId
        })
      );
      setSelectedInst({
        id: institutionId,
        name: result?.data?.getInstitution.name,
        value: result?.data?.getInstitution.name
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (institutionId) {
      getBasicInstitutionInfo(institutionId);
      fetchClassRooms();
    }
  }, [institutionId]);

  const insertExtraData = (cr: any) => {
    const teacherImage = getImageFromS3Static(cr?.teacher?.image);
    return {
      institutionName: cr?.institution?.name || '',
      teacher: {
        name: `${cr?.teacher?.firstName} ${cr?.teacher?.lastName}`,
        image: teacherImage
      },
      courseName: cr?.curricula?.items[0]?.curriculum?.name || '',
      status: cr?.status,
      activeSyllabus: cr?.activeSyllabus
    };
  };

  const [activeUnits, setActiveUnits] = useState([]);

  const fetchActiveUnits = async (crList: any) => {
    const arrayOfActiveUnits = crList
      ?.filter((_c: {activeSyllabus: any}) => Boolean(_c.activeSyllabus))
      .map((_c: {activeSyllabus: string | null}) => {
        if (_c.activeSyllabus) return {unitId: {eq: _c.activeSyllabus}};
      });

    try {
      let curriculumUnits: any = await API.graphql(
        graphqlOperation(customQueries.listUnits, {
          filter: {or: arrayOfActiveUnits}
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnits?.items || [];

      units = units.map((syl: any) => {
        let unitData = syl.unit;
        return {id: unitData.id, name: unitData.name};
      });

      setActiveUnits(units);
    } catch (error) {
      console.error('error at fetchActiveUnits Csv.tsx', error);
    }
  };

  const {authId, isTeacher, email, isFellow} = useAuth();

  const fetchClassRooms = async () => {
    setClassRoomLoading(true);
    let instCRs: any = [];

    const variablesForTR_FR = {filter: {teacherAuthID: {eq: authId}}};
    const variablesForBLD_ADM = {};

    let classrooms: any = await API.graphql(
      graphqlOperation(
        customQueries.listRoomsDashboard,
        isTeacher || isFellow ? variablesForTR_FR : variablesForBLD_ADM
      )
    );
    let coTeahcerClassrooms: any = await API.graphql(
      graphqlOperation(
        customQueries.listRoomCoTeachers,
        isTeacher || isFellow ? variablesForTR_FR : variablesForBLD_ADM
      )
    );

    let coTeachersRooms = coTeahcerClassrooms?.data?.listRoomCoTeachers?.items.map((item:any) => {
      return {
        ...item,
        name:item.room.name,
        class:{id:item.room.classID,},
        curricula:item.room.curricula || {items:[]}
      }
    })
    classrooms = [...coTeachersRooms,...classrooms?.data.listRooms?.items] || [];
    classrooms = classrooms.map((cr: any) => {
      let curriculum =
        cr.curricula?.items &&
        Array.isArray(cr.curricula?.items) &&
        cr.curricula?.items.length > 0
          ? cr.curricula?.items[0].curriculum
          : null;
      instCRs.push({id: cr.id, name: cr.name, value: cr.name});

      return {
        id: cr.id,

        name: cr.name,
        value: cr.name,
        class: {...cr.class},
        curriculum,
        ...insertExtraData(cr)
      };
    });

    setClassRoomsList(classrooms);
    setInstClassRooms(instCRs);
    fetchActiveUnits(classrooms);
    setClassRoomLoading(false);
  };

  const onInstSelect = async (id: string, name: string, value: string) => {
    setClassRoomLoading(true);
    try {
      let sInst = selectedInst;
      let inst = {id, name, value};
      setSelectedInst(inst);
      if (!sInst || sInst.id !== inst.id) {
        resetInstitution();
        let instCRs: any = [];
        // fetch inst classrooms.
        let classrooms: any = await API.graphql(
          graphqlOperation(customQueries.getInstClassRooms, {
            id: inst.id
          })
        );
        classrooms = classrooms?.data.getInstitution?.rooms?.items || [];
        classrooms = classrooms.map((cr: any) => {
          let curriculum =
            cr.curricula?.items && Array.isArray(cr.curricula?.items)
              ? cr.curricula?.items[0]?.curriculum
              : null;
          instCRs.push({id: cr.id, name: cr.name, value: cr.name});
          return {
            id: cr.id,
            name: cr.name,

            value: cr.name,
            class: {...cr.class},
            curriculum,
            ...insertExtraData(cr)
          };
        });
        setClassRoomsList(classrooms);
        setInstClassRooms(instCRs);
        setClassRoomLoading(false);
      } else {
        // console.log('institution already selected');
      }
    } catch (err) {
      console.log('inst select, fetch classrooms err', err);
    }
  };

  const onClassRoomSelect = async (id: string, name: string, value: string) => {
    try {
      let sCR = selectedClassRoom;
      let cr = {id, name, value};
      setSelectedClassRoom(cr);
      if (!sCR || sCR.id !== cr.id) {
        let classroom = classRoomsList.filter((c) => c.id === cr.id)[0];
        // with classroom => class and curriculum are directly selected
        setSelectedClass(classroom.class);
        setSelectedCurriculum(classroom?.curriculum);
        // fetch students of the selected class. (This list of students will be used in the csv)
        const studentsEmails = await fetchStudents(classroom.class.id);
        if (classroom?.curriculum?.id) {
          setUnitsLoading(true);
          await fetchUnits(classroom?.curriculum?.id, studentsEmails);
        }
        // units (syllabus fetched)
      } else {
        console.log('classroom already selected');
      }
    } catch (err) {
      console.log('on class room select', err);
    }
  };

  const fetchUnits = async (curriculumId: string, studentsEmails: any) => {
    try {
      let curriculumUnits: any = await API.graphql(
        graphqlOperation(customQueries.listUnits, {
          filter: {curriculumId: {eq: curriculumId}}
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnits?.items || [];

      units = units.map((syl: any) => {
        let unitData = syl.unit;
        return {id: unitData.id, name: unitData.name, value: unitData.name};
      });
      // console.log('units', units)
      setUnits(units);
      let curriculumData: any = await API.graphql(
        graphqlOperation(customQueries.getCurriculumCheckpointsData, {
          id: curriculumId
        })
      );
      // console.log('curriculumData', curriculumData);
      let curricularCheckpoints =
        curriculumData?.data.getCurriculum.checkpoints?.items || [];
      let demographicsQues: any = [];
      let cCheckpoints: any = [];

      curricularCheckpoints.map((cc: any) => {
        cCheckpoints.push(cc.checkpoint.id);
        let questions = cc.checkpoint?.questions?.items || [];
        questions.map((q: any) => {
          demographicsQues.push({question: q.question, checkpointID: cc.checkpoint.id});
        });
      });
      setUnitsLoading(false);
      setDemographicsQuestions(demographicsQues);
      // here we have curricularCheckpoints and use syllabusLessonId 999999 to fetch list of question data
      getStudentsDemographicsQuestionsResponse(cCheckpoints, '999999', studentsEmails);
    } catch (err) {
      console.log('fetch units (syllabus) error', err);
    }
  };

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

  const onUnitSelect = (id: string, name: string, value: string) => {
    let unit = {id, name, value};
    setSelectedUnit(unit);
    fetchSurveys(unit.id);
  };

  const fetchStudents = async (classId: string) => {
    let classData: any = await API.graphql(
      graphqlOperation(customQueries.fetchClassStudents, {
        id: classId
      })
    );
    let students = classData?.data?.getClass?.students?.items || [];
    let classStudents = students.map((stu: any) => {
      return stu.student;
    });
    let studentsEmails = classStudents.map((stu: any) => stu.email);
    setClassStudents(classStudents);
    return studentsEmails;
  };

  const fetchSurveys = async (unitId: string) => {
    setSurveysLoading(true);
    try {
      let syllabusLessons: any = await API.graphql(
        graphqlOperation(customQueries.listSurveys, {
          id: unitId
        })
      );
      syllabusLessons = syllabusLessons?.data.getUniversalSyllabus?.lessons?.items || [];
      let surveys: any = [];
      let syllabusLessonsData: any = [];
      syllabusLessons.filter((les: any) => {
        if (les.lesson && les.lesson.type === 'survey') {
          syllabusLessonsData.push({
            syllabusLessonID: les.id,
            lessonID: les.lessonID,
            lesson: les.lesson
          });
          surveys.push({
            id: les.lesson.id,
            name: les.lesson.title,
            value: les.lesson.title
          });
          return les.lesson;
        }
      });

      // setSyllabusLessons(syllabusLessons)
      setSyllabusLessonsData(syllabusLessonsData);
      setSurveys(uniqBy(surveys, 'id'));
      setSurveysLoading(false);
    } catch (err) {
      console.error('fetch surveys list error', err);
    }
  };

  const onSurveySelect = async (id: string, name: string, value: string) => {
    let survey = {id, name, value};
    if (selectedSurvey) {
      clearCSVData();
    }
    setSCQAnswers([]);
    setSelectedsurvey(survey);
    await listQuestions(survey.id);
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
      let syllabusLes = syllabusLessonsData.filter((sl) => sl.lessonID === lessonId)[0];
      await getStudentsSurveyQuestionsResponse(lessonId, undefined, []);
      setIsCSVReady(true);
      setCsvGettingReady(false);
    } catch (err) {
      console.log('list questions error', err);
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

      // console.log(JSON.stringify(mappedPages));
      return mappedPages;
    }
  };

  // ##################################################################### //
  // ############################# TEMP CODE ############################# //
  // ##################################################################### //

  // const createNewSurveyDataRecord = async (surveyObj: any) => {
  //   try {
  //     let surveyData: any = await API.graphql(
  //       graphqlOperation(mutations.createUniversalSurveyStudentData, {
  //         input: {
  //           ...surveyObj,
  //         },
  //       })
  //     );
  //     console.log('surveyData', surveyData);
  //   } catch (err) {
  //     console.log('createNewSurveyDataRecord error', err);
  //   }
  // };

  // const adaptStudentDataToSurveyData = async (studentData: any[]) => {
  //   let studentDataAdapted = studentData.reduce(
  //     (acc: {[key: string]: any}, studentDataObj: any) => {
  //       let keyExists = acc[studentDataObj.studentID];

  //       if (keyExists) {
  //         return {
  //           ...acc,
  //           [studentDataObj.studentID]: {
  //             ...acc[studentDataObj.studentID],
  //             currentLocation: studentDataObj.currentLocation,
  //             lessonProgress: studentDataObj.lessonProgress,
  //             surveyData: [
  //               ...acc[studentDataObj.studentID].surveyData,
  //               ...studentDataObj.pageData,
  //             ],
  //           },
  //         };
  //       } else {
  //         return {
  //           ...acc,
  //           [studentDataObj.studentID]: {
  //             syllabusLessonID: studentDataObj.syllabusLessonID,
  //             lessonID: studentDataObj.lessonID,
  //             studentID: studentDataObj.studentID,
  //             studentAuthID: studentDataObj.studentAuthID,
  //             studentEmail: studentDataObj.studentEmail,
  //             roomID: studentDataObj.roomID,
  //             currentLocation: studentDataObj.currentLocation,
  //             lessonProgress: studentDataObj.lessonProgress,
  //             surveyData: [...studentDataObj.pageData],
  //           },
  //         };
  //       }
  //     },
  //     {}
  //   );
  //   console.log('studentDataAdapted', studentDataAdapted);

  //   if (studentDataAdapted && Object.keys(studentDataAdapted).length > 0) {
  //     let loopOverAdaptedData = Object.keys(studentDataAdapted).map(
  //       async (studentID: string) => {
  //         await createNewSurveyDataRecord(studentDataAdapted[studentID]);
  //       }
  //     );
  //     Promise.all(loopOverAdaptedData).then(() => {
  //       console.log('loopOverAdaptedData - done');
  //     });
  //   }
  // };

  // ##################################################################### //
  // ########################## END OF TEMP CODE ######################### //
  // ##################################################################### //

  const getStudentsSurveyQuestionsResponse = async (
    lessonId: String,
    nextToken?: string,
    outArray?: any[]
  ) => {
    setCsvGettingReady(true);
    let studsEmails = classStudents.map((stu: any) => stu.email);
    let universalSurveyStudentData: any = await API.graphql(
      graphqlOperation(queries.listUniversalSurveyStudentData, {
        nextToken: nextToken,
        filter: {
          lessonID: {eq: lessonId},
          ...createFilterToFetchSpecificItemsOnly(studsEmails, 'studentEmail')
        }
      })
    );
    let studentsAnswersSurveyQuestionsData =
      universalSurveyStudentData.data.listUniversalSurveyStudentData.items;
    let theNextToken =
      universalSurveyStudentData.data.listUniversalSurveyStudentData?.nextToken;

    /**
     * combination of last fetch results
     * && current fetch results
     */
    let combined: any = [...studentsAnswersSurveyQuestionsData, ...outArray];

    if (theNextToken) {
      combined = await getStudentsSurveyQuestionsResponse(
        lessonId,
        theNextToken,
        combined
      );
    }
    console.log('fetched from universalSurveyData');
    setSCQAnswers((prevState: any) => {
      return [...prevState, combined];
    });
    setCsvGettingReady(false);
    return;
  };

  // regex match double spaces and replace with single space
  const removeDoubleSpaces = (str: string) => {
    return str.replace(/\s{2,}/g, ' ');
  };

  // regex match double quotations and replace with single quotations
  const removeDoubleQuotes = (str: string) => {
    return str.replace(/\"/g, "'");
  };

  const pipeFn = (...fns: any[]) => (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);

  const cleanString = (str: string) => {
    return pipeFn(removeDoubleSpaces, removeDoubleQuotes)(str);
  };

  const getCSVReady = async () => {
    try {
      setCsvGettingReady(true);
      let students = classStudents;
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

      let data = students.map((stu: any) => {
        let surveyAnswerDates: any = [];
        let studentAnswers: any = {};
        let hasTakenSurvey = false;
        let universalSurveyStudentID = '';
        let demographicsDataID = '';

        SCQAnswers[0].map((answerArray: any) => {
          if (answerArray.studentID === stu.authId) {
            hasTakenSurvey = true;
            universalSurveyStudentID = answerArray.id;
            answerArray.surveyData.map((singleAnswer: any) => {
              if (qids.indexOf(singleAnswer.domID) >= 0) {
                surveyAnswerDates.push(answerArray.updatedAt);
                surveyDates.push(answerArray.updatedAt);
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
                      // cleanup here
                      studentAnswers[singleAnswer.domID] = cleanString(
                        selectedOption[0].text
                      );
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
        DCQAnswers.map((ans: any) => {
          if (ans.person.id === stu.id) {
            demographicsDataID = ans.id;
            ans.responseObject.map((resp: any) => {
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
      console.log('error', err);
    }
  };

  useEffect(() => {
    if (isCSVReady) {
      getCSVReady();
    }
  }, [isCSVReady]);

  const theadStyles =
    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
  const tdataStyles = 'px-6 py-4 whitespace-nowrap text-sm text-gray-800';

  const getTodayDate = () => {
    let today: any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    return today;
  };

  const getFormatedDate = (date: string) => {
    if (date !== '-') {
      return date.split(',')[0];
    } else {
      return '-';
    }
  };

  const Table = () => {
    return (
      <div className="flex flex-col">
        <div className="overflow-x-auto ">
          <div className="py-2 align-middle inline-block min-w-full ">
            <div className="flex flex-1 shadow inner_card overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" style={{width: '15%'}} className={theadStyles}>
                      Id
                    </th>
                    <th scope="col" style={{width: '20%'}} className={theadStyles}>
                      first name
                    </th>
                    <th scope="col" style={{width: '15%'}} className={theadStyles}>
                      last Name
                    </th>
                    <th scope="col" style={{width: '20%'}} className={theadStyles}>
                      Email
                    </th>
                    <th scope="col" style={{width: '20%'}} className={theadStyles}>
                      Taken Survey
                    </th>
                    <th scope="col" style={{width: '20%'}} className={theadStyles}>
                      Completed Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CSVData.map((listItem, idx) => {
                    return (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td style={{width: '15%'}} className={tdataStyles}>
                          {listItem.id}
                        </td>
                        <td style={{width: '20%'}} className={tdataStyles}>
                          {listItem.firstName}
                        </td>
                        <td style={{width: '15%'}} className={tdataStyles}>
                          {listItem.lastName}
                        </td>
                        <td style={{width: '20%'}} className={tdataStyles}>
                          {listItem.email}
                        </td>
                        <td style={{width: '20%'}} className={tdataStyles}>
                          {listItem.hasTakenSurvey ? 'Yes' : 'No'}
                        </td>
                        <td style={{width: '10%'}} className={tdataStyles}>
                          {getFormatedDate(listItem.last)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

  const isSuperAdmin = state.user.role === 'SUP';

  const [hoveringItem, setHoveringItem] = useState<{name?: string}>({});

  const currentSelectedClassroomData =
    hoveringItem &&
    hoveringItem?.name &&
    classRoomsList?.find((_c) => _c.name === hoveringItem?.name);

  const currentActiveUnit =
    currentSelectedClassroomData &&
    activeUnits.find((_d) => _d?.id === currentSelectedClassroomData?.activeSyllabus);

  const DataValue = ({
    title,
    content
  }: {
    title: string;
    content: string | React.ReactNode;
  }) => {
    return (
      <div className="w-auto flex mb-2 flex-col items-start justify-start">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-dark-gray font-medium text-left w-auto text-sm">{content}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col overflow-h-scroll w-full h-full px-8 py-4">
      <div className="mx-auto w-full">
        <div className="flex flex-row my-0 w-full py-0 mb-8 justify-between">
          <h3 className="text-lg leading-6 text-gray-600 w-auto">
            <SectionTitleV3 title={CsvDict[userLanguage]['TITLE']} />
          </h3>

          <div className="w-auto">
            <span className={`mr-0 float-right text-gray-600 text-right`}>
              <DateAndTime />
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-x-4">
        {isSuperAdmin && (
          <Selector
            loading={institutionsLoading}
            selectedItem={selectedInst ? selectedInst.name : ''}
            placeholder={CsvDict[userLanguage]['SELECT_INST']}
            list={institutions}
            onChange={(value, name, id) => onInstSelect(id, name, value)}
          />
        )}

        <div className="w-auto relative">
          <Selector
            dataCy="analytics-classroom"
            disabled={!selectedInst?.id}
            setHoveringItem={setHoveringItem}
            loading={classRoomLoading}
            selectedItem={selectedClassRoom ? selectedClassRoom.name : ''}
            placeholder="select classroom"
            list={instClassRooms}
            onChange={(value, name, id) => {
              setHoveringItem({});
              onClassRoomSelect(id, name, value);
            }}
          />
          {currentSelectedClassroomData && (
            <ClickAwayListener onClickAway={() => setHoveringItem({})}>
              <Transition
                style={{top: '0rem', bottom: '1.5rem', right: '-110%', zIndex: 999999}}
                className="hidden md:block cursor-pointer select-none  absolute right-1 text-black "
                show={Boolean(hoveringItem && hoveringItem.name)}>
                <div className="bg-white flex flex-col border-gray-200 rounded-xl  customShadow border-0 p-4  min-w-70 max-w-70 w-auto">
                  <DataValue
                    title={'Institution Name'}
                    content={currentSelectedClassroomData?.institutionName}
                  />
                  <DataValue
                    title={'Clasroom Name'}
                    content={currentSelectedClassroomData?.name}
                  />
                  <DataValue
                    title={'Status'}
                    content={
                      <p
                        className={`${
                          currentSelectedClassroomData.status === 'ACTIVE'
                            ? 'text-green-500'
                            : 'text-yellow-500'
                        } lowercase`}>
                        {currentSelectedClassroomData.status}
                      </p>
                    }
                  />
                  <DataValue
                    title={'Teacher'}
                    content={
                      <div className="flex items-center justify-center w-auto">
                        <span className="w-auto">
                          <img
                            src={currentSelectedClassroomData.teacher.image}
                            className="h-6 w-6 rounded-full"
                          />
                        </span>
                        <p className="w-auto ml-2">
                          {currentSelectedClassroomData.teacher.name}
                        </p>
                      </div>
                    }
                  />
                  <DataValue
                    title={'Course Name'}
                    content={currentSelectedClassroomData.courseName}
                  />
                  <DataValue
                    title={'Active Unit'}
                    content={currentActiveUnit?.name || 'None'}
                  />
                </div>
              </Transition>
            </ClickAwayListener>
          )}
        </div>

        <Selector
          dataCy="analytics-unit"
          loading={unitsLoading}
          selectedItem={selectedUnit ? selectedUnit.name : ''}
          placeholder="select unit"
          list={units}
          disabled={!selectedCurriculum}
          onChange={(value, name, id) => onUnitSelect(id, name, value)}
        />

        <Selector
          dataCy="analytics-survey"
          loading={surveysLoading}
          disabled={!selectedUnit}
          selectedItem={selectedSurvey ? selectedSurvey.name : ''}
          placeholder="select survey"
          list={surveys}
          onChange={(value, name, id) => onSurveySelect(id, name, value)}
        />

        <div className="w-auto md:gap-x-2 relative flex items-center">
          <button
            type="button"
            className={`col-end-5 ${
              isSuperAdmin ? 'mt-5' : ''
            } inline-flex justify-center h-full border-0 border-transparent text-sm leading-5 font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo transition duration-150 ease-in-out items-center`}
            style={{
              /* stylelint-disable */
              opacity: isCSVDownloadReady ? 1 : 0.5
            }}
            disabled={!isCSVDownloadReady}>
            <span className="w-auto mr-2">
              <BsDownload />
            </span>
            {isCSVDownloadReady ? (
              <CSVLink
                data={CSVData}
                className="w-auto"
                headers={CSVHeaders}
                filename={`${selectedClassRoom.name}_${
                  selectedSurvey.name
                }_${getTodayDate()}.csv`}>
                CSV
              </CSVLink>
            ) : (
              'CSV'
            )}
          </button>
          <button
            type="button"
            className={`col-end-5 ${
              isSuperAdmin ? 'mt-5' : ''
            } inline-flex justify-center h-full border-0 border-transparent text-sm leading-5 font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo transition duration-150 ease-in-out items-center`}
            style={{
              /* stylelint-disable */
              opacity: isCSVDownloadReady ? 1 : 0.5
            }}
            disabled={!isCSVDownloadReady}>
            <span className="w-auto mr-2">
              <BsDownload />
            </span>
            {lessonPDFData.length > 0 ? (
              <PDFDownloadLink
                className="w-auto"
                document={
                  <SurveyPDF lessonPDFData={lessonPDFData} clientKey={clientKey} />
                }
                fileName={`${selectedSurvey?.name}.pdf`}>
                {({loading}) => (loading ? 'Loading' : 'Survey PDF')}
              </PDFDownloadLink>
            ) : (
              'Survey PDF'
            )}
          </button>
        </div>
      </div>
      <div>
        <SectionTitleV3 title={'Survey results'} />
        {CSVData.length > 0 ? (
          <Table />
        ) : (
          <div className="bg-white flex justify-center items-center inner_card h-30 overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {csvGettingReady ? (
              <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="w-5/10">
                  <Loader color="rgba(107, 114, 128, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Populating data please wait...
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="w-5/10">
                  <p className="mt-2 text-center text-lg text-gray-500">
                    Select filters options to populate data
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {isCSVDownloadReady && (
        <div>
          <SectionTitleV3 fontSize="2xl" fontStyle="bold" title={'Statistics'} />
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6`}>
            {/* @Aman change the value:{value} */}
            <Card
              keyItem="Survey First"
              value={getFormatedDate(statistics.surveyFirst)}
            />
            <Card keyItem="Survey Last" value={getFormatedDate(statistics.surveyLast)} />
            <Card keyItem="Taken Survey" value={statistics.takenSurvey} />
            <Card keyItem="Not Taken Survey" value={statistics.notTakenSurvey} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Csv;
