import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Loader from '@components/Atoms/Loader';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import PageWrapper from 'atoms/PageWrapper';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import ModalPopUp from 'molecules/ModalPopUp';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {HiOutlineTrash, HiPencil} from 'react-icons/hi';
import {IoIosAdd} from 'react-icons/io';
import AddLearningObjective from '../AddLearningObjective';
import AddMeasurement from '../AddMeasurement';
import AddTopic from '../AddTopic';

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
}

const LearningObjective = (props: LearningObjectiveProps) => {
  const {curricularId} = props;
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedObjectiveData, setSelectedObjectiveData] = useState<any>({});
  const [learnings, setLearnings] = useState([]);
  const [learningIds, setLearningIds] = useState([]);
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
  const {clientKey, userLanguage} = useContext(GlobalContext);

  const {
    AddMeasurementDict,
    AddTopicDict,
    LEARINGOBJECTIVEDICT,
    TOPICLISTDICT
  } = useDictionary(clientKey);

  const createLearningObjective = () => {
    setIsFormOpen(true);
    setSelectedObjectiveData({});
  };
  const editLearningObj = (learningData: any) => {
    setIsFormOpen(true);
    setSelectedObjectiveData(learningData);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedObjectiveData({});
  };

  const fetchLearningObjs = async () => {
    setLoading(true);
    let [list, seq]: any = await Promise.all([
      await API.graphql(
        graphqlOperation(queries.listLearningObjectives, {
          filter: {curriculumID: {eq: curricularId}}
        })
      ),
      await API.graphql(
        graphqlOperation(queries.getCSequences, {id: `l_${curricularId}`})
      )
    ]);
    seq = seq?.data?.getCSequences?.sequence || [];
    list = list?.data?.listLearningObjectives?.items || [];

    const sequenceLength = seq?.length;
    const listLength = list?.length;
    await Promise.all(
      list.map(async (objective: any) => {
        objective.index = seq.indexOf(objective.id);
        const topicsData: any = await API.graphql(
          graphqlOperation(customQueries.listTopics, {
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
                graphqlOperation(customQueries.listRubrics, {
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

    if (listLength && !sequenceLength) {
      let learningsID = list.map((item: {id: string}) => item.id);
      let seqItem: any = await API.graphql(
        graphqlOperation(mutations.createCSequences, {
          input: {id: `l_${curricularId}`, sequence: learningsID}
        })
      );
      seqItem = seqItem.data.createCSequences;
      setLearningIds(learningsID);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLearningObjs();
  }, []);

  const createNewTopic = (learningObjectiveID: string) => {
    setTopicModal(true);
    setSelectedTopicData({
      learningObjectiveID
    });
    // history.push(
    //   `/dashboard/manage-institutions/curricular/${curricularId}/topic/add?lid=${learningId}`
    // );
  };

  const editCurrentTopic = (topicData: any) => {
    setTopicModal(true);
    setSelectedTopicData(topicData);
    // history.push(
    //   `/dashboard/manage-institutions/curricular/${curricularId}/topic/edit/${id}`
    // );
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
    // history.push(
    //   `/dashboard/manage-institutions/curricular/${curricularId}/measurement/add?tid=${topicID}`
    // );
  };

  const editCurrentMeasurement = (rubricData: any, objectiveId: string) => {
    setOpenMeasurementModal(true);
    setSelectedRubricData({
      ...rubricData,
      topicId: rubricData.topicID,
      objectiveId
    });
    // history.push(
    //   `/dashboard/manage-institutions/curricular/${curricularId}/measurement/edit/${id}`
    // );
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
      message: `Are you sure you want to delete ${section}?. This action cannot be undone.`
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
        deleteLearningObjective();
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

  const deleteLearningObjective = async () => {
    try {
      setDeleting(true);
      await API.graphql(
        graphqlOperation(mutations.deleteLearningObjective, {
          input: {id: warnModal.id}
        })
      );
      await API.graphql(
        graphqlOperation(mutations.updateCSequences, {
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
    } catch (error) {}
  };

  const deleteTopic = async () => {
    try {
      setDeleting(true);
      const result: any = await API.graphql(
        graphqlOperation(mutations.deleteTopic, {
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
    } catch (error) {}
  };

  const deleteRubric = async () => {
    try {
      setDeleting(true);
      const result: any = await API.graphql(
        graphqlOperation(mutations.deleteRubric, {
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
    } catch (error) {}
  };

  const ActionBtns = ({
    actionOne,
    actionTwo
  }: {
    actionOne: () => void;
    actionTwo: () => void;
  }) => {
    return (
      <span className="w-auto inline-flex gap-x-2 items-center cursor-pointer">
        <Buttons
          onClick={actionOne}
          iconSize="w-4 h-6"
          Icon={HiPencil}
          size="small"
          transparent
        />
        <Buttons
          onClick={actionTwo}
          iconSize="w-4 h-6"
          Icon={HiOutlineTrash}
          size="small"
          transparent
          redBtn
        />
      </span>
    );
  };

  return (
    <div className="py-2 px-0 2xl:p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-4 ">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8">
            {LEARINGOBJECTIVEDICT[userLanguage]['TITLE']}
          </h3>
          {!loading ? (
            <Fragment>
              {Boolean(learnings?.length) && (
                <div className="flex justify-end w-fulll px-6 pb-4 m-auto">
                  <Buttons
                    btnClass=""
                    label={LEARINGOBJECTIVEDICT[userLanguage]['BUTTON']['ADD']}
                    labelClass={'leading-6'}
                    Icon={IoIosAdd}
                    iconBeforeLabel
                    onClick={createLearningObjective}
                  />
                </div>
              )}
              <div className="py-4">
                <div className="grid px-2 lg:px-6 gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 lg:max-w-none">
                  {/* <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="grid px-6 gap-5 lg:grid-cols-3 lg:max-w-none"> */}
                  {isFormOpen && (
                    <div className="flex shadow flex-col overflow-hidden white_back">
                      <AddLearningObjective
                        curricularId={curricularId}
                        handleCancel={handleCancel}
                        learningObjectiveData={selectedObjectiveData}
                        postMutation={postLearningObjectiveChange}
                      />
                    </div>
                  )}
                  {learnings.map((learning: any) => (
                    <div
                      className="flex customShadow hover:theme-card-shadow flex-col bg-white rounded-xl overflow-hidden"
                      key={learning.id}>
                      <div className="flex-shrink-0">
                        <div className="p-4 pb-0">
                          <div className="flex">
                            <span className="inline-flex items-center text-base font-medium">
                              {learning.name}
                            </span>

                            <ActionBtns
                              actionOne={() => editLearningObj(learning)}
                              actionTwo={() => deleteModal(learning?.id, 'objective')}
                            />
                          </div>

                          <div className="mt-5 h-48 overflow-y-auto">
                            {learning.topics?.length ? (
                              learning.topics.map((topic: any, topicIndex: number) => (
                                <div
                                  key={topic.id}
                                  className="pr-1 show-action-on-hover-2 mb-2">
                                  <div className="flex show-action-on-hover justify-between items-center">
                                    <span className={`text-base  pr-2`}>
                                      {topicIndex + 1}. {topic.name}
                                    </span>

                                    <div className="actions w-auto">
                                      <ActionBtns
                                        actionOne={() => editCurrentTopic(topic)}
                                        actionTwo={() => deleteModal(topic?.id, 'topic')}
                                      />
                                    </div>
                                  </div>
                                  <ul className="pl-3">
                                    {topic.rubrics?.length ? (
                                      <>
                                        {topic.rubrics.map(
                                          (rubric: any, rubricIndex: number) => (
                                            <li
                                              className="flex show-action-on-hover justify-between items-center py-1 truncate"
                                              key={rubric.id}>
                                              <span className="pr-2 text-gray-600 text-base truncate">
                                                {topicIndex + 1}.{rubricIndex + 1}{' '}
                                                {rubric.name}
                                              </span>

                                              <div className="actions w-auto">
                                                <ActionBtns
                                                  actionOne={() =>
                                                    editCurrentMeasurement(
                                                      rubric,
                                                      learning.id
                                                    )
                                                  }
                                                  actionTwo={() =>
                                                    deleteModal(rubric?.id, 'measurement')
                                                  }
                                                />
                                              </div>
                                            </li>
                                          )
                                        )}
                                        <Buttons
                                          type="submit"
                                          size="small"
                                          onClick={() =>
                                            createNewMeasurement(topic.id, learning.id)
                                          }
                                          title={
                                            AddMeasurementDict[userLanguage]['title']
                                          }
                                          transparent
                                          label={
                                            AddMeasurementDict[userLanguage]['title']
                                          }
                                          iconBeforeLabel
                                          Icon={IoIosAdd}
                                        />
                                      </>
                                    ) : learning.topics?.length < 2 ? (
                                      <Buttons
                                        type="submit"
                                        size="small"
                                        transparent
                                        onClick={() =>
                                          createNewMeasurement(topic.id, learning.id)
                                        }
                                        label={AddMeasurementDict[userLanguage]['title']}
                                        title={AddMeasurementDict[userLanguage]['title']}
                                        iconBeforeLabel
                                        Icon={IoIosAdd}
                                      />
                                    ) : (
                                      <Buttons
                                        type="submit"
                                        size="small"
                                        transparent
                                        onClick={() =>
                                          createNewMeasurement(topic.id, learning.id)
                                        }
                                        label={AddMeasurementDict[userLanguage]['title']}
                                        title={AddMeasurementDict[userLanguage]['title']}
                                        iconBeforeLabel
                                        Icon={IoIosAdd}
                                      />
                                    )}
                                  </ul>
                                </div>
                              ))
                            ) : (
                              <Buttons
                                size="small"
                                type="submit"
                                onClick={() => createNewTopic(learning.id)}
                                label={TOPICLISTDICT[userLanguage]['ADD']}
                                iconBeforeLabel
                                Icon={IoIosAdd}
                              />
                            )}
                          </div>
                        </div>
                        <div className="py-3 border-t-0 flex justify-center">
                          <Buttons
                            size="small"
                            type="submit"
                            onClick={() => createNewTopic(learning.id)}
                            label={TOPICLISTDICT[userLanguage]['ADD']}
                            iconBeforeLabel
                            Icon={IoIosAdd}
                          />
                        </div>
                      </div>
                    </div>
                    // </div>
                    // )}
                    // </Draggable>
                  ))}
                  {/* {provided.placeholder} */}
                </div>
                {/* )} */}
                {/* </Droppable>
                  </DragDropContext> */}
                {/* </div> */}
                {/* <DragableAccordion
                    titleList={learnings}
                    onDragEnd={onDragEnd}
                    showEdit
                    onItemEdit={editLearningObj}
                  /> */}
              </div>
              {!loading && !isFormOpen && !learnings?.length && (
                <Fragment>
                  <div className="flex justify-center mt-8">
                    <Buttons
                      btnClass="mx-4"
                      label={LEARINGOBJECTIVEDICT[userLanguage]['BUTTON']['ADD']}
                      onClick={createLearningObjective}
                    />
                  </div>
                  <p className="text-center p-16">
                    {' '}
                    {LEARINGOBJECTIVEDICT[userLanguage]['INFO']}
                  </p>
                </Fragment>
              )}
            </Fragment>
          ) : (
            <div className="py-12 my-12 m-auto text-center">
              <Loader
                className="text-gray-500"
                animation
                withText={LEARINGOBJECTIVEDICT[userLanguage]['FETCH']}
              />
            </div>
          )}
        </PageWrapper>
        {warnModal.show && (
          <ModalPopUp
            closeAction={onCancel}
            saveAction={onSaveAction}
            saveLabel="Yes"
            cancelLabel="No"
            loading={deleting}
            message={warnModal.message}
          />
        )}
        {openMeasurementModal && (
          <Modal
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
        )}
        {openTopicModal && (
          <Modal
            showHeader={true}
            title={AddTopicDict[userLanguage]['heading']}
            showHeaderBorder={true}
            showFooter={false}
            closeAction={onTopicModalClose}>
            <AddTopic
              curricularId={curricularId}
              onCancel={onTopicModalClose}
              postMutation={postTopicChange}
              topicData={selectedTopicData}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LearningObjective;
