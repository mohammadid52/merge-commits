import React, { useContext } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import { LessonContext } from '../../../contexts/LessonContext';
import { QuestionInterface } from './CheckpointQuestions';

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
  handleInputChange?: (id: string, value: string) => void;
  value?: string;
}

const Question = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, question, questionIndex, questionKey, handleInputChange } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  /**
   * Function for returning different question-types e.g. selectOne, selectMany, etc.
   * @param question
   * @param questionIndex
   * @param key
   */
  const questionSwitch = (question: QuestionInterface, questionIndex: number, key: string) => {
    switch (question.type) {
      case 'input':
        return (
          <InputQuestions
            question={question}
            questionIndex={questionIndex}
            questionKey={key}
            handleInputChange={handleInputChange}
          />
        );
      case 'text':
        return (
          <TextQuestions
            question={question}
            questionIndex={questionIndex}
            questionKey={key}
            // value={input[question.id]}
            handleInputChange={handleInputChange}
          />
        );
      case 'selectOne':
        return (
          <SelectOneQuestions
            question={question}
            questionIndex={questionIndex}
            questionKey={key}
            // value={input[question.id]}
            handleInputChange={handleInputChange}
          />
        );
      case 'selectMany':
        return (
          <SelectManyQuestions
            question={question}
            questionIndex={questionIndex}
            questionKey={key}
            // value={input[question.id]}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return <p>Unsupported question type in question.type</p>;
    }
  };

  return questionSwitch(question, questionIndex, questionKey);
};

export default Question;
