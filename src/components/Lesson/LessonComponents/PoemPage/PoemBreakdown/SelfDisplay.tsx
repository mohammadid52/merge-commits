import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from '../../ReflectionQuestions';
import PoemOutput from './PoemOutput';
import Banner from '../../Banner';

const SelfDisplay = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const displayProps = state.componentState?.poem;
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'activity/breakdown' });
  }, []);

  return (
    <div className={theme.section}>
      <ReflectionQuestions questions={state.data.lesson.activity.breakdown.reflectionQuestions} />

      {/**
       * HIDE BANNER IF NO TITLE
       */}
      {
        displayProps && displayProps.title && (
          <Banner title={displayProps.title} iconName={`FaPenFancy`} />
        )
      }
      <PoemOutput poem={typeof displayProps !== 'undefined' ? displayProps.editInput : 'Your Poem :)'} />
    </div>
  );
};

export default SelfDisplay;
