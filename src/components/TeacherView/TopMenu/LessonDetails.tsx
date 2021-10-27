import React, {useContext} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {getLocalStorageData} from '@utilities/localStorage';

const LessonDetails = () => {
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const controlState = gContext.controlState;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const {classRoomDict} = useDictionary(clientKey);

  const {lessonPlannerDict} = useDictionary(clientKey);

  const getRoomData = getLocalStorageData('room_info');

  const studentsOnline = () => {
    if (controlState.roster) {
      return controlState.roster.length;
    } else {
      return 0;
    }
  };

  return (
    <div className="min-h-30 flex flex-col justify-between px-4 pt-2">
      <div title="title" className="align-middle text-gray-600 text-sm leading-8 ">
        <span className="font-bold">{classRoomDict[userLanguage]['LESSON']}: </span>
        <span>{lessonState.lessonData.title}</span>
      </div>

      <div className="w-full flex flex-col my-auto bg-gray-200 p-2 text-gray-600 text-sm shadow-sm">
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDDENT_ONLINE']}:{' '}
          {studentsOnline()}
        </p>
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['ROOM_NAME']}:{' '}
          {`${getRoomData.name ? getRoomData.name : ''}`}
        </p>
        <p className="">
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['EST_TIME']}:{' '}
          {lessonState.lessonData?.duration}{' '}
          {`${lessonState.lessonData?.duration > 1 ? 'weeks' : 'week'}`}
        </p>
      </div>
    </div>
  );
};

export default LessonDetails;
