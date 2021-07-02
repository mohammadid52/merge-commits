import React, { useContext } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

import useDictionary from '../../../customHooks/dictionary';
import { GlobalContext } from '../../../contexts/GlobalContext';

import PlayComplete from './PlayComplete';

import { LessonInfoTitleBarProps } from '../TopMenu';

const LessonInfoTitleBar: React.FC<LessonInfoTitleBarProps> = (props: LessonInfoTitleBarProps) => {
  const { handleOpen, handleComplete, handleLessonButton } = props;
  const {lessonState, lessonDispatch, controlState, controlDispatch} = useContext(GlobalContext);
  const { clientKey, userLanguage } = useContext(GlobalContext);
  const { classRoomDict } = useDictionary(clientKey);

  return (
    <div className='h-full w-4/10 min-w-100 max-w-160  border-r-0 border-white bg-darker-gray bg-opacity-40 pl-2 flex flex-row justify-between '>
      <div title='title' className='h-8 align-middle text-white text-xs leading-8 '>
        <span className='font-bold'>{classRoomDict[userLanguage]['LESSON']}: </span><span>{lessonState.lessonData.title}</span>
      </div>
      {/*<PlayComplete handleOpen={handleOpen} handleLessonButton={handleLessonButton} />*/}
    </div>
  );
};

export default LessonInfoTitleBar;
