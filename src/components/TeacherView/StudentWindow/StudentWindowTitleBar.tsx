import React, { useContext } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaExpand, FaCompress, FaHome, FaRegThumbsUp, FaInfoCircle } from 'react-icons/fa';

interface StudentWindowTitleBarProps {
  setFullscreenInstructions: React.Dispatch<React.SetStateAction<boolean>>;
  fullscreenInstructions: boolean;
  handleFullscreen: () => void;
  fullscreen: boolean;
}

const StudentWindowTitleBar: React.FC<StudentWindowTitleBarProps> = (
  props: StudentWindowTitleBarProps
) => {
  const { 
    setFullscreenInstructions, 
    fullscreenInstructions, 
    handleFullscreen, 
    fullscreen } = props;

  return (
    <div className={`w-full h-8 top-0 flex space-between font-medium bg-light-gray bg-opacity-10`}>
      <div className='h-8 pl-2 align-middle font-bold text-xs leading-8 '>Student Window:</div>
      
      <div className='w-24 flex space-between'>
        <div
          className='w-auto cursor-pointer w-full text-xl z-50'
          onClick={() => setFullscreenInstructions(!fullscreenInstructions)}>
          <IconContext.Provider
            value={{
              color: '#E2E8F0',
              size: '2rem',
              style: {
                zIndex: 50,
              },
            }}>
            <FaInfoCircle />
          </IconContext.Provider>
        </div>

        <div className='w-auto cursor-pointer w-full text-xl z-50' onClick={handleFullscreen}>
          <IconContext.Provider
            value={{
              color: '#E2E8F0',
              size: '2rem',
              style: {
                zIndex: 50,
              },
            }}>
            {fullscreen ? <FaCompress /> : <FaExpand />}
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default StudentWindowTitleBar;
