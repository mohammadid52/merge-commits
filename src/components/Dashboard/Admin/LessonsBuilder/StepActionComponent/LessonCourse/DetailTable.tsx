import React, { useContext } from 'react';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

const DetailTable = () => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);

  return (
    <>
      <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
        <div className="w-3/10 px-4 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LESSON_COURSES_UNIT_DETAIL_VIEW'][
                'INSTITUTION'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LESSON_COURSES_UNIT_DETAIL_VIEW'][
                'CLASSROOM'
              ]
            }
          </span>
        </div>
        <div className="w-3/10 px-8 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          <span>
            {
              LessonBuilderDict[userLanguage]['LESSON_COURSES_UNIT_DETAIL_VIEW'][
                'LEAD_INSTRUCTOR'
              ]
            }
          </span>
        </div>
      </div>
      <div className="mb-8 w-full m-auto max-h-88 overflow-y-auto">
        <div className="flex justify-between bg-white w-full border-b-0 border-gray-200">
          <div className="w-3/10 flex items-center px-4 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal text-gray-500">
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

export default DetailTable;