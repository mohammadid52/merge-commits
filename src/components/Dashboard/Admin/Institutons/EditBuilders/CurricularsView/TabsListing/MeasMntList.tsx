import React, { Fragment, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoAdd } from 'react-icons/io5';

import { reorder } from '../../../../../../../utilities/strings';

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries';
import { getAsset } from '../../../../../../../assets';
import { GlobalContext } from '../../../../../../../contexts/GlobalContext';

interface MeasurementListProps {
  curricularId: string
  topicID: string
}

const MeasurementList = (props: MeasurementListProps) => {
  const { curricularId, topicID } = props;
  const { theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [measurements, setMeasurements] = useState([])
  const [measrementIds, setMeasrementIds] = useState([])

  const createNewMeasurement = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/measurement/add?tid=${topicID}`)
  }

  const editCurrentMeasurement = (id: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/measurement/edit/${id}`)
  }

  const onDragEnd = async (result: any) => {
    // Change measurement sequence
    if (result.source.index !== result.destination.index) {
      const list = reorder(measrementIds, result.source.index, result.destination.index)
      setMeasrementIds(list)
      let measurementList = measurements.map((t: any) => {
        let index = list.indexOf(t.id)
        return { ...t, index }
      }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
      setMeasurements(measurementList)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `m_${topicID}`, sequence: list } }));
      seqItem = seqItem.data.updateCSequences;
      console.log('seq updated');
    }
  }

  const fetchMeasurements = async () => {
    // Fetching measurement list and it's sequence for given topic.
    setLoading(true)
    let list: any = await API.graphql(graphqlOperation(customQueries.listRubrics, {
      filter: { topicID: { eq: topicID } },
    }));
    list = list.data.listRubrics?.items || []

    let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
      { id: `m_${topicID}` }))
    item = item?.data.getCSequences?.sequence || []
    const sequenceLength = item?.length;
    const listLength = list?.length;
    list = list.map((t: any) => {
      let index = item.indexOf(t.id)
      return { ...t, index }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
    setMeasurements(list)
    setMeasrementIds(item)
    if (listLength && !sequenceLength) {
      // create sequence
      let measurementId = list.map((item: { id: string }) => item.id)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `m_${topicID}`, sequence: measurementId } }));
      seqItem = seqItem.data.createCSequences
      setMeasrementIds(measurementId)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMeasurements();
  }, [])

  return (
    <Fragment>
      {!loading ? (
        <div className='mb-4'>
          {measurements?.length > 0 ?
            <Fragment>
              <div className="flex justify-between w-8/10 px-8 py-4 mx-auto whitespace-nowrap border-b-0 border-gray-200">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>No.</span>
                </div>
                <div className="w-7/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Measurements</span>
                </div>
                <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>Actions</span>
                </div>
              </div>
              <div className="w-8/10 m-auto">

                {/* Drag and drop listing */}
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {measurements.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div key={item.id} className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                                  <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4 text-gray-600">
                                    {index + 1}.
                                </div>
                                  <div className="flex w-7/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal text-gray-600 cursor-move"> {item.name} </div>
                                  <div className={`flex w-2/10 px-8 py-3 items-center text-left text-s leading-4 cursor-pointer ${theme.textColor[themeColor]}`} onClick={() => editCurrentMeasurement(item.id)}>
                                    Edit
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
            </Fragment>
            : <div>
              <p className="text-center p-16">  This topic does not have any measurement yet. Please create a new one.</p>
            </div>}
          <div className="w-8/10 mx-auto my-2 flex justify-center items-center px-8 py-4  border-0 border-dashed font-medium border-gray-400 text-gray-600 cursor-pointer" onClick={createNewMeasurement}>
            <span className="w-6 h-6 flex items-center mr-4">
              <IconContext.Provider value={{ size: '1.5rem', color: 'darkgray' }}>
                <IoAdd />
              </IconContext.Provider>
            </span>
            Add New Measurement
          </div>
        </div>
      ) : (
          <div>
            <p className="text-center p-16">  Fetching measurements list...</p>
          </div>
        )}
    </Fragment>
  )
}

export default MeasurementList