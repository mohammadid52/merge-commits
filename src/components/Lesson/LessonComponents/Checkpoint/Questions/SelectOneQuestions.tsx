import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

export interface CPQuestionProps {
  checkpointID: string;
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
  id: string;
  value: string;
}

const SelectOneQuestions = (selectOneProps: CPQuestionProps) => {
  const { question, checkpointID } = selectOneProps;
  const { state, dispatch } = useContext(LessonContext);
  const [input, setInput] = useState<SelectOneRowState>({ id: '', value: '' });

  useEffect(() => {
    console.log('czech this', question, checkpointID );
    
    if (
      state.questionData[selectOneProps.checkpointID] &&
      state.questionData[selectOneProps.checkpointID][selectOneProps.question.id] &&
      state.questionData[selectOneProps.checkpointID][selectOneProps.question.id] !== ''
    ) {
      // console.log('match', state.questionData[selectOneProps.checkpointID][selectOneProps.question.id] );
      setInput((prev: any) => {
        return {
          ...prev,
          value: state.questionData[selectOneProps.checkpointID][selectOneProps.question.id],
        }
      });
    }

    if (
      state.questionData[selectOneProps.checkpointID] === undefined ||
      state.questionData[selectOneProps.checkpointID][selectOneProps.question.id] === undefined
    ) {
      // console.log('nomatch');
      
      setInput((prev: any) => {
        return {
          ...prev,
          value: '',
        }
      });
    }
  }, [checkpointID]);

  const handleRadioSelect = (e: { target: { value: string; id: string } }) => {
    const { value, id } = e.target;
    setInput({ id: id, value: value });
    selectOneProps.handleInputChange(e);
  };
// console.log(selectOneProps)
  return (
    <>
      <div key={selectOneProps.keyProp} className={'w-4.8/10 flex flex-col mb-3 mx-2'}>
        <p className='mb-2 text-lg'>{selectOneProps.question.question}</p>
        <div className={`flex justify-around`}>
          {selectOneProps.question.options.map(
            (
              option: { label: string; icon: string; color: string; text: string },
              key2: number
            ) => {
              return (
                <div key={key2} className={`flex justify-center items-center text-base`}>
                  
                  <label className="w-auto cursor-pointer">
                    <input
                    id={selectOneProps.question.id}
                    className='w-4 mx-4 cursor-pointer'
                    type='radio'
                    name={selectOneProps.question.label}
                    value={option.label}
                    onChange={handleRadioSelect}
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
