import React from 'react';
import {Options} from 'interfaces/UniversalLessonInterfaces';
import {FormControlProps} from '../FormBlock';
import EditingBlock from '../PoemBlock/EditingBlock';
import useStudentDataValue from '@customHooks/studentDataValue';
import {useGlobalContext} from '@contexts/GlobalContext';

interface WritingExerciseProps extends FormControlProps {
  onChange: (e: any) => void;
  disabled: boolean;
  title: boolean;
  options?: Options[] | null;
}

const WritingExerciseBlock = ({
  inputID,

  label,
  options,
  onChange,
  title,
  value,
  disabled
}: WritingExerciseProps) => {
  const {getDataValue} = useStudentDataValue();
  const {lessonState} = useGlobalContext();
  const viewingStudent = lessonState.studentViewing;

  const initialValue = viewingStudent ? getDataValue(inputID)[0] : value;

  return (
    <div
      id={`${inputID}_for_error`}
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
                value={initialValue}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WritingExerciseBlock;
