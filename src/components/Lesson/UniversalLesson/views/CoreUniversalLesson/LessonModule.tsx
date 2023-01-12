import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Transition} from '@headlessui/react';

import Label from '@components/Atoms/Form/Label';
import {UniversalLesson} from 'API';
import Loader from 'atoms/Loader';
import * as customQueries from 'customGraphql/customQueries';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import * as queries from 'graphql/queries';
import map from 'lodash/map';
import Table from 'molecules/Table';
import ThemeModal from 'molecules/ThemeModal';
import React, {useState} from 'react';
import {AiFillCheckCircle} from 'react-icons/ai';
import AnimatedContainer from '../../../UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {Tabs3, useTabs} from '../../../UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';

export const getFilteredUniversalSyllabus = (curriculum: any, lessonId: string) => {
  const assignedSyllabi = curriculum?.universalSyllabus?.items?.filter(
    (syllabus: any) => {
      const items = syllabus?.unit?.lessons?.items || [];
      const onlyLessonId = items.map((d: {lessonID: any}) => d.lessonID);
      return Boolean(onlyLessonId.includes(lessonId));
    }
  );
  return assignedSyllabi;
};

export const getSelectedCurriculum = (curriculums: any[], lessonId: string) => {
  let selectedCurriculums: any = [];
  curriculums.forEach((curriculum: any) => {
    const assignedSyllabi = getFilteredUniversalSyllabus(curriculum, lessonId);

    const isCourseAdded = assignedSyllabi.length > 0;

    isCourseAdded &&
      selectedCurriculums.push({
        ...curriculum,
        assignedSyllabi: assignedSyllabi.map((syllabus: any) => syllabus.unit.name),
        assignedSyllabusId: assignedSyllabi.map((syllabus: any) => syllabus.id)
      });
  });

  return selectedCurriculums;
};

