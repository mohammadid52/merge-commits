import React, { useState, useContext } from 'react';
import { IconContext } from "react-icons";
import { FaVideo } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const InstructionsBlock = () => {
    const { state } = useContext(LessonContext);
    const [ videoMode, setVideoMode ] = useState(false);
    // const { text, video, link } = state.data..instructions;

    const toggleVideoMode = () => {
        setVideoMode(!videoMode);
    }
    
    return (
        <div className="bg-dark-blue w-full md:h-2.8/10 flex flex-col p-6 shadow-3 rounded-sm text-gray-200 mt-4 md:mt-0">
        <div className="w-full flex justify-between">
            <h3 className="flex-grow text-xl font-open font-bold mb-6 border-b border-white mr-4">
                Instructions
            </h3>
        </div>
        <div className="overflow-scroll text-sm mb-4 md:mb-0">
            <p>Where are you from?</p>
            <p>Write 3-5 facts about what that means to you and and your family.</p>
        </div>
    </div>
    )
}

export default InstructionsBlock;