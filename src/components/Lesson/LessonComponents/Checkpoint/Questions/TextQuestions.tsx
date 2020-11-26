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
    if ( state.questionData[txtPrps.checkpointID] && state.questionData[txtPrps.checkpointID][txtPrps.question.id] && state.questionData[txtPrps.checkpointID][txtPrps.question.id] !== '' ) {
      setContents(state.questionData[txtPrps.checkpointID][txtPrps.question.id])
    }

    if( state.questionData[txtPrps.checkpointID] === undefined || state.questionData[txtPrps.checkpointID][txtPrps.question.id] === undefined ) {
      setContents('');
    }
  }, [])

  return (
    <div key={txtPrps.keyProp} className={`w-full flex flex-col my-2 mb-3`}>
      <label className='mb-2 text-lg' htmlFor={txtPrps.question.label}>
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
