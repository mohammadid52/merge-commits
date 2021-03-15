import React, { useContext, useState } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import Keyword from '../../../Lesson/LessonComponents/Intro/Keyword';
import Connect from '../../../Lesson/LessonComponents/Intro/Connect';
import DoFirst from './DoFirst';
import { getPageLabel } from '../../../getPageLabel';
import Banner from '../../../Lesson/LessonComponents/Banner';
import QuoteBlock from '../../../Lesson/LessonComponents/Intro/QuoteBlock';

interface props {
  fullscreen: boolean;
}

const IntroView = (props: props) => {
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const [doFirstData, setDoFirstData] = useState<{ [key: string]: any }>();
  const { fullscreen } = props;
  const imgArray = state.data?.lesson?.artist?.images;

  let displayStudentData = state.studentViewing.live
    ? state.studentViewing.studentInfo.currentLocation
      ? getPageLabel(state.studentViewing.studentInfo.currentLocation, state.pages) === 'intro'
      : state.studentViewing.studentInfo.lessonProgress === 'intro'
    : false;

  return (
    <div className={theme.section}>
      <Banner isTeacher={true} title={state.data.lesson.title} iconName={'FaHourglassStart'}/>
      <div
        className='h-96 flex flex-col mb-4 justify-between items-center bg-cover bg-right-top rounded-xl z-10'
        style={{ backgroundImage: `url(${imgArray ? imgArray[0] : null})` }}>
        <QuoteBlock isTeacher={true}/>
        {/* <Block /> */}
      </div>
      <Connect isTeacher={true} />
      <div className='flex flex-col justify-between items-center mt-4'>
        <Keyword isTeacher={true}/>
      </div>
      <div className='flex flex-col justify-between items-center mt-4'>
        <DoFirst />
      </div>
    </div>
  );
};

export default IntroView;
