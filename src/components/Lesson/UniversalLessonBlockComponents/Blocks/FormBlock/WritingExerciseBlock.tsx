import React, {useState} from 'react';
import {Options} from '../../../../../interfaces/UniversalLessonInterfaces';
import {FormControlProps} from '../FormBlock';
import EditingBlock from '../PoemBlock/EditingBlock';
import WritingBlock from '../PoemBlock/WritingBlock';

interface WritingExerciseProps extends FormControlProps {
  onChange: (e: any) => void;
  disabled: boolean;
  title: boolean;
  options?: Options[] | null;
}

const WritingExerciseBlock = ({
  inputID,
  id,
  label,
  options,
  onChange,
  title,
  value,
  disabled,
}: WritingExerciseProps) => {
  const [fields, setFields] = useState({
    poemHtml: '',
    poemText: '',
  });

  return (
    <div
      id={id}
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center p-4`}>
      {title ? (
        <>
          {label && (
            <>
              <label className={`text-sm text-gray-900 dark:text-white`} htmlFor="label">
                Title
              </label>
              <input
                id={inputID}
                disabled={disabled}
                className={`w-full py-2 px-4  mt-2 rounded-xl bg-gray-100 dark:bg-darker-gray placeholder-gray-500 dark:placeholder-gray-700`}
                name={'text'}
                type={'text'}
                onChange={onChange}
                placeholder={label}
                value={value}
              />
            </>
          )}
        </>
      ) : (
        <div className="relative flex flex-col justify-between items-center ">
          <div className="relative">
            {options ? (
              <WritingBlock
                id={inputID}
                linestarters={options}
                fields={fields}
                setFields={setFields}
              />
            ) : null}
          </div>
          <EditingBlock
            id={inputID}
            setFields={setFields}
            fields={fields}
            poemWriting={value}
          />
        </div>
      )}
    </div>
  );
};

export default WritingExerciseBlock;
