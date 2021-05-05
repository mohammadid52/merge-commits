import React, {useState, useContext, useEffect} from 'react';
import {LessonContext} from '../../../../contexts/LessonContext';
import {LessonControlContext} from '../../../../contexts/LessonControlContext';

import {QuestionInterface} from '../CheckpointQuestions';
import {QuestionProps} from '../Question';
import LessonElementCard from '../../../Atoms/LessonElementCard';
import find from 'lodash/find';

interface SelectOneRowState {
  id: string;
  value: string;
}

const SelectOneQuestions = (props: QuestionProps) => {
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

  const oneQuestInitAns =
    find(
      state.questionData[checkpointID],
      (q) => q.qid === questionId
    ).response.toString() || '';
  const [input, setInput] = useState<SelectOneRowState>({id: '', value: oneQuestInitAns});
  const [otherOptSel, setOtherOptSel] = useState(false);
  const [other, setOther] = useState('');

  // TODO: change this code for doFirst / Assessment / Checkpoint
  const handleRadioSelect = (e: React.MouseEvent<HTMLElement>) => {
    const {id} = e.target as HTMLElement;
    setInput({id: questionId, value: id});
    handleInputChange(questionId, id, checkpointID);
    if (id === 'other') {
      setOtherOptSel(true);
    } else {
      setOtherOptSel(false);
    }
  };

  const onOtherSave = () => {
    setOtherOptSel(false);
    handleInputChange(questionId, input.value, checkpointID, other);
  };

  return (
    <>
      {visible && (
        <div
          key={questionKey}
          className={'flex flex-col my-4'}
          id={`question_${questionId}`}>
          <label htmlFor={question.question.label}>
            <p
              className={`font-semibold ${theme.elem.text} ${theme.underline} pb-2 mb-4`}>
              <b>{questionIndex + 1}. </b>
              {question.question.question} (Select one)
            </p>
          </label>
          <div className={'w-auto flex flex-wrap'}>
            {question.question.options.map(
              (
                option: {
                  label: string;
                  icon: string;
                  color: string;
                  text: string;
                },
                questionOptionIndex: number
              ) => {
                return (
                  <div
                    key={`question_${questionId}_${questionOptionIndex}`}
                    className={`w-auto flex justify-center items-center mr-8 mb-2 `}>
                    <span
                      id={option.label}
                      className={`w-5 h-5 flex-shrink-0 mx-4 rounded-full cursor-pointer  border-0 
                ${
                  input.value === option.label
                    ? 'bg-blueberry border-white'
                    : 'bg-white border-black '
                }`}
                      data-value={option.label}
                      onClick={(e) => (!isTeacher ? handleRadioSelect(e) : null)}
                    />
                    <span className={`w-auto`}>{option.text}</span>
                  </div>
                );
              }
            )}
          </div>

          {otherOptSel && (
            <div>
              <input
                value={other}
                onChange={(e) => setOther(e.target.value)}
                className="bg-transparent border-b-2 my-8 text-white border-sea-green pb-2"
                placeholder="Other"
                type="text"
              />
              <button
                onClick={onOtherSave}
                className="bg-sea-green w-auto py-2 px-4 rounded">
                save
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SelectOneQuestions;
