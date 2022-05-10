import useStudentDataValue from '@customHooks/studentDataValue';
import React, {useContext, useState} from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {
  Options,
  PartContentSub,
  StudentPageInput,
} from '../../../../../interfaces/UniversalLessonInterfaces';

interface WritingBlockProps {
  id?: string;
  linestarters?: PartContentSub[];
  poemInput?: StudentPageInput[];
  setPoemInput?: React.Dispatch<React.SetStateAction<StudentPageInput[]>>;
  setPoemWriting?: React.Dispatch<React.SetStateAction<string>>;
  saveAndEdit?: boolean;
  setSaveAndEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  fields?: {poemHtml: string; poemText: string};
  setFields?: React.Dispatch<React.SetStateAction<{poemHtml: string; poemText: string}>>;
}

const WritingBlock = (props: WritingBlockProps) => {
  const {id, linestarters, setFields, fields} = props;

  const {
    state: {lessonPage: {themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

  const {setDataValue} = useStudentDataValue();

  const onAddClick = (value: string) => {
    let concatenatedValue;
    if (fields.poemText.length > 0) {
      concatenatedValue = fields.poemText.concat(`\n${value}`);
    } else {
      concatenatedValue = fields.poemText.concat(`${value}`);
    }

    setFields({...fields, poemText: concatenatedValue});
    setDataValue(id, [concatenatedValue]);
  };

  const [selectedLS, setSelectedLS] = useState({
    text: '',
  });

  const onLineSelect = (e: any) => {
    setSelectedLS({...selectedLS, text: e.target.value});
    onAddClick(e.target.value);
  };

  return (
    <div className="w-full flex items-center space-x-4 mb-4">
      <div className={`w-full flex flex-col   rounded-lg`}>
        <div>
          <select
            value={selectedLS.text}
            onChange={onLineSelect}
            className={`iconoclast:bg-500 curate:bg-500  cursor-pointer block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${themeTextColor} rounded-2xl`}>
            <option value={''} disabled>
              Select a line starter
            </option>
            {linestarters.map((line: Options, idx2: number) => (
              <option value={line.text} key={`line_${idx2}`}>
                {line.text}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* <div
        onClick={onAddClick}
        tabIndex={0}
        role="button"
        className="w-auto p-3 bg-gray-200 dark:bg-indigo-400  rounded-md">
        <AiOutlinePlus className="dark:text-white text-gray-600" />
      </div> */}
    </div>
  );
};

export default WritingBlock;
