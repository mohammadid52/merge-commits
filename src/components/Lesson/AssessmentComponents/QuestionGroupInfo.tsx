import React, {useContext, useEffect, useState} from 'react';
import {LessonContext} from '../../../contexts/LessonContext';
import {LessonControlContext} from '../../../contexts/LessonControlContext';
import InstructionBlock from '../LessonComponents/InstructionBlock';
import Banner from '../LessonComponents/Banner';
import {stripStyleFromHTML} from '../../../utilities/strings';

interface QuestionGroupInfoProps {
  checkpointsLoaded?: boolean;
  isTeacher?: boolean;
  checkpointID: string;
  checkpoint?: any;
  showTitle?: boolean;
}

const QuestionGroupInfo = (props: QuestionGroupInfoProps) => {
  /**
   * Teacher switch
   */
  const {checkpointsLoaded, isTeacher, checkpointID, checkpoint, showTitle} = props;
  const switchContext = isTeacher
    ? useContext(LessonControlContext)
    : useContext(LessonContext);
  const {state, theme} = switchContext;

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

  useEffect(() => {
    if (checkpoint) {
      if (checkpoint.hasOwnProperty('title')) {
        setInfo({
          title: checkpoint?.title,
          subtitle: checkpoint?.subtitle,
          instructions: stripStyleFromHTML(checkpoint?.instructions),
          instructionsTitle: checkpoint?.instructionsTitle,
        });
      }
    }
  }, [checkpoint]);

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className="w-full h-full flex flex-col flex-wrap justify-around items-center">
          <Banner
            isTeacher={isTeacher}
            animate
            subtitleSection={`${info && info.title ? info.title : ''}`}
            subtitleSection2={info.subtitle ? `- ( ${info.subtitle} )` : ''}
          />

          <InstructionBlock
            animate
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
