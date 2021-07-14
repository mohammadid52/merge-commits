import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import Loader from '../../../../../Atoms/Loader';

const DetailTable = ({curriculum}: any) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  const {assignedSyllabi, associatedClassRoomData, institution, loading} = curriculum;

  return (
    <>
      <div className="pl-4">
        <span className="w-auto pt-5 font-bold text-lg items-center inline-flex">
          Unit(s): {assignedSyllabi.join(', ')}
        </span>
      </div>
      <div className="w-full flex justify-between border-b-0 border-gray-200 mt-4">
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
        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : (
          associatedClassRoomData?.map((classRoom: any) => (
            <div
              className="flex justify-between bg-white w-full border-b-0 border-gray-200"
              key={classRoom.id}>
              <div className="w-3/10 flex items-center px-4 py-3 hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900 whitespace-normal text-gray-500">
                <span>{institution?.name}</span>
              </div>
              <div className="w-3/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-gray-500">
                <span className="w-auto">{classRoom.name}</span>
              </div>

              <div className="w-3/10 flex items-center px-8 py-3 whitespace-normal text-sm leading-5 text-gray-500">
                <span className="w-auto">{classRoom?.teacher.firstName}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default DetailTable;
