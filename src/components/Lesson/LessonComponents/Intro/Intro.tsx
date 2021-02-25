import React, { useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import QuoteBlock from './QuoteBlock';
import Keyword from './Keyword';
import Banner from './Banner';
import DoFirst from './DoFirst';
import Connect from './Connect';
import InstructionBlock from '../InstructionBlock';

const Intro = () => {
  const { dispatch, state, theme } = useContext(LessonContext);
  const imgArray = state.data.lesson.artist.images;
  const lessonType = state.data.lesson.type;

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: '' });
  }, []);

  if (lessonType === 'survey' || lessonType === 'assessment') {
    return (
      <div className={theme.section}>
        <Banner />
        <div className='flex flex-col justify-between items-center mt-4'>
          <InstructionBlock instructions={state.data.lesson.instructions} />
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
