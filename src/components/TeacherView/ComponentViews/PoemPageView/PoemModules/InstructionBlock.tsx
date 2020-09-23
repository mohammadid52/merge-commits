import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
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
            <div className={`${fullscreen ? 'p-6' : 'p-3'} bg-dark-blue w-full md:h-2.8/10 flex flex-col shadow-3 rounded-lg text-gray-200 mt-4 md:mt-0`}>
                <div className="w-full flex justify-between">
                    <h3 className={`${fullscreen ? 'text-xl mb-6' : 'text-base'} flex-grow font-open font-bold border-b border-white mr-4`}>
                        Instructions
                    </h3>
                </div>
                <div className="overflow-y-scroll text-sm mb-4 md:mb-0">
                    Make the final edits to your poem, and get ready to present.
                </div>
            </div>
        )
    }

    return (
        <div className={`${fullscreen ? 'p-6' : 'p-3'} bg-dark-blue w-full md:h-5/10 flex justify-center shadow-3 rounded-lg text-gray-200`}>
            <div className="w-full flex flex-col">
                <div className={`${fullscreen ? 'flex-row mb-3' : 'flex-col'} w-auto flex border-b border-white mr-2`}>
                    <h3 className={`${fullscreen ? 'text-xl w-auto mr-2' : 'text-base w-full'} flex-grow font-open font-bold`}>
                        Instructions
                    </h3>
                    <p className={`${fullscreen ? 'w-auto' : 'hidden'}  text-gray-600 text-xs flex items-center`}>(click the red icon for video instructions)</p>
                </div>
                <div className={`w-full ${fullscreen ? 'h-8/10' : 'h-7.5/10'} flex justify-center items-center text-sm px-2`}>
                    {   !videoMode ? 
                        <div className="h-full overflow-y-scroll">
                        {
                            instructions.text.map((inst: string, key: number) => (
                                <p key={key} className="mb-2 text-sm">
                                    { inst }
                                </p>
                            ))
                        }
                        </div>
                        :
                        <div className="h-full flex justify-center items-center" style={{ width: '250px'}}>
                            <video controls width="250">
                                <source src={instructions.link} type="video/mp4" />
                                <p>Your browser does not support embedded video playback!</p>
                            </video>
                        </div>
                    }
                </div>
            </div>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1rem'}}>
                <div className="cursor-pointer flex-grow-0 bg-dark-red h-8 w-8 flex flex-col items-center justify-center z-20 rounded-lg shadow-2" onClick={toggleVideoMode}>
                    <FaVideo />
                </div>
            </IconContext.Provider>
        </div>
    )
}

export default InstructionsBlock;