import React, { useContext } from 'react';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import Buttons from '../../../../../Atoms/Buttons';

const MeasurementsList = () => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);

  return (
    <>
      <div className="pl-4">
        <span className="w-auto pt-5 font-bold text-lg items-center flex justify-end">
          <Buttons
            btnClass="mx-4"
            label={
              LessonBuilderDict[userLanguage]['BUTTON'][
                'ADD_EVIDENCE'
              ]
            }
            // onClick={() => setAddModalShow(true)}
          />
        </span>
      </div>
      <div className="w-full flex justify-between border-b-0 border-gray-200 mt-4">
        <div className="w-3/10 px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS'][
                'COURSE_OBJECTIVE'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS'][
                'COURSE_TOPICS'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS'][
                'EVIDENCE_ACTIVITY'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS'][
                'EVIDENCE_PLACE'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS']['ACTION']}
          </span>
        </div>
      </div>
      <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
        <div className="flex justify-between bg-white w-full border-b-0 border-gray-200">
          <div className="w-3/10 flex items-center px-4 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal">
            <span>Spring Branch</span>
          </div>
          <div className="w-3/10 flex items-center px-8 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium whitespace-normal text-gray-500">
            <span>Spring Branch</span>
          </div>
          <div className="w-3/10 flex items-center px-8 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium whitespace-normal text-gray-500">
            <span>Spring Branch</span>
          </div>
          <div className="w-3/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-gray-500">
            <span className="w-auto">Spring Branch</span>
          </div>

          <div className="w-3/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-gray-500">
            <span className="w-auto">Marlon</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeasurementsList;