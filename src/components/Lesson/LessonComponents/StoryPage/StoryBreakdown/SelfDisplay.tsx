import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import StoryOutput from './StoryOutput';

const SelfDisplay = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const displayProps = state.componentState.story;

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  const [fullscreen, setFullscreen] = useState(false);
  return (
    <div className={theme.section}>
      <Banner title={displayProps.title} display='SELF' fullscreen={fullscreen} />
      <ReflectionQuestions />
      <StoryOutput story={displayProps.story} />
      <Modules additional={displayProps.additional} displayMode='SELF' />
    </div>
  );
};

export default SelfDisplay;
