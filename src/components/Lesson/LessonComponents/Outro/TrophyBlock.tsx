import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import {
    FaTrophy,
} from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';
import Quote from './QuoteBlock';
import Block from '../Intro/QuoteBlock';

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

const TrophyBlock = () => {

    return (
        <div className="md:h-4.9/10 w-full bg-dark-blue flex flex-col justify-between items-center shadow-2 rounded-lg p-4">
            <div className="h-6/10">
                <PhotoBlock />
            </div>
            <div className="h-3.9/10 flex justify-around items-center">
                <div className="mx-4 column-center">
                    <IconContext.Provider value={{ color: '#F1C40F', size: '3rem',}}>
                        <FaTrophy />
                    </IconContext.Provider>
                    <div className="flex justify-center text-2xl text-gray-200 font-open font-bold">
                        Story
                    </div>
                </div>
                <div className="mx-4 column-center">
                    <IconContext.Provider value={{ color: '#F1C40F', size: '3rem',}}>
                        <FaTrophy />
                    </IconContext.Provider>
                    <div className="flex justify-center text-2xl text-gray-200 font-open font-bold">
                        Poem
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrophyBlock;