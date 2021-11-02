import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import React from 'react';
import {IoMdAddCircleOutline} from 'react-icons/io';
import {IconContext} from 'react-icons/lib/esm/iconContext';

export const AddNewBlock = (props: RowWrapperProps) => {
  const {handleModalPopToggle, idx} = props;
  const {setNewBlockSeqId} = useULBContext();

  return (
    <div
      onClick={() => {
        handleModalPopToggle('ADD_CONTENT');
        setNewBlockSeqId(idx);
      }}
      className={`
      w-full focus:scale-95 scale-100 transform  h-48 cursor-pointer
      flex justify-center items-center 
      bg-gray-400 bg-opacity-20 
      rounded
      z-0`}>
      <div className={`w-auto `}>
        <IconContext.Provider value={{size: '4rem'}}>
          <IoMdAddCircleOutline className="iconoclast:text-main curate:text-main" />
        </IconContext.Provider>
        <p className={`text-center iconoclast:text-main curate:text-main`}>
          Add New Block
        </p>
      </div>
    </div>
  );
};
