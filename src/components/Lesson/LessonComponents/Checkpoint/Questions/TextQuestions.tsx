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
  const { state, dispatch } = useContext(LessonContext);
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
    if ( state.questionData[txtPrps.question.id] && state.questionData[txtPrps.question.id] !== '') {
      setContents(state.questionData[txtPrps.question.id])
    }

    if(state.questionData[txtPrps.question.id] === undefined){
      setContents('');
    }
  })

  return (
    <div key={txtPrps.keyProp} className={`w-4.5/10 h-5/10 flex flex-col my-2`}>
      <label className='mb-2 text-sm' htmlFor={txtPrps.question.label}>
        {txtPrps.question.question}
      </label>
      <textarea
        id={txtPrps.question.id}
        className='h-9/10 w-9/10 p-8 bg-gray-300 text-gray-800 w-full text-sm md:text-xl text-gray-800 rounded-lg shadow-2'
        value={contents}
        onChange={handleTextInputChange}
      />
    </div>
  );
};

export default TextQuestions;
