import React, { Fragment } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import Buttons from '../../../../../Atoms/Buttons';
import DragableAccordion from '../../../../../Atoms/DragableAccordion';

interface SelectedCheckPointsListProps {
  activeCheckpoints?: any[]
  changeStep: (step: string) => void
}
interface CheckPointContentProps {
  changeStep: (step: string) => void
}

const SelectedCheckPointsList = (props: SelectedCheckPointsListProps) => {
  const { activeCheckpoints, changeStep } = props;

  const dummyData = [
    { id: '1', title: 'Social Engagement and Impact', subtitle: 'Social Engagement Practices ', content: <CheckPointContent changeStep={changeStep} /> },
    { id: '2', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', content: <CheckPointContent changeStep={changeStep} /> },
    { id: '3', title: 'Social Engagement and Impact', subtitle: 'Social Engagement Practices ', content: <CheckPointContent changeStep={changeStep} /> },
    { id: '4', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', content: <CheckPointContent changeStep={changeStep} /> },
    // { id: '5', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', content: <CheckPointContent changeStep={changeStep} /> },
    // { id: '6', title: 'Social Engagement and Impact', subtitle: 'Social Engagement Practices ', content: <CheckPointContent changeStep={changeStep} /> },
    // { id: '7', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', content: <CheckPointContent changeStep={changeStep} /> },
    // { id: '8', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', content: <CheckPointContent changeStep={changeStep} /> },
    // { id: '9', title: 'Social Engagement and Impact', subtitle: 'Social Engagement Practices ', content: <CheckPointContent changeStep={changeStep} /> },
    // { id: '10', title: 'Leadership and Ministry Contexts', subtitle: 'Decision Making and Growth', content: <CheckPointContent changeStep={changeStep} /> },
  ]

  return (
    <Fragment>
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center">
        <span className="w-6 h-6 flex items-center mr-4" onClick={() => console.log('')}>
          <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
            <IoIosKeypad />
          </IconContext.Provider>
        </span>

        {/* Breadcrums */}
        <h4 className="text-base leading-6 font-medium text-gray-900 flex items-center">
          <span className="w-auto flex-shrink-0">Assessment Builder</span>
        </h4>
      </div>

      <div className="p-4">
        {!activeCheckpoints?.length ? (
          <div className="my-8">
            <p className="text-center p-8"> Please add checkpoints to assessment builder</p>
            <div className="flex w-full mx-auto p-8 justify-center">
              <Buttons btnClass="mr-4" onClick={() => changeStep('CheckpointLookup')} label="Add Existing Checkpoint" />
              <Buttons btnClass="ml-4" onClick={() => changeStep('AddNewCheckPoint')} label="Create New Checkpoint" />
            </div>
          </div>
        ) : (
            <div>
              <DragableAccordion titleList={dummyData} />
              <div className="flex w-full mx-auto p-8 justify-center">
                <Buttons btnClass="mr-4" onClick={() => changeStep('CheckpointLookup')} label="Add Existing Checkpoint" />
                <Buttons btnClass="ml-4" onClick={() => changeStep('AddNewCheckPoint')} label="Create New Checkpoint" />
              </div>
            </div>
          )}
      </div>
    </Fragment>
  )
}

export default SelectedCheckPointsList;


const CheckPointContent = (props: CheckPointContentProps) => {
  const { changeStep } = props;
  const dymmyQuestionsList = [
    { id: '1', question: 'Where are you from?', type: 'Text Input', language: 'English' },
    { id: '2', question: 'What social issues is your congregation most deeply invested in?', type: 'Text Input', language: 'English' },
    { id: '3', question: 'Where are you from?', type: 'Text Input', language: 'English' },
    { id: '4', question: 'What social issues is your congregation most deeply invested in?', type: 'Text Input', language: 'English' },
    { id: '5', question: 'What social issues is your congregation most deeply invested in?', type: 'Text Input', language: 'English' },
    { id: '6', question: 'Where are you from?', type: 'Text Input', language: 'English' },
    { id: '7', question: 'What social issues is your congregation most deeply invested in?', type: 'Text Input', language: 'English' },
    { id: '8', question: 'What social issues is your congregation most deeply invested in?', type: 'Text Input', language: 'English' },
    { id: '9', question: 'Where are you from?', type: 'Text Input', language: 'English' },
    { id: '10', question: 'What social issues is your congregation most deeply invested in?', type: 'Text Input', language: 'English' },
  ]

  return (
    <Fragment>
      <div className="w-9/10 mx-auto my-4 flex justify-end">
        <span className="w-6 h-6 flex items-center cursor-pointer mr-4" onClick={() => changeStep('EditCheckPoint')}>
          <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
            <FaEdit />
          </IconContext.Provider>
        </span>
        <span className="w-6 h-6 flex items-center cursor-pointer ml-4">
          <IconContext.Provider value={{ size: '1.5rem', color: '#B22222' }}>
            <FaTrashAlt />
          </IconContext.Provider>
        </span>
      </div>
      <div className='mb-4'>
        <div className="flex justify-between w-9/10 px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
          <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>No.</span>
          </div>
          <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Question</span>
          </div>
          <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Type</span>
          </div>
          {/* <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Language</span>
          </div> */}
        </div>
        <div className="w-9/10 m-auto">
          {dymmyQuestionsList?.length && dymmyQuestionsList.map((item, index) => (
            <div key={item.id} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                {index + 1}.
              </div>
              <div className="flex w-6/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.question} </div>
              <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.type}</div>
              {/* <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.language}</div> */}
            </div>

          ))}
        </div>
      </div>
    </Fragment>
  );

}
