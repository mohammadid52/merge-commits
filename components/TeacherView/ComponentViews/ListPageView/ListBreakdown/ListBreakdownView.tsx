import React, { useState, useEffect, useContext } from 'react';
import { studentObject } from '../../../../../state/LessonControlState';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import ListOutput from './ListOutput';
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

  useEffect(() => {
    console.log('List breakdown selfdisplay: ', dataProps);
  }, [dataProps]);

  return (
    <div className={theme.section}>
      <ReflectionQuestions fullscreen={fullscreen} />
      <Banner dataProps={dataProps} fullscreen={fullscreen} />
      <ListOutput list={dataProps && dataProps.story ? dataProps.story : ['']} fullscreen={fullscreen} />
      <Modules dataProps={dataProps} fullscreen={fullscreen} />
    </div>
  );
};

export default SelfDisplay;
