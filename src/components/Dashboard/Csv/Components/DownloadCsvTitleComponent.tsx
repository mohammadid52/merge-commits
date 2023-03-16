import Selector from '@components/Atoms/Form/Selector';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import useAuth from '@customHooks/useAuth';
import {listInstitutions} from '@graphql/functions';

import {Transition} from '@headlessui/react';
import {insertExtraDataForClassroom, removeDuplicates} from '@utilities/functions';
import {API, graphqlOperation} from 'aws-amplify';
import React, {useEffect, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {DataValue} from '../Csv';
import * as customQueries from 'customGraphql/customQueries';
import {uniqBy} from 'lodash';

const DownloadCsvTitleComponent = ({
  selectedUnit,

  selectedCurriculum,

  selectedSurvey,
  surveys,

  setHoveringItem,
  selectedInst,

  selectedClassRoom,
  setDemographicsQuestions,
  setSCQAnswers,
  getStudentsDemographicsQuestionsResponse,
  setClassStudents,
  currentSelectedClassroomData,
  clearCSVData,
  setSelectedInst,
  setSelectedClassRoom,
  hoveringItem,
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
  selectedCurriculum: any;
  getStudentsDemographicsQuestionsResponse: any;
  setSelectedCurriculum: any;
  setSelectedInst: any;
  setHoveringItem: any;
  setSelectedsurvey: any;
  setSCQAnswers: any;
  setSurveys: any;
  setSelectedUnit: any;
  setClassStudents: any;
  setDemographicsQuestions: any;
  setSelectedClassRoom: any;

  currentSelectedClassroomData: any;

  surveys: any[];

  resetInstitution: () => void;
  clearCSVData: () => void;
  listQuestions: (surveyId: string) => Promise<void>;

  hoveringItem: any;
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
      let inst = {id, name, value};
      setSelectedInst(inst);
      if (!sInst || sInst.id !== inst.id) {
        reset();
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
          !instCRs.find((d: any) => d.name === cr.name) &&
            instCRs.push({id: cr.id, name: cr.name, value: cr.name});
          return {
            id: cr.id,
            name: cr.name,

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
      graphqlOperation(customQueries.fetchClassStudents, {
        id: classId
      })
    );
    let students = classData?.data?.getClass?.students?.items || [];
    let classStudents = students.map((stu: any) => stu.student);

    let uniqIds: any[] = [];

    classStudents = classStudents.filter((stu: any) => {
      if (!uniqIds.includes(stu?.authId)) {
        uniqIds.push(stu?.authId);
        return true;
      } else {
        return false;
      }
    });
    let studentsEmails = classStudents.map((stu: any) => stu?.email).filter(Boolean);

    setClassStudents(classStudents);
    return studentsEmails;
  };

  const onClassRoomSelect = async (id: string, name: string, value: string) => {
    try {
      let sCR = selectedClassRoom;
      let cr = {id, name, value};
      setSelectedClassRoom(cr);
      if (!sCR || sCR.id !== cr.id) {
        let classroom = classRoomsList.filter((c) => c.id === cr.id)[0];

        // with classroom => class and curriculum are directly selected

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
      units = units.filter((d: any) => d.unit !== null);

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
          demographicsQues.push({
            question: q.question,
            checkpointID: cc.checkpoint.id
          });
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

  const onUnitSelect = (id: string, name: string, value: string) => {
    let unit = {id, name, value};
    setSelectedUnit(unit);
    fetchSurveys(unit.id);
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

      syllabusLessons.filter((les: any) => {
        if (les.lesson && les.lesson.type === 'survey') {
          surveys.push({
            id: les.lesson.id,
            name: les.lesson.title,
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
    // getReason();

    setSelectedsurvey(survey);
    await listQuestions(survey.id);
  };

  // init
  useEffect(() => {
    loadInstitution();
  }, []);

  const {userLanguage} = useGlobalContext();
  const {CsvDict} = useDictionary();
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
                  loading={institutionsLoading}
                  width="xl:w-64"
                  selectedItem={selectedInst ? selectedInst.name : ''}
                  placeholder={CsvDict[userLanguage]['SELECT_INST']}
                  list={institutions}
                  onChange={(value, name, id) => onInstSelect(id, name, value)}
                />
                {/* )} */}

                <div className="w-auto relative">
                  <Selector
                    dataCy="analytics-classroom"
                    width="xl:w-64"
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
                        style={{
                          top: '0rem',
                          bottom: '1.5rem',
                          right: '-110%',
                          zIndex: 999999
                        }}
                        className="hidden md:block cursor-pointer select-none  absolute right-1 text-black "
                        show={Boolean(hoveringItem && hoveringItem.name)}>
                        <div className="bg-white flex flex-col border-gray-200 rounded-xl  customShadow border-0 p-4  min-w-70 max-w-70 w-auto">
                          <DataValue
                            title={'Institution Name'}
                            content={
                              currentSelectedClassroomData?.institutionName ||
                              selectedInst?.name ||
                              '--'
                            }
                          />
                          <DataValue
                            title={'Clasroom Name'}
                            content={currentSelectedClassroomData?.name || '--'}
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
                                {currentSelectedClassroomData.status || '--'}
                              </p>
                            }
                          />
                          <DataValue
                            title={'Teacher'}
                            content={
                              <div className="flex items-center justify-center w-auto">
                                <span className="w-auto">
                                  {currentSelectedClassroomData.teacher.image ? (
                                    <img
                                      src={currentSelectedClassroomData.teacher.image}
                                      className="h-6 w-6 rounded-full"
                                    />
                                  ) : (
                                    <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                                  )}
                                </span>
                                <p className="w-auto ml-2">
                                  {currentSelectedClassroomData.teacher.name}
                                </p>
                              </div>
                            }
                          />
                          <DataValue
                            title={'Course Name'}
                            content={currentSelectedClassroomData.courseName || '--'}
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
                  selectedItem={selectedUnit ? selectedUnit.name : ''}
                  placeholder="select unit"
                  width="xl:w-64"
                  list={units}
                  disabled={!selectedCurriculum}
                  onChange={(value, name, id) => onUnitSelect(id, name, value)}
                />

                <Selector
                  dataCy="analytics-survey"
                  direction="left"
                  width="xl:w-64"
                  loading={surveysLoading}
                  disabled={!selectedUnit}
                  selectedItem={selectedSurvey ? selectedSurvey.name : ''}
                  placeholder="select survey"
                  list={surveys}
                  onChange={(value, name, id) => onSurveySelect(id, name, value)}
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
