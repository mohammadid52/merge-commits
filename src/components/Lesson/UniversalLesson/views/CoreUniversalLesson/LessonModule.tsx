import {Transition} from '@headlessui/react';
import map from 'lodash/map';
import React, {useState} from 'react';
import ReactHtmlParser from 'react-html-parser';
import {UniversalLesson} from '@interfaces/UniversalLessonInterfaces';
import Table from '../../../../Molecules/Table';
import ThemeModal from '../../../../Molecules/ThemeModal';
import {Tabs3, useTabs} from '../../../UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as queries from '../../../../../graphql/queries';
import useUpdateEffect from '../../../../../customHooks/useUpdateEffect';
import Loader from '../../../../Atoms/Loader';
import {AiFillCheckCircle} from 'react-icons/ai';
import {getLocalStorageData} from '../../../../../utilities/localStorage';
import AnimatedContainer from '../../../UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';

const EvidenceTab = ({
  curTab,
  currentLesson,
  setSelectedMeasurements,
  selectedMeasurements,
  setCheckedEvidence,
  checkedEvidence,
  setSelectedCurriculumList,
  selectedCurriculumList,
}: any) => {
  const [evidenceListLoading, setEvidenceListLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useUpdateEffect(() => {
    if (curTab === 'Evidences') {
      if (selectedCurriculumList.length === 0) {
        fetchCurriculum();
      }
      if (selectedMeasurements.length === 0) {
        fetchLessonRubrics();
      }
    }
  }, [curTab, selectedCurriculumList, selectedMeasurements]);

  const fetchLessonRubrics = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listLessonRubricss, {
          filter: {
            lessonID: {eq: currentLesson.id},
          },
        })
      );
      const rubricList = result.data?.listLessonRubricss.items.map((rubric: any) => ({
        ...rubric,
        checked: true,
      }));
      setSelectedMeasurements(rubricList);
    } catch (error) {}
  };

  const fetchObjectives = async (curricularId: string) => {
    const learningEvidenceList: any[] = [];

    setEvidenceListLoading(true);
    let rubricList: any = await API.graphql(
      graphqlOperation(customQueries.listRubrics, {
        filter: {
          curriculumID: {eq: curricularId},
        },
      })
    );
    rubricList = rubricList.data.listRubrics?.items || [];

    const [results, learningObjectiveSeqResult, topics]: any = await Promise.all([
      await API.graphql(
        graphqlOperation(queries.listLearningObjectives, {
          filter: {
            curriculumID: {eq: curricularId},
          },
        })
      ),
      await API.graphql(
        graphqlOperation(queries.getCSequences, {id: `l_${curricularId}`})
      ),
      await API.graphql(
        graphqlOperation(customQueries.listTopics, {
          filter: {
            curriculumID: {eq: curricularId},
          },
        })
      ),
    ]);

    const topicsList = topics.data?.listTopics?.items;
    const learningObjectives = results.data?.listLearningObjectives?.items;
    const learningObjectiveSeq =
      learningObjectiveSeqResult?.data?.getCSequences?.sequence || [];

    const learningObjectiveData = learningObjectives?.map((objective: any) => {
      objective.index = learningObjectiveSeq.indexOf(objective.id);
      const associatedTopics = topicsList
        .filter((topic: any) => topic.learningObjectiveID === objective.id)
        .map((topic: any) => {
          const associatedRubrics = rubricList.filter(
            (rubric: any) => rubric.topicID === topic.id
          );
          topic.associatedRubrics = associatedRubrics;
          associatedRubrics.map((rubric: any) => {
            learningEvidenceList.push({
              learningObjectiveName: objective.name,
              topicName: topic.name,
              measurementName: rubric.name,
              rubricId: rubric.id,
            });
          });
          return topic;
        });
      objective.associatedTopics = associatedTopics;
      return objective;
    });
    setEvidenceListLoading(false);
    return {
      learningObjectiveData,
      learningEvidenceList: learningEvidenceList.sort((a: any, b: any) =>
        a.index > b.index ? 1 : -1
      ),
    };
  };

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculumsForLessons, {
          filter: {
            institutionID: {eq: currentLesson.institutionID},
          },
        })
      );
      const curriculums = list.data?.listCurriculums?.items;
      let selectedCurriculums: any = [];
      curriculums.map((curriculum: any) => {
        const assignedSyllabi = curriculum.universalSyllabus?.items.filter(
          (syllabus: any) =>
            syllabus.lessons?.items.filter(
              (lesson: any) => lesson.lessonID === currentLesson.id
            ).length
        );
        const isCourseAdded = Boolean(assignedSyllabi.length);
        if (isCourseAdded) {
          selectedCurriculums.push({
            ...curriculum,
            assignedSyllabi: assignedSyllabi.map((syllabus: any) => syllabus.name),
            assignedSyllabusId: assignedSyllabi.map((syllabus: any) => syllabus.id),
          });
        }
      });
      await Promise.all(
        selectedCurriculums.map(async (curriculum: any) => {
          const {learningObjectiveData} = await fetchObjectives(curriculum.id);
          curriculum.learningObjectiveData = learningObjectiveData;
        })
      );
      setSelectedCurriculumList(selectedCurriculums);
      const $ = generateCheckedList(selectedCurriculums);
      setCheckedEvidence($);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const roomInfo = getLocalStorageData('room_info');

  const curricula = roomInfo?.curricula?.items || [];

  const generateCheckedList = (list: any[]) => {
    let result: any[] = [];
    list.forEach((curriculum: any): void => {
      curriculum.learningObjectiveData.forEach(
        (objective: {curriculumID: string; associatedTopics: any[]}): void => {
          if (
            curricula.find(
              (c: {curriculumID: string}) => c.curriculumID === objective.curriculumID
            )
          )
            objective.associatedTopics.forEach((topic: any) => {
              topic.associatedRubrics.forEach((rubric: {id: string}) => {
                if (
                  selectedMeasurements.find(
                    (measurement: {rubricID: string}) =>
                      measurement.rubricID === rubric.id
                  )?.checked
                ) {
                  result.push(rubric);
                }
              });
            });
        }
      );
    });
    return result;
  };

  // Base
  // map curriculum list
  //  -- curriculum object
  //  --- map learningObjectiveData
  //  ---- objectiveData object
  //  ----- map associatedTopics
  //  ------ map associatedRubrics
  //  ------- rubrics object
  //  -------- rubrics.id === measurement.rubricID = ✅

  return (
    <div>
      {evidenceListLoading || loading ? (
        <div className="flex items-center justify-center min-h-32">
          <Loader
            withText="Loading Evidences..."
            className="text-gray-500 flex-col text-lg"
          />
        </div>
      ) : checkedEvidence.length === 0 ? (
        <div className="flex items-center justify-center min-h-32">
          <p className="text-gray-400 font-medium text-lg leading-3">
            No Evidences Listed
          </p>
        </div>
      ) : (
        <Transition
          show={true}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4"
          leaveTo="opacity-0">
          {checkedEvidence.map((evidence: any) => (
            <div className="flex items-center w-auto col-span-1 border-0 border-gray-200 dark:border-gray-700 px-4 p-2 rounded-lg justify-start">
              <AiFillCheckCircle className="mr-2 w-auto text-green-500" />
              <p className="text-gray-900 dark:text-white  w-auto">{evidence.name}</p>
            </div>
          ))}
        </Transition>
      )}
    </div>
  );
};

