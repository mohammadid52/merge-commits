import {IconContext} from 'react-icons/lib/esm/iconContext';
import React from 'react';
import {IoMdAddCircleOutline} from 'react-icons/io';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

export const AddNewBlock = (props: RowWrapperProps) => {
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
      w-full h-48 
      flex justify-center items-center 
      bg-light-blue bg-opacity-0 
      hover:bg-light-blue hover:bg-opacity-20 
      rounded-xl border-dashed border-4 border-light-blue-500
      z-50`}>
      <div
        onClick={() => handleModalPopToggle('ADD_CONTENT')}
        className={`w-auto cursor-pointer z-50`}>
        <IconContext.Provider value={{size: '4rem', color: '#ffffff'}}>
          <IoMdAddCircleOutline />
        </IconContext.Provider>
        <p className={`text-center`}>Add New Block</p>
      </div>
    </div>
  );
};
