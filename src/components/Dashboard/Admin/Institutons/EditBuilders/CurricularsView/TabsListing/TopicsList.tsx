import React, { useEffect, Fragment, useState } from 'react'
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaGripVertical } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../../Atoms/Buttons';
import { reorder } from '../../../../../../../utilities/strings';

import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries'
import * as mutations from '../../../../../../../graphql/mutations';
interface TopicsListProps {
  topicsList?: any[]
  curricularId: string
}

const TopicsList = (props: TopicsListProps) => {
  const { curricularId } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const [topics, setTopics] = useState([])
  const [topicIds, setTopicIds] = useState([])
  const [sequenceId, setSequenceId] = useState('')

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const list = reorder(topicIds, result.source.index, result.destination.index)
      setTopicIds(list)
      let topicsList = topics.map((t: any) => {
        let index = list.indexOf(t.id)
        return { ...t, index }
      }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
      setTopics(topicsList)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCurriculumSequences, { input: { id: sequenceId, curriculumID: curricularId, type: 'topics', sequence: list } }));
      seqItem = seqItem.data.createCurriculumSequences;
      console.log('seq updated');
    }
  }

  const createNewTopic = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/topic/add`)
  }

  const editCurrentTopic = (id: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/topic/edit/${id}`)
  }

  const fetchTopics = async () => {
    setLoading(true)
    let list: any = await API.graphql(graphqlOperation(customQueries.listTopics, {
      filter: { curriculumID: { eq: curricularId } },
    }));
    list = list.data.listTopics?.items || []
    let item: any = await API.graphql(graphqlOperation(queries.getCurriculumSequences,
      { curriculumID: curricularId, type: 'topics' }))
    item = item.data.getCurriculumSequences || []
    list = list.map((t: any) => {
      let index = item?.sequence.indexOf(t.id)
      return { ...t, index }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
    setTopics(list)
    setTopicIds(item.sequence)
    setSequenceId(item.id)
    setLoading(false)
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CURRICULAR TOPICS</h3>
          {
            !loading ?
              <>
                {(topics && topics.length > 0) ? (
                  <Fragment>
                    <div className="flex justify-end w-8/10 m-auto ">
                      <Buttons btnClass="mx-4" label="Add new Topic" onClick={createNewTopic} />
                    </div>
                    <div className="flex justify-between w-8/10 m-auto px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>No.</span>
                      </div>
                      <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        <span>Topic Name</span>
                      </div>
                      <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider whitespace-normal">
                        <span>Learning Objective</span>
                      </div>
                      <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>Actions</span>
                      </div>
                    </div>

                    <div className="mb-8 w-8/10 m-auto max-h-88 overflow-y-auto">
                      {/* Drag and drop listing */}
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {topics.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200 cursor-move">

                                        {/* TODO: need to find some nice icon for drag and drop. */}
                                        {/* <div className="flex w-1/10 items-center px-2 py-8 text-left text-s leading-4 text-indigo-600">
                                          <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                                            <FaGripVertical />
                                          </IconContext.Provider>
                                        </div> */}

                                        <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                                        <div className="flex w-4/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal">
                                          {item.name}
                                        </div>
                                        <div className="flex w-4/10 items-center px-8 py-3 text-left text-s leading-4 whitespace-normal">
                                          {item.learningObjective ? item.learningObjective.name : '--'}
                                        </div>
                                        <span className="w-1/10 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => editCurrentTopic(item.id)}>
                                          edit
                                        </span>
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
                  </Fragment>
                ) : (
                    <Fragment>
                      <div className="flex justify-center mt-8">
                        <Buttons btnClass="mx-4" label="Add new Topic" onClick={createNewTopic} />
                      </div>
                      <p className="text-center p-16">  This curricular does not have any topics. Please create a new one.</p>
                    </Fragment>)}
              </> : <div className="py-12 my-12 m-auto text-center">Fetching Data Please wait...</div>
          }
        </PageWrapper>
      </div>
    </div>
  )
}

export default TopicsList