const LessonModule = ({currentLesson}: {currentLesson: UniversalLesson}) => {
  const [open, setOpen] = useState(true);
  const tabs = [
    {name: 'Objectives', current: true},
    {name: 'Resources', current: false},
    {name: 'Evidences', current: false},
  ];
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [checkedEvidence, setCheckedEvidence] = useState([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);

  const {curTab, setCurTab, helpers} = useTabs(tabs);
  const [onObjectivesTab, onResourcesTab, onEvidencesTab] = helpers;

  const dataList = map(currentLesson?.lessonPlan, (lesson) => ({
    name: lesson.title,
    time: `${lesson.estTime} min`,
    instructions: lesson.description ? ReactHtmlParser(lesson.description) : '--',
  }));

  const lessonPlanTableConfig = {
    headers: ['Name', 'Time', 'Instructions'],
    dataList,
    config: {
      dark: currentLesson?.darkMode || true,
      headers: {textColor: 'text-white'},
      dataList: {
        pattern: 'striped',
        patternConfig: {firstColor: 'bg-gray-800', secondColor: 'bg-gray-700'},
      },
    },
  };

  return (
    <ThemeModal
      dark={currentLesson?.darkMode || true}
      subHeader={currentLesson?.summary}
      //@ts-ignore
      header={`${currentLesson?.title} - Lesson Overview`}
      open={open}
      setOpen={setOpen}>
      <div>
        <div className="my-2 border-b-0 border-gray-700 py-4 min-h-56">
          <Tabs3
            config={{fullColor: true}}
            setCurTab={setCurTab}
            curTab={curTab}
            tabs={tabs}
            numbered
          />

          <div className="mt-4">
            <AnimatedContainer show={onObjectivesTab} animationType="scale">
              {onObjectivesTab && (
                <>
                  {currentLesson?.objectives[0] ? (
                    <div>
                      <div
                        style={{color: 'rgba(203, 213, 224, 1) !important'}}
                        className="text-gray-400 font-medium text-lg leading-3">
                        {ReactHtmlParser(currentLesson?.objectives[0])}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center min-h-32">
                      <p className="text-gray-400 font-medium text-lg leading-3 w-auto">
                        No Objectives Listed
                      </p>
                    </div>
                  )}
                </>
              )}
            </AnimatedContainer>
            <AnimatedContainer show={onResourcesTab} animationType="scale">
              {onResourcesTab && (
                <>
                  {
                    //@ts-ignore
                    currentLesson?.studentMaterials ? (
                      <div>
                        <p className="text-gray-400 font-medium text-lg leading-3">
                          {
                            //@ts-ignore
                            currentLesson?.studentMaterials
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center min-h-32">
                        <p className="text-gray-400 font-medium text-lg leading-3 w-auto">
                          No Resources Listed
                        </p>
                      </div>
                    )
                  }
                </>
              )}
            </AnimatedContainer>
            <AnimatedContainer show={onEvidencesTab} animationType="scale">
              {onEvidencesTab && (
                <EvidenceTab
                  selectedMeasurements={selectedMeasurements}
                  setSelectedMeasurements={setSelectedMeasurements}
                  checkedEvidence={checkedEvidence}
                  setCheckedEvidence={setCheckedEvidence}
                  curTab={curTab}
                  selectedCurriculumList={selectedCurriculumList}
                  setSelectedCurriculumList={setSelectedCurriculumList}
                  currentLesson={currentLesson}
                />
              )}
            </AnimatedContainer>
          </div>
        </div>
        <div className="min-h-56 py-4">
          <h2
            className={`${
              currentLesson?.darkMode ? 'text-white' : 'text-gray-900'
            } font-medium text-lg `}>
            Lesson Plan
          </h2>
          <Table {...lessonPlanTableConfig} />
        </div>
      </div>
    </ThemeModal>
  );
};

export default LessonModule;
