import Selector from '@components/Atoms/Form/Selector';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import useDictionary from '@customHooks/dictionary';
import useAuth from '@customHooks/useAuth';
import {listInstitutions} from 'graphql-functions/functions';

import {insertExtraDataForClassroom, removeDuplicates} from '@utilities/functions';
import {API, graphqlOperation} from 'aws-amplify';
import {
  fetchClassStudents,
  getCurriculumCheckpointsData,
  getInstClassRooms,
  listSurveys,
  listUnits
} from 'customGraphql/customQueries';
import {uniqBy} from 'lodash';
import {useEffect, useState} from 'react';

const DownloadCsvTitleComponent = ({
  selectedUnit,
  instituteDropdownRef,
  classroomDropdownRef,
  unitDropdownRef,
  surveyDropdownRef,

  selectedSurvey,
  surveys,

  selectedInst,

  selectedClassRoom,
  setDemographicsQuestions,
  setSCQAnswers,
  getStudentsDemographicsQuestionsResponse,
  setClassStudents,

  clearCSVData,
  setSelectedInst,
  setSelectedClassRoom,

  setSelectedCurriculum,
  listQuestions,
  resetInstitution,
  setSelectedUnit,
  setSelectedsurvey,
  setSurveys
}: {
  selectedClassRoom: any;
  selectedSurvey: any;
  selectedUnit: any;
  selectedInst: any;
  getStudentsDemographicsQuestionsResponse: any;
  setSelectedCurriculum: any;
  setSelectedInst: any;
  instituteDropdownRef: any;
  classroomDropdownRef: any;
  unitDropdownRef: any;
  surveyDropdownRef: any;

  setSelectedsurvey: any;
  setSCQAnswers: any;
  setSurveys: any;
  setSelectedUnit: any;
  setClassStudents: any;

  setDemographicsQuestions: any;
  setSelectedClassRoom: any;

  surveys: any[];

  resetInstitution: () => void;
  clearCSVData: () => void;
  listQuestions: (surveyId: string) => Promise<void>;
}) => {
  const {authId, email} = useAuth();

  const [institutions, setInstitutions] = useState<any[]>([]);
  const [instClassRooms, setInstClassRooms] = useState<any[]>([]);
  const [classRoomsList, setClassRoomsList] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  const [classRoomLoading, setClassRoomLoading] = useState(false);
  const [surveysLoading, setSurveysLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [institutionsLoading, setInstitutionsLoading] = useState(false);

  const reset = () => {
    setInstClassRooms([]);
    resetInstitution();
  };

  const loadInstitution = async () => {
    try {
      setInstitutionsLoading(true);
      const resp = await listInstitutions(authId, email);
      if (resp && resp.length > 0) {
        setInstitutions(resp);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setInstitutionsLoading(false);
    }
  };

  const onInstSelect = async (id: string, name: string, value: string) => {
    setClassRoomLoading(true);
    try {
      let sInst = selectedInst;
      let inst = {id, label: name, value};
      setSelectedInst(inst);
      if (!sInst || sInst.id !== inst.id) {
        reset();
        let instCRs: any = [];
        // fetch inst classrooms.
        let classrooms: any = await API.graphql(
          graphqlOperation(getInstClassRooms, {
            id: inst.id
          })
        );
        classrooms = classrooms?.data.getInstitution?.rooms?.items || [];
        classrooms = classrooms.map((cr: any) => {
          let curriculum =
            cr.curricula?.items && Array.isArray(cr.curricula?.items)
              ? cr.curricula?.items[0]?.curriculum
              : null;
          !instCRs.find((d: any) => d.name === cr.name) &&
            instCRs.push({id: cr.id, name: cr.name, value: cr.name});
          return {
            id: cr.id,
            label: cr.name,

            value: cr.name,
            class: {...cr.class},
            curriculum,
            ...insertExtraDataForClassroom(cr)
          };
        });
        setClassRoomsList(classrooms);
        setInstClassRooms(removeDuplicates(instCRs));
        setClassRoomLoading(false);
      }
    } catch (err) {
      console.log('inst select, fetch classrooms err', err);
    }
  };

  const fetchStudents = async (classId: string) => {
    let classData: any = await API.graphql(
      graphqlOperation(fetchClassStudents, {
        id: classId
      })
    );
    let students = classData?.data?.getClass?.students?.items || [];

    let classStudents = students.map((stu: any) => stu.student);

    // remove duplicates
    classStudents = uniqBy(classStudents, (stu: any) => stu.id);

    let studentsEmails = classStudents.map((stu: any) => stu?.email).filter(Boolean);

    setClassStudents(classStudents);
    return studentsEmails;
  };

  const onClassRoomSelect = async (id: string, name: string, value: string) => {
    setUnitsLoading(true);
    try {
      let sCR = selectedClassRoom;
      let cr = {id, label: name, value};
      setSelectedClassRoom(cr);
      if (!sCR || sCR.id !== cr.id) {
        let classroom = classRoomsList.filter((c) => c.id === cr.id)[0];

        // with classroom => class and curriculum are directly selected

        setSelectedCurriculum(classroom?.curriculum);
        // fetch students of the selected class. (This list of students will be used in the csv)
        const studentsEmails = await fetchStudents(classroom.class.id);
        if (classroom?.curriculum?.id) {
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
        graphqlOperation(listUnits, {
          filter: {curriculumId: {eq: curriculumId}}
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnits?.items || [];
      units = units.filter((d: any) => d.unit !== null);

      units = units
        .map((syl: any) => {
          let unitData = syl.unit;
          return unitData
            ? {id: unitData.id, label: unitData.name, value: unitData.name}
            : null;
        })
        .filter(Boolean);
      // console.log('units', units)
      setUnits(units);
      setUnitsLoading(false);
      let curriculumData: any = await API.graphql(
        graphqlOperation(getCurriculumCheckpointsData, {
          id: curriculumId
        })
      );

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
            checkpointID: cc.checkpoint.id
          });
        });
      });

      setDemographicsQuestions(demographicsQues);
      // here we have curricularCheckpoints and use syllabusLessonId 999999 to fetch list of question data
      getStudentsDemographicsQuestionsResponse(cCheckpoints, '999999', studentsEmails);
    } catch (err) {
      console.log('fetch units (syllabus) error', err);
    }
  };

  const onUnitSelect = (id: string, name: string, value: string) => {
    let unit = {id, label: name, value};
    setSelectedUnit(unit);
    fetchSurveys(unit.id);
  };

  const fetchSurveys = async (unitId: string) => {
    setSurveysLoading(true);
    try {
      let syllabusLessons: any = await API.graphql(
        graphqlOperation(listSurveys, {
          id: unitId
        })
      );
      syllabusLessons = syllabusLessons?.data.getUniversalSyllabus?.lessons?.items || [];
      let surveys: any = [];

      syllabusLessons.filter((les: any) => {
        if (les.lesson && les.lesson.type === 'survey') {
          surveys.push({
            id: les.lesson.id,
            label: les.lesson.title,
            value: les.lesson.title
          });
          return les.lesson;
        }
      });

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

  // init
  useEffect(() => {
    loadInstitution();
  }, []);

  const {CsvDict, userLanguage} = useDictionary();
  return (
    <div className="mx-auto w-full">
      <div className="flex flex-row my-0  w-full py-0 mb-4 justify-between">
        <div className="w-full">
          <SectionTitleV3
            textWidth="lg:w-1/5 2xl:w-1/4"
            withButton={
              <div className="grid grid-cols-2 xl:grid-cols-4  gap-4">
                {/* {isSuperAdmin && ( */}
                <Selector
                  width={250}
                  ref={instituteDropdownRef}
                  showSearch
                  placeholder={CsvDict[userLanguage]['SELECT_INST']}
                  list={institutions}
                  loading={institutionsLoading}
                  selectedItem={selectedInst ? selectedInst.label : ''}
                  onChange={(value, option: any) => onInstSelect(option.id, value, value)}
                />
                {/* )} */}

                <div className="w-auto relative">
                  <Selector
                    showSearch
                    dataCy="analytics-classroom"
                    ref={classroomDropdownRef}
                    width={250}
                    disabled={!selectedInst?.id}
                    loading={classRoomLoading}
                    selectedItem={selectedClassRoom ? selectedClassRoom.label : ''}
                    placeholder="Select Classroom"
                    list={instClassRooms}
                    onChange={(value, option: any) => {
                      onClassRoomSelect(option.id, value, value);
                    }}
                  />
                </div>

                <Selector
                  dataCy="analytics-unit"
                  ref={unitDropdownRef}
                  loading={unitsLoading}
                  showSearch
                  selectedItem={selectedUnit ? selectedUnit.label : ''}
                  placeholder="Select Unit"
                  width={250}
                  list={units}
                  disabled={!selectedClassRoom}
                  onChange={(value, option: any) => onUnitSelect(option.id, value, value)}
                />

                <Selector
                  dataCy="analytics-survey"
                  width={250}
                  ref={surveyDropdownRef}
                  showSearch
                  loading={surveysLoading}
                  disabled={!selectedUnit}
                  selectedItem={selectedSurvey ? selectedSurvey.label : ''}
                  placeholder="Select Survey"
                  list={surveys}
                  onChange={(value, option: any) =>
                    onSurveySelect(option.id, value, value)
                  }
                />
              </div>
            }
            title={CsvDict[userLanguage]['TITLE']}
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadCsvTitleComponent;
