import React, { Fragment, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import API, { graphqlOperation } from '@aws-amplify/api';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../../Atoms/Buttons';
import { reorder } from '../../../../../../../utilities/strings';
import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import { getAsset } from '../../../../../../../assets';
import { GlobalContext } from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';
import Tooltip from '../../../../../../Atoms/Tooltip';

interface SyllabusListProps {
  curricularId?: string;
  institutionId: string;
}

const SyllabusList = (props: SyllabusListProps) => {
  const history = useHistory();

  const { curricularId, institutionId } = props;

  const { clientKey, theme, userLanguage } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const SyllabusDict = useDictionary(clientKey).SYLLABUS;

  const [loading, setLoading] = useState(false);
  const [syllabusList, setSyllabusList] = useState([]);

  const fetchSyllabusList = async () => {
    try {
      setLoading(true)
      let list: any = await API.graphql(
        graphqlOperation(queries.listUniversalSyllabuss, {
          filter: {
            curriculumID: { eq: curricularId }
          },
        })
      );
      list = list?.data?.listUniversalSyllabuss?.items;
      console.log('list', list)
      setSyllabusList(list);
      setLoading(false);
    } catch (err) {
      console.log('ERROR: Fetch syllabus list', err);
    }
  }

  const createNewSyllabus = async () => {
    history.push(
      `/dashboard/manage-institutions/${institutionId}/curricular/${curricularId}/syllabus/add`
    );
  }
  const editCurrentSyllabus = (id: string) => {
    history.push(
      `/dashboard/manage-institutions/${institutionId}/curricular/${curricularId}/syllabus/edit?id=${id}`
    );
  };

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      console.log('seq updated');
    }
  };

  useEffect(() => {
    fetchSyllabusList()
  }, [])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {SyllabusDict[userLanguage]['TITLE']}
          </h3>
          {
            loading && (
              <p className="text-center p-16"> {SyllabusDict[userLanguage]['FETCH']}</p>
            )
          }
          {
            !loading &&
            <Fragment>
              {syllabusList && syllabusList.length > 0 &&
                <Fragment>
                  <div className="flex justify-end w-8/10 m-auto ">
                    <Buttons
                      btnClass="mx-4"
                      label={SyllabusDict[userLanguage]['ADDNEW']}
                      onClick={createNewSyllabus}
                    />
                  </div>
                  <div className="my-8 w-8/10 m-auto">
                    {/* Table Headers */}
                    <div className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                      <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{SyllabusDict[userLanguage]['NO']}</span>
                      </div>
                      <div className="w-7/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{SyllabusDict[userLanguage]['NAME']}</span>
                      </div>
                      <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>{SyllabusDict[userLanguage]['ACTION']}</span>
                      </div>
                    </div>
                    {/* Table data */}
                    <div className="max-h-88 overflow-y-auto">
                      {/* Drag and drop listing */}
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                              {syllabusList.map((item, index) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}>
                                      <div
                                        key={index}
                                        className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 cursor-pointer"
                                        onClick={() => editCurrentSyllabus(item.id)}>
                                        <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                                          {index + 1}.
                                        </div>
                                        <div className="flex w-7/10 items-center px-8 py-3 text-left text-s leading-4 font-medium ">
                                          {item.name ? item.name : ''}
                                        </div>
                                        <span
                                          className={`w-2/10 flex items-center text-left px-8 py-3 cursor-pointer ${theme.textColor[themeColor]} `}>
                                          <Tooltip
                                            placement="left"
                                            text={`Click to edit`}>
                                            {SyllabusDict[userLanguage]['EDIT']}
                                          </Tooltip>
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
              }
              {(!syllabusList || syllabusList && syllabusList.length === 0) &&
                (
                  <Fragment>
                    <div className="flex justify-center mt-8">
                      <Buttons
                        btnClass="mx-4"
                        label="Add new unit"
                        onClick={createNewSyllabus}
                      />
                    </div>
                    <p className="text-center p-16"> {SyllabusDict[userLanguage]['INFO']}</p>
                  </Fragment>
                )
              }
            </Fragment>
          }
        </PageWrapper>
      </div>
    </div>
  );
};

export default SyllabusList;
