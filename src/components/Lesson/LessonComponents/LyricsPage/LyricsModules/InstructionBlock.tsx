import React, { useState, useContext } from 'react';
import { IconContext } from "react-icons";
import { FaVideo } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const InstructionsBlock = () => {
    const { state } = useContext(LessonContext);
    const [ videoMode, setVideoMode ] = useState(false);
    const { text, video, link } = state.data.coreLesson.instructions;
    const instructionsArr = [
            <p className="text-sm mb-2">
                Read the lyrics to the song "Latinoamérica" by Calle 13.
            </p>,
            <p className="text-sm mb-2">
                Highlight lines or words from the lyrics that are <span className="underline">connect to you personally</span> in <span className="text-dark-red">red</span> using the highlighters below. 
            </p>, 
            <p className="text-sm mb-2"> 
                Mark lines that<span className="underline"> remind you of your culture</span> with <span className="text-blueberry">blue</span>.
            </p>,
            <p className="text-sm mb-2"> 
                Highlight any lines that you think are<span className="underline">powerful</span> in <span className="text-fire-orange">orange</span>.
            </p>,
            <p className="text-sm mb-2">
                Mark words you don't know in <span className="text-sea-green">green</span>.
            </p>,
            <p className="text-sm mb-2">
                Use the eraser to deselect!
            </p>,
    ]

    const toggleVideoMode = () => {
        setVideoMode(!videoMode);
    }
    
    return (
        <div className="flex-grow md:h-48 bg-dark-blue w-full flex flex-col justify-around items-center p-4 shadow-2 rounded-t text-gray-200 mb-4 md:mb-2">
            <div className="w-full flex justify-between">
                <h3 className="flex-grow text-xl font-open font-bold mb-3 border-b border-white mr-4">
                    Instructions
                </h3>
                <IconContext.Provider value={{ color: '#EDF2F7', size: '1rem'}}>
                    <div className="flex-grow-0 bg-dark-red h-8 w-8 flex flex-col items-center justify-center z-20 rounded-sm shadow-2" onClick={toggleVideoMode}>
                        <FaVideo />
                    </div>
                </IconContext.Provider>
            </div>
            {   !videoMode ?
                <div className="overflow-scroll">
                    { instructionsArr.map((inst, key) => (
                        <div className="mx-2" key={key}>{inst}</div>
                    ))}
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
    )
}

export default InstructionsBlock;