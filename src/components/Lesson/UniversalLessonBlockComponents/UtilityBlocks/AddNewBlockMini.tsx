import React from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

export const AddNewBlockMini = (props: RowWrapperProps) => {
  const {mode, hasContent, contentID, hoveredID, handleModalPopToggle} = props;

  return (
    <div
      className={`
      group
      w-full
      flex flex-col justify-center items-center
      z-50`}>
      <button
        onClick={() => handleModalPopToggle('ADD_CONTENT')}
        className={`
        w-auto 
        p-2
        cursor-pointer 
        text-xs text-center text-gray-600 group-hover:text-gray-200
        bg-gray-600 bg-opacity-20 
        group-hover:bg-opacity-95 
        rounded-full z-50`}>
        Add New Block
      </button>
      <div
        className={`absolute border-b-0 border-dashed border-blue-400 border-opacity-20 group-hover:border-opacity-80`}
      />
    </div>
  );
};
