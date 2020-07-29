import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import { FaVideo } from 'react-icons/fa';

const InstructionsBlock = () => {
    const { state } = useContext(LessonContext);
    const [ videoMode, setVideoMode ] = useState(false);
    const { text, video, link } = state.data.warmUp.instructions ;

    const toggleVideoMode = () => {
        setVideoMode(!videoMode);
    }

    return (
        <div className="bg-dark-blue md:h-52 p-4 mb-4 flex text-gray-200 shadow-2 rounded-sm">
            <div className="w-full flex flex-col px-4">
                <div className="flex flex-row mb-3 border-b border-white mr-4">
                    <h3 className="w-3/10 mr-2 flex-grow text-xl font-open font-bold ">
                        Instructions
                    </h3>
                    <p className="text-sm flex items-center">(click the red icon for video instructions)</p>
                </div>
                <div className={`w-full flex justify-center text-sm px-2`}>
                {   !videoMode ?
                    <div className="h-32 overflow-scroll mb-2">
                        
                        {
                            text.map((inst: string, key: number) => (
                                
                                <p key={key} className="mb-2">
                                
                                    { inst }
                                </p>
                            ))
                        }
                    </div>
                    :
                    <div className="shadow-2 items-center" style={{ width: '225px'}}>
                        <video controls width="225">
                            <source src={link} type="video/mp4" />
                            <p>Your browser does not support embedded video playback!</p>
                        </video>
                    </div>
                }
                </div>
            </div>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1rem'}}>
                <div className="flex-grow-0 bg-dark-red h-8 w-8 flex flex-col items-center justify-center z-20 rounded-sm shadow-2 mr-2" onClick={toggleVideoMode}>
                    <FaVideo />
                </div>
            </IconContext.Provider>
        </div>
    )
}

export default InstructionsBlock;