import { GraphQLAPI as API, graphqlOperation } from "@aws-amplify/api-graphql";
import Buttons from "@components/Atoms/Buttons";
import Modal from "@components/Atoms/Modal";
import AnimatedContainer from "@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer";
import Table from "@components/Molecules/Table";
import { useGlobalContext } from "@contexts/GlobalContext";
import { listInstitutions, logError } from "@graphql/functions";
import { Transition } from "@headlessui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { getFormatedDate } from "@utilities/utils";
import { RoomStatus } from "API";
import Selector from "atoms/Form/Selector";
import SectionTitleV3 from "atoms/SectionTitleV3";
import * as customQueries from "customGraphql/customQueries";
import useDictionary from "customHooks/dictionary";
import useAuth from "customHooks/useAuth";
import * as queries from "graphql/queries";
import { orderBy, uniqBy } from "lodash";
import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { CSVLink } from "react-csv";
import { BsDownload } from "react-icons/bs";
import { RiErrorWarningLine } from "react-icons/ri";
import { getImageFromS3Static } from "utilities/services";
import { createFilterToFetchSpecificItemsOnly } from "utilities/strings";
import SurveyPDF from "./SurveyPDF";
const reg = /[,.]/gi;

export const DataValue = ({
  title,
  content,
  withBg = false,
  className = "",
}: {
  title: string;
  className?: string;
  content: string | React.ReactNode;
  withBg?: boolean;
}) => {
  return (
    <div
      className={` w-auto flex mb-2 flex-col items-start justify-start ${
        withBg ? "bg-white rounded-md px-4 py-2" : ""
      } ${className}`}
    >
      <span className="text-sm mb-1 text-gray-500">{title}</span>
      <span className="text-dark-gray font-medium text-left w-auto text-sm">
        {content}
      </span>
    </div>
  );
};

export const insertExtraDataForClassroom = (cr: any) => {
  const teacherImage = getImageFromS3Static(cr?.teacher?.image);
  return {
    institutionName: cr?.institution?.name || "",
    teacher: {
      name: `${cr?.teacher?.firstName} ${cr?.teacher?.lastName}`,
      image: teacherImage,
    },
    courseName: cr?.curricula?.items[0]?.curriculum?.name || "",
    status: cr?.status || RoomStatus.ACTIVE,
    activeSyllabus: cr?.activeSyllabus,
  };
};

export const removeDuplicates = (array: any[]) => {
  let ids: any[] = [];

  let result: any[] = [];
  array.forEach((item) => {
    if (!ids.includes(item?.id)) {
      result.push(item);
      ids.push(item.id);
    }
  });
  return result;
};

const Card = ({ keyItem, value }: any) => {
  return (
    <div className="flex relative bg-white rounded-lg  justify-center items-center h-20 shadow inner_card">
      <p className={`text-sm text-semibold text-gray-500 w-auto mr-2 text-md`}>
        {keyItem}:
      </p>
      <p className={`text-dark-gray font-medium text-center w-auto text-md`}>
        {value}
      </p>
    </div>
  );
};

