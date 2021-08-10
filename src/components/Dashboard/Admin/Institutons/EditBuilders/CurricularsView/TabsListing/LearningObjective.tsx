import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';
import {HiPencil} from 'react-icons/hi';
import {IoAdd} from 'react-icons/io5';
import {IconContext} from 'react-icons';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import TopicsListComponent from './TopicsList';
import {reorder, stringToHslColor} from '../../../../../../../utilities/strings';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import DragableAccordion from '../../../../../../Atoms/DragableAccordion';
import Buttons from '../../../../../../Atoms/Buttons';

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';
import {getAsset} from '../../../../../../../assets';
import AddLearningObjective from '../TabsActions/AddLearningObjective';
import {IoIosAdd} from 'react-icons/io';

interface LearningObjectiveListProps {
  curricularId: string;
  institutionId?: string;
}

const LearningObjectiveList = (props: LearningObjectiveListProps) => {
  const {curricularId, institutionId} = props;
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedObjectiveData, setSelectedObjectiveData] = useState<any>({});
  const [learnings, setLearnings] = useState([]);
  const [learningIds, setLearningIds] = useState([]);
  const {clientKey, userLanguage, theme} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {LEARINGOBJECTIVEDICT, TOPICLISTDICT} = useDictionary(clientKey);

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
        const topicsData: any = await API.graphql(
          graphqlOperation(customQueries.listTopics, {
            filter: {learningObjectiveID: {eq: objective.id}},
          })
        );
        console.log(topicsData, 'topicsData inside loop++++');

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
              console.log(measurementData, 'measurementData inside nested loop');

              t.rubrics =
                measurementData.data.listRubrics?.items.sort((a: any, b: any) =>
                  a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                ) || [];
              return t;
            })
        );
      })
    );
    console.log(list, 'list');

    // list = list
    //   .map((t: any) => {
    //     let index = seq.indexOf(t.id);
    //     return {
    //       id: t.id,
    //       title: t.name,
    //       content: <TopicsListComponent curricularId={curricularId} learningId={t.id} />,
    //       index,
    //     };
    //   })
    //   .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
    setLearnings(list);
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

  const createNewTopic = (learningId: string) => {
    history.push(
      `/dashboard/manage-institutions/curricular/${curricularId}/topic/add?lid=${learningId}`
    );
  };

  const editCurrentTopic = (id: string) => {
    history.push(
      `/dashboard/manage-institutions/curricular/${curricularId}/topic/edit/${id}`
    );
  };

  const createNewMeasurement = (topicID: string) => {
    history.push(
      `/dashboard/manage-institutions/curricular/${curricularId}/measurement/add?tid=${topicID}`
    );
  };

  const editCurrentMeasurement = (id: string) => {
    history.push(
      `/dashboard/manage-institutions/curricular/${curricularId}/measurement/edit/${id}`
    );
  };

  const getInitialFromObjectiveName = (name: string) => {
    const temp = name.replace(/a |an |the /gi, '');
    return temp.split('')[0];
  };

  const postMutation = (data: any) => {
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

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {LEARINGOBJECTIVEDICT[userLanguage]['TITLE']}
          </h3>
          {!loading ? (
            <Fragment>
              {Boolean(learnings?.length) && (
                <div className="flex justify-end w-9/10 m-auto ">
                  <Buttons
                    btnClass=""
                    label={LEARINGOBJECTIVEDICT[userLanguage]['BUTTON']['ADD']}
                    onClick={createLearningObjective}
                  />
                </div>
              )}
              <div className="py-4">
                <div className="grid px-6 gap-5 lg:grid-cols-3 lg:max-w-none">
                  {isFormOpen && (
                    <div className="flex shadow flex-col rounded-lg overflow-hidden">
                      <AddLearningObjective
                        curricularId={curricularId}
                        handleCancel={handleCancel}
                        learningObjectiveData={selectedObjectiveData}
                        postMutation={postMutation}
                      />
                    </div>
                  )}

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {learnings.map((learning: any, index: number) => (
                            <Draggable
                              key={learning.id}
                              draggableId={learning.id}
                              index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  <div
                                    className="flex shadow flex-col rounded-lg overflow-hidden"
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
                                                  getInitialFromObjectiveName(
                                                    learning.name
                                                  )
                                                )}`,
                                                textShadow: '0.1rem 0.1rem 2px #423939b3',
                                              }}>
                                              {getInitialFromObjectiveName(learning.name)}
                                            </div>
                                          </div>
                                          <span className="inline-flex items-center ml-5 text-lg font-bold">
                                            {learning.name}
                                          </span>
                                          <span
                                            className="w-auto inline-flex items-center cursor-pointer"
                                            onClick={() => editLearningObj(learning)}>
                                            <HiPencil className="w-4 h-4" />
                                          </span>
                                        </div>

                                        <div className="mt-5 h-48 overflow-y-auto">
                                          {learning.topics?.length ? (
                                            learning.topics.map((topic: any) => (
                                              <div key={topic.id} className="pr-1 mb-2">
                                                <div className="flex justify-between items-center">
                                                  <span
                                                    className={`text-lg ${theme.text.active} font-bold	`}>
                                                    {topic.name}
                                                  </span>
                                                  <span
                                                    className="w-auto cursor-pointer"
                                                    onClick={() =>
                                                      editCurrentTopic(topic.id)
                                                    }>
                                                    <HiPencil className="w-4 h-4" />
                                                  </span>
                                                </div>
                                                <ul className="pl-3">
                                                  {topic.rubrics?.length ? (
                                                    topic.rubrics.map((rubric: any) => (
                                                      <li
                                                        className="flex justify-between items-center py-1"
                                                        key={rubric.id}>
                                                        <span>{rubric.name}</span>
                                                        <span
                                                          className="w-auto cursor-pointer"
                                                          onClick={() =>
                                                            editCurrentMeasurement(
                                                              rubric.id
                                                            )
                                                          }>
                                                          <HiPencil className="w-4 h-4" />
                                                        </span>
                                                      </li>
                                                    ))
                                                  ) : learning.topics?.length < 2 ? (
                                                    <div className="flex justify-center items-center">
                                                      <div
                                                        className="flex justify-center items-center my-5 w-full mx-2 px-8 py-4 h-28 border-0 border-dashed font-medium border-gray-400 text-gray-600 cursor-pointer"
                                                        onClick={() =>
                                                          createNewMeasurement(topic.id)
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
                                                      className={`text-base ${theme.text.active}`}
                                                      onClick={() =>
                                                        createNewMeasurement(topic.id)
                                                      }>
                                                      Add new measurement
                                                    </div>
                                                  )}
                                                </ul>
                                              </div>
                                            ))
                                          ) : (
                                            <div className="flex justify-center items-center">
                                              <div
                                                className="flex justify-center items-center my-2 w-9/10 mx-auto px-8 py-4 h-36 border-0 border-dashed font-medium border-gray-400 text-gray-600 cursor-pointer"
                                                onClick={() =>
                                                  createNewTopic(learning.id)
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
                                          label={
                                            <>
                                              <span className="w-8 h-8 inline-flex items-center">
                                                <IconContext.Provider
                                                  value={{
                                                    size: '1.2rem',
                                                    color: '#ffffff',
                                                  }}>
                                                  <IoIosAdd />
                                                </IconContext.Provider>
                                              </span>
                                              <span>
                                                {TOPICLISTDICT[userLanguage]['ADD']}
                                              </span>
                                            </>
                                          }
                                          overrideClass={true}
                                          btnClass={`h-9 w-auto my-2 flex rounded px-12 text-xs focus:outline-none transition duration-150 ease-in-out ${theme.btn.iconoclastIndigo}`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
                {/* <DragableAccordion
                    titleList={learnings}
                    onDragEnd={onDragEnd}
                    showEdit
                    onItemEdit={editLearningObj}
                  /> */}
              </div>
              {!isFormOpen && !learnings?.length && (
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
      </div>
    </div>
  );
};

export default LearningObjectiveList;
