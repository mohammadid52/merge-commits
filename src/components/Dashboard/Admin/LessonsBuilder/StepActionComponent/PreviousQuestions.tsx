import React, { Fragment, useContext } from 'react'
import { getAsset } from '../../../../../assets';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import SearchInput from '../../../../Atoms/Form/SearchInput';

const PreviousQuestions = () => {
  const questionsList = [];
  const { theme, clientKey,userLanguage } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { BUTTONS, PreviousQuestionsDict } = useDictionary(clientKey);
  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> {PreviousQuestionsDict[userLanguage]['HEADING']}</h3>
      </div>

      <div className="p-4">
        <div className="flex justify-end">
          <SearchInput value={''} onChange={() => console.log("setSearch")} onKeyDown={() => console.log("searchQuestionFromList")} closeAction={() => console.log("removeSearchAction")} style="w-1/4" />
        </div>
        <div>
          <Fragment>
            <div className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
              <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{PreviousQuestionsDict[userLanguage]['NO']}</span>
              </div>
              <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{PreviousQuestionsDict[userLanguage]['QUESTION']}</span>
              </div>
              <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{PreviousQuestionsDict[userLanguage]['LABEL']}</span>
              </div>
              <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{PreviousQuestionsDict[userLanguage]['TYPE']}</span>
              </div>
              <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{PreviousQuestionsDict[userLanguage]['ACTION']}</span>
              </div>
            </div>

            <div className="w-full m-auto max-h-88 overflow-y-auto">
              <div key={"index"} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{1}.</div>
                <div className="flex w-3/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {PreviousQuestionsDict[userLanguage]['WHERARE']} </div>
                <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{PreviousQuestionsDict[userLanguage]['WHERYOU']}</div>
                <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{PreviousQuestionsDict[userLanguage]['TEXTINPUT']}</div>
                <div className="flex w-1/10 px-8 py-3 text-left text-s leading-4 items-center">
                  <span className={`w-6 flex items-center cursor-pointer ${theme.textColor[themeColor] }`} onClick={() => console.log("add")}>
                    {PreviousQuestionsDict[userLanguage]['ADD']}
                  </span>
                </div>
              </div>

            </div>
          </Fragment>
        </div>
      </div>
    </div>
  )
}

export default PreviousQuestions
