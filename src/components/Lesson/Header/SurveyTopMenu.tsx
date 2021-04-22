import React, { useState, useRef, useContext, useEffect } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { CheckpointInterface } from '../AssessmentComponents/Checkpoint';
import { LessonHeaderBarProps } from '../../../interfaces/LessonComponentsInterfaces';

const SurveyTopMenu = (props: LessonHeaderBarProps) => {
  const { lessonDataLoaded, checkpointsLoaded, overlay, setOverlay } = props;
  const { state, theme } = useContext(LessonContext);
  const [nrQuestions, setNrQuestions] = useState<number>(0);
  const [nrAnswers, setNrAnswers] = useState<number>(0);
  const [completion, setCompletion] = useState<number>(0);

  useEffect(() => {
    if (Object.keys(state.questionData).length > 0 && nrQuestions === 0) {
      const totalQuestionNr = Object.keys(state.questionData).reduce((acc: number, key: string) => {
        return acc + state.questionData[key].length;
      }, 0);
      setNrQuestions(totalQuestionNr);
    }
  }, [state.questionData]);

  useEffect(() => {
    console.log('total answered -> ', getTotalQuestionAnsweredNumber());
    if (Object.keys(state.questionData).length > 0) {
      const totalAnswerNr = getTotalQuestionAnsweredNumber();
      const roundedPercentage = Math.round((getTotalQuestionAnsweredNumber() / nrQuestions) * 100);
      setCompletion(roundedPercentage);
      if (totalAnswerNr) {
        setNrAnswers(totalAnswerNr);
      }
    }
  }, [state.questionData]);

  const getTotalQuestionAnsweredNumber = (): number => {
    return Object.keys(state.questionData).reduce((acc: number, questionDataKey: string) => {
      const nrOfAnswers = state.questionData[questionDataKey].reduce((acc2: number, questionObj: any) => {
        if (questionObj.response.length > 0) {
          return acc2 + 1;
        } else {
          return acc2;
        }
      }, 0);
      return acc + nrOfAnswers;
    }, 0);
  };

  return (
    <div
      className={`fixed h-1.1/10 w-full z-50 py-4 px-6  flex flex-col justify-center items-center content-center ${theme.toolbar.bg} shadow-1 `}>
      <div className={`h-8 max-w-256 flex flex-col justify-between`}>
        <div className={`h-2 ${theme.elem.text}`}>
          <span>Survey Progress: </span>
          {nrQuestions > 0 && (
            <span className={`font-bold`}>
              {nrAnswers}/{nrQuestions}
            </span>
          )}
          <span> questions answered</span>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-medium-gray">
          <div
            style={{ width: `${completion}%` }}
            className="transition duration-500 ease-in-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sea-green"></div>
        </div>
      </div>
    </div>
  );
};

export default SurveyTopMenu;
