import React, {useContext, useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import WritingBlock from './PoemBlock/WritingBlock';
import {StudentPageInput} from '../../../../interfaces/UniversalLessonInterfaces';
import EditingBlock from './PoemBlock/EditingBlock';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import {isEmpty, noop} from 'lodash';

interface PoemBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  classString?: string;
  writingExercise?: boolean;
}

const PoemBlock = (props: PoemBlockProps) => {
  const {id, value, classString = 'title-show || lineStarter-hide'} = props;

  const {state, lessonState, lessonDispatch} = useContext(GlobalContext);
  const [poemInput, setPoemInput] = useState<StudentPageInput[]>([]);
  // const [poemWriting, setPoemWriting] = useState<string>('');
  const [saveAndEdit, setSaveAndEdit] = useState<boolean>(false);
  const [poemWriting, setPoemWriting] = useState('');
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

  const getStudentDataValue = (domID: string) => {
    const pageData = lessonState.studentData[lessonState.currentPage];

    const getInput = pageData
      ? pageData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;

    if (getInput) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const [title, lineStarter] = classString?.split(' || ');

  return (
    <div
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center`}>
      <div className="relative flex flex-col justify-between items-center p-4">
        {value && value[0].options && lineStarter === 'lineStarter-show' ? (
          <WritingBlock
            id={id}
            linestarters={value[0].options}
            poemInput={poemInput}
            setPoemInput={setPoemInput}
            saveAndEdit={saveAndEdit}
            fields={fields}
            setFields={setFields}
            setPoemWriting={setPoemWriting}
            setSaveAndEdit={setSaveAndEdit}
            handleUpdateStudentData={handleUpdateStudentData}
          />
        ) : null}
        <div className="bg-gray-700 rounded-md p-4 mt-4">
          {value && value[0].label && title === 'title-show' && (
            <h1 className="text-left text-lg font-medium mb-4 text-gray-900 dark:text-white">
              {value[0].label}
            </h1>
          )}
          <EditingBlock
            id={id}
            poemWriting={isInLesson ? getStudentDataValue(id)[0] : ''}
            handleUpdateStudentData={
              isInLesson && isStudent ? handleUpdateStudentData : noop
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PoemBlock;
