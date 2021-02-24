import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

/**
 * ICON IMPORTS
 */

/**
 * MAIN QUESTION COMPONENT IMPORTS
 */

/**
 * QUESTION SELECTOR COMPONENT IMPORT
 */

interface QuestionGroupInfoProps {
  isTeacher?: boolean;
  checkpointID: string;
}

const QuestionGroupInfo = (props: QuestionGroupInfoProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, checkpointID } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme } = switchContext;

  const [info, setInfo] = useState<{
    title: string;
    subtitle: string;
    instructions: string;
    instructionsTitle: string;
  }>({
    title: '',
    subtitle: '',
    instructions: '',
    instructionsTitle: '',
  });

  const getQuestionGroupInfo = () => {
    const getCheckpointObj = state.data.lesson.checkpoints.items.find((checkpointObj: any) => checkpointObj.id === checkpointID);
    setInfo({
      title: getCheckpointObj?.title,
      subtitle: getCheckpointObj?.subtitle,
      instructions: getCheckpointObj?.instructions,
      instructionsTitle: getCheckpointObj?.instructionsTitle
    })
  };

  useEffect(() => {
    if (state.data.lesson.checkpoints) {
      getQuestionGroupInfo();
    }
  }, [state.data.lesson.checkpoints]);

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className='w-full h-full flex flex-col flex-wrap justify-around items-center'>
          <p>{info.title ? info.title : 'Please add title'}</p>
          <p>{info.subtitle ? info.subtitle : 'Please add subtitle'}</p>
          <p>{info.instructions ? info.instructions : 'Please add instructions'}</p>
          <p>{info.instructionsTitle ? info.instructionsTitle : 'Please add instructions title'}</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionGroupInfo;
