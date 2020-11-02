import React, { useState, useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { AiOutlineRead } from 'react-icons/ai';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
  fullscreen: boolean
}

const QuoteBlock = (props: props) => {
  const { fullscreen } = props;
  const [heroIsActive, setHeroIsActive] = useState<boolean>(false);
  const { state, theme } = useContext(LessonControlContext);
  const quoteArray = state.data.lesson.artist.quotes;
  const artistName = state.data.lesson.artist.name;
  const artistBio = state.data.lesson.artist.bio;


  const randomQuote = () => {
    let quote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
    return quote
  }

  const quote = randomQuote();

  /**
 * Function for toggling hero description hover
 * @param e - Hover/click over hero image
 */
  const toggleHeroDescription = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;

    if (!heroIsActive) {
      setHeroIsActive(true);
    } else {
      setHeroIsActive(false);
    }
  };

  return (
    <div
      className={`relative w-full md:h-96 flex flex-grow items-center p-4 rounded-xl ${theme.block.text} ${heroIsActive ? 'bg-black50' : ''}`}>
      {/* READ ICON */}
      <div
        className='absolute top-1 right-1 w-auto h-auto transition-all duration-500 ease-in-out text-gray-200 hover:text-white'
        onClick={toggleHeroDescription}>
        <IconContext.Provider value={{ size: '2rem', style: { width: 'auto', cursor: 'pointer' } }}>
          <AiOutlineRead
            style={{
              MozUserSelect: 'none',
              WebkitUserSelect: 'none',
              msUserSelect: 'none',
            }}
          />
        </IconContext.Provider>
      </div>

      <div className='h-full text-left flex flex-col items-start'>
        {/* BIO */}
        <div
          className={`${heroIsActive ? 'visible' : 'hidden'
            } h-96 w-9/10 bg-black50 flex flex-col justify-start transition-all duration-500 ease-in-out animate-fadeIn overflow-hidden`}>
          {typeof artistBio !== 'undefined'
            ? artistBio.map((paragraph: string, i: number) => (
              <p key={`paraBio${i}`} className='mb-2 text-blue-100 text-opacity-75'>
                {paragraph}
              </p>
            ))
            : ''}
        </div>

        {/* STANDARD HERO TEXT */}
        <div
          className={`${heroIsActive ? 'hidden' : 'visible'
            } h-full flex flex-col justify-end transition-all duration-500 ease-in-out animate-fadeIn`}>
          <div className='h-auto mb-0 flex flex-col'>
            <div className='text-sm flex text-left items-center'>Featured Artist:</div>
            <div className='w-full text-4.5xl leading-none font-light'>{artistName}</div>
          </div>

          <div className={`h-auto mb-0 flex flex-col justify-end items-center`}>
            <div className='h-full flex flex-col justify-around items-center'>
              <div className='relative'>
                <div className='header-font text-lg font-open font-light'>"{quote.text}"</div>
              </div>
              <div className='text-sm pl-8 mt-2'>- {quote.source}</div>
            </div>
          </div>
        </div>
      </div>
      {/* <PhotoBlock /> */}
    </div>
  );
}

export default QuoteBlock;