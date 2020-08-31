import React, { useContext, useState } from 'react';
import { IconContext } from "react-icons";
import { FaVideo } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface InstructionsBlockProps {
    fullscreen: boolean
}

const InstructionsBlock = (props: InstructionsBlockProps) => {
    const { fullscreen } = props
    const { state } = useContext(LessonControlContext);
    const [ videoMode, setVideoMode ] = useState(false);
    const { text, video, link } = state.data.lesson.warmUp.instructions;

    const toggleVideoMode = () => {
        setVideoMode(!videoMode);
    }

    return (
        <div className={`${fullscreen ? 'p-4' : 'p-2'} bg-dark-blue md:h-4/10 flex text-gray-200 shadow-2 rounded-lg`}>
            <div className="w-full flex flex-col">
                <div className={`${fullscreen ? 'flex-row mb-3' : 'flex-col'} w-auto flex flex-row border-b border-white mr-4`}>
                    <h3 className={`${fullscreen ? 'text-xl w-auto mr-2' : 'text-base w-full'} w-3/10 flex-grow font-open font-bold`}>
                        Instructions
                    </h3>
                    <p className={`${fullscreen ? 'w-auto' : 'w-full'} text-gray-600 text-sm flex mr-4 items-center`}>(click the red icon for video instructions)</p>
                </div>
                <div className={`${fullscreen ? 'h-8/10' : 'h-5/10'} w-full  flex justify-center items-center text-sm px-2`}>
                {   !videoMode ?
                    <div className="h-full overflow-scroll">
                        
                        {
                            text.map((inst: string, key: number) => (
                                
                                <p key={key} className={`${fullscreen ? '' : 'text-xs'} mb-2`}>
                                
                                    { inst }
                                </p>
                            ))
                        }
                    </div>
                    :
                    <div className="h-full flex justify-center items-center" style={{ width: '250px'}}>
                        <video controls width="250">
                            <source src={link} type="video/mp4" />
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