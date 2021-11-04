import React, {useEffect, useState, useContext} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as customQueries from '../../../customGraphql/customQueries';
import * as queries from '@graphql/queries';
import Selector from '../../Atoms/Form/Selector';
import {createFilterToFetchSpecificItemsOnly} from '../../../utilities/strings';
import {CSVLink} from 'react-csv';
import DateAndTime from '../DateAndTime/DateAndTime';
import {getAsset} from '../../../assets';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import useDictionary from '../../../customHooks/dictionary';
import {orderBy, uniqBy} from 'lodash';

interface ICsvProps {
  institutionId?: string;
}

const Csv = ({institutionId}: ICsvProps) => {
  const {state, theme, dispatch, clientKey, userLanguage} = useContext(GlobalContext);
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
    notTakenSurvey: 0,
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
    setInstitutionsLoading(true);
    let institutions: any = await API.graphql(
      graphqlOperation(customQueries.getInstitutionsList)
    );
    institutions = institutions?.data.listInstitutions?.items || [];
    institutions = institutions.map((inst: any) => {
      return {
        id: inst.id,
        name: inst.name,
        value: inst.name,
      };
    });
    setInstitutions(institutions);
    setInstitutionsLoading(false);
  };

  const getBasicInstitutionInfo = async (institutionId: string) => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getInstitutionBasicInfo, {
          id: institutionId,
        })
      );
      setSelectedInst({
        id: institutionId,
        name: result?.data?.getInstitution.name,
        value: result?.data?.getInstitution.name,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (institutionId) {
      getBasicInstitutionInfo(institutionId);
      fetchClassRooms();
    }
  }, [institutionId]);

  const fetchClassRooms = async () => {
    setClassRoomLoading(true);
    let instCRs: any = [];

    let classrooms: any = await API.graphql(
      graphqlOperation(customQueries.getInstClassRooms, {
        id: institutionId,
      })
    );
    classrooms = classrooms?.data.getInstitution?.rooms?.items || [];
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
      };
    });
    setClassRoomsList(classrooms);
    setInstClassRooms(instCRs);
    setClassRoomLoading(false);
  };

  // const onInstSelect = async (id: string, name: string, value: string) => {
  //   setClassRoomLoading(true);
  //   try {
  //     let sInst = selectedInst;
  //     let inst = {id, name, value};
  //     setSelectedInst(inst);
  //     if (!sInst || sInst.id !== inst.id) {
  //       resetInstitution();
  //       let instCRs: any = [];
  //       // fetch inst classrooms.
  //       let classrooms: any = await API.graphql(
  //         graphqlOperation(customQueries.getInstClassRooms, {
  //           id: inst.id,
  //         })
  //       );
  //       classrooms = classrooms?.data.getInstitution?.rooms?.items || [];
  //       classrooms = classrooms.map((cr: any) => {
  //         let curriculum =
  //           cr.curricula?.items && Array.isArray(cr.curricula?.items)
  //             ? cr.curricula?.items[0].curriculum
  //             : null;
  //         instCRs.push({id: cr.id, name: cr.name, value: cr.name});
  //         return {
  //           id: cr.id,
  //           name: cr.name,
  //           value: cr.name,
  //           class: {...cr.class},
  //           curriculum,
  //         };
  //       });
  //       setClassRoomsList(classrooms);
  //       setInstClassRooms(instCRs);
  //       setClassRoomLoading(false);
  //     } else {
  //       // console.log('institution already selected');
  //     }
  //   } catch (err) {
  //     console.log('inst select, fetch classrooms err', err);
  //   }
  // };

  const onClassRoomSelect = async (id: string, name: string, value: string) => {
    try {
      let sCR = selectedClassRoom;
      let cr = {id, name, value};
      setSelectedClassRoom(cr);
      if (!sCR || sCR.id !== cr.id) {
        let classroom = classRoomsList.filter((c) => c.id === cr.id)[0];
        // with classroom => class and curriculum are directly selected
        setSelectedClass(classroom.class);
        setSelectedCurriculum(classroom.curriculum);
        // fetch students of the selected class. (This list of students will be used in the csv)
        setUnitsLoading(true);
        const studentsEmails = await fetchStudents(classroom.class.id);
        await fetchUnits(classroom.curriculum.id, studentsEmails);
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
          id: curriculumId,
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnitss?.items || [];
      units = units.map((syl: any) => {
        let unitData = syl.unit;
        return {id: unitData.id, name: unitData.name, value: unitData.name};
      });
      // console.log('units', units)
      setUnits(units);
      let curriculumData: any = await API.graphql(
        graphqlOperation(customQueries.getCurriculumCheckpointsData, {
          id: curriculumId,
        })
      );
      // console.log('curriculumData', curriculumData)
      let curricularCheckpoints =
        curriculumData?.data.getCurriculum.checkpoints?.items || [];
      let demographicsQues: any = [];
      let cCheckpoints: any = [];
      // console.log('curricularCheckpoints', curricularCheckpoints)
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
          ...createFilterToFetchSpecificItemsOnly(studentsEmails, 'email'),
        },
        limit: 1000,
      })
    );
    let studentsAnswersDemographicsCheckpointsQuestions =
      curriculumData?.data?.listQuestionDatas?.items || [];
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
        id: classId,
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
          id: unitId,
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
      setSurveys(uniqBy(surveys, 'id'));
      setSurveysLoading(false);
    } catch (err) {
      console.log('fetch surveys list error', err);
    }
  };

  const onSurveySelect = async (id: string, name: string, value: string) => {
    let survey = {id, name, value};
    if (selectedSurvey) {
      clearCSVData();
    }
    setSelectedsurvey(survey);
    await listQuestions(survey.id);
  };

  const listQuestions = async (lessonId: string) => {
    try {
      let universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId,
        })
      );
      let lessonObject = universalLesson.data.getUniversalLesson;
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
      let syllabusLes = syllabusLessonsData.filter((sl) => sl.lessonID === lessonId)[0];
      await getStudentsSurveyQuestionsResponse(lessonId, undefined, []);
      setIsCSVReady(true);
    } catch (err) {
      console.log('list questions error', err);
    }
  };

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
                                options: partContentSub.options,
                              },
                            ],
                          };
                        },
                        {pgInput: []}
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
                  {pageInputAcc: []}
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
            {pageInputAcc: []}
          );

          return {
            questionList: [...inputs.questionList, reducedPageInputs.pageInputAcc],
          };
        },

        {questionList: []}
      );

      // console.log(JSON.stringify(mappedPages));
      return mappedPages;
    }
  };

  const getStudentsSurveyQuestionsResponse = async (
    lessonId: String,
    nextToken?: string,
    outArray?: any[]
  ) => {
    let studsEmails = classStudents.map((stu: any) => stu.email);
    let universalSurveyStudentData: any = await API.graphql(
      graphqlOperation(queries.listUniversalSurveyStudentDatas, {
        nextToken: nextToken,
        filter: {
          lessonID: {eq: lessonId},
          ...createFilterToFetchSpecificItemsOnly(studsEmails, 'studentEmail'),
        },
      })
    );
    let studentsAnswersSurveyQuestionsData =
      universalSurveyStudentData.data.listUniversalSurveyStudentDatas.items;
    let theNextToken =
      universalSurveyStudentData.data.listUniversalSurveyStudentDatas?.nextToken;

    /**
     * combination of last fetch results
     * && current fetch results
     */
    let combined = [...studentsAnswersSurveyQuestionsData, ...outArray];

    // console.log('combined - - - -', combined);

    if (theNextToken) {
      getStudentsSurveyQuestionsResponse(lessonId, theNextToken, combined);
    } else {
      console.log('fetched from universalSurveyData');
      setSCQAnswers(combined);
    }

    return;
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
        return {label: `${ques.question.question}`, key: `${ques.question.id}`};
      });

      /* Enable this code if demographics questions */

      let demographicsQuestionHeaders = demographicsQuestions.map((ques: any) => {
        qids.push(ques.question.id);
        return {
          label: `${ques.question.question} (demographic)`,
          key: `${ques.question.id}`,
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
        {label: 'Classroom', key: 'classroom'},
        {label: 'Survey name', key: 'surveyName'},
        ...demographicsQuestionHeaders, // Enable this line for demographics question
        ...surveyQuestionHeaders,
      ]);

      let data = students.map((stu: any) => {
        let surveyAnswerDates: any = [];
        let studentAnswers: any = {};
        let hasTakenSurvey = false;

        SCQAnswers.map((ans: any) => {
          if (ans.studentID === stu.authId) {
            hasTakenSurvey = true;
            ans.surveyData.map((page: any) => {
              if (qids.indexOf(page.domID) >= 0) {
                surveyAnswerDates.push(ans.updatedAt);
                surveyDates.push(ans.updatedAt);
                if (
                  surveyQuestionOptions[page.domID] &&
                  Array.isArray(surveyQuestionOptions[page.domID]) &&
                  surveyQuestionOptions[page.domID].length
                ) {
                  if (
                    Array.isArray(page.input) &&
                    page.input.length &&
                    page.input[0].length
                  ) {
                    let selectedOption = surveyQuestionOptions[page.domID].filter(
                      (option: any) => {
                        return option.id === page.input[0];
                      }
                    );
                    if (Array.isArray(selectedOption) && selectedOption.length) {
                      studentAnswers[page.domID] = selectedOption[0].text;
                    } else {
                      studentAnswers[page.domID] = '';
                    }
                  } else {
                    studentAnswers[page.domID] = '';
                  }
                } else {
                  studentAnswers[page.domID] =
                    Array.isArray(page.input) && page.input.length ? page.input[0] : '';
                }
              }
            });
            // ans.responseObject.map((resp: any) => {
            //   if (qids.indexOf(resp.qid) >= 0) {
            //     surveyAnswerDates.push(ans.updatedAt);
            //     surveyDates.push(ans.updatedAt)
            //     studentAnswers[resp.qid] =
            //       Array.isArray(resp.response) && resp.response.length
            //         ? resp.response[0]
            //         : '';
            //   }
            // });
          }
        });

        /* Enable this code if demographics questions */
        DCQAnswers.map((ans: any) => {
          if (ans.person.id === stu.id) {
            ans.responseObject.map((resp: any) => {
              if (qids.indexOf(resp.qid) >= 0) {
                studentAnswers[resp.qid] =
                  Array.isArray(resp.response) && resp.response.length
                    ? resp.response[0]
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
          classroom: selectedClassRoom.name,
          surveyName: selectedSurvey.name,
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
            '-',
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
        notTakenSurvey,
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

  const themeColor = getAsset(clientKey, 'themeClassName');

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
      <div className="flex flex-col px-8">
        <div className="overflow-x-auto ">
          <div className="py-2 align-middle inline-block min-w-full ">
            <div className="shadow inner_card overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
                  {CSVData.map((listItem, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const fieldClass = 'p-3 flex justify-center items-center w-full';

  const Card = ({keyItem, value}: any) => {
    return (
      <div className="flex relative bg-white rounded-lg shadow justify-center items-center h-20 shadow inner_card">
        <p className={`text-sm text-semibold text-gray-500 w-auto mr-2 text-md`}>
          {keyItem}:
        </p>
        <p className={`text-dark-gray font-medium text-center w-auto text-md`}>{value}</p>
      </div>
    );
  };

  return (
    <div className="w-full h-full px-8 py-4">
      <div className="mx-auto w-full">
        <div className="flex flex-row my-0 w-full py-0 mb-8 justify-between">
          <h3 className="text-lg leading-6 text-gray-600 w-auto">
            {CsvDict[userLanguage]['TITLE']}
          </h3>
          {/* <div className={`border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
            <span>{CsvDict[userLanguage]['TITLE']}</span>
          </div> */}
          <div className="w-auto">
            <span className={`mr-0 float-right text-gray-600 text-right`}>
              <DateAndTime />
            </span>
          </div>
        </div>
      </div>
      {/* <SectionTitleV3
        fontSize="2xl"
        fontStyle="bold"
        title={CsvDict[userLanguage]['SELECT_FILTERS']}
      /> */}
      <div className="grid grid-cols-4 gap-x-4">
        {/* <Selector
          loading={institutionsLoading}
          selectedItem={selectedInst ? selectedInst.name : ''}
          placeholder={CsvDict[userLanguage]['SELECT_INST']}
          list={institutions}
          onChange={(value, name, id) => onInstSelect(id, name, value)}
        /> */}

        <Selector
          loading={classRoomLoading}
          selectedItem={selectedClassRoom ? selectedClassRoom.name : ''}
          placeholder="select class room"
          list={instClassRooms}
          onChange={(value, name, id) => onClassRoomSelect(id, name, value)}
        />

        <Selector
          loading={unitsLoading}
          selectedItem={selectedUnit ? selectedUnit.name : ''}
          placeholder="select unit"
          list={units}
          disabled={!selectedCurriculum}
          onChange={(value, name, id) => onUnitSelect(id, name, value)}
        />

        <Selector
          loading={surveysLoading}
          disabled={!selectedUnit}
          selectedItem={selectedSurvey ? selectedSurvey.name : ''}
          placeholder="select survey"
          list={surveys}
          onChange={(value, name, id) => onSurveySelect(id, name, value)}
        />
        <button
          type="button"
          className="col-end-5 inline-flex justify-center h-9 border-0 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo transition duration-150 ease-in-out items-center"
          style={{
            /* stylelint-disable */
            opacity: isCSVDownloadReady ? 1 : 0.5,
          }}
          disabled={!isCSVDownloadReady}>
          {isCSVDownloadReady ? (
            <CSVLink
              data={CSVData}
              headers={CSVHeaders}
              filename={`${selectedClassRoom.name}_${
                selectedSurvey.name
              }_${getTodayDate()}.csv`}>
              Download CSV
            </CSVLink>
          ) : (
            'Download CSV'
          )}
        </button>
      </div>
      <div>
        <SectionTitleV3 title={'Survey results'} />
        {CSVData.length > 0 ? (
          <Table />
        ) : (
          <div className="bg-white flex justify-center items-center inner_card h-30 overflow-hidden border-b border-gray-200 sm:rounded-lg">
            {csvGettingReady
              ? 'Populating Data'
              : 'Select filters options to populate data'}
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
