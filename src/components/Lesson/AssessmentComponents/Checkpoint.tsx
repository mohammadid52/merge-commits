import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import CheckpointQuestions from './CheckpointQuestions';
import Banner from '../LessonComponents/Banner';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import SaveQuit from '../LessonComponents/Outro/SaveQuit';

export interface CheckpointInterface {
  title: string;
  subtitle: string;
  id: string;
  type: string;
  questions: any;
  instructions: string;
  instructionsTitle: string;
  label: string;
}

const Checkpoint = (props: { isTeacher?: boolean }) => {
  /**
   * Teacher switch
   */
  const { isTeacher } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const [title, setTitle] = useState('');

  const lessonType = state.data.lesson.type;

  const handleSetTitle = (title: string) => {
    setTitle(title);
  };

  useEffect(() => {
    const lessonType = state.data.lesson.type;
    const lessonTitle = state.data.lesson.title;

    if (lessonType === 'lesson') {
      setTitle('Checkpoint Questions');
    } else {
      setTitle(`${lessonTitle} - Assessment Questions`);
    }
  }, []);

  useEffect(() => {
    if (!isTeacher) {
      if (!state.pages[state.currentPage].active) {
        dispatch({ type: 'ACTIVATE_LESSON', payload: state.pages[state.currentPage].stage });
      }
    }
  }, [state.currentPage]);

  return (
    <div className={theme.section}>
      {
        lessonType === 'lesson' &&
        (
          <Banner isTeacher={isTeacher} title={title} iconName={'FaCheck'} />
        )
      }
      <CheckpointQuestions isTeacher={isTeacher} checkpointType={`checkpoint`} handleSetTitle={handleSetTitle} />
      {
        !isTeacher && state.data.lesson.type !== 'lesson' &&
        (
          <SaveQuit />
        )
      }
    </div>
  );
};

export default Checkpoint;
