import {isEmpty} from 'lodash';
import React, {useState, useEffect} from 'react';
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
  console.log('🚀 ~ file: WritingExerciseBlock.tsx ~ line 26 ~ fields', fields.poemText);

  useEffect(() => {
    $('.wrapperClassName.dark').css('background', '#1B191D ');
    $('.wrapperClassName.dark').css('borderColor', '#1B191D ');
  }, []);

  return (
    <div
      id={id}
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center`}>
      {!title ? (
        <div className="relative flex flex-col justify-between items-center ">
          <div className="relative">
            {options ? (
              <WritingBlock
                id={inputID}
                fields={fields}
                setFields={setFields}
                linestarters={options}
              />
            ) : null}
          </div>
          <EditingBlock
            fields={fields}
            setFields={setFields}
            id={inputID}
            poemWriting={value}
          />
        </div>
      ) : (
        <>
          {label && (
            <>
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
      )}
    </div>
  );
};

export default WritingExerciseBlock;
