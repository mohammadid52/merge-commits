import React, { useContext } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

import  PlayComplete from './PlayComplete';

interface LessonInfoTitleBarProps {
  handleOpen: () => void;
  handleLessonButton: () => void;
}

const LessonInfoTitleBar: React.FC<LessonInfoTitleBarProps> = (props: LessonInfoTitleBarProps) => {
  const { handleOpen, handleLessonButton } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);

  return (
    <div className='h-full w-4/10 min-w-100 max-w-160 border-r border-white bg-light-gray bg-opacity-20 pl-2 flex flex-row justify-between '>
      <div title='title' className='h-8 align-middle font-bold text-xs leading-8 '>
        Lesson: "{state.data.lesson.title}"
      </div>
      <PlayComplete handleOpen={handleOpen} handleLessonButton={handleLessonButton} />
    </div>
  );
};

export default LessonInfoTitleBar;
