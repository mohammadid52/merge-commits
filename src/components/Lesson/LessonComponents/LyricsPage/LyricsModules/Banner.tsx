import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';

const Banner = () => {
    const { state } = useContext(LessonContext);
    const { title, artist } = state.data.coreLesson.content

    return (
        <div className="w-full flex flex-row justify-center items-center mb-4">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
            <div className="bg-dark-red h-20 w-20 flex flex-col items-center justify-center z-20 rounded-sm shadow-2">
                <FaMusic />
            </div>
            </IconContext.Provider>
            <div className="bg-dark-blue w-full flex flex-row justify-center items-center text-4xl text-center font-open font-bold text-gray-200 rounded-sm shadow-2 px-4 py-2 z-10">
                { title } by { artist }
            </div>
        </div>
    )
}

export default Banner;