const Csv = () => {
  const { clientKey, userLanguage } = useGlobalContext();
  const { CsvDict } = useDictionary();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectedInst, setSelectedInst] = useState<any>(null);

  const [instClassRooms, setInstClassRooms] = useState<any[]>([]);

  const [classRoomsList, setClassRoomsList] = useState<any[]>([]);

  const [selectedClassRoom, setSelectedClassRoom] = useState<any>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<any>(null);

  const [_, setSelectedClass] = useState<any | null>(null);

  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const [surveys, setSurveys] = useState<any[]>([]);
  const [_1, setSyllabusLessonsData] = useState<any[]>([]);
  const [selectedSurvey, setSelectedsurvey] = useState<any>(null);

  const [surveyQuestions, setSurveyQuestions] = useState<any[]>([]);
  const [demographicsQuestions, setDemographicsQuestions] = useState<any[]>([]);

  const [classStudents, setClassStudents] = useState<any[]>([]);

  const [isCSVReady, setIsCSVReady] = useState(false);
  const [isCSVDownloadReady, setIsCSVDownloadReady] = useState(false);
  const [CSVHeaders, setCSVHeaders] = useState<any[]>([]);

  const [CSVData, setCSVData] = useState<any[]>([]);
  const [lessonPDFData, setLessonPDFData] = useState<any[]>([]);

  const [SCQAnswers, setSCQAnswers] = useState<any[]>([]);
  const [DCQAnswers, setDCQAnswers] = useState<any[]>([]);

  const [institutionsLoading] = useState(false);
  const [classRoomLoading, setClassRoomLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [surveysLoading, setSurveysLoading] = useState(false);
  const [_3, setCsvGettingReady] = useState(false);
  const [statistics, setStatistics] = useState({
    surveyFirst: "-",
    surveyLast: "-",
    takenSurvey: 0,
    notTakenSurvey: 0,
  });

  // methods to clear state data
  const resetInstitution = () => {
    setInstClassRooms([]);

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

  const loadInstitution = async () => {
    try {
      const resp = await listInstitutions(authId, email);
      if (resp && resp.length > 0) {
        setInstitutions(resp);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // starting
  useEffect(() => {
    loadInstitution();
  }, []);

  const { authId, email } = useAuth();

  const onInstSelect = async (id: string, name: string, value: string) => {
    setClassRoomLoading(true);
    try {
      let sInst = selectedInst;
      let inst = { id, name, value };
      setSelectedInst(inst);
      if (!sInst || sInst.id !== inst.id) {
        resetInstitution();
        let instCRs: any = [];
        // fetch inst classrooms.
        let classrooms: any = await API.graphql(
          graphqlOperation(customQueries.getInstClassRooms, {
            id: inst.id,
          })
        );
        classrooms = classrooms?.data.getInstitution?.rooms?.items || [];
        classrooms = classrooms.map((cr: any) => {
          let curriculum =
            cr.curricula?.items && Array.isArray(cr.curricula?.items)
              ? cr.curricula?.items[0]?.curriculum
              : null;
          !instCRs.find((d: any) => d.name === cr.name) &&
            instCRs.push({ id: cr.id, name: cr.name, value: cr.name });
          return {
            id: cr.id,
            name: cr.name,

            value: cr.name,
            class: { ...cr.class },
            curriculum,
            ...insertExtraDataForClassroom(cr),
          };
        });
        setClassRoomsList(classrooms);
        setInstClassRooms(removeDuplicates(instCRs));
        setClassRoomLoading(false);
      } else {
        // console.log('institution already selected');
      }
    } catch (err) {
      console.log("inst select, fetch classrooms err", err);
    }
  };

  const onClassRoomSelect = async (id: string, name: string, value: string) => {
    try {
      let sCR = selectedClassRoom;
      let cr = { id, name, value };
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
        console.log("classroom already selected");
      }
    } catch (err) {
      console.log("on class room select", err);
    }
  };

  const fetchUnits = async (curriculumId: string, studentsEmails: any) => {
    try {
      let curriculumUnits: any = await API.graphql(
        graphqlOperation(customQueries.listUnits, {
          filter: { curriculumId: { eq: curriculumId } },
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnits?.items || [];
      units = units.filter((d: any) => d.unit !== null);

      units = units.map((syl: any) => {
        let unitData = syl.unit;
        return { id: unitData.id, name: unitData.name, value: unitData.name };
      });
      // console.log('units', units)
      setUnits(units);
      let curriculumData: any = await API.graphql(
        graphqlOperation(customQueries.getCurriculumCheckpointsData, {
          id: curriculumId,
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
          demographicsQues.push({
            question: q.question,
            checkpointID: cc.checkpoint.id,
          });
        });
      });
      setUnitsLoading(false);
      setDemographicsQuestions(demographicsQues);
      // here we have curricularCheckpoints and use syllabusLessonId 999999 to fetch list of question data
      getStudentsDemographicsQuestionsResponse(
        cCheckpoints,
        "999999",
        studentsEmails
      );
    } catch (err) {
      console.log("fetch units (syllabus) error", err);
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
          ...createFilterToFetchSpecificItemsOnly(
            checkpointIds,
            "checkpointID"
          ),
          syllabusLessonID: { eq: syllabusLessonID },
          ...createFilterToFetchSpecificItemsOnly(studentsEmails, "email"),
        },
        limit: 1000,
      })
    );
    let studentsAnswersDemographicsCheckpointsQuestions =
      curriculumData?.data?.listQuestionData?.items || [];
    setDCQAnswers(studentsAnswersDemographicsCheckpointsQuestions);
  };

  const onUnitSelect = (id: string, name: string, value: string) => {
    let unit = { id, name, value };
    setSelectedUnit(unit);
    fetchSurveys(unit.id);
  };

  const fetchStudents = async (classId: string) => {
    let classData: any = await API.graphql(
      graphqlOperation(customQueries.fetchClassStudents, {
        id: classId,
      })
    );
    let students = classData?.data?.getClass?.students?.items || [];
    let classStudents = students.map((stu: any) => stu.student);

    let uniqIds: any[] = [];

    classStudents = classStudents.filter((stu: any) => {
      if (!uniqIds.includes(stu.authId)) {
        uniqIds.push(stu.authId);
        return true;
      } else {
        return false;
      }
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
          id: unitId,
        })
      );
      syllabusLessons =
        syllabusLessons?.data.getUniversalSyllabus?.lessons?.items || [];
      let surveys: any = [];
      let syllabusLessonsData: any = [];
      syllabusLessons.filter((les: any) => {
        if (les.lesson && les.lesson.type === "survey") {
          syllabusLessonsData.push({
            syllabusLessonID: les.id,
            lessonID: les.lessonID,
            lesson: les.lesson,
          });
          surveys.push({
            id: les.lesson.id,
            name: les.lesson.title,
            value: les.lesson.title,
          });
          return les.lesson;
        }
      });

      // setSyllabusLessons(syllabusLessons)
      setSyllabusLessonsData(syllabusLessonsData);
      setSurveys(uniqBy(surveys, "id"));
      setSurveysLoading(false);
    } catch (err) {
      console.error("fetch surveys list error", err);
    }
  };

  const onSurveySelect = async (id: string, name: string, value: string) => {
    let survey = { id, name, value };
    if (selectedSurvey) {
      clearCSVData();
    }
    setSCQAnswers([]);
    // getReason();

    setSelectedsurvey(survey);
    await listQuestions(survey.id);
  };

  const listQuestions = async (lessonId: string) => {
    try {
      setCsvGettingReady(true);
      let universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId,
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
                options: item.options,
              },
            });
          });
        });
      }

      setSurveyQuestions(questions);

      let response = await getStudentsSurveyQuestionsResponse(
        lessonId,
        undefined,
        []
      );

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
    } catch (err) {
      logError(err, { authId, email }, "Csv @listQuestions");
      console.error("list questions error", err);
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
              if (pagePart.hasOwnProperty("partContent")) {
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
                        (
                          subPartAcc: { pgInput: any[] },
                          partContentSub: any
                        ) => {
                          return {
                            ...subPartAcc,

                            pgInput: [
                              ...subPartAcc.pgInput,
                              {
                                questionID: partContentSub.id,
                                type: partContentSub.type,
                                questionString: partContentSub.label,
                                options: partContentSub.options,
                              },
                            ],
                          };
                        },
                        { pgInput: [] }
                      );

                      return {
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          ...formSubInputs.pgInput,
                        ],
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
                            options: partContent.options,
                          },
                        ],
                      };
                    } else {
                      return partInputAcc;
                    }
                  },
                  { pageInputAcc: [] }
                );

                return {
                  pageInputAcc: [
                    ...pageInputsAcc.pageInputAcc,
                    ...partInputs.pageInputAcc,
                  ],
                };
              } else {
                return pageInputsAcc;
              }
            },
            { pageInputAcc: [] }
          );

          return {
            questionList: [
              ...inputs.questionList,
              reducedPageInputs.pageInputAcc,
            ],
          };
        },

        { questionList: [] }
      );

      // console.log(JSON.stringify(mappedPages));
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
    let studsEmails = classStudents.map((stu: any) => stu.email);
    let universalSurveyStudentData: any = await API.graphql(
      graphqlOperation(queries.listUniversalSurveyStudentData, {
        nextToken: nextToken,
        limit: 200,
        filter: {
          lessonID: { eq: lessonId },
          ...createFilterToFetchSpecificItemsOnly(studsEmails, "studentEmail"),
        },
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
          lessonID: { eq: lessonId },
          ...createFilterToFetchSpecificItemsOnly(studsEmails, "studentEmail"),
        },
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

  // regex match double spaces and replace with single space
  const removeDoubleSpaces = (str: string) => {
    if (!str) return "";
    return str.replace(/\s{2,}/g, " ");
  };

  // regex match double quotations and replace with single quotations
  const removeDoubleQuotes = (str: string) => {
    if (!str) return "";
    return str.replace(/\"/g, "'");
  };

  const pipeFn =
    (...fns: any[]) =>
    (arg: any) =>
      fns.reduce((acc, fn) => fn(acc), arg);

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
          key: `${ques.question.id}`,
        };
      });
      /* Enable this code if demographics questions */

      let demographicsQuestionHeaders = demographicsQuestions.map(
        (ques: any) => {
          qids.push(ques.question.id);
          return {
            label: `${ques.question.question}-d-${ques.question.id} (demographic)`,
            key: `${ques.question.id}`,
          };
        }
      );

      setCSVHeaders([
        { label: "AuthId", key: "authId" },
        { label: "Email", key: "email" },
        { label: "First Name", key: "firstName" },
        { label: "Last Name", key: "lastName" },
        { label: "Institute", key: "institute" },
        { label: "Curriculum", key: "curriculum" },
        { label: "Unit", key: "unit" },
        { label: "UnitID", key: "unitId" },
        { label: "Classroom", key: "classroom" },
        { label: "Survey name", key: "surveyName" },
        { label: "SurveyID", key: "surveyId" },
        { label: "UniversalSurveyStudentID", key: "universalSurveyStudentID" },
        { label: "DemographicsDataID", key: "demographicsDataID" },
        ...demographicsQuestionHeaders, // Enable this line for demographics question
        ...surveyQuestionHeaders,
      ]);

      let data = students.map((stu: any) => {
        let surveyAnswerDates: any = [];
        let studentAnswers: any = {};
        let hasTakenSurvey = false;
        let universalSurveyStudentID = "";
        let demographicsDataID = "";

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
                    let selectedOption = surveyQuestionOptions[
                      singleAnswer.domID
                    ].filter((option: any) => {
                      return option.id === singleAnswer.input[0];
                    });
                    if (
                      Array.isArray(selectedOption) &&
                      selectedOption.length
                    ) {
                      // cleanup here
                      studentAnswers[singleAnswer.domID] = cleanString(
                        selectedOption[0].text
                      );
                    } else {
                      studentAnswers[singleAnswer.domID] = "";
                    }
                  } else {
                    studentAnswers[singleAnswer.domID] = "";
                  }
                } else {
                  // cleanup here
                  studentAnswers[singleAnswer.domID] =
                    Array.isArray(singleAnswer.input) &&
                    singleAnswer.input.length
                      ? cleanString(singleAnswer.input[0])
                      : "";
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
                    : "";
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
            : "Not-taken-yet",
          demographicsDataID: demographicsDataID
            ? demographicsDataID
            : "No-demographics-data",
          ...studentAnswers,
          hasTakenSurvey,
          first:
            (surveyAnswerDates[surveyAnswerDates.length - 1] &&
              new Date(
                surveyAnswerDates[surveyAnswerDates.length - 1]
              ).toLocaleString("en-US")) ||
            "-",
          last:
            (surveyAnswerDates[0] &&
              new Date(surveyAnswerDates[0]).toLocaleString("en-US")) ||
            "-",
        };
      });

      surveyDates = surveyDates.sort(
        // @ts-ignore
        (a: any, b: any) => new Date(b) - new Date(a)
      );
      setCSVData(orderBy(data, ["firstName"], ["asc"]));
      setStatistics({
        surveyFirst:
          (surveyDates[surveyDates.length - 1] &&
            new Date(surveyDates[surveyDates.length - 1]).toLocaleString(
              "en-US"
            )) ||
          "-",
        surveyLast:
          (surveyDates[0] &&
            new Date(surveyDates[0]).toLocaleString("en-US")) ||
          "-",
        takenSurvey,
        notTakenSurvey,
      });
      setIsCSVDownloadReady(true);
      setCsvGettingReady(false);
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    if (isCSVReady) {
      getCSVReady();
    }
  }, [isCSVReady]);

  const getTodayDate = () => {
    let today: any = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    return today;
  };

  const [hoveringItem, setHoveringItem] = useState<{ name?: string }>({});

  const currentSelectedClassroomData =
    hoveringItem &&
    hoveringItem?.name &&
    classRoomsList?.find((_c) => _c.name === hoveringItem?.name);

  useEffect(() => {
    const el = document?.getElementById("csv-download-button");

    el?.addEventListener("click", () => {
      setShowWarnModal(true);
    });
  }, []);

  const [showWarnModal, setShowWarnModal] = useState(false);

  const getSeparatedHeaders = (arr: any[]) => {
    if (arr && arr.length > 0) {
      let result = arr.map((i) => {
        return {
          ...i,
          label: i.label.replaceAll(reg, ""),
        };
      });

      return result;
    }
    return arr;
  };

  const mappedHeaders = getSeparatedHeaders(CSVHeaders);

  const dataList = CSVData.map((listItem, idx) => ({
    no: idx + 1,
    id: listItem.id,
    name: `${listItem.firstName} ${listItem.lastName}`,

    email: listItem.email,
    takenSurvey: listItem?.hasTakenSurvey ? "Yes" : "No",
    completedDate: getFormatedDate(listItem?.last),
  }));

  const tableConfig = {
    headers: ["No", "Id", "Name", "Email", "Completed Date", "Taken Survey"],
    dataList,
    config: {
      isFirstIndex: true,
      dataList: {
        loading: !isCSVDownloadReady || !isCSVReady,

        emptyText: "no data found",
        customWidth: {
          id: "w-72",
          takenSurvey: "w-48",
          completedDate: "w-48",
          email: "w-72 break-all",
        },
        maxHeight: "max-h-196",
      },
    },
  };

  return (
    <>
      {showWarnModal && (
        <Modal
          closeAction={() => setShowWarnModal(false)}
          closeOnBackdrop
          showFooter={false}
          showHeader={true}
          title="Csv Download"
        >
          <div className="flex flex-col justify-center items-center gap-y-4">
            <RiErrorWarningLine
              fontSize={"4rem"}
              className="text-yellow-500 animate-y"
            />
            <hr />
            <p className="text-gray-600 pt-0 p-4 text-center">
              If you will be using this file to upload results to the app,
              please do not change column header or tab names
            </p>
          </div>
        </Modal>
      )}
      <div className="flex flex-col overflow-h-auto w-full h-full px-8 py-4">
        <div className="mx-auto w-full">
          <div className="flex flex-row my-0  w-full py-0 mb-4 justify-between">
            <div className="">
              <SectionTitleV3
                textWidth="lg:w-1/5 2xl:w-1/4"
                withButton={
                  <div className="grid grid-cols-2 xl:grid-cols-4  gap-4">
                    {/* {isSuperAdmin && ( */}
                    <Selector
                      loading={institutionsLoading}
                      width="xl:w-64"
                      selectedItem={selectedInst ? selectedInst.name : ""}
                      placeholder={CsvDict[userLanguage]["SELECT_INST"]}
                      list={institutions}
                      onChange={(value, name, id) =>
                        onInstSelect(id, name, value)
                      }
                    />
                    {/* )} */}

                    <div className="w-auto relative">
                      <Selector
                        dataCy="analytics-classroom"
                        width="xl:w-64"
                        disabled={!selectedInst?.id}
                        setHoveringItem={setHoveringItem}
                        loading={classRoomLoading}
                        selectedItem={
                          selectedClassRoom ? selectedClassRoom.name : ""
                        }
                        placeholder="select classroom"
                        list={instClassRooms}
                        onChange={(value, name, id) => {
                          setHoveringItem({});
                          onClassRoomSelect(id, name, value);
                        }}
                      />
                      {currentSelectedClassroomData && (
                        <ClickAwayListener
                          onClickAway={() => setHoveringItem({})}
                        >
                          <Transition
                            style={{
                              top: "0rem",
                              bottom: "1.5rem",
                              right: "-110%",
                              zIndex: 999999,
                            }}
                            className="hidden md:block cursor-pointer select-none  absolute right-1 text-black "
                            show={Boolean(hoveringItem && hoveringItem.name)}
                          >
                            <div className="bg-white flex flex-col border-gray-200 rounded-xl  customShadow border-0 p-4  min-w-70 max-w-70 w-auto">
                              <DataValue
                                title={"Institution Name"}
                                content={
                                  currentSelectedClassroomData?.institutionName ||
                                  selectedInst?.name ||
                                  "--"
                                }
                              />
                              <DataValue
                                title={"Clasroom Name"}
                                content={
                                  currentSelectedClassroomData?.name || "--"
                                }
                              />
                              <DataValue
                                title={"Status"}
                                content={
                                  <p
                                    className={`${
                                      currentSelectedClassroomData.status ===
                                      "ACTIVE"
                                        ? "text-green-500"
                                        : "text-yellow-500"
                                    } lowercase`}
                                  >
                                    {currentSelectedClassroomData.status ||
                                      "--"}
                                  </p>
                                }
                              />
                              <DataValue
                                title={"Teacher"}
                                content={
                                  <div className="flex items-center justify-center w-auto">
                                    <span className="w-auto">
                                      {currentSelectedClassroomData.teacher
                                        .image ? (
                                        <img
                                          src={
                                            currentSelectedClassroomData.teacher
                                              .image
                                          }
                                          className="h-6 w-6 rounded-full"
                                        />
                                      ) : (
                                        <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                                      )}
                                    </span>
                                    <p className="w-auto ml-2">
                                      {
                                        currentSelectedClassroomData.teacher
                                          .name
                                      }
                                    </p>
                                  </div>
                                }
                              />
                              <DataValue
                                title={"Course Name"}
                                content={
                                  currentSelectedClassroomData.courseName ||
                                  "--"
                                }
                              />
                              {/* <DataValue
                                title={"Active Unit"}
                                content={currentActiveUnit?.name || "--"}
                              /> */}
                            </div>
                          </Transition>
                        </ClickAwayListener>
                      )}
                    </div>

                    <Selector
                      dataCy="analytics-unit"
                      loading={unitsLoading}
                      selectedItem={selectedUnit ? selectedUnit.name : ""}
                      placeholder="select unit"
                      width="xl:w-64"
                      list={units}
                      disabled={!selectedCurriculum}
                      onChange={(value, name, id) =>
                        onUnitSelect(id, name, value)
                      }
                    />

                    <Selector
                      dataCy="analytics-survey"
                      direction="left"
                      width="xl:w-64"
                      loading={surveysLoading}
                      disabled={!selectedUnit}
                      selectedItem={selectedSurvey ? selectedSurvey.name : ""}
                      placeholder="select survey"
                      list={surveys}
                      onChange={(value, name, id) =>
                        onSurveySelect(id, name, value)
                      }
                    />
                  </div>
                }
                title={CsvDict[userLanguage]["TITLE"]}
              />
            </div>
          </div>
        </div>

        <div className="w-auto  border-t-0 border-b-0 border-gray-400 border-dashed py-4 justify-between xl:justify-start md:gap-x-4 relative flex items-center">
          <Buttons
            disabled={!isCSVDownloadReady && lessonPDFData.length === 0}
            Icon={BsDownload}
            size="small"
            btnClass="px-6"
            insideElement={
              <PDFDownloadLink
                className="w-auto ml-2"
                document={
                  <SurveyPDF
                    lessonPDFData={lessonPDFData}
                    clientKey={clientKey}
                  />
                }
                fileName={`${selectedSurvey?.name}.pdf`}
              >
                Download PDF Survey
              </PDFDownloadLink>
            }
          />

          <Buttons
            disabled={!isCSVDownloadReady}
            Icon={BsDownload}
            size="small"
            btnClass="px-6"
            insideElement={
              <CSVLink
                data={CSVData}
                className="w-auto ml-2"
                id="csv-download-button"
                headers={mappedHeaders}
                filename={`${selectedClassRoom?.name}_${
                  selectedSurvey?.name
                }_${getTodayDate()}.csv`}
              >
                Download Survey Results
              </CSVLink>
            }
          />
        </div>

        <div>
          <div className="w-auto my-4">
            <SectionTitleV3 title={"Survey Results"} />
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
            <div>
              <div className="w-auto my-4">
                <SectionTitleV3 title={"Statistics"} />
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
                <Card
                  keyItem="Not Taken Survey"
                  value={statistics.notTakenSurvey}
                />
              </div>
            </div>
          )}
        </AnimatedContainer>
      </div>
    </>
  );
};

export default Csv;
