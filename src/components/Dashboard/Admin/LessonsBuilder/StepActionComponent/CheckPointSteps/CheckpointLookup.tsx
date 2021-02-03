import React, { Fragment, useState } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';

import SearchInput from '../../../../../Atoms/Form/SearchInput';
import CheckBox from '../../../../../Atoms/Form/CheckBox';
import Buttons from '../../../../../Atoms/Buttons';
interface CheckpointLookupProps {
  changeStep: (step: string) => void
  onSave: (ids: string[]) => void
  checkpointList: any[]
}

const CheckpointLookup = (props: CheckpointLookupProps) => {
  const { changeStep, onSave, checkpointList } = props;
  const [selectedCheckpointIds, setSelectedCheckpointIds] = useState([]);


  const selectItem = (checkpointId: string) => {
    const selectedItem = selectedCheckpointIds.find(id => id === checkpointId);
    let updatedList;
    if (!selectedItem) {
      updatedList = [...selectedCheckpointIds, checkpointId];
    } else {
      updatedList = selectedCheckpointIds.filter(id => id !== checkpointId);
    }
    setSelectedCheckpointIds(updatedList);
  }

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
          <span className="w-auto flex-shrink-0 cursor-pointer" onClick={() => changeStep('SelectedCheckPointsList')}>Assessment Builder</span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">Previous Checkpoints</span>
        </h4>
      </div>

      <div className="p-4">
        <div className="flex justify-between my-4">
          <p className="text-sm font-medium text-gray-600 flex items-center w-1/4 px-14"> {selectedCheckpointIds?.length} Checkpoints Selected</p>
          <SearchInput value={''} onChange={() => console.log("setSearch")} onKeyDown={() => console.log("searchCheckpointFromList")} closeAction={() => console.log("removeSearchAction")} style="w-2/4" />
        </div>
        <div>
          <Fragment>
            <div className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Selection.</span>
              </div>
              <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Checkpoint Title</span>
              </div>
              <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Language</span>
              </div>
            </div>

            <div className="w-full m-auto max-h-120 overflow-y-auto">
              {checkpointList?.length && checkpointList.map(item => (
                <div key={item.id} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                    <span>
                      <CheckBox value={selectedCheckpointIds?.includes(item.id)} onChange={() => selectItem(item.id)} name='selectcheckpoint' />
                    </span>
                  </div>
                  <div className="flex w-6/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                    <div>
                      <span>{item.title}</span><br />
                      <span className="text-sm leading-6 text-gray-500">{item.subtitle ? item.subtitle : ''}</span>
                    </div>
                  </div>
                  <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.language}</div>
                </div>

              ))}
            </div>
          </Fragment>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-center my-6">
            <Buttons btnClass="py-1 px-4 text-xs mr-2" label="Cancel" onClick={() => changeStep('SelectedCheckPointsList')} transparent />
            <Buttons btnClass="py-1 px-8 text-xs ml-2" label="Save" onClick={() => onSave(selectedCheckpointIds)} />
          </div>
        </div>

      </div>
    </Fragment>
  )
}

export default CheckpointLookup
