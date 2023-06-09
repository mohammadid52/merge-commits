import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {getSelectedCurriculum} from '@components/Lesson/UniversalLesson/views/CoreUniversalLesson/LessonModule';
import {LEARINGOBJECTIVEDICT} from '@dictionary/dictionary.iconoclast';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import Modal from 'atoms/Modal';
import PageWrapper from 'atoms/PageWrapper';
import {API, graphqlOperation} from 'aws-amplify';
import AddLearningObjective from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/AddLearningObjective';
import AddMeasurement from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/AddMeasurement';
import AddTopic from 'components/Dashboard/Admin/Institutons/EditBuilders/CurricularsView/TabsActions/AddTopic';
import {useGlobalContext} from 'contexts/GlobalContext';
import {listCurricula, listRubrics, listTopics} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {getCSequences, listLearningObjectives} from 'graphql/queries';
import React, {useEffect, useState} from 'react';
import {IoIosAdd} from 'react-icons/io';
import AddEvidence from './AddEvidence';
import CourseMeasurementsCard from './CourseMeasurementsCard';
import MeasurementsList from './MeasurementsList';

interface ILearningEvidence {
  fetchLessonRubrics: () => void;
  lessonId: string;
  institutionId: string;

  serverMessage: {
    isError: boolean;
    message: string;
  };
  setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMeasurements: any[];
  setSelectedMeasurements: React.Dispatch<React.SetStateAction<any>>;
  updating: boolean;
  updateMeasurementList: (rubrics: any) => void;
}

