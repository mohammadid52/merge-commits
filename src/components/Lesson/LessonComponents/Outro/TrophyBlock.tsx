import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { FaTrophy, FaPenFancy, FaScroll } from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';
import Quote from './QuoteBlock';
import Block from '../Intro/QuoteBlock';

const keywordCapitilizer = (str: string) => {
  let capitalizedStr = str.replace(/^\w/, (char) => char.toUpperCase());
  return capitalizedStr;
};

const TrophyBlock = () => {
  const { theme } = useContext(LessonContext);

  return (
    <div
      className={`w-7/10 h-full ${theme.gradient.cardBase} flex flex-col justify-between items-center rounded-lg py-3 px-6 shadow-xl`}>
      <div className='w-full border-b border-white border-opacity-10 mr-4 mb-2'>
        <h3 className='w-full text-xl text-gray-200 font-open font-light pr-4'>
          You have completed
        </h3>
      </div>

      <div className='h-full flex flex-col justify-between items-center '>
        <div className='h-full flex flex-row justify-around'>
          <div className='bg-medium-blue rounded-lg cursor-pointer p-2 w-4.5/10 h-full flex justify-center items-center'>
            <IconContext.Provider
              value={{
                color: '#F1C40F',
                style: {height: '1.5rem', width: 'auto'},
                className: 'flex flex-grow',
              }}>
              <FaScroll />
            </IconContext.Provider>

            <div className='w-auto text-gray-200 font-open font-light flex flex-row items-center mr-2'>
              <span className='w-8 h-8 rounded-full bg-indigo-500 uppercase px-3 py-2 flex items-center font-bold mr-3'>
                1
              </span>{' '}
              Story
            </div>
          </div>

          <div className='bg-medium-blue rounded-lg cursor-pointer p-2 w-4.5/10 h-full flex justify-center items-center'>
            <IconContext.Provider
              value={{
                color: '#F1C40F',
                style: {height: '1.5rem', width: 'auto'},
                className: 'flex flex-grow',
              }}>
              <FaPenFancy />
            </IconContext.Provider>

            <div className='w-auto text-gray-200 font-open font-light flex flex-row items-center mr-2'>
              <span className='w-8 h-8 rounded-full bg-indigo-500 uppercase px-3 py-2 flex items-center font-bold mr-3'>
                1
              </span>{' '}
              Poem
            </div>
          </div>
          {/* <div className='column-center'>
                        <IconContext.Provider value={{ color: '#F1C40F', size: '5rem',}}>
                            <FaPenFancy />
                        </IconContext.Provider>
                        <div className='flex justify-center text-2xl text-gray-200 font-open font-bold mt-2'>
                            1 Poem
                        </div>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default TrophyBlock;
