import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { CPQuestionProps } from './SelectOneQuestions';

interface TextInputState {
  name: string;
  value: string;
}

/**
 * Value needs to be passed down???
 */

const TextQuestions = (props: CPQuestionProps) => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [txtDataID, setTxtDataID] = useState<any>();
  const [contents, setContents] = useState<string>('');

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const t = e.target;
    setContents(t.value);
    props.handleInputChange(e);
  }

  useEffect(() => {
    if ( state.questionData[props.checkpointID] && state.questionData[props.checkpointID][props.question.id] && state.questionData[props.checkpointID][props.question.id] !== '' ) {
      setContents(state.questionData[props.checkpointID][props.question.id])
    }

    if( state.questionData[props.checkpointID] === undefined || state.questionData[props.checkpointID][props.question.id] === undefined ) {
      setContents('');
    }
  }, [])

  return (
    <div key={props.keyProp} className={`w-full h-5/10 flex flex-col my-2 mb-3`}>
      <label className={theme.elem.text} htmlFor={props.question.label}>
      <p className={theme.elem.text}><b>{props.number + 1}. </b>{props.question.question}</p>
      </label>
      <textarea
        id={props.question.id}
        className={`h-40 ${theme.elem.textInput} w-full rounded-xl`}
        value={contents}
        onChange={handleTextInputChange}/* sdfsdfd */
      />
    </div>
  );
};

export default TextQuestions;
