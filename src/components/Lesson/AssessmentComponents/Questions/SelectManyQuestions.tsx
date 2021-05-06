import React, {useState, useContext, useEffect} from 'react';
import {IconContext} from 'react-icons';
import {ImCheckboxChecked, ImCheckboxUnchecked} from 'react-icons/im';
import {LessonContext} from '../../../../contexts/LessonContext';
import {LessonControlContext} from '../../../../contexts/LessonControlContext';

import {QuestionProps} from '../Question';
import LessonElementCard from '../../../Atoms/LessonElementCard';

interface SelectManyState {
  id: string;
  value: string[];
}

const SelectManyQuestions = (props: QuestionProps) => {
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

  const [input, setInput] = useState<SelectManyState>({id: '', value: []});

  const questionId = question.question.id;

  /**
   * Function to add multi-select options to input.value array
   * Removes the ID string from array if it is already there i.e. unselect it
   * @param e
   */
  const handleMultiSelect = (e: React.MouseEvent<HTMLElement>) => {
    const {id} = e.target as HTMLElement;

    if (input.value.indexOf(id) === -1) {
      setInput({id: questionId, value: [...input.value, id]});
      handleInputChange(questionId, [...input.value, id], checkpointID);
    } else {
      const filterOutId = input.value.filter((elem: string) => elem !== id);
      setInput({id: questionId, value: filterOutId});
      handleInputChange(questionId, filterOutId, checkpointID);
    }
  };

  return (
    visible && (
      <div key={questionKey} className={'flex flex-col my-4'}>
        <label htmlFor={question.question.label}>
          <p className={`font-semibold ${theme.elem.text} ${theme.underline} pb-2 mb-4`}>
            <b>{questionIndex + 1}. </b>
            {question.question.question} (Select one or more)
          </p>
        </label>
        {/*<div id={question.label} className={'flex'}>*/}
        <div className={'w-auto flex flex-wrap'}>
          {question.question.options.map(
            (
              option: {label: string; icon: string; color: string; text: string},
              key: any
            ) => (
              <div
                key={key}
                className={`w-auto flex justify-center items-center mb-2 `}
                onClick={(e) => (!isTeacher ? handleMultiSelect(e) : null)}
                data-key={questionId}>
                {input.value.indexOf(`${option.label}`) >= 0 ? (
                  <label className={`flex justify-center items-center mr-8 mb-2 `}>
                    <input
                      id={`${option.label}`}
                      data-key={questionId}
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-pink-600"
                      checked
                    />
                    <span className={`ml-2 ${theme.elem.text}`}>{option.text}</span>
                  </label>
                ) : (
                  <label className={`flex justify-center items-center mr-8 mb-2 `}>
                    <input
                      id={`${option.label}`}
                      data-key={questionId}
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-pink-600"
                    />
                    <span className={`ml-2 ${theme.elem.text}`}>{option.text}</span>
                  </label>
                )}
              </div>
            )
          )}
        </div>
      </div>
    )
  );
};

export default SelectManyQuestions;
