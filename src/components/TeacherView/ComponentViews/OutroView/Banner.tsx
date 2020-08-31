import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaTrophy } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

interface props {
        fullscreen: boolean
    }

const Banner = (props: props) => {
    const {  fullscreen } = props;
    // const { state } = useContext(Le);
    // const achievements = state.data.lesson.achievements;
    // const studentPortfolio = state.data.student.portfolio;


    return (

        <div className="w-full h-1/10 flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                <div className={`${fullscreen ? 'h-20 w-20' : 'h-12 w-12'} red bg-dark-red flex flex-col items-center justify-center z-20 rounded-lg shadow-2`}>
                    <FaTrophy />
                </div>
            </IconContext.Provider>
            <div className={`${fullscreen ? 'text-4xl' : 'text-2xl px-4 py-2'} bg-dark-blue w-full flex flex-row justify-center items-center text-center font-open font-bold text-gray-200 rounded-lg shadow-2 z-10`}>
                Congrats! You've completed the lesson!
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