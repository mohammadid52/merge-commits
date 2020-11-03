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

const TextQuestions = (txtPrps: CPQuestionProps) => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [txtDataID, setTxtDataID] = useState<any>();
  const [contents, setContents] = useState<string>('');

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const t = e.target;
    setContents(t.value);
    txtPrps.handleInputChange(e);
  }

  useEffect(() => {
    if ( state.questionData[txtPrps.checkpointID] && state.questionData[txtPrps.checkpointID][txtPrps.question.id] && state.questionData[txtPrps.checkpointID][txtPrps.question.id] !== '' ) {
      setContents(state.questionData[txtPrps.checkpointID][txtPrps.question.id])
    }

    if( state.questionData[txtPrps.checkpointID] === undefined || state.questionData[txtPrps.checkpointID][txtPrps.question.id] === undefined ) {
      setContents('');
    }
  }, [])

  return (
    <div key={txtPrps.keyProp} className={`w-full h-5/10 flex flex-col my-2 mb-3`}>
      <label className={theme.elem.text} htmlFor={txtPrps.question.label}>
        {txtPrps.question.question}
      </label>
      <textarea
        id={txtPrps.question.id}
        className={`h-40 ${theme.elem.textInput} w-full rounded-xl`}
        value={contents}
        onChange={handleTextInputChange}/* sdfsdfd */
      />
    </div>
  );
};

export default TextQuestions;
