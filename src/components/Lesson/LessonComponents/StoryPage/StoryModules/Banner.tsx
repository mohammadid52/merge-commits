import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaScroll } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const Banner = () => {
    const { state } = useContext(LessonContext);
    const title = state.data.warmUp.title

    return (
        <div className="banner w-full flex flex-row justify-center items-center my-4 ">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
            <div className="red bg-dark-red h-24 w-24 flex flex-col items-center justify-center z-20 rounded-sm shadow-2">
                <FaScroll />
            </div>
            </IconContext.Provider>
            <div className="title bg-dark-blue shadow-2 w-full flex flex-row justify-center items-center text-xl text-center font-open font-bold text-gray-200 px-4 py-2 z-10 text-center">
                { title }
            </div>
        </div>
    )
}

export default Banner;