import React, { useState, useEffect, useContext } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import StoryOutput from './StoryOuput';
import { studentObject } from '../../../../../state/LessonControlState';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { getPageLabel } from '../../../../getPageLabel';

interface props {
  fullscreen: boolean;
}

const SelfDisplay = (props: props) => {
  const { fullscreen } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const [dataProps, setDataProps] = useState<{ title?: string; story?: string[]; [key: string]: any } | null>(null);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  let displayStudentData = state.studentViewing.live
    ? state.studentViewing.studentInfo.currentLocation
      ? getPageLabel(state.studentViewing.studentInfo.currentLocation, state.pages) === 'warmup/breakdown'
      : state.studentViewing.studentInfo.lessonProgress === 'warmup/breakdown'
    : false;

  useEffect(() => {
    if (displayStudentData) {
      if (state.studentViewing.studentInfo.warmupData) {
        return setDataProps(state.studentViewing.studentInfo.warmupData);
      }
    }
    return setDataProps(null);
  }, [state.studentViewing]);

  return (
    <div className={theme.section}>
      <ReflectionQuestions fullscreen={fullscreen} />
      <Banner dataProps={dataProps} fullscreen={fullscreen} />
      <StoryOutput story={dataProps && dataProps.story ? dataProps.story : ['']} />
      <Modules dataProps={dataProps} fullscreen={fullscreen} />
    </div>
  );
};

export default SelfDisplay;
