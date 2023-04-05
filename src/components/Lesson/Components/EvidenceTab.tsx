import Loader from '@components/Atoms/Loader';
import useUpdateEffect from '@customHooks/useUpdateEffect';
import {Transition} from '@headlessui/react';
import {API, graphqlOperation} from 'aws-amplify';
import {useState} from 'react';
import {AiFillCheckCircle} from 'react-icons/ai';
import {getSelectedCurriculum} from '../UniversalLesson/views/CoreUniversalLesson/LessonModule';
import {listCurriculumsForLessons, listTopics} from 'customGraphql/customQueries';
import {getCSequences, listLearningObjectives, listRubrics} from 'graphql/queries';

const EvidenceTab = ({
  curTab,
  currentLesson,

  setSelectedMeasurements,
  setCheckedEvidence,
  checkedEvidence,
  setSelectedCurriculumList,
  selectedCurriculumList
}: any) => {
  const [evidenceListLoading, setEvidenceListLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useUpdateEffect(() => {
    if (selectedCurriculumList.length === 0) {
      fetchCurriculum();
    }
  }, [curTab]);

  const fetchObjectives = async (curricularId: string) => {
    const learningEvidenceList: any[] = [];

    setEvidenceListLoading(true);
    let rubricList: any = await API.graphql(
      graphqlOperation(listRubrics, {
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
        graphqlOperation(listLearningObjectives, {
          filter: {
            curriculumID: {eq: curricularId}
          }
        })
      ),
      await API.graphql(graphqlOperation(getCSequences, {id: `l_${curricularId}`})),
      await API.graphql(
        graphqlOperation(listTopics, {
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
        graphqlOperation(listCurriculumsForLessons, {
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
          if (
            Boolean(curricula.find((c: {id: string}) => c.id === objective.curriculumID))
          ) {
            objective?.associatedTopics &&
              objective?.associatedTopics.length > 0 &&
              objective?.associatedTopics?.forEach((topic: any) => {
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
            className="text-medium  flex-col text-lg"
          />
        </div>
      ) : checkedEvidence.length === 0 ? (
        <div className="flex text-center items-center justify-center min-h-32">
          <p className="text-light  w-auto font-medium text-lg leading-3">
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
              className="flex items-center w-auto col-span-1 border-0 border-lightest dark:border-dark   px-4 p-2 rounded-lg justify-start">
              <AiFillCheckCircle className="mr-2 w-auto text-green-500" />
              <p className="text-darkest   dark:text-white  w-auto">{evidence.name}</p>
            </div>
          ))}
        </Transition>
      )}
    </div>
  );
};

export default EvidenceTab;
