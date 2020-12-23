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
  const { theme } = useContext(LessonControlContext);
  const [txtDataID, setTxtDataID] = useState<any>();
  const [contents, setContents] = useState<string>('');
  const { fullscreen } = txtPrps;

  return (
    <div key={txtPrps.keyProp} className={`w-full h-full flex flex-col flex-grow-3`}>
      <label className={`${theme.elem.text} mt-2 mb-2 w-full`} htmlFor={txtPrps.question.id}>
        {txtPrps.question.question}
      </label>
      <textarea
        id={txtPrps.question.id}
        className={`h-40 ${theme.elem.textInput} w-full rounded-xl`}
        defaultValue={contents}
        // onChange={handleTextInputChange}
      />
    </div>
  );
};

export default TextQuestions;
