import React, {useContext} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IoMdAddCircleOutline} from 'react-icons/io';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {GlobalContext} from '../../../../contexts/GlobalContext';

export const AddNewBlock = (props: RowWrapperProps) => {
  const {handleModalPopToggle, idx} = props;
  const {setNewBlockSeqId} = useULBContext();
  const {
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const iconColor = lessonPageTheme === 'light' ? 'black' : 'white';

  return (
    <div
      onClick={() => {
        handleModalPopToggle('ADD_CONTENT');
        setNewBlockSeqId(idx);
      }}
      className={`
      w-full h-48 
      flex justify-center items-center 
      bg-gray-400 bg-opacity-20 
      rounded
      z-0`}>
      <div className={`w-auto cursor-pointer`}>
        <IconContext.Provider value={{size: '4rem', color: iconColor}}>
          <IoMdAddCircleOutline />
        </IconContext.Provider>
        <p className={`text-center ${themeTextColor}`}>Add New Block</p>
      </div>
    </div>
  );
};
