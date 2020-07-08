import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const QuoteBlock = () => { 
    const { state } = useContext(LessonContext);
    const quoteArray = state.data.quotes;

    const randomQuote = () => {
        let quote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
        return quote
    }

    const quote = randomQuote();

    return (
        <div className="flex-grow w-full h-40 bg-dark-blue px-8 py-4 flex items-center justify-center rounded-sm shadow-2">
            <div className="flex flex-col items-center w-9/10">
                <div className="text-gray-200 text-3xl font-open font-bold ml-4" style={{ textIndent: '-16px'}}>
                    "{ quote.text }"
                </div>
                <div className="text-gray-500 text-xl self-end">
                    - { quote.source }
                </div>
            </div>
        </div>
    )
}

export default QuoteBlock;