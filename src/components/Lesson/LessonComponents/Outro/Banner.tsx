import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

const Banner = () => {
    const { state } = useContext(LessonContext);
    // const achievements = state.data.lesson.achievements;
    // const studentPortfolio = state.data.student.portfolio;


    return (
        <div className="w-full flex flex-row justify-center items-center mt-8">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                <div className="bg-dark-red h-24 w-24 flex flex-col items-center justify-center z-20 rounded-sm shadow-2">
                    <FaMusic />
                </div>
            </IconContext.Provider>
            <div className="bg-dark-blue w-full h-20 flex flex-row justify-center items-center text-4xl text-center font-open font-bold text-gray-200 rounded-sm shadow-2 px-4 py-2 z-10">
                <p>Congrats! You've completed <span className="text-gold"> 1 </span> story and <span className="text-gold"> 1 </span> poem!</p>
            </div>
        </div>
    )
}

export default Banner;