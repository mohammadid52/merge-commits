import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaVideo } from 'react-icons/fa';
import ToolTip from '../../../../General/ToolTip/ToolTip';

const InstructionsBlock = () => {
  const { state } = useContext(LessonContext);
  const [videoMode, setVideoMode] = useState(false);
  const { text, video, link } = state.data.lesson.warmUp.instructions;

  const toggleVideoMode = () => {
    setVideoMode(!videoMode);
  };

  return (
    <div className='bg-dark-blue border-l-4 border-green-light md:h-4/10 p-4 flex text-gray-200 rounded-lg shadow-2xlr overflow-hidden'>
      <div className='w-full flex flex-col'>
        <div className='w-full flex flex-row mb-1 pb-1 border-b border-white border-opacity-10 mr-4'>
          <h3 className='w-3/10 mr-2 flex text-xl font-open font-light animate-bounce'>
            Instructions 
            {/* <ToolTip width='w-40' position='bottom' header='Instructions' content='click the red icon for video instructions'/> */}
          </h3>
          {/* <p className='w-auto text-gray-600 text-sm flex mr-4 items-center'>
            
          </p> */}
        </div>
        <div
          className={`w-full h-8/10 flex justify-center items-center font-light text-base text-blue-100 text-opacity-70 px-2`}>
          {/* {!videoMode ? ( */}
            <div className='h-full overflow-y-auto overflow-x-hidden'>
              {text.map((inst: string, key: number) => (
                <p key={key} className='mb-1'>
                  {inst}
                </p>
              ))}
            </div>
          {/* ) : (
            <div
              className='h-full flex justify-center items-center'
              style={{ width: '250px' }}>
              <video controls width='250'>
                <source src={link} type='video/mp4' />
                <p>Your browser does not support embedded video playback!</p>
              </video>
            </div>
          )} */}
        </div>
      </div>
      {/* <IconContext.Provider value={{ color: '#EDF2F7', size: '1rem' }}>
        <div
          className='cursor-pointer flex-grow-0 bg-dark-red h-8 w-8 flex flex-col items-center justify-center z-20 rounded-lg shadow-2'
          onClick={toggleVideoMode}>
          <FaVideo />
        </div>
      </IconContext.Provider> */}
    </div>
  );
};

export default InstructionsBlock;
