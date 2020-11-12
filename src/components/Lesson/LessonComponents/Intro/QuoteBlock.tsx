import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineRead } from 'react-icons/ai';
import PhotoBlock from './PhotoBlock';

const QuoteBlock = () => {
  const { state, theme } = useContext(LessonContext);
  const [heroIsActive, setHeroIsActive] = useState<boolean>(false);
  const [isToggled, setIsToggled] = useState<string[]>(['']);

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
    const t = e.currentTarget as HTMLElement;
    const targetWordID = t.id || '';

    if (!heroIsActive) {
      setHeroIsActive(true);
    } else {
      setHeroIsActive(false);
    }

    /**
     * Animation
     */
    setIsToggled([...isToggled, targetWordID]);

    setTimeout(() => {
      setIsToggled(isToggled.filter((targetString: string) => targetString !== targetWordID));
    }, 300);
  };

  return (
    <div
      className={`relative w-full md:h-96 flex flex-grow items-center p-4 rounded-xl ${theme.block.text} ${heroIsActive ? 'bg-black50' : ''}`}>
      
      {/* READ ICON */}
      <div
        id='read-icon'
        className='absolute top-1 right-1 w-auto h-auto transition-all duration-500 ease-in-out text-gray-200 hover:text-white'
        onClick={toggleHeroDescription}>
        <IconContext.Provider value={{ size: '2rem', style: { width: 'auto', cursor: 'pointer' } }}>
          <AiOutlineRead
            className={`${isToggled.includes('read-icon') && 'animate-jiggle'} hover:animate-jiggle`}
            style={{
              MozUserSelect: 'none',
              WebkitUserSelect: 'none',
              msUserSelect: 'none',
            }}
          />
        </IconContext.Provider>
      </div>

      {/* READ ICON - RIGHT TEXT */}
      <div className='absolute top-1 right-0 w-full transform translate-x-full'>
        <p className='animate-bounce ml-2'>&larr; Read Me!</p>
      </div>

      <div className='h-full text-left flex flex-col items-start'>
        {/* BIO */}
        <div
          className={`${
            heroIsActive ? 'visible' : 'hidden'
          } h-96 w-9/10 flex flex-col justify-start transition-all duration-500 ease-in-out animate-fadeIn overflow-hidden`}>
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
          } h-full flex flex-col justify-end transition-all duration-500 ease-in-out animate-fadeIn`}
          style={{textShadow: 'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) -1px 0px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) 0px 1px 1px'}}>
          <div className='absolute bottom-0 left-0 p-2 h-auto mb-0 flex flex-col bg-gradient-to-t from-black50 rounded-xl'>
            <div className='text-xl header-font font-open font-light'>Featured Artist:</div>
            <div className='w-full text-4.5xl leading-none font-light'>{artistName}</div>
            <div className='text-xl header-font font-open font-light'>"{quote.text}"</div>
          </div>

        </div>
      </div>
      {/* <PhotoBlock /> */}
    </div>
  );
};

export default QuoteBlock;
