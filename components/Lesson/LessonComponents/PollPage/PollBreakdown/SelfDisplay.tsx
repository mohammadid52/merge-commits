import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

/**
 * Component imports
 */
import ReflectionQuestions from '../../ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import PollOutput from './PollOutput';

import { PollBreakdownProps } from './PollBreakdown';

const SelfDisplay = (props: PollBreakdownProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, dataProps, displayMode } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const displayProps = !isTeacher ? state.componentState.poll : null;
  // const inputs = state.data.lesson.warmUp.inputs;

  // const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  return (
    <div className={theme.section}>
      <ReflectionQuestions isTeacher={isTeacher} questions={state.data.lesson.warmUp.breakdown.reflectionQuestions} />
      <Banner isTeacher={isTeacher} title={state.data.lesson.warmUp.title} display="SELF" />
      <Modules
        isTeacher={isTeacher}
        dataProps={isTeacher && dataProps ? dataProps : !isTeacher && displayProps ? displayProps : null}
        displayMode="SELF"
      />
      <PollOutput
        isTeacher={isTeacher}
        dataProps={isTeacher && dataProps ? dataProps : !isTeacher && displayProps ? displayProps : null}
      />
      {/*  NEEDS TO RECEIVE DISPLAY PROPS OR DATA PROPS  */}
    </div>
  );
};

export default SelfDisplay;
