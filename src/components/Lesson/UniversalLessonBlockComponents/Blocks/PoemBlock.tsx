import React, {useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import WritingBlock from './PoemBlock/WritingBlock';
import {PagePartInput} from '../../../../interfaces/UniversalLessonInterfaces';
import EditingBlock from './PoemBlock/EditingBlock';

interface PoemBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
}

const PoemBlock = (props: PoemBlockProps) => {
  const {id, value} = props;
  const [poemInput, setPoemInput] = useState<PagePartInput[]>([]);
  const [poemWriting, setPoemWriting] = useState<string>('');
  const [saveAndEdit, setSaveAndEdit] = useState<boolean>(false);

  useEffect(() => {
    if (poemInput.length > 0) {
      const concatenated = poemInput.reduce((acc: string, poemInputObj: PagePartInput) => {
        return `${acc}<p>${poemInputObj.input[0]}</p>`;
      }, '');
      setPoemWriting(concatenated)
    }
  }, [poemInput]);

  const handleSaveAndEdit = () => {
    setSaveAndEdit(!saveAndEdit);
  };

  return (
    <div
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-50`}>
      <div className="relative flex flex-col justify-between items-center">
        {!saveAndEdit ? (
          <WritingBlock
            id={id}
            linestarters={value}
            poemInput={poemInput}
            setPoemInput={setPoemInput}
            saveAndEdit={saveAndEdit}
            setSaveAndEdit={setSaveAndEdit}
          />
        ) : (
          <EditingBlock
            id={id}
            poemWriting={poemWriting}
            setPoemWriting={setPoemWriting}
          />
        )}
      </div>
      <button
        onClick={() => handleSaveAndEdit()}
        className={`self-center w-auto px-3 h-8 bg-yellow-500 text-gray-900 flex justify-center items-center rounded-xl mt-2 text-gray-200`}>
        Save and Edit Your Poem
      </button>
    </div>
  );
};

export default PoemBlock;
