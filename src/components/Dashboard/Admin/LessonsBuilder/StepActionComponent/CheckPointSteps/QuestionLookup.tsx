import React, { Fragment, useState } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoIosKeypad } from 'react-icons/io';
import { RiArrowRightLine } from 'react-icons/ri';

import SearchInput from '../../../../../Atoms/Form/SearchInput';
import CheckBox from '../../../../../Atoms/Form/CheckBox';
import Buttons from '../../../../../Atoms/Buttons';

interface QuestionLookupProps {
  changeStep: (step: string) => void

}

const QuestionLookup = (props: QuestionLookupProps) => {
  const { changeStep } = props;
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

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

  const selectItem = (questId: string) => {
    const selectedItem = selectedQuestionIds.find(id => id === questId);
    let updatedList;
    if (!selectedItem) {
      updatedList = [...selectedQuestionIds, questId];
    } else {
      updatedList = selectedQuestionIds.filter(id => id !== questId);
    }
    setSelectedQuestionIds(updatedList);
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
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">Checkpoints</span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{ size: '1.5rem', color: 'darkgrey' }}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">Previous Questions</span>
        </h4>
      </div>

      <div className="p-4">
        <div className="flex justify-between my-4">
          <p className="text-sm font-medium text-gray-600 flex items-center w-1/4 px-14"> {selectedQuestionIds?.length} Questions Selected</p>
          <SearchInput value={''} onChange={() => console.log("setSearch")} onKeyDown={() => console.log("searchQuestionFromList")} closeAction={() => console.log("removeSearchAction")} style="w-2/4" />
        </div>
        <div>
          <Fragment>
            <div className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Selection.</span>
              </div>
              <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Question</span>
              </div>
              <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Type</span>
              </div>
              <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>Language</span>
              </div>
            </div>

            <div className="w-full m-auto max-h-120 overflow-y-auto">
              {dymmyQuestionsList?.length && dymmyQuestionsList.map(item => (
                <div key={item.id} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                    <span>
                      <CheckBox value={selectedQuestionIds?.includes(item.id)} onChange={() => selectItem(item.id)} name='selectquestion' />
                    </span>
                  </div>
                  <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.question} </div>
                  <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.type}</div>
                  <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.language}</div>
                </div>

              ))}
            </div>
          </Fragment>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-center my-6">
            <Buttons btnClass="py-1 px-4 text-xs mr-2" label="Cancel" onClick={() => changeStep('AddNewCheckPoint')} transparent />
            <Buttons btnClass="py-1 px-8 text-xs ml-2" label="Save" onClick={() => console.log('')} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default QuestionLookup
