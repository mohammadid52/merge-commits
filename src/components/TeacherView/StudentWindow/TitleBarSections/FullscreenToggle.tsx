import React from 'react';
import {FaCompress, FaExpand} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';

interface IFullscreenToggleProps {
  fullscreen?: boolean;
  handleFullscreen?: () => void;
}

const FullscreenToggle = ({fullscreen, handleFullscreen}: IFullscreenToggleProps) => {
  return (
    <div className="w-1/3 w-auto flex justify-end">
      <div
        className="w-8 flex justify-center items-center cursor-pointer text-xl z-50 px-2 text-black hover:text-blueberry"
        onClick={handleFullscreen}>
        <IconContext.Provider
          value={{
            size: '1.5rem',
            style: {
              zIndex: 50,
            },
          }}>
          {fullscreen ? <FaCompress /> : <FaExpand />}
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default FullscreenToggle;
