import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import { FaTrophy, FaPenFancy, FaScroll} from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';
import Quote from './QuoteBlock';
import Block from '../Intro/QuoteBlock';

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

const TrophyBlock = () => {

    return (
        <div className="h-full w-6.8/10 bg-dark-blue flex flex-col justify-between items-center shadow-2 rounded-lg p-4">
            <div className="h-full flex flex-col justify-between items-center">
                <div className="h-1.5/10 text-2xl text-gray-200 font-open font-bold border-b border-white">
                    You have completed
                </div>

                <div className="flex h-8/10 justify-center">
                    <div className="flex flex-col justify-center column-center">
                        <div className="">
                            <IconContext.Provider value={{ color: '#F1C40F', size: '5rem',}}>
                                <FaScroll />
                            </IconContext.Provider>
                        </div>
                        <div className="flex justify-center text-2xl text-gray-200 font-open font-bold mt-2">
                            1 Story
                        </div>
                    </div>
                    <div className="flex flex-col justify-center column-center">
                        <div className="">
                            <IconContext.Provider value={{ color: '#F1C40F', size: '5rem',}}>
                                <FaPenFancy />
                            </IconContext.Provider>
                        </div>
                        <div className="flex justify-center text-2xl text-gray-200 font-open font-bold mt-2">
                            1 Poem
                        </div>
                    </div>
                    {/* <div className="column-center">
                        <IconContext.Provider value={{ color: '#F1C40F', size: '5rem',}}>
                            <FaPenFancy />
                        </IconContext.Provider>
                        <div className="flex justify-center text-2xl text-gray-200 font-open font-bold mt-2">
                            1 Poem
                        </div>
                    </div> */}
                </div>

            </div>
        </div>
    )
}

export default TrophyBlock;