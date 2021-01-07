import React, { useContext, useEffect } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import { LessonContext } from '../../../contexts/LessonContext';
import { QuestionInterface, ResponseState } from './CheckpointQuestions';

/**
 * MAIN QUESTION COMPONENT IMPORTS
 */
import InputQuestions from './Questions/InputQuestions';
import TextQuestions from './Questions/TextQuestions';
import SelectOneQuestions from './Questions/SelectOneQuestions';
import SelectManyQuestions from './Questions/SelectManyQuestions';

export interface QuestionProps {
  isTeacher?: boolean;
  question?: QuestionInterface;
  questionIndex?: number;
  questionKey: any;
  handleInputChange?: (id: number | string, value: string | string[]) => void;
  value?: ResponseState;
}

const Question = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, question, questionIndex, questionKey, handleInputChange, value } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const cloneQuestion = JSON.parse(JSON.stringify(question));

  /**
   * Function for returning different question-types e.g. selectOne, selectMany, etc.
   * @param questionIndex
   * @param key
   */
  const questionSwitch = (questionIndex: number, key: string) => {
    switch (cloneQuestion.question.type) {
      case 'input':
        return (
          <InputQuestions
            question={question}
            questionIndex={questionIndex}
            questionKey={key}
            handleInputChange={handleInputChange}
            value={value}
          />
        );
      case 'text':
        return (
          <TextQuestions
            question={question}
            questionIndex={questionIndex}
            questionKey={key}
            handleInputChange={handleInputChange}
            value={value}
          />
        );
      case 'selectOne':
        return (
          <SelectOneQuestions
            question={question}
            questionIndex={questionIndex}
            questionKey={key}
            handleInputChange={handleInputChange}
            value={value}
          />
        );
      case 'selectMany':
        return (
          <SelectManyQuestions
            question={question}
            questionIndex={questionIndex}
            questionKey={key}
            handleInputChange={handleInputChange}
            value={value}
          />
        );
      default:
        return <p>Unsupported question type in question.type</p>;
    }
  };

  return (
    <>
      {question && cloneQuestion ? questionSwitch(questionIndex, questionKey) : null}
    </>
  );
};

export default Question;
