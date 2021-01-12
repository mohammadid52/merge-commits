import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../../Atoms/Buttons';

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';

interface LearningObjectiveListProps {
  curricularId: string
}

const LearningObjectiveList = (props: LearningObjectiveListProps) => {
  const { curricularId } = props;
  const [loading, setLoading] = useState(false)
  const [learnings, setLearnings] = useState([])
  const [learningIds, setLearningIds] = useState([])
  const history = useHistory();

  const onDragEnd = async (result: any) => {
    try {
      if (result.source.index !== result.destination.index) {
        const list = reorder(learningIds, result.source.index, result.destination.index)
        setLearningIds(list)
        let learningsList = learnings.map((t: any) => {
          let index = list.indexOf(t.id)
          return { ...t, index }
        }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
        setLearnings(learningsList)
        let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `l_${curricularId}`, sequence: list } }));
        seqItem = seqItem.data.updateCSequences;
        console.log('seq updated');
      }
    } catch (err) {
      console.log('err', err)
    }
  }

  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const createLearningObjective = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/learning-objective/add`)
  }

  const editLearningObjective = (id: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/learning-objective/edit/${id}`)
  }

  const fetchList = async () => {
    setLoading(true)
    let list: any = await API.graphql(graphqlOperation(queries.listLearningObjectives, {
      filter: { curriculumID: { eq: curricularId } },
    }));
    list = list.data.listLearningObjectives?.items || []
    let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
      { id: `l_${curricularId}` }))

    item = item?.data.getCSequences?.sequence || []
    list = list.map((t: any) => {
      let index = item.indexOf(t.id)
      return { ...t, index }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
    setLearnings(list)
    setLearningIds(item)
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
  }, [])
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LEARNING OBJECTIVES</h3>
          {
            !loading ? ((learnings && learnings.length > 0) ? (
              <Fragment>
                <div className="flex justify-end w-8/10 m-auto ">
                  <Buttons btnClass="mx-4" label="Add new" onClick={createLearningObjective} />
                </div>
                <div className="flex justify-between w-8/10 m-auto px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>No.</span>
                  </div>
                  <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>Name</span>
                  </div>
                  {/* <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Description</span>
                </div> */}
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>Actions</span>
                  </div>
                </div>

                <div className="w-8/10 m-auto max-h-88 overflow-y-auto">

                  {/* Drag and drop listing */}
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >

                          {learnings.map((item, index) => (

                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200 cursor-move">
                                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                                    <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal">
                                      {item.name || ''}
                                    </div>
                                    {/* <div className="flex w-6/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                                        {item.description || ''}
                                      </div> */}
                                    <span className="w-3/10 h-6 flex items-center text-left px-8 py-3 text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => editLearningObjective(item.id)}>
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
                    <Buttons btnClass="mx-4" label="Add new" onClick={createLearningObjective} />
                  </div>
                  <p className="text-center p-16">  This curricular does not have any learning objectives yet. Please create a new one.</p>
                </Fragment>)) : (
                <div className="py-12 my-12 m-auto text-center">Fetching Data Please wait...</div>
              )}
        </PageWrapper>
      </div>
    </div>
  )
}

export default LearningObjectiveList
