import React, { useState, useContext, useEffect } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

export interface CPQuestionProps {
  checkpointID?: string;
  question?: {
    id?: string;
    label: string;
    options: Array<{ label: string; icon: string; color: string; text: string }>;
    question: string;
    type: string;
  };
  handleInputChange?: (e: any) => void;
  keyProp?: any;
  value?: string;
  number: number;
}

interface SelectOneRowState {
  id: string;
  value: string;
}

const SelectOneQuestions = (props: CPQuestionProps) => {
  const { question, checkpointID } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const [input, setInput] = useState<SelectOneRowState>({ id: '', value: '' });

 
  return (
    <>
      <div key={props.keyProp} className={'flex flex-col mb-3'}>
      <p className={theme.elem.text}><b>{props.number + 1}. </b>{props.question.question}</p>
        <div className={`flex justify-center`}>
          {props.question.options.map(
            (
              option: { label: string; icon: string; color: string; text: string },
              key2: number
            ) => {
              return (
                <div key={key2} className={`${theme.elem.text} w-auto`}>
                  
                  <label className="w-auto cursor-pointer flex flex-row">
                    <input
                    id={props.question.id}
                    className='w-12 my-auto mx-4 cursor-pointer'
                    type='radio'
                    name={props.question.label}
                    value={option.label}
                    // onChange={handleRadioSelect}
                    checked={
                      input.value === option.label
                    }
                    />
                    {option.text}
                  </label>
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default SelectOneQuestions;
