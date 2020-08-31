import React, { useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';

const Banner = () => {
    const { state } = useContext(LessonContext);
    const { title, artist } = state.data.lesson.coreLesson.content

    return (

        <div className="w-full h-1/10 flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                <div className="red bg-dark-red h-20 w-20 flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
                    <FaMusic />
                </div>
            </IconContext.Provider>
            <div className="title bg-dark-blue w-full flex flex-row justify-center items-center text-xl md:text-4xl text-center font-open font-bold text-gray-200 rounded-lg shadow-2 px-4 py-2 z-10">
                    { title }
            </div>
        </div>

    )
}

export default Banner;