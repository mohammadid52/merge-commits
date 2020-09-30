import React, { useState, useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext'
import { CPQuestionProps } from './SelectOneQuestions';

interface TextInputState {
  name: string;
  value: string;
  fullscreen: boolean
}

/**
 * Value needs to be passed down???
 */

const TextQuestions = (txtPrps: CPQuestionProps) => {
  const { state, dispatch } = useContext(LessonControlContext);
  const [txtDataID, setTxtDataID] = useState<any>();
  const [contents, setContents] = useState<string>('');
  const { fullscreen } = txtPrps;

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const t = e.target;
    setContents(t.value);
    txtPrps.handleInputChange(e);
  }

//   useEffect(() => {
//     // console.log('contents: ', contents);
//     // console.log('quesData: ', state.questionData[txtPrps.question.id]);
//     // console.log('text area id: ', txtPrps.question.id);
//     if ( state.questionData.doFirst && state.questionData.doFirst[txtPrps.question.id] && state.questionData.doFirst[txtPrps.question.id] !== '') {
//       setContents(state.questionData.doFirst[txtPrps.question.id])
//     }

//     if( state.questionData.doFirst && state.questionData.doFirst[txtPrps.question.id] === undefined ){
//       setContents('');
//     }
//   })

  return (
    <div key={txtPrps.keyProp} className={`w-9.5/10 h-full flex flex-col my-2`}>
      <label className={`mb-2 ${fullscreen ? 'text-base' : 'text-sm'} w-full`} htmlFor={txtPrps.question.id}>
        {txtPrps.question.question}
      </label>
      <textarea
        id={txtPrps.question.id}
        className={`h-9/10 w-9/10 px-4 py-2 bg-gray-300 text-gray-800 w-full ${fullscreen ? 'text-lg' : 'text-xs'} text-gray-800 rounded-lg shadow-2`}
        defaultValue={contents}
        // onChange={handleTextInputChange}
      />
    </div>
  );
};

export default TextQuestions;
