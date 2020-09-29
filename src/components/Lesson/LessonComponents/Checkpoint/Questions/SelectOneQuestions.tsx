import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

export interface CPQuestionProps {
  checkpointID: string
  question: {
    id: string;
    label: string;
    options: Array<{ label: string; icon: string; color: string; text: string }>;
    question: string;
    type: string;
  };
  handleInputChange?: (e: any) => void;
  keyProp: any;
  value?: string;
}

interface SelectOneRowState {
  name: string;
  value: string;
}

const SelectOneQuestions = (selPrps: CPQuestionProps) => {
  const { state, dispatch } = useContext(LessonContext);
  const [ input, setInput ] = useState('');

  useEffect(() => {
    if ( state.questionData[selPrps.checkpointID] && state.questionData[selPrps.checkpointID][selPrps.question.id] && state.questionData[selPrps.checkpointID][selPrps.question.id] !== '' ) {
      setInput(state.questionData[selPrps.checkpointID][selPrps.question.id])
    }

    if( state.questionData[selPrps.checkpointID] === undefined || state.questionData[selPrps.checkpointID][selPrps.question.id] === undefined ){
      setInput('');
    }
  }, [])

  const handleRadioSelect = (e: { target: { value: string, id: string }}) => {
    const { value } = e.target;
    setInput(value)
    selPrps.handleInputChange(e)
  }

  return (
    <>
      <div key={selPrps.keyProp} className={'w-4.8/10 flex flex-col mb-4 mx-2'}>
        <p className='mb-2 text-md'>{selPrps.question.question}</p>
        <div className={`flex justify-around`}>
          {selPrps.question.options.map(
            (
              option: { label: string; icon: string; color: string; text: string },
              key2: number
            ) => (
              <div key={key2} className={`flex justify-center items-center text-xs`}>
                <input
                  id={selPrps.question.id}
                  className='w-4 mx-4 cursor-pointer'
                  type='radio'
                  name={selPrps.question.label}
                  value={option.label}
                  onChange={handleRadioSelect}
                  checked={input === option.label}
                  // checked={state.questionData[selPrps.checkpointID][parseInt(selPrps.question.id)] === option.label}
                />
                <label htmlFor={`${option.text}`}>{option.text}</label>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default SelectOneQuestions;
