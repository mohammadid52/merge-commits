import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import {
    FaTrophy,
} from 'react-icons/fa';

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

const TrophyBlock = () => {

    return (
        <div className="md:h-44 w-full bg-dark-blue flex flex-row justify-around items-center shadow-2 rounded-sm p-4 mt-4">
            <div className="mx-4 column-center">
                <IconContext.Provider value={{ color: '#F1C40F', size: '7rem',}}>
                    <FaTrophy />
                </IconContext.Provider>
                <div className="flex justify-center text-2xl text-gray-200 font-open font-bold">
                    Story
                </div>
            </div>
            <div className="mx-4 column-center">
                <IconContext.Provider value={{ color: '#F1C40F', size: '7rem',}}>
                    <FaTrophy />
                </IconContext.Provider>
                <div className="flex justify-center text-2xl text-gray-200 font-open font-bold">
                    Poem
                </div>
            </div>
        </div>
    )
}

export default TrophyBlock;