import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { FaVideo } from 'react-icons/fa';
import ToolTip from '../../../../General/ToolTip/ToolTip';

interface InstructionsBlockProps {
  editMode: boolean;
}

const InstructionsBlock = (props: InstructionsBlockProps) => {
  const { editMode } = props;
  const { state } = useContext(LessonContext);
  const [videoMode, setVideoMode] = useState(false);
  const instructions = state.data.lesson.activity.instructions;

  const toggleVideoMode = () => {
    setVideoMode(!videoMode);
  };

  if (editMode) {
    return (
      <div className='md:h-2/10 bg-dark-blue border-l-4 border-green-light w-full flex flex-col p-4 rounded-lg text-gray-200 shadow-2xlr'>
        <div className='w-auto flex flex-row mb-1 pb-1 border-b border-white border-opacity-10 mr-4'>
          <h3 className='w-auto mr-2 flex-grow text-xl font-open font-light animate-bounce'>
            Instructions
          </h3>
        </div>
        <div className='overflow-y-auto overflow-x-hidden font-light text-base mt-2 mb-4 md:mb-0'>
          Make the final edits to your poem, and get ready to present.
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full p-4 md:pr-8 mb-4 flex flex-row text-gray-200 rounded-lg border-l-4 border-green-light'>
      <div className='w-full flex flex-col'>
        <div className='w-auto flex flex-row mb-1 pb-1 border-b border-white border-opacity-10 mr-4'>
          <h3 className='text-xl text-gray-200 font-open font-light flex'>
              Instructions <ToolTip width='w-40' position='bottom' header='Instructions' content='click the red icon for video instructions'/>
          </h3>
          {/* <p className='w-auto text-gray-600 text-sm flex mr-1 font-light items-center'>
            (click the red icon for video instructions)
          </p> */}
        </div>
        <div
          className={`w-full h-7.5/10 flex justify-center items-center text-sm px-2`}>
          {!videoMode ? (
            <div className='h-full overflow-auto'>
              {instructions.text.map((inst: string, key: number) => (
                <p key={key} className='mb-2 text-sm font-light'>
                  {inst}
                </p>
              ))}
            </div>
          ) : (
            <div
              className='h-full flex justify-center items-center'
              style={{ width: '250px', paddingTop: '.5rem' }}>
              <video controls width='250'>
                <source src={instructions.link} type='video/mp4' />
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
