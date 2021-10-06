import React, {useContext} from 'react';

import useDictionary from '../../../customHooks/dictionary';
import {GlobalContext} from '../../../contexts/GlobalContext';

const LessonInfoTitleBar = () => {
  const {lessonState, clientKey, userLanguage} = useContext(GlobalContext);
  const {classRoomDict} = useDictionary(clientKey);

  return (
    <div className="h-full w-full lg:w-3/10 min-w-100 border-r-0 border-white bg-darker-gray bg-opacity-40 pl-2 flex flex-row justify-between">
      <div title="title" className="h-8 align-middle text-white text-xs leading-8 ">
        <span className="font-bold">{classRoomDict[userLanguage]['LESSON']}: </span>
        <span>{lessonState.lessonData.title}</span>
      </div>
    </div>
  );
};

export default LessonInfoTitleBar;
