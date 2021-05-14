import React, {useState, useEffect, useContext} from 'react';
import {LessonContext} from '../../../../contexts/LessonContext';
import {QuestionProps} from '../Question';
import {LessonControlContext} from '../../../../contexts/LessonControlContext';
import find from 'lodash/find';

interface TextInputState {
  id: string;
  value: string;
}

const InputQuestions = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const {
    checkpointID,
    visible,
    isTeacher,
    questionIndex,
    question,
    handleInputChange,
    questionKey,
    value,
  } = props;
  const switchContext = isTeacher
    ? useContext(LessonControlContext)
    : useContext(LessonContext);
  const {state, theme, dispatch} = switchContext;

  const questionId = question.question.id;

  const getTextInitAns = () =>
    find(
      state.questionData[checkpointID],
      (q) => q.qid === questionId
    ).response.toString();

  useEffect(() => {
    if (
      state.questionData &&
      state.questionData.length > 0 &&
      getTextInitAns().length > 0
    ) {
      setContents({...contents, value: getTextInitAns() || ''});
    }
  }, []);

  const [contents, setContents] = useState<TextInputState>({id: '', value: ''});

  // TODO: change this code for doFirst / Assessment / Checkpoint
  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value, id} = e.target as HTMLInputElement;
    setContents({
      id: questionId,
      value: value,
    });
    handleInputChange(questionId, value, checkpointID);
  };

  return (
    visible &&
    question && (
      <div key={`question_${questionId}`} className={`w-auto my-4`}>
        <label htmlFor={question.question.label}>
          <p className={`font-semibold ${theme.elem.text} ${theme.underline} pb-2 mb-4`}>
            <b>{questionIndex + 1}. </b>
            {question.question.question}
          </p>
        </label>
        <input
          id={questionId}
          className={`${theme.elem.textInput} w-full rounded-xl`}
          type="text"
          name={question.question.label}
          value={contents.value}
          onChange={(e) => (!isTeacher ? handleTextInputChange(e) : null)}
        />
      </div>
    )
  );
};

export default InputQuestions;
