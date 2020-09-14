import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { FaVideo } from 'react-icons/fa';

const InstructionsBlock = () => {
  const { state } = useContext(LessonContext);
  const [videoMode, setVideoMode] = useState(false);
  const { text, video, link } = state.data.lesson.warmUp.instructions;

  const toggleVideoMode = () => {
    setVideoMode(!videoMode);
  };

  return (
    <div className='bg-dark-blue border-l-8 border-green-light md:h-4/10 p-4 flex text-gray-200 rounded-lg shadow-2xlr'>
      <div className='w-full flex flex-col'>
        <div className='w-auto flex flex-row mb-3 border-b border-white mr-4'>
          <h3 className='w-3/10 mr-2 mb-4 flex-grow text-xl font-open font-light animate-bounce'>
            Instructions
          </h3>
          <p className='w-auto text-gray-600 text-sm flex mb-4 mr-4 items-center'>
            (click the red icon for video instructions)
          </p>
        </div>
        <div
          className={`w-full h-8/10 flex justify-center items-center font-light text-base text-blue-100 text-opacity-70 px-2`}>
          {!videoMode ? (
            <div className='h-full overflow-scroll'>
              {text.map((inst: string, key: number) => (
                <p key={key} className='mb-2'>
                  {inst}
                </p>
              ))}
            </div>
          ) : (
            <div
              className='h-full flex justify-center items-center'
              style={{ width: '250px' }}>
              <video controls width='250'>
                <source src={link} type='video/mp4' />
                <p>Your browser does not support embedded video playback!</p>
              </video>
            </div>
          )}
        </div>
      </div>
      <IconContext.Provider value={{ color: '#EDF2F7', size: '1rem' }}>
        <div
          className='cursor-pointer flex-grow-0 bg-dark-red h-8 w-8 flex flex-col items-center justify-center z-20 rounded-lg shadow-2'
          onClick={toggleVideoMode}>
          <FaVideo />
        </div>
      </IconContext.Provider>
    </div>
  );
};

export default InstructionsBlock;
