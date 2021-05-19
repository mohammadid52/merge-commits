import React from 'react';
import { RowWrapperProps } from '../../../../interfaces/UniversalLessonBuilderInterfaces';

export const AddNewBlockMini = (props: RowWrapperProps) => {
  const {
    mode,
    hasContent,
    contentID,
    hoveredID,
    handleModalPopToggle,
  } = props;

  return (
    <div
      className={`
      w-full
      flex flex-col justify-center items-center
      z-50`}>
      <div
        onClick={() => handleModalPopToggle('ADD_CONTENT')}
        className={`w-auto cursor-pointer bg-gray-600 rounded-full z-50`}>
        <p className={`p-2 text-xs text-center`}>Add New Block</p>
      </div>
        <div className={`absolute border-b-0 border-dashed border-blue-400`}/>
    </div>
  );
};
