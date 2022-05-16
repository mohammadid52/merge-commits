import React from 'react';
import {Options} from '../../../../../interfaces/UniversalLessonInterfaces';
import {FormControlProps} from '../FormBlock';
import EditingBlock from '../PoemBlock/EditingBlock';

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
  // useEffect(() => {
  //   $('.wrapperClassName.dark').css('background', '#1B191D ');
  //   $('.wrapperClassName.dark').css('borderColor', '#1B191D ');
  // }, []);

  return (
    <div
      id={id}
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center`}>
      {!title ? (
        <EditingBlock options={options} inputID={inputID} id={inputID} value={value[0]} />
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
