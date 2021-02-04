import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaEdit, FaTrashAlt, FaChevronRight, FaRegArrowAltCircleDown, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiArrowRightCircleFill, RiArrowDownCircleFill } from 'react-icons/ri';
import { IoAdd } from 'react-icons/io5';

import TopicsListComponent from './TopicsListNew';


import PageWrapper from '../../../../../../Atoms/PageWrapper';
import DragableAccordion from '../../../../../../Atoms/DragableAccordion';
import Buttons from '../../../../../../Atoms/Buttons';
import { reorder } from '../../../../../../../utilities/strings';

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries';

interface LearningObjectiveListProps {
  curricularId: string
  learningObjData: any[]
  setLearningObjData: (obj: any[]) => void
}


// IN PROGRESS NOTES: **Component is in progress
// Pendings:

// 1. Improve mutations
// 2. Set list sequence
// 3. Remove redundant things



const LearningObjectiveList = (props: LearningObjectiveListProps) => {
  const { curricularId } = props;
  const [loading, setLoading] = useState(false)
  const [learnings, setLearnings] = useState([])
  const [learningIds, setLearningIds] = useState([])
  const [measurements, setMeasurements] = useState([])
  const [measrementIds, setMeasrementIds] = useState([])
  const [topics, setTopics] = useState([])
  const [topicIds, setTopicIds] = useState([])
  const history = useHistory();

  const topicsList = [
    { id: '1', title: 'topic one ' },
    { id: '2', title: 'topic two ' },
    { id: '3', title: 'topic three ' },
  ]

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

  const createLearningObjective = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/learning-objective/add`)
  }

  const editLearningObjective = (id: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/learning-objective/edit/${id}`)
  }

  const addNewTopic = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/topic/add`)
  }

  const fetchMeasurements = async () => {
    setLoading(true)
    let list: any = await API.graphql(graphqlOperation(customQueries.listRubrics, {
      filter: { curriculumID: { eq: curricularId } },
    }));
    list = list.data.listRubrics?.items || []

    let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
      { id: `m_${curricularId}` }))
    item = item?.data.getCSequences?.sequence || []
    list = list.map((t: any) => {
      let index = item.indexOf(t.id)
      return { ...t, index }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
    setMeasurements(list)
    setMeasrementIds(item)
    // setLoading(false)
  }
  const fetchTopics = async () => {
    // setLoading(true)
    let [list, seq]: any = await Promise.all([
      await API.graphql(graphqlOperation(customQueries.listTopics, {
        filter: { curriculumID: { eq: curricularId } },
      })),
      await API.graphql(graphqlOperation(queries.getCSequences,
        { id: `t_${curricularId}` }))
    ]);
    list = list?.data.listTopics?.items || []
    seq = seq?.data.getCSequences?.sequence || []
    // sort list as per the seq
    list = list.map((t: any) => {
      let filteredMeasurements = measurements.filter(item => item.topicID === t.id)
      let index = seq.indexOf(t.id)
      return { ...t, index, measurements: filteredMeasurements }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))

    setTopics(list)
    setTopicIds(seq)
    // fetchLearningObjs()
    // setLoading(false)
  }

  const fetchLearningObjs = async () => {
    // setLoading(true)
    let [list, seq]: any = await Promise.all([
      await API.graphql(graphqlOperation(queries.listLearningObjectives, {
        filter: { curriculumID: { eq: curricularId } },
      })),
      await API.graphql(graphqlOperation(queries.getCSequences,
        { id: `l_${curricularId}` }))
    ]);
    seq = seq?.data?.getCSequences?.sequence || []
    list = list?.data?.listLearningObjectives?.items || []
    list = list.map((t: any) => {
      let filteredTopics = topics.filter(item => item.learningObjectiveID == t.id);
      let index = seq.indexOf(t.id)
      return {
        id: t.id,
        title: t.name,
        content: <TopicsListComponent topicsList={filteredTopics} addNewTopic={addNewTopic} onLOEdit={() => editLearningObjective(t.id)} />,
        index
      }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
    setLearnings(list)
    setLearningIds(seq)
    setLoading(false)
  }

  useEffect(() => {
    fetchMeasurements()
  }, [])

  useEffect(() => {
    fetchLearningObjs();
  }, [topics])

  useEffect(() => {
    fetchTopics();
  }, [measurements])


  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LEARNING OBJECTIVES</h3>
          {
            !loading ? ((learnings && learnings.length > 0) ? (
              <Fragment>
                <div className="flex justify-end w-9/10 m-auto ">
                  <Buttons btnClass="" label="Add New Learning Objective" onClick={createLearningObjective} />
                </div>
                <div className="py-4">
                  <DragableAccordion titleList={learnings} onDragEnd={onDragEnd} />
                </div>
                {/* <div className="flex justify-between w-8/10 m-auto px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>No.</span>
                  </div>
                  <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>Name</span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>Actions</span>
                  </div>
                </div>
                <div className="w-8/10 m-auto max-h-88 overflow-y-auto">
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
                </div> */}
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