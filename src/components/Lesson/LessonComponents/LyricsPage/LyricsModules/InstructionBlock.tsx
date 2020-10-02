import React, { useState, useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaVideo } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ToolTip from '../../../../General/ToolTip/ToolTip';

const InstructionsBlock = () => {
    const { state, theme } = useContext(LessonContext);
    const [ videoMode, setVideoMode ] = useState(false);
    const { text, video, link } = state.data.lesson.coreLesson.instructions;
    

    const instructionsArr = state.data.lesson.coreLesson.instructions.text;
    // [
        
    //         <p className="text-sm font-light mb-2">
    //             Read the lyrics to the song "Where I'm from" by Marlon Lizama.
    //             {console.log(state.data.lesson.coreLesson.instructions.text, 'text')}
    //         </p>,
    //         <p className="text-sm font-light mb-2"> 
    //             Highlight lines that <span className="underline">remind you of your culture</span> with <span className="text-dark-red font-bold animate-fadeIn">red</span>.
    //         </p>,
    //         <p className="text-sm font-light mb-2"> 
    //             Highlight any lines that you think are <span className="underline">powerful</span> in <span className="text-fire-orange font-bold animate-fadeIn">orange</span>.
    //         </p>,
    //         <p className="text-sm font-light mb-2">
    //             Mark words you don't know in <span className="text-sea-green font-bold animate-fadeIn">green</span>.
    //         </p>,
    //         <p className="text-sm font-light mb-2">
    //             Use the eraser to deselect!
    //         </p>,
    // ]

    const toggleVideoMode = () => {
        setVideoMode(!videoMode);
    }
    
    return (
        <div className="md:h-3.8/10 bg-dark-blue border-l-4 border-green-light w-full flex justify-center p-4 rounded-lg text-gray-200 shadow-2xlr">
            <div className="w-full flex flex-col">
                <div className={`w-auto flex flex-row ${theme.underline} mr-4 pb-1`}>
                    {/* <h3 className="mr-2 flex-grow text-xl font-open font-light animate-bounce">
                        Instructions <ToolTip width='w-40' position='bottom' header='Instruction' content='click the red icon for video instructions'/>
                    </h3> */}
                    <h3 className='text-xl text-gray-200 font-open font-light flex'>
                        Instructions <ToolTip width='w-40' position='bottom' header='Instructions' content='click the red icon for video instructions'/>
                    </h3>
                </div>
                <div className={`w-full h-8/10 flex justify-center items-center text-sm px-2`}>
                    {   !videoMode ?
                        <div className="h-full overflow-y-auto overflow-x-hidden">
                            { instructionsArr.map((inst: string, key: number) => (
                                <div className={`mx-2 text-sm font-light mb-2 `} key={key}>{inst}</div>
                                ))}
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