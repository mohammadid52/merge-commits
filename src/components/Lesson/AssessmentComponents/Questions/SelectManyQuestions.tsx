import React, { useState, useContext, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { LessonContext } from '../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

import { QuestionProps } from '../Question';

interface SelectManyState {
  id: string;
  value: string[];
}

const SelectManyQuestions = (props: QuestionProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, questionIndex, question, handleInputChange, questionKey, value } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const [input, setInput] = useState<SelectManyState>({ id: '', value: [] });

  const questionId = question.question.id;

  /**
   * Function to add multi-select options to input.value array
   * Removes the ID string from array if it is already there i.e. unselect it
   * @param e
   */
  const handleMultiSelect = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.target as HTMLElement;

    if (!input.value.includes(id)) {
      setInput({ id: questionId, value: [...input.value, id] });
    } else {
      const filterOutId = input.value.filter((elem: string) => elem !== id);
      setInput({ id: questionId, value: filterOutId });
    }
  };

  return (
    <div key={questionKey} className={'flex flex-col mb-3'}>
      <div className={theme.elem.text}>
        <p>
          <b>{questionIndex + 1}. </b>
          {question.question}
        </p>
      </div>
      <div id={question.label} className={'flex'}>
        {question.options.map((option: { label: string; icon: string; color: string; text: string }, key: any) => (
          <div
            key={key}
            className={`w-3/4 flex justify-center items-center mb-2`}
            onClick={handleMultiSelect}
            data-key={questionId}>
            {input.value.indexOf(`${option.label}`) >= 0 ? (
              <div
                id={`${option.label}`}
                className="cursor-pointer w-36 h-12 p-2 text-base rounded flex justify-start items-center"
                style={{ backgroundColor: `${option.color}` }}
                data-key={questionId}>
                <IconContext.Provider value={{ color: '#EDF2F7', size: '1.25rem', className: 'w-auto mr-2' }}>
                  <ImCheckboxChecked style={{ pointerEvents: 'none' }} />
                </IconContext.Provider>

                {option.text}
              </div>
            ) : (
              <div
                id={`${option.label}`}
                className="bg-gray-400 text-black50 cursor-pointer w-36 h-12 p-2 text-base rounded flex justify-start items-center"
                data-key={questionId}>
                <IconContext.Provider value={{ color: '#000', size: '1.25rem', className: 'w-auto mr-2' }}>
                  <ImCheckboxUnchecked style={{ pointerEvents: 'none' }} />
                </IconContext.Provider>

                {option.text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectManyQuestions;
