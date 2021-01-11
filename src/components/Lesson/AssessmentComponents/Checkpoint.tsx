import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import CheckpointQuestions from './CheckpointQuestions';
import Banner from '../LessonComponents/Banner';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

const Checkpoint = (props: { isTeacher?: boolean }) => {
  /**
   * Teacher switch
   */
  const { isTeacher } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const [title, setTitle] = useState('');

  const handleSetTitle = (title: string) => {
    setTitle(title);
  };

  useEffect(() => {
    if (!isTeacher) {
      if (!state.pages[state.currentPage].active) {
        dispatch({ type: 'ACTIVATE_LESSON', payload: state.pages[state.currentPage].stage });
      }
    }
  }, [state.currentPage]);

  return (
    <div className={theme.section}>
      <Banner isTeacher={isTeacher} title={title} iconName={'FaCheck'} />
      <CheckpointQuestions isTeacher={isTeacher} checkpointType={`checkpoint`} handleSetTitle={handleSetTitle} />
    </div>
  );
};

export default Checkpoint;
