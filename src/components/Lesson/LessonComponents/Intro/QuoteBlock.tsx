import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineRead } from 'react-icons/ai';
import PhotoBlock from './PhotoBlock';

const QuoteBlock = () => {
  const { state, theme } = useContext(LessonContext);
  const [heroIsActive, setHeroIsActive] = useState<boolean>(false);
  const quoteArray = state.data.lesson.artist.quotes;
  const artistName = state.data.lesson.artist.name;
  const title = state.data.lesson.title;
  const artistBio = state.data.lesson.artist.bio;

  const randomQuote = () => {
    let quote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
    return quote;
  };

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
      className={`relative w-full md:h-96 flex flex-grow items-center ${theme.block.text} p-4 rounded-xl`}>
      {/* READ ICON */}
      <div
        className='absolute top-1 right-1 w-auto h-auto transition-all duration-500 ease-in-out text-gray-700 hover:text-white'
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
          className={`${
            heroIsActive ? 'visible' : 'hidden'
          } h-full w-9/10 flex flex-col justify-start transition-all duration-500 ease-in-out animate-fadeIn`}>
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
          className={`${
            heroIsActive ? 'hidden' : 'visible'
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
              <div className='text-gray-500 text-sm pl-8 mt-2'>- {quote.source}</div>
            </div>
          </div>
        </div>
      </div>
      {/* <PhotoBlock /> */}
    </div>
  );
};

export default QuoteBlock;
