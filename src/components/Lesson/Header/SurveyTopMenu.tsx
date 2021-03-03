import React, { useState, useRef, useContext, useEffect } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { CheckpointInterface } from '../AssessmentComponents/Checkpoint';

const SurveyTopMenu = () => {
  const { state, theme } = useContext(LessonContext);
  const [completion, setCompletion] = useState<number>(0);

  useEffect(() => {
    if (state.questionData) {
      const roundedPercentage = Math.round((getTotalQuestionAnsweredNumber() / getTotalQuestionNumber()) * 100);
      setCompletion(roundedPercentage);
    }
  }, [state.questionData]);

  const getTotalQuestionNumber = (): number => {
    const questionGroups = state.data.lesson.checkpoints.items.map((checkpoint: CheckpointInterface) => {
      if (checkpoint && checkpoint.questions) {
        return checkpoint.questions.items;
      }
    });
    if (questionGroups && questionGroups.length > 0) {
      return questionGroups.reduce((acc: number, group: any[]) => {
        return acc + group?.length;
      }, 0);
    }
  };

  const getTotalQuestionAnsweredNumber = (): number => {
    return Object.keys(state.questionData).reduce((acc: number, questionGroupKey: string) => {
      const questionGroupSum = Array.isArray(state.questionData[questionGroupKey])
        ? state.questionData[questionGroupKey].reduce((acc2: number, val: any) => {
          return acc2 + val.response.length;
        }, 0)
        : 0;
      return acc + questionGroupSum;
    }, 0);
  };

  return (
    <div
      className={`fixed h-1.1/10 w-full z-50 py-4 px-6  flex flex-col justify-center items-center content-center ${theme.toolbar.bg} shadow-1 `}>
      <div className={`h-8 max-w-256 flex flex-col justify-between`}>
        <div className={`h-2 ${theme.elem.text}`}>
          <span>Survey Progress:  </span>
          <span
            className={`font-bold`}>{getTotalQuestionAnsweredNumber()}/{getTotalQuestionNumber()}</span>
          <span>  questions answered</span>
        </div>
        <div className='overflow-hidden h-2 text-xs flex rounded-full bg-medium-gray'>
          <div style={{ width: `${completion}%` }}
               className='transition duration-500 ease-in-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sea-green'></div>
        </div>
      </div>
    </div>
  );
};

export default SurveyTopMenu;