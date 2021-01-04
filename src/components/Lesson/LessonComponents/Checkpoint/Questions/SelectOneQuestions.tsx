import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

export interface CPQuestionProps {
  number?: number;
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

const SelectOneQuestions = (props: CPQuestionProps) => {
  const { number, question, checkpointID } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const [input, setInput] = useState<SelectOneRowState>({ id: '', value: '' });

  useEffect(() => {
    // console.log('czech this', question, checkpointID );
    
    if (
      state.questionData[props.checkpointID] &&
      state.questionData[props.checkpointID][props.question.id] &&
      state.questionData[props.checkpointID][props.question.id] !== ''
    ) {
      // console.log('match', state.questionData[props.checkpointID][props.question.id] );
      setInput((prev: any) => {
        return {
          ...prev,
          value: state.questionData[props.checkpointID][props.question.id],
        }
      });
    }

    if (
      state.questionData[props.checkpointID] === undefined ||
      state.questionData[props.checkpointID][props.question.id] === undefined
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
    props.handleInputChange(e);
  };
// console.log(props)
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
                    onChange={handleRadioSelect}
                    checked={
                      input.value === option.label
                    }
                    />
                    <span>{option.text}</span>
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
