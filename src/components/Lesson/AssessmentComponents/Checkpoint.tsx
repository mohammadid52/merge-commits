import React, {useContext, useEffect, useState} from 'react';
import {LessonContext} from '../../../contexts/LessonContext';
import CheckpointQuestions from './CheckpointQuestionsV2';
import Banner from '../LessonComponents/Banner';
import {LessonControlContext} from '../../../contexts/LessonControlContext';
import SaveQuit from '../LessonComponents/Outro/SaveQuit';
import SurveyOutro from './SurveyOutro';
import {BodyProps} from '../Body/Body';
import useUrlState from '@ahooksjs/use-url-state';

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

const Checkpoint = (props: {
  isTeacher?: boolean;
  checkpointsLoaded?: BodyProps['checkpointsLoaded'];
  setupComplete?: BodyProps['setupComplete'];
  checkpointsItems?: any[];
  fromClosing?: boolean;
}) => {
  /**
   * Teacher switch
   */
  const {
    isTeacher,
    checkpointsLoaded,
    setupComplete,
    checkpointsItems,
    fromClosing,
  } = props;
  const switchContext = isTeacher
    ? useContext(LessonControlContext)
    : useContext(LessonContext);
  const {state, theme, dispatch} = switchContext;

  const [urlState] = useUrlState({roomId: ''});
  const {roomId} = urlState;

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
        dispatch({
          type: 'ACTIVATE_LESSON',
          payload: state.pages[state.currentPage].stage,
        });
      }
    }
  }, [state.currentPage]);

  return (
    <div className={theme.section}>
      {/**
       *  1.
       *  SHOW BANNER + ICON, IF LESSON
       */}
      {/*{
        lessonType === 'lesson' &&
        (
          <Banner isTeacher={isTeacher} title={`${title}`} iconName={'FaCheck'} />
        )
      }*/}

      {/**
       *  2.
       *  LOAD CHECKPOINT QUESTIONS
       */}
      {checkpointsItems && checkpointsItems.length > 0 && (
        <CheckpointQuestions
          fromClosing={fromClosing}
          isTeacher={isTeacher}
          checkpointType={`checkpoint`}
          handleSetTitle={handleSetTitle}
          checkpointsItems={checkpointsItems}
        />
      )}

      {/**
       *  3.
       *  SHOW OUTRO + SAVE, IF SURVEY
       */}
      {/* {!isTeacher && state.data.lesson.type !== 'lesson' && (
        <>
          <SurveyOutro />
          <SaveQuit roomID={roomId} />
        </>
      )} */}
    </div>
  );
};

export default Checkpoint;
