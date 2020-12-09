import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from '../../ReflectionQuestions';
import PoemOutput from './PoemOutput';

const SelfDisplay = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const displayProps = state.componentState.poem;
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'activity/breakdown' });
  }, []);

  return (
    <div className={theme.section}>
      <ReflectionQuestions questions={state.data.lesson.activity.breakdown.reflectionQuestions}  />
      <Banner title={typeof displayProps !== 'undefined' ? displayProps.title : 'Your Poem Title :)'} display='SELF' fullscreen={fullscreen} />    
      <PoemOutput poem={typeof displayProps !== 'undefined' ? displayProps.editInput : 'Your Poem :)'} />
    </div>
  );
};

export default SelfDisplay;
