import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { GoQuote } from 'react-icons/go';
import { FaQuoteLeft, FaPenFancy } from 'react-icons/fa';
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
    <div className={`w-full min-h-24 flex flex-grow items-center justify-center ${theme.block.text} p-4 bg-gradient-to-tr from-transparent to-white5 rounded-lg`}>
      <div className='h-full flex flex-col items-center mr-4'>
        <div className='h-full flex flex-col justify-around'>

          <div className="h-4.5/10 my-auto flex flex-col justify-center">
            <div className="w-40 text-2xl flex text-left justify-center items-center">
              Featured Artist:
            </div>
            <div className='w-full text-center text-4.5xl leading-none font-light'>{artistName}</div>
          </div>

          <div className="h-4.8/10 my-auto flex flex-col justify-end items-center">
            <div className='h-auto quote flex flex-col justify-around items-center py-2 px-4 bg-gradient-to-l from-transparent to-black80'>
              <div className='relative'>
                <div className='absolute w-16' style={{ top: '-30px', left: '-5px' }}>
                  <IconContext.Provider value={{ size: '7rem', style: { opacity: '40%' } }}>
                    <GoQuote />
                  </IconContext.Provider>
                </div>
                <div className='header-font text-lg font-open font-light pl-8 md:pl-12 ' style={{ textIndent: '-16px' }}>
                  {quote.text}
                </div>
              </div>
              <div className='text-gray-500 text-sm self-end text-right mt-2'>- {quote.source}</div>
            </div>
          </div>
        </div>
      </div>
      <PhotoBlock />
    </div>





    // <div className={`w-full min-h-24 flex flex-col items-between justify-between ${theme.block.text} p-4 bg-gradient-to-tr from-transparent to-white5 rounded-lg`}>
    //   <div className="h-8.5/10 p-2 flex flex-grow items-center justify-center">
    //     <div className='h-full flex flex-col items-center mr-4'>
    //       <div className=''>
    //         <div className='w-full text-center text-4xl font-light flex items-center'>
    //           <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
    //             <div className={`bg-dark-red h-8 w-8 flex flex-col items-center justify-center z-20 rounded-lg`}>
    //               <FaPenFancy />
    //             </div>
    //           </IconContext.Provider>
    //           <div className="w-auto pl-3 h-full text-3xl flex justify-center items-center">
    //             Featured Artist
    //           </div>
    //         </div>
    //         <div className="h-4/10 leading-extra-tight text-6xl text-center flex items-center">
    //             {artistName}
    //         </div>
    //         <div className='h-auto mt-2 quote flex flex-col justify-around items-center py-1 px-3 bg-gradient-to-l from-transparent to-black80'>
    //           <div className='relative'>
    //             <div className='absolute w-16' style={{ top: '-30px', left: '-5px' }}>
    //               <IconContext.Provider value={{ size: '7rem', style: { opacity: '40%' } }}>
    //                 <GoQuote />
    //               </IconContext.Provider>
    //             </div>
    //             <div className='header-font text-xl font-open font-light pl-8 md:pl-12 ' style={{ textIndent: '-16px' }}>
    //               {quote.text}
    //             </div>
    //           </div>

    //           <div className='text-gray-500 self-end text-right'>- {quote.source}</div>
    //         </div>
    //       </div>
    //     </div>
    //     <PhotoBlock />
    //   </div>

    //   <div className="h-1.5/10 text-3xl flex flex-row-reverse text-bold pr-4 tracking-wider" style={{backgroundColor: '#1d2d42b3'}}>
    //     {title}
    //   </div>
      
    // </div>
  );
};

export default QuoteBlock;
