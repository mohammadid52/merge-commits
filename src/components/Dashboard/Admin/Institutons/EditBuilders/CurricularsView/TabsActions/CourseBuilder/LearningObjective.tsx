import Loader from '@components/Atoms/Loader';
import {Empty} from '@components/Dashboard/Admin/LessonsBuilder/StepActionComponent/LearningEvidence/CourseMeasurementsCard';
import {RoomStatus} from 'API';
import {message} from 'antd';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import {listTopics, listRubrics} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {deleteLearningObjective, updateCSequences} from 'graphql/mutations';
import {listLearningObjectives, getCSequences} from 'graphql/queries';
import PageLayout from 'layout/PageLayout';
import {isEmpty} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import {Fragment, useEffect, useState} from 'react';
import {HiOutlineTrash, HiPencil} from 'react-icons/hi';
import {IoIosAdd} from 'react-icons/io';
import AddLearningObjective from '../AddLearningObjective';
import AddMeasurement from '../AddMeasurement';
import AddTopic from '../AddTopic';

const ActionBtns = ({
  actionOne,
  actionTwo
}: {
  actionOne: () => void;
  actionTwo: () => void;
  titleOne?: string;
  titleTwo?: string;
}) => {
  return (
    <span
      style={{transform: 'scale(0.7)'}}
      className="w-auto inline-flex gap-x-2 items-center cursor-pointer">
      {actionOne && (
        <Buttons onClick={actionOne} Icon={HiPencil} size="small" transparent />
      )}
      {actionTwo && (
        <Buttons
          onClick={actionTwo}
          Icon={HiOutlineTrash}
          size="small"
          transparent
          redBtn
        />
      )}
    </span>
  );
};

