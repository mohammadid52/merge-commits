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

interface MeasurementsListComponentProps {
  measurementList: any[]
}

// IN PROGRESS NOTES: **Component is in progress
// Pendings:

// 1. Improve mutations
// 2. Set list sequence
// 3. Remove redundant things

const MeasurementsListComponent = (props: MeasurementsListComponentProps) => {
  const { measurementList } = props;

  return (
    <Fragment>
      <div className='mb-4'>
        {measurementList?.length ? <div className="flex justify-between w-8/10 px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
          <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>No.</span>
          </div>
          <div className="w-7/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Measurements</span>
          </div>
          <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Actions</span>
          </div>
        </div> : null}
        <div className="w-8/10 m-auto">
          {measurementList?.length ? measurementList.map((item, index) => (
            <div key={item.id} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4 text-gray-600">
                {index + 1}.
              </div>
              <div className="flex w-7/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal text-gray-600"> {item.name} </div>
              <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                <span className="w-6 h-6 flex items-center cursor-pointer mr-4" >
                  <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                    <FaEdit />
                  </IconContext.Provider>
                </span>
              </div>
            </div>

          )) : null}
          <div className="w-full my-2 flex justify-center items-center px-8 py-4 border border-dashed font-medium border-gray-400 text-gray-600 cursor-pointer">
            <span className="w-6 h-6 flex items-center mr-4">
              <IconContext.Provider value={{ size: '1.5rem', color: 'darkgray' }}>
                <IoAdd />
              </IconContext.Provider>
            </span>
            Add New Measurement
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default MeasurementsListComponent