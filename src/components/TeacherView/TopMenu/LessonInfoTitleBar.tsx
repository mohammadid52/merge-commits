import React, { useContext } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

import PlayComplete from './PlayComplete';

import { LessonInfoTitleBarProps } from '../TopMenu';

const LessonInfoTitleBar: React.FC<LessonInfoTitleBarProps> = (props: LessonInfoTitleBarProps) => {
  const { handleOpen, handleComplete, handleLessonButton } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);

  return (
    <div className='h-full w-4/10 min-w-100 max-w-160 border-r border-white bg-darker-gray bg-opacity-40 pl-2 flex flex-row justify-between '>
      <div title='title' className='h-8 align-middle text-white text-xs leading-8 '>
        <span className='font-bold'>Lesson: </span><span>{state.data.lesson.title}</span>
      </div>
      <PlayComplete handleOpen={handleOpen} handleLessonButton={handleLessonButton} />
    </div>
  );
};

export default LessonInfoTitleBar;
