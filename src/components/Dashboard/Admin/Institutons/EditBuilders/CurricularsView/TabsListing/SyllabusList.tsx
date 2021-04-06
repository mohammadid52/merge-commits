import React, { Fragment, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import API, { graphqlOperation } from '@aws-amplify/api';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../../Atoms/Buttons';
import { reorder } from '../../../../../../../utilities/strings';
import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import { getAsset } from '../../../../../../../assets';
import { GlobalContext } from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';

interface SyllabusListProps {
  savedSyllabi?: any[]
  curricularId?: string
  loading: boolean
  institutionId: string
}

const SyllabusList = (props: SyllabusListProps) => {
  const { curricularId, savedSyllabi, loading, institutionId } = props;
  const [isLoading, setLoading] = useState(loading);
  const [syllabusList, setSyllabusList] = useState(savedSyllabi);
  const [syllabusIds, setSyllabusIds] = useState([]);
  const history = useHistory();

  const { clientKey, theme,userLanguage } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { SYLLABUS,BreadcrumsTitles } = useDictionary(clientKey)

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const list = reorder(syllabusIds, result.source.index, result.destination.index)
      setSyllabusIds(list)
      let updatedList = syllabusList.map((t: any) => {
        let index = list.indexOf(t.id)
        return { ...t, index }
      }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
      setSyllabusList(updatedList)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `s_${curricularId}`, sequence: list } }));
      seqItem = seqItem.data.updateCSequences;
      console.log('seq updated');
    }
  }

  const createNewSyllabus = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/syllabus/add`)
  }

  const editCurrentSyllabus = (id: string) => {
    history.push(`/dashboard/manage-institutions/${institutionId}/curricular/${curricularId}/syllabus/edit?id=${id}`)
  }

  const setSyllabusSequence = async () => {

    let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
      { id: `s_${curricularId}` }))
    item = item?.data.getCSequences?.sequence || []
    let list = savedSyllabi?.map((t: any) => {
      let index = item.indexOf(t.id)
      return { ...t, index }
    }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
    setSyllabusList(list)
    setSyllabusIds(item)
    const sequenceLength = item?.length;
    const listLength = savedSyllabi?.length;
    if (listLength && !sequenceLength) {
      // create sequence
      let syllabusId = savedSyllabi?.map((item: { id: string }) => item.id)
      let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `s_${curricularId}`, sequence: syllabusId } }));
      seqItem = seqItem.data.createCSequences
      setSyllabusIds(syllabusId)
    }
  }

  // useEffect(() => {
  //   setSyllabusSequence()
  // }, [])

  useEffect(() => {
    if (savedSyllabi?.length) {
      setSyllabusSequence()
    }
  }, [savedSyllabi])

  useEffect(() => {
    setLoading(loading)
  }, [loading])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">{SYLLABUS[userLanguage]['TITLE']}</h3>
          {!isLoading ? (

            <Fragment>
              {(syllabusList && syllabusList.length > 0) ? (
                <Fragment>
                  <div className="flex justify-end w-8/10 m-auto ">
                    <Buttons btnClass="mx-4" label={SYLLABUS[userLanguage]['ADDNEW']} onClick={createNewSyllabus} />
                  </div>
                  <div className="my-8 w-8/10 m-auto">

                    <div className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                      <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{SYLLABUS[userLanguage]['NO']}</span>
                      </div>
                      <div className="w-7/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{SYLLABUS[userLanguage]['NAME']}</span>
                      </div>
                      {/* <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>Description</span>
                  </div> */}
                      <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{SYLLABUS[userLanguage]['ACTION']}</span>
                      </div>
                    </div>

                    <div className="max-h-88 overflow-y-auto">

                      {/* Drag and drop listing */}
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {syllabusList.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <div key={index} className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 cursor-pointer" onClick={() => editCurrentSyllabus(item.id)}>
                                        <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                                        <div className="flex w-7/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                                          {item.name ? item.name : ''}
                                        </div>
                                        {/* <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                                          {item.description ? item.description : ''}
                                        </div> */}
                                        <span className={`w-2/10 flex items-center text-left px-8 py-3 cursor-pointer ${theme.textColor[themeColor]} `}>
                                        {SYLLABUS[userLanguage]['EDIT']}
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
                  </div>
                </Fragment>
              ) : (
                  <Fragment>
                    <div className="flex justify-center mt-8">
                      <Buttons btnClass="mx-4" label="Add new unit" onClick={createNewSyllabus} />
                    </div>
                    <p className="text-center p-16">  {SYLLABUS[userLanguage]['INFO']}</p>
                  </Fragment>)}
            </Fragment>
          ) : (<p className="text-center p-16">  {SYLLABUS[userLanguage]['FETCH']}</p>)}
        </PageWrapper>
      </div>
    </div>
  )
}

export default SyllabusList
