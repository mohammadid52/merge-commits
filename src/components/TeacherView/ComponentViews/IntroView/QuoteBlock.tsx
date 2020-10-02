import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { GoQuote } from 'react-icons/go';
import { FaQuoteLeft } from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const QuoteBlock = (props: props) => { 
    const {  fullscreen } = props
    const { state, theme } = useContext(LessonControlContext);
    const quoteArray = state.data.lesson.artist.quotes;
    const artistName = state.data.lesson.artist.name;
    

    const randomQuote = () => {
        let quote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
        return quote
    }

    const quote = randomQuote();

    return (

    <div className={`w-full min-h-24 flex flex-grow items-center justify-center ${theme.block.text} ${fullscreen ? 'p-4' : 'p-2'} bg-gradient-to-tr from-transparent to-white5 rounded-lg`}>
        <div className='h-full flex flex-col items-center mr-4'>
          <div className='h-full flex flex-col justify-around'>
  
            <div className="h-4.5/10 my-auto flex flex-col justify-center">
              <div className={`w-40 ${fullscreen ? 'text-2xl' : 'text-base'} flex text-left justify-center items-center`}>
                Featured Artist:
              </div>
              <div className={`w-full text-center ${fullscreen ? 'text-3xl' : 'text-lg'} leading-none font-light`}>{artistName}</div>
            </div>
  
            <div className="h-4.8/10 my-auto flex flex-col justify-end items-center">
              <div className={`h-auto quote flex flex-col justify-around items-center py-2 ${fullscreen ? 'px-4' : 'px-0'} bg-gradient-to-l from-transparent to-black80`}>
                <div className='relative'>
                  <div className='absolute w-16' style={{ top: '-30px', left: '-5px' }}>
                    <IconContext.Provider value={{ size: '7rem', style: { opacity: '40%' } }}>
                      <GoQuote />
                    </IconContext.Provider>
                  </div>
                  <div className={`header-font ${fullscreen ? 'text-lg' : 'text-sm'} font-open font-light pl-8 md:pl-12`} style={{ textIndent: '-16px' }}>
                    {quote.text}
                  </div>
                </div>
                <div className={`${fullscreen ? 'text-sm' : 'text-xs'} text-gray-500 text-sm self-end text-right mt-2`}>- {quote.source}</div>
              </div>
            </div>
          </div>
        </div>
        <PhotoBlock />
      </div>
    )
}

export default QuoteBlock;