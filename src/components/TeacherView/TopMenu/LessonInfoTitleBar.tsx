import React, {useContext} from 'react';

import useDictionary from 'customHooks/dictionary';
import {GlobalContext} from 'contexts/GlobalContext';

const LessonInfoTitleBar = () => {
  const {lessonState, clientKey, userLanguage} = useContext(GlobalContext);
  const {classRoomDict} = useDictionary(clientKey);

  return (
    <div className="bg-transparent flex flex-row justify-between">
      <div
        title={lessonState.lessonData.title}
        className="h-8 align-middle text-gray-600 text-sm leading-8 ">
        <span className="font-bold">{classRoomDict[userLanguage]['LESSON']}: </span>
        <span>{lessonState.lessonData.title}</span>
      </div>
    </div>
  );
};

export default LessonInfoTitleBar;
