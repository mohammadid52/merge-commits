import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from '../../ReflectionQuestions';
import Modules from './Modules';
import StoryOutput from './StoryOutput';
import Banner from '../../Banner';

const SelfDisplay = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const displayProps = state.componentState.story;

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  return (
    <div className={theme.section}>
      <ReflectionQuestions questions={state.data.lesson.warmUp.breakdown.reflectionQuestions}  />
      <Banner title={displayProps.title} iconName={`FaScroll`} />
      <StoryOutput story={displayProps.story} />
      <Modules additional={displayProps.additional} displayMode='SELF' />
    </div>
  );
};

export default SelfDisplay;
