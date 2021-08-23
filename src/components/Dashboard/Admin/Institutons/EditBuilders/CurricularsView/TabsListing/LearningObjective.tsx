import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';
import {IconContext} from 'react-icons';
import {HiPencil} from 'react-icons/hi';
import {IoAdd} from 'react-icons/io5';
import {IoIosAdd} from 'react-icons/io';
// import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import {reorder, stringToHslColor} from '../../../../../../../utilities/strings';

import Buttons from '../../../../../../Atoms/Buttons';
import {DeleteActionBtn} from '../../../../../../Atoms/Buttons/DeleteActionBtn';
import Modal from '../../../../../../Atoms/Modal';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import ModalPopUp from '../../../../../../Molecules/ModalPopUp';

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';
import {getAsset} from '../../../../../../../assets';

import AddLearningObjective from '../TabsActions/AddLearningObjective';
import AddMeasurement from '../TabsActions/AddMeasurement';
import AddTopic from '../TabsActions/AddTopic';

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

interface LearningObjectiveListProps {
  curricularId: string;
  institutionId?: string;
}

const LearningObjectiveList = (props: LearningObjectiveListProps) => {
  const {curricularId, institutionId} = props;
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
    message: "Are you sure? This can't be undone.",
  });
  const {clientKey, userLanguage, theme} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {
    AddMeasurementDict,
    AddTopicDict,
    LEARINGOBJECTIVEDICT,
    TOPICLISTDICT,
  } = useDictionary(clientKey);

  const history = useHistory();

  const onDragEnd = async (result: any) => {
    try {
      if (result.source.index !== result.destination.index) {
        const list = reorder(learningIds, result.source.index, result.destination.index);
        setLearningIds(list);
        let learningsList = learnings
          .map((t: any) => {
            let index = list.indexOf(t.id);
            return {...t, index};
          })
          .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
        setLearnings(learningsList);
        let seqItem: any = await API.graphql(
          graphqlOperation(mutations.updateCSequences, {
            input: {id: `l_${curricularId}`, sequence: list},
          })
        );
        seqItem = seqItem.data.updateCSequences;
        console.log('seq updated');
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const createLearningObjective = () => {
    setIsFormOpen(true);
    setSelectedObjectiveData({});
    // history.push(
    //   `/dashboard/manage-institutions/${institutionId}/curricular/${curricularId}/learning-objective/add`
    // );
  };
  const editLearningObj = (learningData: any) => {
    setIsFormOpen(true);
    setSelectedObjectiveData(learningData);
    // history.push(
    //   `/dashboard/manage-institutions/${institutionId}/curricular/${curricularId}/learning-objective/edit/${learningId}`
    // );
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
          filter: {curriculumID: {eq: curricularId}},
        })
      ),
      await API.graphql(
        graphqlOperation(queries.getCSequences, {id: `l_${curricularId}`})
      ),
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
            filter: {learningObjectiveID: {eq: objective.id}},
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
                  filter: {topicID: {eq: t.id}},
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
          input: {id: `l_${curricularId}`, sequence: learningsID},
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
      learningObjectiveID,
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
      objectiveId,
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
      objectiveId,
    });
    // history.push(
    //   `/dashboard/manage-institutions/curricular/${curricularId}/measurement/edit/${id}`
    // );
  };

  const onMeasurementClose = () => {
    setOpenMeasurementModal(false);
    setSelectedRubricData({});
  };

  const getInitialFromObjectiveName = (name: string) => {
    const temp = name.replace(/a |an |the /gi, '');
    return temp.split('')[0];
  };

  const postLearningObjectiveChange = (data: any) => {
    if (selectedObjectiveData?.id) {
      const index = learnings.findIndex(
        (learning) => learning.id === selectedObjectiveData?.id
      );
      learnings[index] = {
        ...learnings[index],
        name: data.name,
        description: data.description,
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
                        criteria: data.criteria,
                      }
                ),
              }
        ),
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
                rubrics: [...(topic.rubrics || []), data],
              }
        ),
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
                ...data,
              }
        ),
      };
      setLearnings(temp);
    } else {
      temp[index] = {
        ...temp[index],
        topics: [...temp[index].topics, data],
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
      message: `Are you sure you want to delete ${section}?. This action cannot be undone.`,
    });
  };

  const onCancel = () => {
    setWarnModal((prevValues) => ({
      ...prevValues,
      id: '',
      message: '',
      section: '',
      show: false,
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
          input: {id: warnModal.id},
        })
      );
      await API.graphql(
        graphqlOperation(mutations.updateCSequences, {
          input: {
            id: `l_${curricularId}`,
            sequence: learningIds.filter((item) => item !== warnModal.id),
          },
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
          input: {id: warnModal.id},
        })
      );
      const objectiveId = result?.data.deleteTopic.learningObjectiveID;
      let temp = [...learnings];
      const index = temp.findIndex((objective) => objective.id === objectiveId);
      temp[index] = {
        ...temp[index],
        topics: temp[index].topics.filter((topic: any) => topic.id !== warnModal.id),
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
          input: {id: warnModal.id},
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
                rubrics: topic.rubrics.filter(
                  (rubric: any) => rubric.id !== warnModal.id
                ),
              }
        ),
      };
      setLearnings(temp);
      setDeleting(false);
      onCancel();
    } catch (error) {}
  };

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-4 bg-gray-100">
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
                <div className="grid px-6 gap-5 lg:grid-cols-3 lg:max-w-none">
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
                  {learnings.map((learning: any, index: number) => (
                    // <Draggable
                    //   key={learning.id}
                    //   draggableId={learning.id}
                    //   index={index}>
                    //   {(provided, snapshot) => (
                    //     <div
                    //       ref={provided.innerRef}
                    //       {...provided.draggableProps}
                    //       {...provided.dragHandleProps}>
                    <div
                      className="flex shadow flex-col white_back overflow-hidden"
                      key={learning.id}>
                      <div className="flex-shrink-0">
                        <div className="p-4">
                          <div className="flex">
                            {/* <span className="w-auto">
                                              <GiArrowScope className="w-12 h-12" />
                                            </span> */}
                            <div className="flex-shrink-0 h-16 w-16 flex items-center">
                              <div
                                className="h-14 w-14 rounded-full flex justify-center items-center text-white text-lg text-bold"
                                style={{
                                  background: `${stringToHslColor(
                                    getInitialFromObjectiveName(learning.name)
                                  )}`,
                                  textShadow: '0.1rem 0.1rem 2px #423939b3',
                                }}>
                                {getInitialFromObjectiveName(learning.name)}
                              </div>
                            </div>
                            <span className="inline-flex items-center ml-2 text-base font-bold">
                              {learning.name}
                            </span>
                            <span className="w-auto inline-flex items-center cursor-pointer">
                              <HiPencil
                                className="w-4 h-4"
                                onClick={() => editLearningObj(learning)}
                              />
                              <DeleteActionBtn
                                handleClick={() => deleteModal(learning?.id, 'objective')}
                              />
                            </span>
                          </div>

                          <div className="mt-5 h-48 overflow-y-auto">
                            {learning.topics?.length ? (
                              learning.topics.map((topic: any, topicIndex: number) => (
                                <div key={topic.id} className="pr-1 mb-2">
                                  <div className="flex justify-between items-center">
                                    <span
                                      className={`text-base ${theme.text.active} font-bold pr-2`}>
                                      {topicIndex + 1}. {topic.name}
                                    </span>
                                    <span className="w-auto inline-flex items-center cursor-pointer">
                                      <HiPencil
                                        className="w-4 h-4"
                                        onClick={() => editCurrentTopic(topic)}
                                      />
                                      <DeleteActionBtn
                                        handleClick={() =>
                                          deleteModal(topic?.id, 'topic')
                                        }
                                      />
                                    </span>
                                  </div>
                                  <ul className="pl-3">
                                    {topic.rubrics?.length ? (
                                      <>
                                        {topic.rubrics.map(
                                          (rubric: any, rubricIndex: number) => (
                                            <li
                                              className="flex justify-between items-center py-1 truncate"
                                              key={rubric.id}>
                                              <span className="pr-2 text-base truncate">
                                                {topicIndex + 1}.{rubricIndex + 1}{' '}
                                                {rubric.name}
                                              </span>
                                              <span className="w-auto inline-flex items-center cursor-pointer">
                                                <HiPencil
                                                  className="w-4 h-4"
                                                  onClick={() =>
                                                    editCurrentMeasurement(
                                                      rubric,
                                                      learning.id
                                                    )
                                                  }
                                                />
                                                <DeleteActionBtn
                                                  handleClick={() =>
                                                    deleteModal(rubric?.id, 'measurement')
                                                  }
                                                />
                                              </span>
                                            </li>
                                          )
                                        )}
                                        <div
                                          className={`text-sm ${theme.text.active} cursor-pointer flex`}
                                          onClick={() =>
                                            createNewMeasurement(topic.id, learning.id)
                                          }>
                                          <span className="w-auto flex items-center mr-1">
                                            <IconContext.Provider
                                              value={{
                                                color: theme.iconColor[themeColor],
                                              }}>
                                              <IoAdd className="w-4 h-4" />
                                            </IconContext.Provider>
                                          </span>
                                          Add new measurement
                                        </div>
                                      </>
                                    ) : learning.topics?.length < 2 ? (
                                      <div className="flex justify-center items-center">
                                        <div
                                          className="flex justify-center items-center my-5 w-full mx-2 px-8 py-4 h-28 border-0 border-dashed font-medium border-gray-400 text-gray-600 cursor-pointer"
                                          onClick={() =>
                                            createNewMeasurement(topic.id, learning.id)
                                          }>
                                          <span className="w-6 h-6 flex items-center mr-4">
                                            <IconContext.Provider
                                              value={{
                                                size: '1.5rem',
                                                color: 'darkgray',
                                              }}>
                                              <IoAdd />
                                            </IconContext.Provider>
                                          </span>
                                          Add measurement
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className={`text-base ${theme.text.active}  cursor-pointer flex`}
                                        onClick={() =>
                                          createNewMeasurement(topic.id, learning.id)
                                        }>
                                        <span className="w-auto flex items-center mr-1">
                                          <IconContext.Provider
                                            value={{
                                              color: theme.iconColor[themeColor],
                                            }}>
                                            <IoAdd className="w-4 h-4" />
                                          </IconContext.Provider>
                                        </span>
                                        Add measurement
                                      </div>
                                    )}
                                  </ul>
                                </div>
                              ))
                            ) : (
                              <div className="flex justify-center items-center">
                                <div
                                  className="flex justify-center items-center my-2 w-9/10 mx-auto px-8 py-4 h-36 border-0 border-dashed font-medium border-gray-400 text-gray-600 cursor-pointer"
                                  onClick={() => createNewTopic(learning.id)}>
                                  <span className="w-6 h-6 flex items-center mr-4">
                                    <IconContext.Provider
                                      value={{
                                        size: '1.5rem',
                                        color: 'darkgray',
                                      }}>
                                      <IoAdd />
                                    </IconContext.Provider>
                                  </span>
                                  Add Topic
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="border border-t-0 flex justify-center">
                          <Buttons
                            type="submit"
                            onClick={() => createNewTopic(learning.id)}
                            label={TOPICLISTDICT[userLanguage]['ADD']}
                            labelClass={'leading-6'}
                            overrideClass={true}
                            btnClass={`h-9 w-auto my-2 flex items-center rounded px-12 text-xs font-bold focus:outline-none transition duration-150 ease-in-out ${theme.btn.iconoclastIndigo}`}
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
              {LEARINGOBJECTIVEDICT[userLanguage]['FETCH']}
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

export default LearningObjectiveList;
