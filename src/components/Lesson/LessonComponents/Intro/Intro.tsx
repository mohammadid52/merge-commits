import React, { useEffect, useState, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPenFancy, FaCheckSquare } from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import Keyword from './Keyword';
import Block from './Block';
import Banner from './Banner';
import DoFirst from './DoFirst';
import Connect from './Connect';

const Intro = () => {
  const { dispatch, state, theme } = useContext(LessonContext);
  const imgArray = state.data.lesson.artist.images;

  useEffect(() => {
    // console.log('andrew', state.data.lesson);

    dispatch({ type: 'ACTIVATE_LESSON', payload: '' });
  }, []);

  if (state.data.lesson.type === 'survey') {
    return (
      <div className={`z-50 w-full h-full flex flex-col justify-center items-center`}>
        <div className={`w-8/10 text-xl md:text-5xl ${theme.banner}`}>
          <div
            className={`h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-medium ${theme.block.text} z-10 my-4`}>
            {state.data.lesson.title ? state.data.lesson.title : null}
          </div>
        </div>

        <div
          className={`w-8/10 h-8/10 flex flex-col ${theme.block.bg} justify-center items-center p-8 ${theme.block.text} text-base rounded-lg`}>
          {state.data.lesson.instructions
            ? state.data.lesson.instructions.map((item: string, idx: number) => (
              <div key={`introinstruction_${idx}`} className={`text-xl my-2 text-center`}
  dangerouslySetInnerHTML={{ __html: item }}/>
            ))
            : null}
        </div>
      </div>
    );
  }

  return (
    <div className={theme.section}>
      <Banner />
      <div
        className='h-96 flex flex-col mb-4 justify-between items-center bg-cover bg-right-top rounded-xl z-10'
        style={{ backgroundImage: `url(${imgArray[0]})` }}>
        <QuoteBlock />
        {/* <Block /> */}
      </div>
      <Connect />
      <div className='flex flex-col justify-between items-center mt-4'>
        <Keyword />
      </div>
      <div className='flex flex-col justify-between items-center mt-4'>
        <DoFirst />
      </div>
    </div>
  );
};

export default Intro;
