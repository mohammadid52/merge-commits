import {Select} from 'antd';
import {useGlobalContext} from 'contexts/GlobalContext';
import useStudentDataValue from 'customHooks/studentDataValue';
import {
  Options,
  PartContentSub,
  StudentPageInput
} from 'interfaces/UniversalLessonInterfaces';
import React, {useState} from 'react';

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
  sendTextToEditor?: any;
}

const WritingBlock = (props: WritingBlockProps) => {
  const {id = '', linestarters, sendTextToEditor} = props;

  const {
    state: {lessonPage: {themeTextColor = ''} = {}}
  } = useGlobalContext();

  const {setDataValue} = useStudentDataValue();

  const onAddClick = (value: string) => {
    sendTextToEditor(`${value} `, () => setDataValue(id, [value]));
  };

  const [selectedLS, setSelectedLS] = useState({
    text: ''
  });

  const onLineSelect = (value: string) => {
    setSelectedLS({...selectedLS, text: value});
    onAddClick(value);
  };

  const mappedOptions = linestarters?.map((line: Options) => ({
    value: line.text,
    label: line.text
  }));

  return (
    <Select
      className="dark-selector mb-4"
      showSearch
      value={selectedLS.text || undefined}
      style={{width: '100%'}}
      onChange={onLineSelect}
      placeholder="Select or search a line starter"
      options={mappedOptions}
    />

    // <div className="w-full flex items-center space-x-4 mb-4">
    //   <div className={`w-full flex flex-col   rounded-lg`}>
    //     <div>
    //       <select
    //         value={selectedLS.text}
    //         onChange={onLineSelect}
    //         className={`iconoclast:bg-500 curate:bg-500  cursor-pointer block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${themeTextColor} rounded-2xl`}
    //       >
    //         <option value={""} disabled>
    //           Select a line starter
    //         </option>
    //         {linestarters &&
    //           linestarters.length > 0 &&
    //           linestarters?.map((line: Options, idx2: number) => (
    //             <option value={line.text} key={`line_${idx2}`}>
    //               {line.text}
    //             </option>
    //           ))}
    //       </select>
    //     </div>
    //   </div>
    //   {/* <div
    //     onClick={onAddClick}
    //     tabIndex={0}
    //     role="button"
    //     className="w-auto p-3 bg-gray-200 dark:bg-indigo-400  rounded-md">
    //     <AiOutlinePlus className="dark:text-white text-gray-600" />
    //   </div> */}
    // </div>
  );
};

export default WritingBlock;