const Topic = ({
  topic,
  topicIndex,

  createNewMeasurement,
  learning,
  deleteModal,
  editCurrentMeasurement,
  editCurrentTopic
}: {
  topic: any;
  topicIndex: number;
  editCurrentTopic: (topic: any) => void;

  createNewMeasurement: (topicId: string, learningId: string) => void;
  learning: any;
  deleteModal: (id: string, type: string) => void;
  editCurrentMeasurement: (rubric: any, learningId: string) => void;
}) => {
  return (
    <div className=" w-auto">
      <div key={topic.id} className="pr-1  show-action-on-hover-2 mb-2">
        <div className="flex show-action-on-hover justify-start items-center">
          <span className={`text-base w-auto  pr-2`}>
            {topicIndex + 1}. {topic.name}
          </span>

          <div className="w-auto flex actions">
            <span
              style={{transform: 'scale(0.7)'}}
              className="w-auto inline-flex gap-x-2 items-center cursor-pointer">
              <Buttons
                onClick={() => editCurrentTopic(topic)}
                Icon={HiPencil}
                size="small"
                transparent
              />

              <Buttons
                onClick={() => deleteModal(topic?.id, 'topic')}
                Icon={HiOutlineTrash}
                size="small"
                transparent
                redBtn
              />

              <Buttons
                onClick={() => createNewMeasurement(topic.id, learning.id)}
                Icon={IoIosAdd}
                size="small"
                transparent
              />
            </span>
          </div>
        </div>
        <ul className="pl-3">
          {topic.rubrics?.length ? (
            <>
              {topic.rubrics.map((rubric: any, rubricIndex: number) => (
                <li
                  className="flex show-action-on-hover justify-between items-center py-1 truncate"
                  key={rubric.id}>
                  <span className="pr-2 text-medium  text-base truncate">
                    {topicIndex + 1}.{rubricIndex + 1} {rubric.name}
                  </span>

                  <div className="actions w-auto">
                    <ActionBtns
                      titleOne="Edit measurement"
                      titleTwo="Delete measurement"
                      actionOne={() => editCurrentMeasurement(rubric, learning.id)}
                      actionTwo={() => deleteModal(rubric?.id, 'measurement')}
                    />
                  </div>
                </li>
              ))}
            </>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

declare global {
  interface Array<T> {
    chunk(o: T): Array<T>;
  }
}

// ? chunk method injected in Array prototype
Array.prototype.chunk = function (n) {
  if (!this.length) {
    return [];
  }
  return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

interface LearningObjectiveProps {
  curricularId: string;
  institutionId?: string;
  status: RoomStatus;
}

const LearningObjective = (props: LearningObjectiveProps) => {
  const {curricularId, status} = props;
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedObjectiveData, setSelectedObjectiveData] = useState<any>({});
  const [learnings, setLearnings] = useState<any[]>([]);
  const [learningIds, setLearningIds] = useState<any[]>([]);
  const [openMeasurementModal, setOpenMeasurementModal] = useState(false);
  const [selectedRubricData, setSelectedRubricData] = useState<any>({});
  const [openTopicModal, setTopicModal] = useState(false);
  const [selectedTopicData, setSelectedTopicData] = useState<any>({});
  const [warnModal, setWarnModal] = useState({
    show: false,
    section: '',
    id: '',
    message: "Are you sure? This can't be undone."
  });
  const {userLanguage} = useGlobalContext();

  const [createOrEditLearningObjectiveModal, setCreateOrEditLearningObjectiveModal] =
    useState(false);

  const {AddMeasurementDict, AddTopicDict, LEARINGOBJECTIVEDICT} = useDictionary();

  const createLearningObjective = () => {
    setCreateOrEditLearningObjectiveModal(true);
    setSelectedObjectiveData({});
  };

  const editLearningObj = (learningData: any) => {
    setSelectedObjectiveData(learningData);
    setCreateOrEditLearningObjectiveModal(true);
  };

  const handleCancel = () => {
    setCreateOrEditLearningObjectiveModal(false);

    setSelectedObjectiveData({});
  };

  const fetchLearningObjs = async () => {
    setLoading(true);
    let [list, seq]: any = await Promise.all([
      await API.graphql(
        graphqlOperation(listLearningObjectives, {
          filter: {curriculumID: {eq: curricularId}}
        })
      ),
      await API.graphql(graphqlOperation(getCSequences, {id: `l_${curricularId}`}))
    ]);
    seq = seq?.data?.getCSequences?.sequence || [];
    list = list?.data?.listLearningObjectives?.items || [];

    const sequenceLength = seq?.length;
    const listLength = list?.length;
    await Promise.all(
      list.map(async (objective: any) => {
        objective.index = seq.indexOf(objective.id);
        const topicsData: any = await API.graphql(
          graphqlOperation(listTopics, {
            filter: {learningObjectiveID: {eq: objective.id}}
          })
        );
        objective.topics = await Promise.all(
          (topicsData?.data.listTopics?.items || [])
            .sort((a: any, b: any) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            )
            .map(async (t: any) => {
              const measurementData: any = await API.graphql(
                graphqlOperation(listRubrics, {
                  filter: {topicID: {eq: t.id}}
                })
              );
              t.rubrics =
                measurementData.data.listRubrics?.items.sort((a: any, b: any) =>
                  a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                ) || [];
              return t;
            })
        );
      })
    );
    setLearnings(list.sort((a: any, b: any) => (a.index > b.index ? 1 : -1)));
    setLearningIds(seq);
    setLoading(false);
    if (listLength && !sequenceLength) {
      let learningsID = list.map((item: {id: string}) => item.id);

      setLearningIds(learningsID);
    }
  };

  useEffect(() => {
    fetchLearningObjs();
  }, []);

  const createNewTopic = (learningObjectiveID: string) => {
    setTopicModal(true);
    setSelectedTopicData({
      learningObjectiveID
    });
  };

  const editCurrentTopic = (topicData: any) => {
    setTopicModal(true);
    setSelectedTopicData(topicData);
  };

  const onTopicModalClose = () => {
    setTopicModal(false);
    setSelectedRubricData({});
  };

  const createNewMeasurement = (topicId: string, objectiveId: string) => {
    setOpenMeasurementModal(true);
    setSelectedRubricData({
      topicId,
      objectiveId
    });
  };

  const editCurrentMeasurement = (rubricData: any, objectiveId: string) => {
    setOpenMeasurementModal(true);
    setSelectedRubricData({
      ...rubricData,
      topicId: rubricData.topicID,
      objectiveId
    });
  };

  const onMeasurementClose = () => {
    setOpenMeasurementModal(false);
    setSelectedRubricData({});
  };

  const postLearningObjectiveChange = (data: any) => {
    if (selectedObjectiveData?.id) {
      const index = learnings.findIndex(
        (learning) => learning.id === selectedObjectiveData?.id
      );
      learnings[index] = {
        ...learnings[index],
        name: data.name,
        description: data.description
      };
      setLearnings(learnings);
    } else {
      setLearnings((prevLearnings) => [...prevLearnings, {...data, topics: []}]);
    }
    handleCancel();
  };

  const postMeasurementChange = (data: any) => {
    const {objectiveId, topicId} = selectedRubricData;
    let temp = [...learnings];
    const index = temp.findIndex((objective) => objective.id === objectiveId);
    const topicIndex = temp[index].topics.findIndex((topic: any) => topic.id === topicId);
    if (selectedRubricData?.id) {
      const rubricIndex = temp[index].topics[topicIndex].rubrics.findIndex(
        (rubric: any) => rubric.id === selectedRubricData.id
      );
      temp[index] = {
        ...temp[index],
        topics: temp[index].topics.map((topic: any, index: number) =>
          index !== topicIndex
            ? topic
            : {
                ...topic,
                rubrics: topic.rubrics.map((rubric: any, i: number) =>
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
      setLearnings(temp);
    } else {
      temp[index] = {
        ...temp[index],
        topics: temp[index].topics.map((topic: any, index: number) =>
          index !== topicIndex
            ? topic
            : {
                ...topic,
                rubrics: [...(topic.rubrics || []), data]
              }
        )
      };
      setLearnings(temp);
    }
    onMeasurementClose();
  };

  const postTopicChange = (data: any) => {
    const {learningObjectiveID} = selectedTopicData;
    let temp = [...learnings];
    const index = temp.findIndex((objective) => objective.id === learningObjectiveID);
    if (selectedTopicData?.id) {
      const topicIndex = temp[index].topics.findIndex(
        (topic: any) => topic.id === selectedTopicData.id
      );
      temp[index] = {
        ...temp[index],
        topics: temp[index].topics.map((topic: any, index: number) =>
          index !== topicIndex
            ? topic
            : {
                ...topic,
                ...data
              }
        )
      };
      setLearnings(temp);
    } else {
      temp[index] = {
        ...temp[index],
        topics: [...temp[index].topics, data]
      };
      setLearnings(temp);
    }
    onTopicModalClose();
  };

  const deleteModal = (id: string, section: string) => {
    setWarnModal({
      show: true,
      id,
      section,
      message: `Are you sure you want to delete ${section}?. This action cannot be undone. `
    });
  };

  const onCancel = () => {
    setWarnModal((prevValues) => ({
      ...prevValues,
      id: '',
      message: '',
      section: '',
      show: false
    }));
  };

  const onSaveAction = () => {
    const {section} = warnModal;
    switch (section) {
      case 'objective':
        deleteLearningObjectiveFn();
        break;
      case 'topic':
        deleteTopic();
        break;
      case 'measurement':
        deleteRubric();
        break;
      default:
        break;
    }
  };

  const deleteLearningObjectiveFn = async () => {
    try {
      setDeleting(true);
      await API.graphql(
        graphqlOperation(deleteLearningObjective, {
          input: {id: warnModal.id}
        })
      );
      await API.graphql(
        graphqlOperation(updateCSequences, {
          input: {
            id: `l_${curricularId}`,
            sequence: learningIds.filter((item) => item !== warnModal.id)
          }
        })
      );
      setLearnings((prevLearnings) =>
        prevLearnings.filter((objective) => objective.id !== warnModal.id)
      );
      setLearningIds((prevLearningIds) =>
        prevLearningIds.filter((item) => item !== warnModal.id)
      );
      setDeleting(false);
      onCancel();

      messageApi.success('Learning Objective deleted successfully');
    } catch (error) {
      console.error(error);
      messageApi.error('Something went wrong');
    }
  };

  const deleteTopic = async () => {
    try {
      setDeleting(true);
      const result: any = await API.graphql(
        graphqlOperation(deleteTopic, {
          input: {id: warnModal.id}
        })
      );
      const objectiveId = result?.data.deleteTopic.learningObjectiveID;
      let temp = [...learnings];
      const index = temp.findIndex((objective) => objective.id === objectiveId);
      temp[index] = {
        ...temp[index],
        topics: temp[index].topics.filter((topic: any) => topic.id !== warnModal.id)
      };
      setLearnings(temp);
      setDeleting(false);
      onCancel();
      messageApi.success('Topic deleted successfully');
    } catch (error) {
      console.error(error);
      messageApi.error('Something went wrong');
    }
  };

  const deleteRubric = async () => {
    try {
      setDeleting(true);
      const result: any = await API.graphql(
        graphqlOperation(deleteRubric, {
          input: {id: warnModal.id}
        })
      );
      const objectiveId = result?.data.deleteRubric?.topic.learningObjectiveID;
      const topicId = result?.data.deleteRubric?.topicID;
      let temp = [...learnings];
      const index = temp.findIndex((objective) => objective.id === objectiveId);
      const topicIndex = temp[index].topics.findIndex(
        (topic: any) => topic.id === topicId
      );
      temp[index] = {
        ...temp[index],
        topics: temp[index].topics.map((topic: any, index: number) =>
          index !== topicIndex
            ? topic
            : {
                ...topic,
                rubrics: topic.rubrics.filter((rubric: any) => rubric.id !== warnModal.id)
              }
        )
      };
      setLearnings(temp);
      setDeleting(false);
      onCancel();
      messageApi.success('Measurement deleted successfully');
    } catch (error) {
      console.error(error);
      messageApi.error('Something went wrong');
    }
  };

  const isInactive = status === RoomStatus.INACTIVE;

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="">
      {contextHolder}
      <div className="">
        <PageLayout
          type="inner"
          warning={
            isInactive
              ? 'This course is inactive. Adding learning objective to this course has been disabled'
              : ''
          }
          title={LEARINGOBJECTIVEDICT[userLanguage]['TITLE']}
          extra={
            Boolean(learnings?.length) && (
              <Buttons
                disabled={loading || isInactive}
                label={LEARINGOBJECTIVEDICT[userLanguage]['BUTTON']['ADD']}
                Icon={IoIosAdd}
                onClick={createLearningObjective}
              />
            )
          }>
          {!loading ? (
            <Fragment>
              <div className="py-4">
                <div className="grid  gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:max-w-none">
                  {learnings.map((learning: any) => (
                    <div
                      className="flex customShadow hover:theme-card-shadow flex-col bg-white rounded-xl overflow-hidden"
                      key={learning.id}>
                      <div className="flex-shrink-0">
                        <div className="p-4">
                          <div className=" topic-header text-center w-auto py-2">
                            <div className="text-center topic-header__heading tracking-wider uppercase text-base font-medium theme-text">
                              {learning.name}
                            </div>

                            <div className="actions-2 justify-center gap-x-4 flex items-center">
                              <Buttons
                                onClick={() => editLearningObj(learning)}
                                Icon={HiPencil}
                                size="small"
                                transparent
                              />
                              <Buttons
                                size="small"
                                type="submit"
                                onClick={() => createNewTopic(learning.id)}
                                Icon={IoIosAdd}
                              />
                              <Buttons
                                onClick={() => deleteModal(learning?.id, 'objective')}
                                Icon={HiOutlineTrash}
                                size="small"
                                transparent
                                redBtn
                              />
                            </div>
                          </div>

                          <div className="py-5 h-48 p-4 overflow-y-auto">
                            {learning.topics?.length ? (
                              learning.topics.map((topic: any, topicIndex: number) => {
                                return (
                                  <Topic
                                    topic={topic}
                                    key={topic?.id}
                                    topicIndex={topicIndex}
                                    editCurrentMeasurement={editCurrentMeasurement}
                                    createNewMeasurement={createNewMeasurement}
                                    editCurrentTopic={editCurrentTopic}
                                    deleteModal={deleteModal}
                                    learning={learning}
                                  />
                                );
                              })
                            ) : (
                              <Empty text="No topics found" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {!loading && !learnings?.length && (
                <Fragment>
                  <div className="flex justify-center mt-8">
                    <Buttons
                      label={LEARINGOBJECTIVEDICT[userLanguage]['BUTTON']['ADD']}
                      onClick={createLearningObjective}
                    />
                  </div>
                  <p className="text-center p-16">
                    {LEARINGOBJECTIVEDICT[userLanguage]['INFO']}
                  </p>
                </Fragment>
              )}
            </Fragment>
          ) : (
            <div className="py-12 my-12 m-auto text-center">
              <Loader withText={LEARINGOBJECTIVEDICT[userLanguage]['FETCH']} animation />
            </div>
          )}
        </PageLayout>

        <ModalPopUp
          open={warnModal.show}
          closeAction={onCancel}
          saveAction={onSaveAction}
          saveLabel="Yes"
          cancelLabel="No"
          loading={deleting}
          message={warnModal.message}
        />

        <Modal
          open={openMeasurementModal}
          showHeader={true}
          title={AddMeasurementDict[userLanguage]['title']}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={onMeasurementClose}>
          <AddMeasurement
            curricularId={curricularId}
            onCancel={onMeasurementClose}
            postMutation={postMeasurementChange}
            rubricData={selectedRubricData}
            topicId={selectedRubricData.topicId}
          />
        </Modal>

        <Modal
          open={createOrEditLearningObjectiveModal}
          showHeader={true}
          title={
            LEARINGOBJECTIVEDICT[userLanguage]['BUTTON'][
              isEmpty(selectedObjectiveData) ? 'ADD' : 'EDIT'
            ]
          }
          showHeaderBorder={true}
          showFooter={false}
          closeAction={handleCancel}>
          <AddLearningObjective
            curricularId={curricularId}
            handleCancel={handleCancel}
            learningObjectiveData={selectedObjectiveData}
            postMutation={postLearningObjectiveChange}
          />
        </Modal>

        <Modal
          open={openTopicModal}
          showHeader={true}
          title={AddTopicDict[userLanguage]['heading']}
          showHeaderBorder={true}
          showFooter={false}
          width={800}
          closeAction={onTopicModalClose}>
          <AddTopic
            curricularId={curricularId}
            onCancel={onTopicModalClose}
            postMutation={postTopicChange}
            topicData={selectedTopicData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default LearningObjective;
