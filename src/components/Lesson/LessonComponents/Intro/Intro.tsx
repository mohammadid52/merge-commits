import React, { useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import Banner from '../Banner';
import QuoteBlock from './QuoteBlock';
import Keyword from './Keyword';
import DoFirst from './DoFirst';
import Connect from './Connect';
import InstructionBlock from '../InstructionBlock';

const Intro = () => {
  const { dispatch, state, theme } = useContext(LessonContext);
  const imgArray = state.data?.lesson?.artist?.images;
  const lessonType = state.data.lesson.type;

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: '' });
  }, []);

  const quickRepair = (str: string) => {
    if(str){
      return str.replace('color: black', 'color: white');
    } else return '';
  }

  /**
   *
   * SURVEY INTRO COMPONENT
   *
   */
  if (lessonType === 'survey' || lessonType === 'assessment') {
    return (
      <div className={theme.section}>
        <Banner title={state.data.lesson?.title}/>
        <Banner titleSection={state.data.lesson?.introductionTitle}/>
        <p className={`mb-1 text-gray-100 ${theme.elem.text}`} dangerouslySetInnerHTML={{ __html: state.data.lesson?.introduction }} />
        <div className='flex flex-col justify-between items-center mt-4'>
          <Banner titleSection={state.data.lesson?.instructionsTitle}/>
          <InstructionBlock instructions={state.data.lesson.instructions} />
        </div>
      </div>
    );
  }

  /**
   *
   * STANDARD INTRO COMPONENT
   *
   */
  return (
    <div className={theme.section}>
      <Banner title={state.data.lesson.title} iconName={'FaHourglassStart'}/>
      <div
        className='h-96 flex flex-col mb-4 justify-between items-center bg-cover bg-right-top rounded-xl z-10'
        style={{ backgroundImage: `url(${imgArray ? imgArray[0] : null})` }}>
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
