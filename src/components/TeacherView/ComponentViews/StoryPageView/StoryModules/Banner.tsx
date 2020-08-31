import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaScroll } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

const Banner = () => {
    const { state } = useContext(LessonControlContext);
    const title = state.data.lesson.warmUp.title

    return (
        <div className="w-full h-1/10 flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                <div className="red bg-dark-red h-20 w-20 flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
                    <FaScroll />
                </div>
            </IconContext.Provider>
            <div className="title bg-dark-blue w-full flex flex-row justify-center items-center text-xl md:text-4xl text-center font-open font-bold text-gray-200 rounded-lg shadow-2 px-4 py-2 z-10">
                    { title }
            </div>
        </div>
    )
}

export default Banner;