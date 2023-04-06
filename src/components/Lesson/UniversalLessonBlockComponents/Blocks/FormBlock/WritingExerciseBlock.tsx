import React from 'react';
import {Options} from 'interfaces/UniversalLessonInterfaces';
import {FormControlProps} from '../FormBlock';
import EditingBlock from '../PoemBlock/EditingBlock';
import useStudentDataValue from '@customHooks/studentDataValue';
import {useGlobalContext} from '@contexts/GlobalContext';
import FormInput from '@components/Atoms/Form/FormInput';

interface WritingExerciseProps extends FormControlProps {
  onChange: (e: any) => void;
  disabled: boolean;
  title: boolean;
  options?: Options[] | null;
}

const WritingExerciseBlock = ({
  inputID,

  label,
  options = [],
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
      className={`w-full max-w-256  mx-auto  flex flex-col justify-between items-center ${
        !Boolean(label) && !title ? 'p-4' : ''
      } rounded-2xl dark-blue ${title ? 'rounded-b-none' : 'rounded-t-none'}`}>
      {!title ? (
        <EditingBlock options={options} inputID={inputID} id={inputID} value={value[0]} />
      ) : (
        <>
          {label && (
            <>
              <FormInput
                id={inputID}
                disabled={disabled}
                name={'text'}
                type={'text'}
                className="lesson-form-block gray-input  w-full placeholder:text-medium "
                onChange={onChange}
                placeHolder={label}
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
