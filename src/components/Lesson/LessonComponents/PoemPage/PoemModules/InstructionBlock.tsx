import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import { FaVideo } from 'react-icons/fa';

interface InstructionsBlockProps {
    editMode: boolean
}

const InstructionsBlock = (props: InstructionsBlockProps) => {
    const { editMode } = props
    const { state } = useContext(LessonContext);
    const [ videoMode, setVideoMode ] = useState(false);
    const instructions = state.data.activity.instructions;

    const toggleVideoMode = () => {
        setVideoMode(!videoMode);
    }

    if (editMode) {
        return (
            <div className="bg-dark-blue w-full md:h-2.8/10 flex flex-col p-6 shadow-3 rounded-lg text-gray-200 mt-4 md:mt-0">
                <div className="w-full flex justify-between">
                    <h3 className="flex-grow text-xl font-open font-bold mb-6 border-b border-white mr-4">
                        Instructions
                    </h3>
                </div>
                <div className="overflow-scroll text-sm mb-4 md:mb-0">
                    Make the final edits to your poem, and get ready to present.
                </div>
            </div>
        )
    }

    return (
        <div className="bg-dark-blue w-full h-72 flex justify-center p-6 shadow-3 rounded-lg text-gray-200 mb-4">
            <div className="w-full flex flex-col mr-2">
                <h3 className="flex-grow text-xl font-open font-bold mb-3 border-b border-white mr-4">
                    Instructions
                </h3>
                {   !videoMode ? 
                    <div className="h-52 overflow-scroll">
                    {
                        instructions.text.map((inst: string, key: number) => (
                            <p key={key} className="mb-2 text-sm">
                                { inst }
                            </p>
                        ))
                    }
                    </div>
                    :
                    <div className="shadow-2 flex justify-center items-center my-4" style={{ width: '300px'}}>
                        <video controls width="300">
                            <source src={instructions.link} type="video/mp4" />
                            <p>Your browser does not support embedded video playback!</p>
                        </video>
                    </div>
                }
            </div>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1rem'}}>
                <div className="flex-grow-0 bg-dark-red h-8 w-8 flex flex-col items-center justify-center z-20 rounded-lg shadow-2" onClick={toggleVideoMode}>
                    <FaVideo />
                </div>
            </IconContext.Provider>
        </div>
    )
}

export default InstructionsBlock;