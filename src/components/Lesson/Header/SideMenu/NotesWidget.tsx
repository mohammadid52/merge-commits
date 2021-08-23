import React from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { BsPencilSquare } from 'react-icons/all';
import { LessonHeaderBarProps } from '../../../../interfaces/LessonComponentsInterfaces';

const NotesWidget = (props: LessonHeaderBarProps) => {
  const { overlay, setOverlay } = props;

  const handleToggle = () => {
    if (overlay === 'notes') {
      setOverlay('');
    } else {
      setOverlay('notes');
    }
  };

  return (
    <div className={`cursor-pointer flex flex-col justify-center items-center mx-2 mb-4`}>
      <div className={`w-12 h-12 flex justify-center items-center bg-white rounded-full`} onClick={handleToggle}>
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <BsPencilSquare color={`black`} />
        </IconContext.Provider>
      </div>
      <p className='text-xs text-gray-200 text-center'>Notes</p>
    </div>
  );
};

export default NotesWidget;
