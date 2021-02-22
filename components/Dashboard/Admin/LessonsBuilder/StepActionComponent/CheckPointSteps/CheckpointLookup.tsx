import React, { Fragment, useState, useEffect } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';
import { IoCaretDownCircleOutline, IoCaretUpCircleOutline } from 'react-icons/io5';

import { getLanguageString } from '../../../../../../utilities/strings';

import SearchInput from '../../../../../Atoms/Form/SearchInput';
import CheckBox from '../../../../../Atoms/Form/CheckBox';
import Buttons from '../../../../../Atoms/Buttons';
import CheckpointQueTable from './CheckpointQueTable';
interface CheckpointLookupProps {
  changeStep: (step: string) => void
  onSave: (ids: string[]) => void
  checkpointList: any[]
}

const CheckpointLookup = (props: CheckpointLookupProps) => {
  const { changeStep, onSave, checkpointList } = props;
  const [selectedCheckpointIds, setSelectedCheckpointIds] = useState([]);
  const [expandId, setExpandedId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filteredList, setFilteredList] = useState(checkpointList);

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

  const viewCheckpoint = (checkId: string) => {
    if (expandId === checkId) {
      setExpandedId('')
    } else {
      setExpandedId(checkId)
    }
  }

  const searchFromList = () => {
    const currentCheckList = [...checkpointList];
    const newList = currentCheckList.filter(item => {
      // Search on title for match.
      return (
        (item.title?.toLowerCase().includes(searchInput))
      )
    });
    setFilteredList(newList);
  }

  const removeSearchAction = () => {
    setFilteredList(checkpointList);
    setSearchInput('')
  }

  useEffect(() => {
    setFilteredList(checkpointList)
  }, [checkpointList])

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
          <SearchInput value={searchInput} onChange={(val: string) => setSearchInput(val)} onKeyDown={searchFromList} closeAction={removeSearchAction} style="w-2/4" />
        </div>
        <div>
          <Fragment>
            <div className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Selection</span>
              </div>
              <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Checkpoint Title
              </div>
              <div className="w-3/10 px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Language
              </div>
              <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span></span>
              </div>
            </div>

            <div className="w-full m-auto max-h-128 overflow-y-auto">
              {checkpointList?.length && filteredList.map(item => (
                <Fragment>
                  {/* Table row */}
                  <div key={item.id} className={`flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200 ${expandId === item.id ? 'border border-indigo-400 rounded-lg' : ''}`}>
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                      <span>
                        <CheckBox value={selectedCheckpointIds?.includes(item.id)} onChange={() => selectItem(item.id)} name='selectcheckpoint' />
                      </span>
                    </div>
                    <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                      <div>
                        <span>{item.title}</span><br />
                        <span className="text-sm leading-6 text-gray-500">{item.subtitle ? item.subtitle : ''}</span>
                      </div>
                    </div>
                    <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.language ? getLanguageString(item.language) : '--'}</div>
                    <div className="flex w-1/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                      <span className="w-6 h-6 cursor-pointer text-indigo-600" onClick={() => viewCheckpoint(item.id)}>
                        <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                          {expandId === item.id ? <IoCaretUpCircleOutline /> : <IoCaretDownCircleOutline />}
                        </IconContext.Provider>
                      </span>
                    </div>
                  </div>

                  {/* Details for selected row */}
                  {(expandId === item.id) && (
                    <div className="my-6">
                      <CheckpointQueTable changeStep={changeStep} checkpointId={item.id} />
                    </div>
                  )}

                </Fragment>
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
