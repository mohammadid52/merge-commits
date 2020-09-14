import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaTrophy } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

const Banner = () => {
    const { state } = useContext(LessonContext);
    const { theme } = useContext(LessonContext);
    // const achievements = state.data.lesson.achievements;
    // const studentPortfolio = state.data.student.portfolio;


    return (

        <div className="w-full h-1/10 relative flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                <div className="bg-dark-red absolute left-0 h-8 w-8 flex flex-col justify-center items-center z-20 rounded-lg">
                    <FaTrophy />
                </div>
            </IconContext.Provider>
            <div className={`border-b border-white border-opacity-50 title w-full flex flex-row justify-center items-center text-5xl text-center font-open font-light px-4 py-2 ${theme.block.text} z-10`}>
                <p>Congrats! You've completed the lesson!</p>
            </div>
        </div>


        // <div className="banner w-full flex flex-row justify-center items-center md:mt-8">
        //     <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
        //         <div className="red bg-dark-red h-24 w-24 flex flex-col items-center justify-center z-20 rounded-sm shadow-2">
        //             < FaPenFancy />
        //         </div>
        //     </IconContext.Provider>
        //     <div className="title bg-dark-blue w-full h-20 flex flex-row justify-center items-center text-xs md:text-4xl text-center font-open font-bold text-gray-200 rounded-sm shadow-2 px-1 md:px-4 py-2 z-10">
        //         <p>Congrats! You've completed <span className="text-gold"> 1 </span> story and <span className="text-gold"> 1 </span> poem!</p>
        //     </div>
        // </div>
    )
}

export default Banner;