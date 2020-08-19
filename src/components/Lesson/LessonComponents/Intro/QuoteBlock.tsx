import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import { GoQuote } from 'react-icons/go';
import { FaQuoteLeft } from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';


const QuoteBlock = () => { 
    const { state, theme } = useContext(LessonContext);
    const quoteArray = state.data.quotes;
    const artistName = state.data.artist.name;
    

    const randomQuote = () => {
        let quote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
        return quote
    }

    const quote = randomQuote();

    return (

    <div className={`flex-grow w-full min-h-24 ${theme.block.bg} ${theme.block.text} p-4 mt-3 flex items-center justify-center rounded-lg ${theme.block.shadow}`}>
        <div className="h-full flex flex-col items-center">
            <div className="w-8/10 text-center border-b-2 text-4xl font-bold mb-4">
                {artistName}
            </div>
            <div className="quote flex flex-col items-center px-4">
                <div className="relative">
                    <div className="absolute w-16" style={{top: '-30px', left: '-5px'}}>
                        <IconContext.Provider value={{ size: '7rem', style: { opacity: '40%' }}}>
                            <GoQuote /> 
                        </IconContext.Provider>
                    </div>
                    <div className="header-font text-3xl font-open font-bold pl-8 md:pl-12" style={{ textIndent: '-16px'}}>
                        { quote.text }
                    </div>
                </div>

                <div className="text-gray-500 self-end text-right mt-2">
                    - { quote.source }
                </div>
            </div>
        </div>
        <PhotoBlock />
    </div>
    )
}

export default QuoteBlock;