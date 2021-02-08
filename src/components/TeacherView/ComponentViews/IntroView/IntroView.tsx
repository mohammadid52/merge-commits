import React, { useState, useContext } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import Block from './Block';
import Banner from './Banner';
import InstructionsBlock from './InstructionsBlock';
import Keyword from './Keyword';
import Connect from './Connect';
import DoFirst from './DoFirst';
import { getPageLabel } from '../../../getPageLabel';

interface props {
  fullscreen: boolean;
}

const IntroView = (props: props) => {
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const [doFirstData, setDoFirstData] = useState<{ [key: string]: any }>();
  const { fullscreen } = props;
  const imgArray = state.data.lesson.artist.images;

  let displayStudentData = state.studentViewing.live
    ? state.studentViewing.studentInfo.currentLocation
      ? getPageLabel(state.studentViewing.studentInfo.currentLocation, state.pages) === 'intro'
      : state.studentViewing.studentInfo.lessonProgress === 'intro'
    : false;

  return (
    <div className={theme.section}>
      <Banner fullscreen={fullscreen} />
      <div
        className='h-96 flex flex-col mb-4 justify-between items-center bg-cover bg-right-top rounded-xl z-10'
        style={{ backgroundImage: `url(${imgArray[0]})` }}>
        <QuoteBlock fullscreen={fullscreen} />
        {/* <Block /> */}
      </div>
      <Connect fullscreen={fullscreen} />
      <div className='flex flex-col justify-between items-center mt-4'>
        <Keyword fullscreen={fullscreen} />
      </div>
      <div className='flex flex-col justify-between items-center mt-4'>
        <DoFirst />
      </div>
    </div>
  );
};

export default IntroView;
