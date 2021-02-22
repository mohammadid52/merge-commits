import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from '../../ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import TruthGameOutput from './TruthGameOutput';

const tempData = [
  {
    id: 'deepest-fear',
    label: 'Deepest fear',
    text: 'My deepest fear is losing someone I love',
    isLie: true,
  },
  {
    id: 'most-anxious',
    label: 'Most anxious',
    text: 'I am most anxious about school',
  },
  {
    id: 'happiest-moment',
    label: 'Happiest moment',
    text: 'My happiest moment was when I got a new iPhone',
  },
];

const SelfDisplay = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const displayProps = state.componentState.truthGame.truthGameArray;
  const inputs = state.data.lesson.warmUp.inputs;

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  const [fullscreen, setFullscreen] = useState(false);
  return (
    <div className={theme.section}>
      <ReflectionQuestions questions={state.data.lesson.warmUp.breakdown.reflectionQuestions} />
      <Banner title={state.data.lesson.warmUp.title} display="SELF" fullscreen={fullscreen} />

      <TruthGameOutput truthGameData={displayProps ? displayProps : []} />

      {/*{inputs.additionalInputs.length > 0 ? <Modules additional={displayProps.additional} displayMode="SELF" /> : null}*/}
    </div>
  );
};

export default SelfDisplay;
