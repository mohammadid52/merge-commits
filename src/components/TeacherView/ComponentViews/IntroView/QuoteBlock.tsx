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
  const [isToggled, setIsToggled] = useState<string[]>(['']);

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

      <div className='h-full text-left flex flex-col items-start'>
        {/* BIO */}
        <div
          className={`${
            heroIsActive ? 'visible overflow-y-auto' : 'hidden'
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
          >
          <div className='absolute bottom-0 left-0 p-2 h-auto mb-0 flex flex-col bg-gradient-to-r from-black20 rounded-b-xl'>
            <div className='text-xl header-font font-open font-light'>Featured Artist:</div>
            <div className='w-full text-4.5xl leading-none font-light'>{artistName}</div>
            <div className='text-xl header-font font-open font-light'>"{quote.text}"</div>
          </div>

        </div>
      </div>
      
      {/* <PhotoBlock /> */}
    </div>
  );
}

export default QuoteBlock;