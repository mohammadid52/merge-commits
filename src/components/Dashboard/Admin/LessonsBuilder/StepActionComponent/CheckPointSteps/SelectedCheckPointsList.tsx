import React, { Fragment, useContext, useEffect, useState } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';

import Buttons from '../../../../../Atoms/Buttons';
import DragableAccordion from '../../../../../Atoms/DragableAccordion';
import CheckpointQueTable from './CheckpointQueTable';
import useDictionary from '../../../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';

interface SelectedCheckPointsListProps {
  activeCheckpoints?: any[]
  changeStep: (step: string) => void
  DeleteCheckpoint: (id: string) => void
  editCheckPoint: (id: string) => void
  onDragEnd: (result: any) => void
  lessonName: string
  lessonType: string
}

const SelectedCheckPointsList = (props: SelectedCheckPointsListProps) => {
  const { activeCheckpoints, changeStep, DeleteCheckpoint, editCheckPoint, onDragEnd, lessonName, lessonType } = props;
  const [savedCheckpoint, setSavedCheckpoint] = useState(activeCheckpoints);
  const {  clientKey,userLanguage } = useContext(GlobalContext);
  const { SelectedCheckPointsListDict ,BreadcrumsTitles } = useDictionary(clientKey);
  
  useEffect(() => {
    const checkpointList = [...activeCheckpoints];
    const updatedList = checkpointList.map(item => {
      const newItem = {
        ...item,
        content: <CheckpointQueTable changeStep={changeStep} checkpointId={item.id} DeleteCheckpoint={DeleteCheckpoint} editCheckPoint={editCheckPoint} showActionIcons />
      }
      return newItem;
    })
    setSavedCheckpoint(updatedList)
  }, [activeCheckpoints]);

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
          <span className="w-auto flex-shrink-0">{lessonType === 'survey' ? 'Survey' : 'Assessment'} {SelectedCheckPointsListDict[userLanguage]['BUILDER']} - {lessonName}</span>
        </h4>
      </div>

      <div className="p-4">
        {!activeCheckpoints?.length ? (
          <div className="my-8">
            <p className="text-center p-8"> {SelectedCheckPointsListDict[userLanguage]['ADDCHECKPOINT']} {lessonType === 'survey' ? 'survey' : 'assessment'}  builder</p>
            <div className="flex w-full mx-auto p-8 justify-center">
              <Buttons btnClass="mr-4" onClick={() => changeStep('CheckpointLookup')} label={SelectedCheckPointsListDict[userLanguage]['BUTTON']['ADDEXIST']} />
              <Buttons btnClass="ml-4" onClick={() => changeStep('AddNewCheckPoint')} label={SelectedCheckPointsListDict[userLanguage]['BUTTON']['CREATE']} />
            </div>
          </div>
        ) : (
            <div>
              <DragableAccordion titleList={savedCheckpoint} onDragEnd={onDragEnd} />
              <div className="flex w-full mx-auto p-8 justify-center">
                <Buttons btnClass="mr-4" onClick={() => changeStep('CheckpointLookup')} label={SelectedCheckPointsListDict[userLanguage]['BUTTON']['ADDEXIST']} />
                <Buttons btnClass="ml-4" onClick={() => changeStep('AddNewCheckPoint')} label={SelectedCheckPointsListDict[userLanguage]['BUTTON']['CREATE']} />
              </div>
            </div>
          )}
      </div>
    </Fragment>
  )
}

export default SelectedCheckPointsList;