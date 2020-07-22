import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaPenFancy } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const Banner = () => {
    const { state } = useContext(LessonContext);
    const title = state.data.activity.title;

    return (
        <div className="banner w-full flex flex-row justify-center items-center my-4">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                <div className="red bg-dark-red h-20 w-20 flex flex-col items-center justify-center z-20 rounded-sm shadow-2">
                    <FaPenFancy />
                </div>
            </IconContext.Provider>
            <div className="title bg-dark-blue w-full flex flex-row justify-center items-center text-4xl text-center font-open font-bold text-gray-200 rounded-sm shadow-2 px-4 py-2 z-10">
                { title }
            </div>
        </div>
    )
}

export default Banner;