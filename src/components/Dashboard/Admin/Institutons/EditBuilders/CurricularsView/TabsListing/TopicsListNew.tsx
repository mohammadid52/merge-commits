import React, { Fragment, useEffect, useState } from 'react';

import MeasurementsListComponent from './MeasurementListNew';

import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaEdit, FaTrashAlt, FaChevronRight, FaRegArrowAltCircleDown, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiArrowRightCircleFill, RiArrowDownCircleFill } from 'react-icons/ri';
import { IoAdd } from 'react-icons/io5';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import DragableAccordion from '../../../../../../Atoms/DragableAccordion';
import Buttons from '../../../../../../Atoms/Buttons';
import { reorder } from '../../../../../../../utilities/strings';

import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries';


interface TopicsListComponentProps {
  topicsList: any
  onLOEdit: () => void
  addNewTopic: () => void
}

// IN PROGRESS NOTES: **Component is in progress
// Pendings:

// 1. Improve mutations
// 2. Set list sequence
// 3. Remove redundant things


const TopicsListComponent = (props: TopicsListComponentProps) => {
  const { topicsList, onLOEdit, addNewTopic } = props;
  const [openRow, setOpenRow] = useState('');


  const expandRow = (id: string) => {
    if (openRow === id) {
      setOpenRow('')
    } else {
      setOpenRow(id)
    }
  }

  return (
    <Fragment>
      <div className="w-9/10 mx-auto my-4 flex justify-end">
        <div>
          <p className="text-base font-medium text-gray-600">Topics: </p>
        </div>
        <div className="w-auto">
          <Buttons btnClass="" Icon={FaEdit} label="Edit Learning Objective" onClick={onLOEdit} />
        </div>
      </div>

      <div className='mb-4'>
        <div className="w-9/10 m-auto border-b">
          {topicsList?.length && topicsList.map((item: any) => (
            <Fragment>
              <div key={item.id} className={`flex justify-between w-full px-8 py-4 whitespace-no-wrap border border-b-0 border-gray-200 hover:bg-gray-200 ${(openRow === item.id) && 'bg-gray-200'}`}>
                <div className="flex w-2/10 items-center px-8 py-3 text-left text-s leading-4" onClick={() => expandRow(item.id)}>
                  <span className="w-6 h-6 flex items-center cursor-pointer">
                    <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                      {(openRow !== item.id) ? <FaRegArrowAltCircleRight /> : <FaRegArrowAltCircleDown />}
                    </IconContext.Provider>
                  </span>
                </div>
                <div className="flex w-6/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal cursor-pointer text-gray-900 hover:text-gray-800" onClick={() => expandRow(item.id)}> {item.name} </div>
                <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center text-indigo-600 hover:text-indigo-900 cursor-pointer">
                  Edit
              </div>
              </div>
              {(openRow === item.id) && <div className="border border-gray-200">
                <MeasurementsListComponent measurementList={item.measurements} />
              </div>}
            </Fragment>
          ))}
        </div>
        <div className="flex justify-center items-center my-2 w-9/10 mx-auto px-8 py-4 border border-dashed font-medium border-gray-400 text-gray-600 cursor-pointer" onClick={addNewTopic}>
          <span className="w-6 h-6 flex items-center mr-4">
            <IconContext.Provider value={{ size: '1.5rem', color: 'darkgray' }}>
              <IoAdd />
            </IconContext.Provider>
          </span>
            Add New Topic
          </div>
      </div>
    </Fragment>
  )
}

export default TopicsListComponent;