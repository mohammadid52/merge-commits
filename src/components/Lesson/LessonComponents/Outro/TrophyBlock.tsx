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
  return (
    <div className='h-full w-10/10 border border-medium-blue flex flex-col justify-between items-center rounded-lg p-4'>
      <div className='h-full flex flex-col justify-between items-center'>
        <div className='text-2xl text-gray-200 font-light font-medium border-b border-white mb-4 pb-4 border-opacity-50'>
          You have completed
        </div>

        <div className='h-8/10 flex flex-col'>
          <div className='cursor-pointer px-4 py-2 w-4.5/10 h-5/10 flex justify-center items-center'>
            <IconContext.Provider
              value={{
                color: '#F1C40F',
                size: '2rem',
                className: 'flex flex-grow',
              }}>
              <FaScroll />
            </IconContext.Provider>

            <div className=' text-2xl text-gray-200 font-open font-light'>
              1 Story
            </div>
          </div>
          <div className='cursor-pointer px-4 py-2 w-4.5/10 h-5/10 flex justify-center items-center'>
            <IconContext.Provider
              value={{
                color: '#F1C40F',
                size: '2rem',
                className: 'flex flex-grow',
              }}>
              <FaPenFancy />
            </IconContext.Provider>

            <div className=' text-2xl text-gray-200 font-open font-light'>
              1 Poem
            </div>
          </div>
          {/* <div className="column-center">
                        <IconContext.Provider value={{ color: '#F1C40F', size: '5rem',}}>
                            <FaPenFancy />
                        </IconContext.Provider>
                        <div className="flex justify-center text-2xl text-gray-200 font-open font-bold mt-2">
                            1 Poem
                        </div>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default TrophyBlock;
