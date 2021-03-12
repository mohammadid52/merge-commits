import React from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineHome } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/all';

const HomeWidget = (props: { handlePopup: any }) => {
  return (
    <div className={`cursor-pointer flex flex-col justify-center items-center mb-4`}>
      <div className={`w-12 h-12 flex justify-center items-center bg-white rounded-full`} onClick={props.handlePopup}>
        <IconContext.Provider value={{ size: '1.5rem' }}>
          <AiOutlineHome color={`black`} />
        </IconContext.Provider>
      </div>
        <p className='text-xs text-gray-200 text-center'>Home</p>
    </div>
  );
};

export default HomeWidget;