const EvidenceTab = ({
  curTab,
  currentLesson,
  selectedMeasurements,
  setSelectedMeasurements,
  setCheckedEvidence,
  checkedEvidence,
  setSelectedCurriculumList,
  selectedCurriculumList
}: any) => {
  const [evidenceListLoading, setEvidenceListLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useUpdateEffect(() => {
    if (curTab === 'Evidences') {
      if (selectedCurriculumList.length === 0) {
        fetchCurriculum();
      }
    }
  }, [curTab]);

  const fetchObjectives = async (curricularId: string) => {
    const learningEvidenceList: any[] = [];

    setEvidenceListLoading(true);
    let rubricList: any = await API.graphql(
      graphqlOperation(queries.listRubrics, {
        filter: {
          curriculumID: {eq: curricularId}
        }
      })
    );

    //e94b7f1b-6cce-42d3-97d2-3ab8f65ac96d
    rubricList = rubricList.data.listRubrics?.items || [];
    setSelectedMeasurements(rubricList);
    const [results, learningObjectiveSeqResult, topics]: any = await Promise.all([
      await API.graphql(
        graphqlOperation(queries.listLearningObjectives, {
          filter: {
            curriculumID: {eq: curricularId}
          }
        })
      ),
      await API.graphql(
        graphqlOperation(queries.getCSequences, {id: `l_${curricularId}`})
      ),
      await API.graphql(
        graphqlOperation(customQueries.listTopics, {
          filter: {
            curriculumID: {eq: curricularId}
          }
        })
      )
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
          topic.associatedRubrics = associatedRubrics || [];
          associatedRubrics.map((rubric: any) => {
            learningEvidenceList.push({
              learningObjectiveName: objective.name,
              topicName: topic.name,
              measurementName: rubric.name,
              rubricId: rubric.id
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
      )
    };
  };

  const getRubricsData = (rubrics: string[]) => {
    return rubrics.map((id) => {
      return {
        rubricID: id,
        checked: true
      };
    });
  };

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculumsForLessons, {
          filter: {
            institutionID: {eq: currentLesson.institutionID}
          }
        })
      );
      let curriculums = list.data?.listCurricula?.items;

      let selectedCurriculums = getSelectedCurriculum(curriculums, currentLesson.id);

      for (const curriculum of selectedCurriculums) {
        const {learningObjectiveData} = await fetchObjectives(curriculum.id);
        curriculum.learningObjectiveData = learningObjectiveData;
      }

      setSelectedCurriculumList(selectedCurriculums);
      const $ = generateCheckedList(selectedCurriculums, curriculums);
      setCheckedEvidence($);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const generateCheckedList = (list: any[], curricula: any[]) => {
    let result: any[] = [];

    const selectedMeasurements = getRubricsData(currentLesson?.rubrics || []);

    list.forEach((curriculum: any): void => {
      curriculum.learningObjectiveData.forEach(
        (objective: {curriculumID: string; associatedTopics: any[]}): void => {
          console.log(curricula);
          if (
            Boolean(curricula.find((c: {id: string}) => c.id === objective.curriculumID))
          ) {
            objective?.associatedTopics &&
              objective?.associatedTopics.length > 0 &&
              objective?.associatedTopics?.forEach((topic: any) => {
                console.log('topic->', topic);
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
        <div className="flex text-center items-center justify-center min-h-32">
          <p className="text-gray-400 w-auto font-medium text-lg leading-3">
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
            <div
              key={evidence.id}
              className="flex items-center w-auto col-span-1 border-0 border-gray-200 dark:border-gray-700 px-4 p-2 rounded-lg justify-start">
              <AiFillCheckCircle className="mr-2 w-auto text-green-500" />
              <p className="text-gray-900 dark:text-white  w-auto">{evidence.name}</p>
            </div>
          ))}
        </Transition>
      )}
    </div>
  );
};

const WithHtml = ({html, emptyText = '--'}: {html: string; emptyText: string}) => {
  return html && html.length > 0 && html !== '<p></p>' ? (
    <div>
      <span
        dangerouslySetInnerHTML={{__html: html || '<p>---</p>'}}
        className="text-gray-400  remove-draft-styles font-medium text-lg leading-7"
      />
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-32">
      <p className="text-gray-400 font-medium text-lg leading-3 w-auto">{emptyText}</p>
    </div>
  );
};

const LessonModule = ({currentLesson}: {currentLesson: UniversalLesson}) => {
  const [open, setOpen] = useState(true);
  const tabs = [
    {name: 'Objectives', current: true},
    {name: 'Evidences', current: false},
    {name: 'Resources', current: false}
  ];
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [checkedEvidence, setCheckedEvidence] = useState([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);

  const {curTab, setCurTab, helpers} = useTabs(tabs);
  const [onObjectivesTab, onResourcesTab, onEvidencesTab] = helpers;

  const dataList = map(currentLesson?.lessonPlan, (lesson) => ({
    name: lesson?.label,
    time: `${lesson?.estTime} min`,
    instructions: lesson?.description || '--'
  }));

  const lessonPlanTableConfig = {
    headers: ['Name', 'Time', 'Instructions'],
    dataList,
    config: {
      dark: currentLesson?.darkMode || true,
      headers: {textColor: 'text-white'},
      dataList: {
        pattern: 'striped',
        patternConfig: {firstColor: 'bg-gray-800', secondColor: 'bg-gray-700'}
      }
    }
  };

  return (
    <ThemeModal
      dark={currentLesson?.darkMode !== undefined ? currentLesson?.darkMode : true}
      subHeader={currentLesson?.summary}
      header={`${currentLesson?.title} - Overview`}
      open={open}
      setOpen={setOpen}>
      <div>
        <div className="my-2 border-b-0 border-gray-700 py-4 min-h-56">
          <Tabs3
            config={{fullColor: true}}
            setCurTab={setCurTab}
            curTab={curTab}
            tabs={tabs}
          />

          <div className="mt-4">
            <AnimatedContainer
              duration="500"
              show={onObjectivesTab}
              animationType="scale">
              {onObjectivesTab && (
                <>
                  <WithHtml
                    emptyText="No Objectives Listed"
                    html={currentLesson?.objectives[0]}
                  />
                </>
              )}
            </AnimatedContainer>
            <AnimatedContainer duration="500" show={onResourcesTab} animationType="scale">
              {onResourcesTab && (
                <>
                  <WithHtml
                    emptyText="No Resources Listed"
                    html={currentLesson?.studentMaterials}
                  />
                </>
              )}
            </AnimatedContainer>
            <AnimatedContainer duration="500" show={onEvidencesTab} animationType="scale">
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
          <Label label="Lesson Plan" />

          <Table {...lessonPlanTableConfig} />
        </div>
      </div>
    </ThemeModal>
  );
};

export default LessonModule;
