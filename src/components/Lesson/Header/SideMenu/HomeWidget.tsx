import React from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineHome} from 'react-icons/ai';
import {BsPencilSquare} from 'react-icons/all';

const HomeWidget = (props: {overlay: any; setOverlay: any; handlePopup: any}) => {
  const {overlay, setOverlay, handlePopup} = props;
  const handleHome = () => {
    if (overlay !== '') {
      setOverlay('');
    }
    handlePopup();
  };
  return (
    <div className={`cursor-pointer mx-2 flex flex-col justify-center items-center mb-4`}>
      <div
        className={`w-12 h-12 flex justify-center items-center bg-white rounded-full`}
        onClick={handleHome}>
        <IconContext.Provider value={{size: '1.5rem'}}>
          <AiOutlineHome color={`black`} />
        </IconContext.Provider>
      </div>
      <p className="text-xs text-gray-200 text-center">Home</p>
    </div>
  );
};

export default HomeWidget;
