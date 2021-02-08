import React, { Fragment, useEffect, useState } from 'react';
import { IoAdd, IoCaretDownCircleOutline, IoCaretUpCircleOutline } from 'react-icons/io5';
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import MeasurementList from './MeasMntList';

import Buttons from '../../../../../../Atoms/Buttons';
import { reorder } from '../../../../../../../utilities/strings';

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries';


interface TopicsListComponentProps {
  curricularId: string
  learningId: string
}

const TopicsListComponent = (props: TopicsListComponentProps) => {
  const { curricularId, learningId } = props;
  const history = useHistory();

  const [openRow, setOpenRow] = useState('');
  const [loading, setLoading] = useState(false)
  const [topics, setTopics] = useState([])
  const [topicIds, setTopicIds] = useState([])

  const expandRow = (id: string) => {
    if (openRow === id) {
      setOpenRow('')
    } else {
      setOpenRow(id)
    }
  }

  const createNewTopic = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/topic/add`)
  }

  const editCurrentTopic = (id: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/topic/edit/${id}`)
  }

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const list = reorder(topicIds, result.source.index, result.destination.index)
      setTopicIds(list)
      let topicsList = topics.map((t: any) => {
        let index = list.indexOf(t.id)
        return { ...t, index }
      }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
      setTopics(topicsList)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `t_${learningId}`, sequence: list } }));
      seqItem = seqItem.data.updateCSequences;
      console.log('seq updated');
    }
  }

  const fetchTopicList = async () => {
    // set loader true
    setLoading(true)
    // fetch topics list and its sequence
    let [list, seq]: any = await Promise.all([
      await API.graphql(graphqlOperation(customQueries.listTopics, {
        filter: { learningObjectiveID: { eq: learningId } },
      })),
      await API.graphql(graphqlOperation(queries.getCSequences,
        { id: `t_${learningId}` }))
    ]);
    list = list?.data.listTopics?.items || []
    seq = seq?.data.getCSequences?.sequence || []
    const sequenceLength = seq?.length;
    const listLength = list?.length;
    // sort list as per the seq
    list = list.map((t: any) => {
      let index = seq.indexOf(t.id)
      return { ...t, index }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))

    setTopics(list)
    setTopicIds(seq)
    if (listLength && !sequenceLength) {
      let topicsID = list.map((item: { id: string }) => item.id)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `t_${learningId}`, sequence: topicsID } }));
      seqItem = seqItem.data.createCSequences
      setTopicIds(topicsID)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTopicList();
  }, [])

  return (
    <Fragment>
      <div className="w-9/10 mx-auto my-4 flex">
        <div>
          <p className="text-base font-medium text-gray-600">Topics: </p>
        </div>
      </div>
      {!loading ? (
        <Fragment>
          {
            topics?.length > 0 ?
              <div className='mb-4'>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        <div className="w-9/10 m-auto border-b">
                          {topics.map((item: any, index: number) => (
                            <Fragment>
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div key={item.id} className={`flex justify-between w-full px-8 py-4 whitespace-no-wrap border border-b-0 border-gray-200 hover:bg-gray-200 ${(openRow === item.id) && 'bg-gray-200'}`}>
                                      <div className="flex w-8.5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal cursor-pointer text-gray-900 hover:text-gray-800" onClick={() => expandRow(item.id)}> {item.name} </div>
                                      <div className="flex w-1/10 px-8 py-3 text-left text-s leading-4 items-center text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => editCurrentTopic(item.id)}>
                                        Edit
                                      </div>
                                      <div className="flex w-1.5/10 items-center px-8 py-3 text-left text-s leading-4 justify-end" onClick={() => expandRow(item.id)}>
                                        <span className="w-6 h-6 flex items-center cursor-pointer">
                                          <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                                            {(openRow !== item.id) ? <IoCaretDownCircleOutline /> : <IoCaretUpCircleOutline />}
                                          </IconContext.Provider>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                              {(openRow === item.id) && <div className="border border-gray-200">
                                <MeasurementList curricularId={curricularId} topicID={item.id} />
                              </div>}
                            </Fragment>
                          ))}
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

              </div> : (
                <div>
                  <p className="text-center p-16">  This learning objective does not have any topics. Please create a new one.</p>
                </div>
              )
          }
          <div className="flex justify-center items-center my-2 w-9/10 mx-auto px-8 py-4 border border-dashed font-medium border-gray-400 text-gray-600 cursor-pointer" onClick={createNewTopic}>
            <span className="w-6 h-6 flex items-center mr-4">
              <IconContext.Provider value={{ size: '1.5rem', color: 'darkgray' }}>
                <IoAdd />
              </IconContext.Provider>
            </span>
          Add New Topic
        </div>
        </Fragment>
      ) : (
          <div>
            <p className="text-center p-16">  Fetching topics list...</p>
          </div >
        )}

    </Fragment >
  )
}

export default TopicsListComponent;