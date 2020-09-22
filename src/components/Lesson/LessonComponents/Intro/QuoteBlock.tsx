import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { GoQuote } from 'react-icons/go';
import { FaQuoteLeft } from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';

const QuoteBlock = () => {
  const { state, theme } = useContext(LessonContext);
  const quoteArray = state.data.lesson.artist.quotes;
  const artistName = state.data.lesson.artist.name;
  const title = state.data.lesson.title;

  const randomQuote = () => {
    let quote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
    return quote;
  };

  const quote = randomQuote();

  return (
    <div className={`w-full min-h-24 flex flex-col items-between justify-between ${theme.block.text} p-4 bg-gradient-to-tr from-transparent to-white5 rounded-lg`}>
      <div className="h-8/10 flex flex-grow items-center justify-center">
        <div className='h-full flex flex-col items-center mr-4'>
          <div className='my-auto'>
            <div className='w-8/10 text-center text-4xl font-light mb-4'>{artistName}</div>
            <div className='h-auto quote flex flex-col justify-around items-center py-2 px-4 bg-gradient-to-l from-transparent to-black80'>
              <div className='relative'>
                <div className='absolute w-16' style={{ top: '-30px', left: '-5px' }}>
                  <IconContext.Provider value={{ size: '7rem', style: { opacity: '40%' } }}>
                    <GoQuote />
                  </IconContext.Provider>
                </div>
                <div className='header-font text-2xl font-open font-light pl-8 md:pl-12 ' style={{ textIndent: '-16px' }}>
                  {quote.text}
                </div>
              </div>

              <div className='text-gray-500 self-end text-right mt-2'>- {quote.source}</div>
            </div>
          </div>
        </div>
        <PhotoBlock />
      </div>
      <div className="h-1.8/10 text-3xl flex flex-row-reverse text-bold pt-3">
        {title}
      </div>
    </div>
  );
};

export default QuoteBlock;
