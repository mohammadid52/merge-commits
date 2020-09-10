import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaScroll } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const Banner = () => {
    const { state } = useContext(LessonContext);
    const title = state.data.lesson.warmUp.title

    return (
        <div className="w-full h-1/10 flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                <div className="h-full bg-dark-red h-20 w-20 flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
                    <FaScroll />
                </div>
            </IconContext.Provider>
            <div className="bg-dark-blue h-full w-full flex flex-row justify-center items-center text-xl md:text-5xl text-center font-open font-bold text-gray-200 rounded-lg shadow-2 z-10">
                    { title }
            </div>
        </div>
    )
}

export default Banner;