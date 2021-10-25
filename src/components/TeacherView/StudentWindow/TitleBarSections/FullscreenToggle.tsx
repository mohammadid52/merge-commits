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
    <div className="w-1/3 w-auto flex justify-end">
      <div
        className={`text-gray-600 hover:${theme.textColor[themeColor]} w-8 flex justify-center items-center cursor-pointer text-xl z-50 px-2`}
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
