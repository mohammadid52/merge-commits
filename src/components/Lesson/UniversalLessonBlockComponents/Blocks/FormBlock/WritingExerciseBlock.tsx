import React, {useContext, useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import WritingBlock from '../PoemBlock/WritingBlock';
import {
  Options,
  StudentPageInput,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import EditingBlock from '../PoemBlock/EditingBlock';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useInLessonCheck from '../../../../../customHooks/checkIfInLesson';
import {isEmpty, noop} from 'lodash';
import {FormControlProps} from '../FormBlock';

interface WritingExerciseProps extends FormControlProps {
  onChange: (e: any) => void;
  disabled: boolean;
  title: boolean;
  options?: Options[] | null;
}

const WritingExerciseBlock = (props: WritingExerciseProps) => {
  const {inputID, id, label, options, onChange, title, value, disabled} = props;

  const {state, lessonState, lessonDispatch} = useContext(GlobalContext);
  // const [poemInput, setPoemInput] = useState<StudentPageInput[]>([]);
  // // const [poemWriting, setPoemWriting] = useState<string>('');
  // const [saveAndEdit, setSaveAndEdit] = useState<boolean>(false);
  // const [poemWriting, setPoemWriting] = useState('');
  const [fields, setFields] = useState({
    poemHtml: '',
    poemText: '',
  });

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
  const isStudent = state.user.role === 'ST';
  const isInLesson = useInLessonCheck();

  const handleUpdateStudentData = (domID: string, input: string[]) => {
    lessonDispatch({
      type: 'UPDATE_STUDENT_DATA',
      payload: {
        pageIdx: lessonState.currentPage,
        data: {
          domID: domID,
          input: input,
        },
      },
    });
  };

  return (
    <div
      id={id}
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center p-4`}>
      {title ? (
        <>
          <label className={`text-sm text-gray-900 dark:text-white`} htmlFor="label">
            {label}
          </label>
          <input
            id={inputID}
            disabled={disabled}
            className={`w-full py-2 px-4  mt-2 rounded-xl bg-gray-100 dark:bg-darker-gray placeholder-gray-500 dark:placeholder-gray-700`}
            name={'text'}
            type={'text'}
            onChange={onChange}
            value={value}
          />
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
                handleUpdateStudentData={
                  isInLesson && isStudent ? handleUpdateStudentData : noop
                }
              />
            ) : null}
          </div>
          <EditingBlock
            id={inputID}
            setFields={setFields}
            fields={fields}
            poemWriting={value}
            handleUpdateStudentData={
              isInLesson && isStudent ? handleUpdateStudentData : noop
            }
          />
        </div>
      )}
    </div>
  );
};

export default WritingExerciseBlock;
