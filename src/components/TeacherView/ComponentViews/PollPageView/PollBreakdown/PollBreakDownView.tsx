import React, { useState, useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import SelfDisplay from '../../../../Lesson/LessonComponents/PollPage/PollBreakdown/SelfDisplay';

import {PollBreakdownProps} from '../../../../Lesson/LessonComponents/PollPage/PollBreakdown/PollBreakdown';
import { getPageLabel } from '../../../../getPageLabel';

const PollBreakdownView = (props: PollBreakdownProps) => {
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const [dataProps, setDataProps] = useState();

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
    <SelfDisplay isTeacher={true} dataProps={dataProps} displayMode={'SELF'}/>
  );
};

export default PollBreakdownView;
