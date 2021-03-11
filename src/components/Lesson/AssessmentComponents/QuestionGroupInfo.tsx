import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import InstructionBlock from '../LessonComponents/InstructionBlock';
import Banner from '../LessonComponents/Banner';

interface QuestionGroupInfoProps {
  isTeacher?: boolean;
  checkpointID: string;
  showTitle?: boolean;
}

const QuestionGroupInfo = (props: QuestionGroupInfoProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, checkpointID, showTitle } = props;
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
    const getCheckpointObj = state.data.lesson.checkpoints.items.find(
      (checkpointObj: any) => checkpointObj.id === checkpointID
    );

    const quickRepair = (str: string) => {
      if (str) {
        return str.replace('color: black', 'color: white');
      } else return '';
    };

    setInfo({
      title: getCheckpointObj?.title,
      subtitle: getCheckpointObj?.subtitle,
      instructions: quickRepair(getCheckpointObj?.instructions),
      instructionsTitle: getCheckpointObj?.instructionsTitle,
    });
  };

  useEffect(() => {
    if (state.data.lesson.checkpoints) {
      if(state.data.lesson.checkpoints.items.length > 0){
        getQuestionGroupInfo();
      }
    }
  }, [state.data.lesson.checkpoints]);

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className="w-full h-full flex flex-col flex-wrap justify-around items-center">

          <Banner
            isTeacher={isTeacher}
            subtitleSection={`${info && info.title ?  info.title : null}`}
            subtitleSection2={info.subtitle ? `- ( ${info.subtitle} )` : null}
          />

          <InstructionBlock
            isTeacher={isTeacher}
            titleVisible={true}
            instructionsTitle={info?.instructionsTitle}
            instructions={info?.instructions}
          />

        </div>
      </div>
    </div>
  );
};

export default QuestionGroupInfo;