const LearningEvidence = ({
  fetchLessonRubrics,
  lessonId,
  institutionId,
  serverMessage,
  setUnsavedChanges,
  selectedMeasurements = [],
  setSelectedMeasurements,
  updateMeasurementList
}: ILearningEvidence) => {
  const {userLanguage} = useGlobalContext();
  const {AddNewLessonFormDict, LearningEvidenceDict, AddMeasurementDict, AddTopicDict} =
    useDictionary();
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [evidenceListLoading, setEvidenceListLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedObjectiveData, setSelectedObjectiveData] = useState<any>({});
  const [openMeasurementModal, setOpenMeasurementModal] = useState(false);

  const [selectedRubricData, setSelectedRubricData] = useState<any>({});
  const [openTopicModal, setTopicModal] = useState(false);

  const [selectedTopicData, setSelectedTopicData] = useState<any>({});

  const editCurrentMeasurement = (rubricData: any, objectiveId: string) => {
    setOpenMeasurementModal(true);
    setSelectedRubricData({
      ...rubricData,
      topicId: rubricData.topicID,
      objectiveId
    });
  };

  const createLearningObjective = () => {
    setIsFormOpen(true);
    setSelectedObjectiveData({});
  };

  const onMeasurementClose = () => {
    setOpenMeasurementModal(false);
    setSelectedRubricData({});
  };

  const addLearningObjective = (curricularId: string) => {
    setIsFormOpen(true);
    setSelectedObjectiveData({
      curricularId
    });
  };

  const editLearningObj = (learningData: any) => {
    setIsFormOpen(true);
    setSelectedObjectiveData(learningData);
  };

  const editCurrentTopic = (
    topicData: any,
    curIdx: number,
    objectiveIdx: number,
    topicIdx: number
  ) => {
    setTopicModal(true);
    setSelectedTopicData({...topicData, curIdx, objectiveIdx, topicIdx});
  };

  const onTopicModalClose = () => {
    setTopicModal(false);
    setSelectedRubricData({});
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedObjectiveData({});
  };

  useEffect(() => {
    fetchCurriculum();
    fetchLessonRubrics();
  }, []);

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
    rubricList = rubricList.data.listRubrics?.items || [];

    const [results, _, topics]: any = await Promise.all([
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

    setLearnings(learningObjectives);
    const learningObjectiveData = learningObjectives?.map((objective: any) => {
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
              rubricId: rubric.id
            });
          });
          return topic;
        });
      objective.associatedTopics = associatedTopics;
      return objective;
    });
    setEvidenceListLoading(false);
    const sortInner = (a: any, b: any) =>
      a.measurementName.toLowerCase() > b.measurementName.toLowerCase() ? 1 : -1;
    const sorted = learningEvidenceList.sort(sortInner);
    return {
      learningObjectiveData,
      learningEvidenceList: sorted
    };
  };

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(listCurricula, {
          filter: {
            institutionID: {eq: institutionId}
          }
        })
      );
      const curriculums = list.data?.listCurricula?.items;

      let selectedCurriculums = getSelectedCurriculum(curriculums, lessonId);

      for (const curriculum of selectedCurriculums) {
        const {learningObjectiveData, learningEvidenceList} = await fetchObjectives(
          curriculum.id
        );
        curriculum.learningObjectiveData = learningObjectiveData;
        curriculum.learningEvidenceList = learningEvidenceList;
      }
      setSelectedCurriculumList(selectedCurriculums);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    rubricId: string
  ) => {
    event.stopPropagation();
    setUnsavedChanges(true);
    const checked: boolean = (event.target as HTMLInputElement).checked;
    let rubrics =
      selectedMeasurements && selectedMeasurements?.length > 0
        ? [...selectedMeasurements]
        : [];
    const index: number = (selectedMeasurements || []).findIndex(
      (item: any) => item.rubricID === rubricId
    );

    if (index > -1) {
      rubrics[index] = {
        ...rubrics[index],
        checked
      };
    } else {
      rubrics.push({
        rubricID: rubricId,
        checked
      });
    }
    setSelectedMeasurements(rubrics);
    updateMeasurementList(rubrics);
  };

  const postLearningObjectiveChange = (data: any) => {
    setSelectedCurriculumList((prevList) =>
      prevList.map((item) =>
        item.id === data.curriculumID
          ? {
              ...item,
              learningObjectiveData: selectedObjectiveData?.id
                ? item.learningObjectiveData.map((objective: any) =>
                    objective.id === data.id ? {...objective, ...data} : objective
                  )
                : [...item.learningObjectiveData, data]
            }
          : item
      )
    );
    setIsFormOpen(false);
    setSelectedObjectiveData({});
  };

  const renderTableView = (learningEvidenceList: any) => {
    return (
      <MeasurementsList
        handleCheckboxChange={handleCheckboxChange}
        learningEvidenceList={learningEvidenceList}
        loading={evidenceListLoading}
        selectedMeasurements={selectedMeasurements}
        setAddModalShow={setAddModalShow}
      />
    );
  };

  const titleList = selectedCurriculumList.map((curriculum, index) => ({
    id: index,
    title: curriculum.name,
    content: renderTableView(curriculum.learningEvidenceList),
    uniqueId: curriculum.id
  }));

  const [learnings, setLearnings] = useState<any[]>([]);

  const postMeasurementChange = (data: any) => {
    const {objectiveId, topicId} = selectedRubricData;

    let index = selectedCurriculumList.findIndex(
      (item) => item.id === selectedRubricData.curriculumID
    );

    let temp: any[] = [...selectedCurriculumList];

    if (index === -1) return;

    let selObjIdx = temp[index].learningObjectiveData.findIndex(
      (item: any) => item.id === objectiveId
    );
    let topics = temp[index].learningObjectiveData[selObjIdx].associatedTopics;

    const topicIndex = topics?.findIndex((topic: any) => topic.id === topicId);
    if (selectedRubricData?.id) {
      const rubricIndex = topics[topicIndex].associatedRubrics.findIndex(
        (rubric: any) => rubric.id === selectedRubricData.id
      );
      temp[index].learningObjectiveData[selObjIdx] = {
        ...temp[index].learningObjectiveData[selObjIdx],
        associatedTopics: topics.map((topic: any, index: number) =>
          index !== topicIndex
            ? topic
            : {
                ...topic,
                associatedRubrics: topic.associatedRubrics.map((rubric: any, i: number) =>
                  i !== rubricIndex
                    ? rubric
                    : {
                        ...rubric,
                        name: data.name,
                        criteria: data.criteria
                      }
                )
              }
        )
      };
    } else {
      temp[index].learningObjectiveData[selObjIdx] = {
        ...temp[index].learningObjectiveData[selObjIdx],
        associatedTopics: topics.map((topic: any, index: number) =>
          index !== topicIndex
            ? topic
            : {
                ...topic,
                associatedRubrics: [...(topic.associatedRubrics || []), data]
              }
        )
      };
    }

    setTimeout(() => {
      setSelectedCurriculumList(temp);

      onMeasurementClose();
    }, 500);
  };

  const postTopicChange = (data: any) => {
    const {curIdx = -1, objectiveIdx = -1, topicIdx = -1} = selectedTopicData;
    let temp: any[] = [...selectedCurriculumList];

    if (curIdx === -1) return;

    let topics = temp[curIdx].learningObjectiveData[objectiveIdx].associatedTopics;

    if (selectedTopicData?.id) {
      temp[curIdx].learningObjectiveData[objectiveIdx] = {
        ...temp[curIdx].learningObjectiveData[objectiveIdx],
        associatedTopics: topics.map((topic: any, index: number) =>
          index !== topicIdx
            ? topic
            : {
                ...topic,
                ...data
              }
        )
      };
    } else {
      temp[curIdx].learningObjectiveData[objectiveIdx] = {
        ...temp[curIdx].learningObjectiveData[objectiveIdx],
        associatedTopics: [...topics, data]
      };
    }
    setTimeout(() => {
      setSelectedCurriculumList(temp);

      onTopicModalClose();
    }, 500);
  };

  return (
    <div className="flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-2 xl:px-8 bg-lightest  border-0 border-light">
          <SectionTitleV3
            withButton={
              Boolean(learnings?.length) && (
                <Buttons
                  disabled={loading}
                  label={LEARINGOBJECTIVEDICT[userLanguage]['BUTTON']['ADD']}
                  Icon={IoIosAdd}
                  onClick={createLearningObjective}
                />
              )
            }
            title={LearningEvidenceDict[userLanguage]['TITLE']}
          />

          {loading ? (
            <div className="mt-4">
              <Loader animation />
            </div>
          ) : titleList.length ? (
            <>
              <div className="w-full flex justify-between">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:max-w-none">
                  {selectedCurriculumList.map((curriculum, idx) => (
                    <CourseMeasurementsCard
                      curriculum={curriculum}
                      editCurrentMeasurement={editCurrentMeasurement}
                      handleCheckboxChange={handleCheckboxChange}
                      selectedMeasurements={selectedMeasurements}
                      setAddModalShow={setAddModalShow}
                      key={curriculum.id}
                      curIdx={idx}
                      editCurrentTopic={editCurrentTopic}
                      addLearningObjective={addLearningObjective}
                      editLearningObj={editLearningObj}
                    />
                  ))}
                </div>
              </div>

              {serverMessage.message && (
                <div className="py-2 m-auto mt-2 text-center">
                  <p
                    className={`${
                      serverMessage.isError ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {serverMessage.message}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 my-6 text-center">
              <p className="text-medium  font-medium">
                {AddNewLessonFormDict[userLanguage]['MESSAGES']['LESSONNOTHAVE']}
              </p>
            </div>
          )}
        </PageWrapper>

        <Modal
          open={addModalShow}
          showHeader
          showFooter={false}
          showHeaderBorder
          title={'Add Evidence'}
          closeOnBackdrop
          closeAction={() => setAddModalShow(false)}>
          <div className="min-w-256">
            <AddEvidence />
          </div>
        </Modal>

        <Modal
          open={isFormOpen}
          showHeader
          showFooter={false}
          showHeaderBorder
          title={'Learning Objective'}
          closeOnBackdrop
          closeAction={handleCancel}>
          <div className="min-w-120">
            <AddLearningObjective
              curricularId={selectedObjectiveData.curricularId}
              handleCancel={handleCancel}
              learningObjectiveData={selectedObjectiveData}
              postMutation={postLearningObjectiveChange}
            />
          </div>
        </Modal>

        <Modal
          open={openMeasurementModal}
          showHeader={true}
          title={AddMeasurementDict[userLanguage]['heading']}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={onMeasurementClose}>
          <AddMeasurement
            curricularId={selectedRubricData.curriculumID}
            onCancel={onMeasurementClose}
            postMutation={postMeasurementChange}
            rubricData={selectedRubricData}
            topicId={selectedRubricData.topicId}
          />
        </Modal>

        <Modal
          open={openTopicModal}
          showHeader={true}
          title={AddTopicDict[userLanguage]['heading']}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={onTopicModalClose}>
          <AddTopic
            curricularId={selectedTopicData.curriculumID}
            onCancel={onTopicModalClose}
            postMutation={postTopicChange}
            topicData={selectedTopicData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default LearningEvidence;
