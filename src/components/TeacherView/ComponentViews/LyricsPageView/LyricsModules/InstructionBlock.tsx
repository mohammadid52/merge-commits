import React, { useState, useContext } from 'react';
import { IconContext } from "react-icons";
import { FaVideo } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const InstructionsBlock = (props: props) => {
    const {  fullscreen } = props;
    const { state } = useContext(LessonControlContext);
    const [ videoMode, setVideoMode ] = useState(false);
    const { text, video, link } = state.data.lesson.coreLesson.instructions;
    const instructionsArr = [
            <p className="text-sm mb-2">
                Read the lyrics to the song "Where I'm from" by Marlon Lizama.
            </p>,
            <p className="text-sm mb-2"> 
                Highlight lines that <span className="underline">remind you of your culture</span> with <span className="text-dark-red">red</span>.
            </p>,
            <p className="text-sm mb-2"> 
                Highlight any lines that you think are <span className="underline">powerful</span> in <span className="text-fire-orange">orange</span>.
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
        <div className="md:h-3.8/10 bg-dark-blue w-full flex justify-center p-4 shadow-2 rounded-lg text-gray-200">
            <div className="w-full flex flex-col">
                <div className="w-auto flex flex-row mb-3 border-b border-white mr-2">
                    <h3 className={`${fullscreen ? 'text-xl' : 'text-md'} w-3/10 mr-2 flex-grow font-open font-bold`}>
                        Instructions
                    </h3>
                    <p className={`${fullscreen ? 'mr-4' : 'hidden'} w-auto text-gray-600 text-xs flex items-center`}>(click the red icon for video instructions)</p>
                </div>
                <div className={`${fullscreen ? 'text-sm' : 'text-xs'} w-full h-8/10 flex justify-center items-center text-sm px-2`}>
                    {   !videoMode ?
                        <div className="h-full overflow-scroll">
                            { instructionsArr.map((inst, key) => (
                                <div className="mx-2" key={key}>{inst}</div>
                                ))}
                        </div>
                        :
                        <div className={`h-full flex justify-center items-center`} style={{ width: '150px'}}>
                            <video controls width="150">
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