import React, { useContext } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

interface ClassRosterTitleBar {
  handleResetDoneCounter: () => void;
}

const ClassRosterTitleBar: React.FC<ClassRosterTitleBar> = (props: ClassRosterTitleBar) => {

  return (
    <div
      className={`w-full h-8 top-0 font-medium border-r border-white bg-light-gray bg-opacity-40`}>
      <div className='h-8 pl-2 align-middle font-bold text-xs leading-8 '>Class Roster:</div>

    </div>
  );
};

export default ClassRosterTitleBar;
