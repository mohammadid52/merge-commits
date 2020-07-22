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
        <div className="bg-dark-blue md:h-40 overflow-scroll px-4 md:px-8 py-4 mb-4 flex flex-col text-gray-200 shadow-2 rounded-sm">
            <div className="w-full flex justify-between">
                <h3 className="flex-grow text-xl font-open font-bold mb-3 border-b border-gray-700 mr-4">
                    Instructions
                </h3>
                <IconContext.Provider value={{ color: '#EDF2F7', size: '1rem'}}>
                    <div className="flex-grow-0 bg-dark-red h-8 w-8 flex flex-col items-center justify-center z-20 rounded-sm shadow-2" onClick={toggleVideoMode}>
                        <FaVideo />
                    </div>
                </IconContext.Provider>
            </div>
            <div className="w-full text-sm px-2">
            {   !videoMode ?
                <div className="overflow-scroll">
                    {
                        text.map((inst: string, key: number) => (
                            <p key={key} className="mb-4">
                                { inst }
                            </p>
                        ))
                    }
                </div>
                :
                <div className="shadow-2 flex justify-center items-center my-4" style={{ width: '300px'}}>
                    <video controls width="300">
                        <source src={link} type="video/mp4" />
                        <p>Your browser does not support embedded video playback!</p>
                    </video>
                </div>
            }
            </div>
        </div>
    )
}

export default InstructionsBlock;