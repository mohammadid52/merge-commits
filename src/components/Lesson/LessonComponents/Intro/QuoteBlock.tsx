import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const QuoteBlock = () => { 
    const { state, theme } = useContext(LessonContext);
    const quoteArray = state.data.quotes;
    

    const randomQuote = () => {
        let quote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
        return quote
    }

    const quote = randomQuote();

    return (
        <div className={`flex-grow w-full min-h-24 ${theme.block.bg} ${theme.block.text} px-8 py-4 mt-3 flex items-center justify-center rounded-sm ${theme.block.shadow}`}>
            <div className="flex flex-col items-center w-">
                <div className="text-4xl font-open font-bold ml-4" style={{ textIndent: '-16px'}}>
                    "{ quote.text }"
                </div>
                <div className="text-gray-500 self-end">
                    - { quote.source }
                </div>
            </div>
        </div>
    )
}

export default QuoteBlock;