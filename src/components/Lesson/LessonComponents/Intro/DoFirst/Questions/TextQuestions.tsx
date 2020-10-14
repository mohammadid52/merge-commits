import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../../contexts/LessonContext'
import { CPQuestionProps } from './SelectOneQuestions';

interface TextInputState {
  name: string;
  value: string;
}

/**
 * Value needs to be passed down???
 */

const TextQuestions = (txtPrps: CPQuestionProps) => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const [txtDataID, setTxtDataID] = useState<any>();
  const [contents, setContents] = useState<string>('');

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const t = e.target;
    setContents(t.value);
    txtPrps.handleInputChange(e);
  }

  useEffect(() => {
    // console.log('contents: ', contents);
    // console.log('quesData: ', state.questionData[txtPrps.question.id]);
    // console.log('text area id: ', txtPrps.question.id);
    if ( state.questionData.doFirst && state.questionData.doFirst[txtPrps.question.id] && state.questionData.doFirst[txtPrps.question.id] !== '') {
      setContents(state.questionData.doFirst[txtPrps.question.id])
    }

    if( state.questionData.doFirst && state.questionData.doFirst[txtPrps.question.id] === undefined ){
      setContents('');
    }
  })

  return (
    <div key={txtPrps.keyProp} className={`w-full h-full flex flex-col flex-grow-3`}>
      <label className={`${theme.elem.text} mt-2 mb-2 w-full`} htmlFor={txtPrps.question.id}>
        {txtPrps.question.question}
      </label>
      <textarea
        id={txtPrps.question.id}
        className={`h-40 ${theme.elem.textInput} w-full rounded-xl`}
        defaultValue={contents}
        onChange={handleTextInputChange}
      />
    </div>
  );
};

export default TextQuestions;
