import React from 'react';
import {FaCompress, FaExpand} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';

interface IFullscreenToggleProps {
  theme?: any;
  themeColor?: string;
  fullscreen?: boolean;
  handleFullscreen?: () => void;
}

const FullscreenToggle = ({
  theme,
  themeColor,
  fullscreen,
  handleFullscreen,
}: IFullscreenToggleProps) => {
  return (
    <div title="Show/Hide fullscreen" className="w-8 flex flex-col content-between ">
      <div
        className={`text-gray-600 hover:iconoclast:text-500 hover:curate:text-500 cursor-pointer`}
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
