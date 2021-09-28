import useStudentDataValue from '@customHooks/studentDataValue';
import React from 'react';

interface EditingBlockProps {
  id?: string;
  setFields?: React.Dispatch<React.SetStateAction<{poemHtml: string; poemText: string}>>;
  poemWriting?: string;
  fields?: {poemHtml: string; poemText: string};
}

const EditingBlock = ({id, poemWriting, fields, setFields}: EditingBlockProps) => {
  const {setDataValue} = useStudentDataValue();

  const onChange = (e: any) => {
    setDataValue(id, [e.target.value]);
    setFields({...fields, poemText: e.target.value});
  };

  return (
    <div className="w-full flex flex-col">
      <div className={`w-full h-full rounded-xl text-black`}>
        <textarea
          id={id}
          className={`editingBlock w-full h-64 py-2 px-4 dark:text-white text-gray-900 mt-2 rounded-xl bg-gray-200 dark:bg-darker-gray`}
          name="story"
          onChange={onChange}
          value={poemWriting}
          rows={3}
          cols={250}
        />
      </div>
    </div>
  );
};

export default EditingBlock;
