import React, {useEffect, useState, useContext} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';
import Selector from '../../Atoms/Form/Selector';
import {createFilterToFetchSpecificItemsOnly} from '../../../utilities/strings';
import {CSVLink} from 'react-csv';
import DateAndTime from '../DateAndTime/DateAndTime';
import {getAsset} from '../../../assets';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import useDictionary from '../../../customHooks/dictionary';

interface Csv {}

const Csv = (props: Csv) => {
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
  };

  const onInstSelect = async (id: string, name: string, value: string) => {
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
            id: inst.id,
          })
        );
        classrooms = classrooms?.data.getInstitution?.rooms?.items || [];
        classrooms = classrooms.map((cr: any) => {
          let curriculum =
            cr.curricula?.items && Array.isArray(cr.curricula?.items)
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
      } else {
        console.log('institution already selected');
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
        setSelectedCurriculum(classroom.curriculum);
        // fetch students of the selected class. (This list of students will be used in the csv)
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
      let curriculumData: any = await API.graphql(
        graphqlOperation(customQueries.listUnits, {
          id: curriculumId,
        })
      );
      let units = curriculumData?.data.getCurriculum?.syllabi?.items || [];
      units = units.map((syl: any) => {
        return {id: syl.id, name: syl.name, value: syl.name};
      });
      setUnits(units);
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
      })
    );
    let studentsAnswersDemographicsCheckpointsQuestions =
      curriculumData?.data?.listQuestionDatas?.items || [];
    setDCQAnswers(studentsAnswersDemographicsCheckpointsQuestions);
    // console.log('studentsAnswersDemographicsCheckpointsQuestions', studentsAnswersDemographicsCheckpointsQuestions)
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
    try {
      let syllabusLessons: any = await API.graphql(
        graphqlOperation(customQueries.listSurveys, {
          id: unitId,
        })
      );
      syllabusLessons = syllabusLessons?.data.getSyllabus?.lessons?.items || [];
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
      setSurveys(surveys);
    } catch (err) {
      console.log('fetch surveys list error', err);
    }
  };

  const onSurveySelect = async (id: string, name: string, value: string) => {
    let survey = {id, name, value};
    setSelectedsurvey(survey);
    await listQuestions(survey.id);
  };

  const listQuestions = async (lessonId: string) => {
    try {
      let surveyQuestions: any = await API.graphql(
        graphqlOperation(customQueries.getSurveyQuestions, {
          id: lessonId,
        })
      );
      let checkpoints = surveyQuestions?.data?.getLesson?.checkpoints?.items;
      const questions: any = [];
      let cCheckpoints: any = [];
      checkpoints.map((cp: any) => {
        cCheckpoints.push(cp.checkpointID);
        let ques = cp?.checkpoint?.questions?.items;
        ques.map((q: any) => {
          questions.push({question: q.question, checkpointID: cp.checkpointID});
        });
      });
      setSurveyQuestions(questions);
      let syllabusLes = syllabusLessonsData.filter((sl) => sl.lessonID === lessonId)[0];
      await getStudentsSurveyQuestionsResponse(
        cCheckpoints,
        syllabusLes.syllabusLessonID
      );
      setIsCSVReady(true);
      return;
    } catch (err) {
      console.log('list questions error', err);
    }
  };

  const getStudentsSurveyQuestionsResponse = async (
    checkpointIds: any,
    syllabusLessonID: string
  ) => {
    if (checkpointIds.length) {
      let studsEmails = classStudents.map((stu: any) => stu.email);
      let curriculumData: any = await API.graphql(
        graphqlOperation(customQueries.getStudentResponse, {
          filter: {
            ...createFilterToFetchSpecificItemsOnly(checkpointIds, 'checkpointID'),
            syllabusLessonID: {eq: syllabusLessonID},
            ...createFilterToFetchSpecificItemsOnly(studsEmails, 'email'),
          },
        })
      );
      let studentsAnswersSurveyCheckpointsQuestions =
        curriculumData?.data?.listQuestionDatas?.items || [];
      setSCQAnswers(studentsAnswersSurveyCheckpointsQuestions);
      return studentsAnswersSurveyCheckpointsQuestions;
    } else {
      console.log('no checkpoints of the selected survey');
    }
  };

  const getCSVReady = async () => {
    let students = classStudents;
    let qids: any = [];
    let surveyQuestionHeaders = surveyQuestions.map((ques: any) => {
      qids.push(ques.question.id);
      return {label: `${ques.question.question}`, key: `${ques.question.id}`};
    });
    let demographicsQuestionHeaders = demographicsQuestions.map((ques: any) => {
      qids.push(ques.question.id);
      return {
        label: `${ques.question.question} (demographic)`,
        key: `${ques.question.id}`,
      };
    });
    console.log('surveyQuestionHeaders', surveyQuestionHeaders);
    console.log('demographicsQuestionHeaders', demographicsQuestionHeaders);
    setCSVHeaders([
      {label: 'AuthId', key: 'authId'},
      {label: 'Email', key: 'email'},
      {label: 'First Name', key: 'firstName'},
      {label: 'Last Name', key: 'lastName'},
      {label: 'Institute', key: 'institute'},
      {label: 'Curriculum', key: 'curriculum'},
      {label: 'Unit', key: 'unit'},
      {label: 'Survey name', key: 'surveyName'},
      ...surveyQuestionHeaders,
      ...demographicsQuestionHeaders,
    ]);
    let data = students.map((stu: any) => {
      let studentAnswers: any = {};
      SCQAnswers.map((ans: any) => {
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
      return {
        ...stu,
        institute: selectedInst.name,
        curriculum: selectedCurriculum.name,
        unit: selectedUnit.name,
        surveyName: selectedSurvey.name,
        ...studentAnswers,
      };
    });
    setCSVData(data);
    setIsCSVDownloadReady(true);
  };

  useEffect(() => {
    if (isCSVReady) {
      console.log('SCQAnswers', SCQAnswers);
      getCSVReady();
    }
  }, [isCSVReady]);

  const themeColor = getAsset(clientKey, 'themeClassName');
  const listArr: any[] = [{}, {}];
  const theadStyles =
    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
  const tdataStyles = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
  const Table = () => {
    return (
      <div className="flex flex-col ">
        <div className="overflow-x-auto ">
          <div className="py-2 align-middle inline-block min-w-full ">
            <div className="shadow inner_card overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className={theadStyles}>
                      Institute Name
                    </th>
                    <th scope="col" className={theadStyles}>
                      Curriculum
                    </th>
                    <th scope="col" className={theadStyles}>
                      Unit Name
                    </th>
                    <th scope="col" className={theadStyles}>
                      Classroom
                    </th>

                    <th scope="col" className={theadStyles}>
                      Survey Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listArr.map((listItem, idx) => (
                    <tr
                      // TODO: Uncomment this
                      // key={`${listItem.selectedInst.name}_${idx}`}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {selectedInst ? selectedInst.name : 'not selected'}
                      </td>
                      <td className={tdataStyles}>
                        {selectedCurriculum ? selectedCurriculum.name : 'not selected'}
                      </td>
                      <td className={tdataStyles}>
                        {selectedUnit ? selectedUnit.name : 'not selected'}
                      </td>
                      <td className={tdataStyles}>
                        {selectedClassRoom ? selectedClassRoom.name : 'not selected'}
                      </td>
                      <td className={tdataStyles}>
                        {selectedSurvey ? selectedSurvey.name : 'not selected'}
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

  return (
    <div className="p-8 w-full h-full">
      <div className="mx-auto w-full">
        <div className="flex flex-row my-0 w-full py-0 mb-4 justify-between">
          <div className={`border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
            <span>{CsvDict[userLanguage]['TITLE']}</span>
          </div>
          <div>
            <span className={`mr-0 float-right text-gray-600 text-right`}>
              <DateAndTime />
            </span>
          </div>
        </div>
      </div>
      <SectionTitleV3
        fontSize="2xl"
        fontStyle="bold"
        title={CsvDict[userLanguage]['SELECT_FILTERS']}
      />
      <div className="grid grid-cols-4 gap-x-4">
        <Selector
          selectedItem={selectedInst ? selectedInst.name : ''}
          placeholder={CsvDict[userLanguage]['SELECT_INST']}
          list={institutions}
          onChange={(value, name, id) => onInstSelect(id, name, value)}
        />

        <Selector
          selectedItem={selectedClassRoom ? selectedClassRoom.name : ''}
          placeholder="select class room"
          list={instClassRooms}
          onChange={(value, name, id) => onClassRoomSelect(id, name, value)}
        />

        <Selector
          selectedItem={selectedUnit ? selectedUnit.name : ''}
          placeholder="select unit"
          list={units}
          disabled={!selectedCurriculum}
          onChange={(value, name, id) => onUnitSelect(id, name, value)}
        />

        <Selector
          disabled={!selectedUnit}
          selectedItem={selectedSurvey ? selectedSurvey.name : ''}
          placeholder="select survey"
          list={surveys}
          onChange={(value, name, id) => onSurveySelect(id, name, value)}
        />
        <button
          type="button"
          className="col-end-5 disabled:opacity-50 mt-5 inline-flex justify-center py-2 px-4  border-0 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo transition duration-150 ease-in-out items-center"
          style={{
            opacity: isCSVDownloadReady ? 1 : 0.5,
            cursor: isCSVDownloadReady ? 'cursor-pointer' : 'not-allowed',
          }}
          disabled={!isCSVDownloadReady}>
          {isCSVDownloadReady ? (
            <CSVLink data={CSVData} headers={CSVHeaders} filename={'students_data.csv'}>
              Download CSV
            </CSVLink>
          ) : (
            'Download CSV'
          )}
        </button>
      </div>
      <div>
        <SectionTitleV3
          fontSize="2xl"
          fontStyle="bold"
          // title={CsvDict[userLanguage]['SELECT_FILTERS']}
          title={'List Table'}
        />
        <Table />
      </div>

      {/* <span> ====**===========**======= ====**===========**======= </span>
      {selectedUnit ? (
        <div>
          <span>survey questions</span>
          {surveyQuestions.map((sq, index) => {
            return (
              <div key={index}>
                <span>Question: {sq.question.question}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      <span> ====**===========**======= ====**===========**======= </span>
      {selectedCurriculum ? (
        <div>
          <span>Demographics questions</span>
          {demographicsQuestions.map((dq, index) => {
            return (
              <div key={index}>
                <span>Question: {dq.question.question}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      <span> ====**===========**======= ====**===========**======= </span>
      {selectedClass ? (
        <div>
          <span>Class Students</span>
          {classStudents.map((stu, index) => {
            return (
              <div key={index}>
                <span>student: email: {stu.email}</span>
              </div>
            );
          })}
        </div>
      ) : null} */}
    </div>
  );
};

export default Csv;
