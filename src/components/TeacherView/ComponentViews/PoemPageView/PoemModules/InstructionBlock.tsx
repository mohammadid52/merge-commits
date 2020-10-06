import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaVideo } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface InstructionsBlockProps { 
    editMode: boolean,
    fullscreen: boolean
}

const InstructionsBlock = (props: InstructionsBlockProps) => {
    const { editMode, fullscreen } = props
    const { state } = useContext(LessonControlContext);
    const [ videoMode, setVideoMode ] = useState(false);
    const instructions = state.data.lesson.activity.instructions;

    const toggleVideoMode = () => {
        setVideoMode(!videoMode);
    }

    if (editMode) {
        return (
        <div className={`${fullscreen ? 'p-4' : 'p-2'} md:h-2.8/10 bg-dark-blue border-l-4 border-green-light w-full flex flex-col rounded-lg text-gray-200 shadow-2xlr`}>
            <div className='w-auto flex flex-row mb-1 pb-1 border-b border-white border-opacity-10 mr-4'>
              <h3 className={`${fullscreen ? 'text-xl' : 'text-base'} w-auto mr-2 flex-grow font-open font-light animate-bounce`}>
                Instructions
              </h3>
            </div>
            <div className={`${fullscreen ? 'text-base' : 'text-sm'} overflow-y-auto overflow-x-hidden font-light mt-2 mb-4 md:mb-0`}>
              Make the final edits to your poem, and get ready to present.
            </div>
          </div>
        )
    }

    return (
        <div className={`h-5.3/10 bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full ${fullscreen ? 'p-4' : 'p-2'}  flex flex-row text-gray-200 rounded-lg border-l-4 border-green-light`}>
            <div className='w-full flex flex-col'>
            <div className={`${fullscreen ? 'flex-row mb-1' : 'flex-col'} w-auto flex pb-1 border-b border-white border-opacity-10 mr-1`}>
                <h3 className={`${fullscreen ? 'text-xl w-auto mr-2' : 'text-base w-full'} flex-grow font-open font-light animate-bounce`}>
                Instructions
                </h3>
                <p className={`${fullscreen ? 'w-auto' : 'hidden'} w-auto text-gray-600 text-sm flex mr-1 font-light items-center`}>
                (click the red icon for video instructions)
                </p>
            </div>
            <div
                className={`w-full ${fullscreen ? 'h-7.5/10' : 'h-8/10'} font-light flex justify-center items-center text-sm px-2`}>
                {!videoMode ? (
                <div className='h-full overflow-y-auto overflow-x-hidden'>
                    {instructions.text.map((inst: string, key: number) => (
                    <p key={key} className={`mb-2 ${fullscreen ? 'text-base' : 'text-xs'}`}>
                        {inst}
                    </p>
                    ))}
                </div>
                ) : (
                <div
                    className='h-full flex justify-center items-center pt-4'
                    style={fullscreen ? { width: '280px' } : {width: '200px'}}>
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
    )
}

export default InstructionsBlock;