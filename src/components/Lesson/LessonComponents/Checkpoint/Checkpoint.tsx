import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import SampleProfileQuestions from './SampleProfileQuestion';
import CheckpointQuestions from './CheckpointQuestions';
import Assessments from './Assessments';
import Banner from './Banner';

const Checkpoint = () => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const [title, setTitle] = useState('');

  const handleSetTitle = (title: string) => {
    setTitle(title);
  };

  const tempCheckPtSwitch = (type: string) => {
    switch (type) {
      case 'profile':
        return <SampleProfileQuestions />;
      case 'survey':
        return <CheckpointQuestions handleSetTitle={handleSetTitle} />;
      case 'assessment':
        return <Assessments handleSetTitle={handleSetTitle} />;
      default:
        return;
    }
  };

  useEffect(() => {
    if (!state.pages[state.currentPage].active) {
      dispatch({ type: 'ACTIVATE_LESSON', payload: state.pages[state.currentPage].stage });
    }
  }, [state.currentPage]);

  return (
    <div className={theme.section}>
      <Banner />
        {tempCheckPtSwitch(state.pages[state.currentPage].type)}
    </div>
  );
};

export default Checkpoint;
