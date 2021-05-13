import React, {useContext, useEffect} from 'react';
import {LessonControlContext} from '../../../contexts/LessonControlContext';
import {LessonContext} from '../../../contexts/LessonContext';
import {QuestionInterface, ResponseState} from './CheckpointQuestions';

/**
 * MAIN QUESTION COMPONENT IMPORTS
 */
import InputQuestions from './Questions/InputQuestions';
import TextQuestions from './Questions/TextQuestions';
import SelectOneQuestions from './Questions/SelectOneQuestions';
import SelectManyQuestions from './Questions/SelectManyQuestions';

export interface QuestionProps {
  checkpointID?: string;
  visible?: boolean;
  isTeacher?: boolean;
  question?: QuestionInterface;
  questionIndex?: number;
  questionKey: any;
  animate?: boolean;
  handleInputChange?: (
    id: number | string,
    value: string | string[],
    checkpointID: string,
    otherValue?: string
  ) => void;
  value?: ResponseState;
}

const Question = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const {
    checkpointID,
    visible,
    isTeacher,
    question,
    questionIndex,
    animate,
    questionKey,
    handleInputChange,
    value,
  } = props;
  const switchContext = isTeacher
    ? useContext(LessonControlContext)
    : useContext(LessonContext);
  const {state, theme, dispatch} = switchContext;

  /**
   * Function for returning different question-types e.g. selectOne, selectMany, etc.
   * @param questionIndex
   * @param key
   */
  const questionSwitch = (questionIndex: number, key: string) => {
    switch (question.question.type) {
      case 'input':
        return (
          <InputQuestions
            checkpointID={checkpointID}
            visible={visible}
            isTeacher={isTeacher}
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
            checkpointID={checkpointID}
            visible={visible}
            isTeacher={isTeacher}
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
            checkpointID={checkpointID}
            visible={visible}
            isTeacher={isTeacher}
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
            checkpointID={checkpointID}
            visible={visible}
            isTeacher={isTeacher}
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
    <div className={animate && 'fade__animation2'}>
      {question && question.question.type
        ? questionSwitch(questionIndex, questionKey)
        : null}
    </div>
  );
};

export default Question;
