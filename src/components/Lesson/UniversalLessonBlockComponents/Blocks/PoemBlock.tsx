import React, {useContext, useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import WritingBlock from './PoemBlock/WritingBlock';
import {StudentPageInput} from '../../../../interfaces/UniversalLessonInterfaces';
import EditingBlock from './PoemBlock/EditingBlock';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import {noop} from 'lodash';

interface PoemBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  classString?: string;
}

const PoemBlock = (props: PoemBlockProps) => {
  const {id, value, classString} = props;

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

  // // init poemInput so the first linestarter shows up
  useEffect(() => {
    if (poemInput.length === 0 && value.length > 0) {
      setPoemInput([
        {
          domID: value[0].id,
          input: [value[0].value],
        },
      ]);
    }
  }, [value]);

  // // init poemWriting for WYSIWYG
  useEffect(() => {
    if (isInLesson && isStudent) {
      if (poemInput.length > 0) {
        const concatenated = poemInput.reduce(
          (acc: string, poemInputObj: StudentPageInput) => {
            return `${acc}<p>${poemInputObj.input[0]}</p>`;
          },
          ''
        );
        handleUpdateStudentData(id, [concatenated]);
      }
    }
  }, [poemInput]);

  const handleSaveAndEdit = () => {
    setSaveAndEdit(!saveAndEdit);
  };

  return (
    <div
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center`}>
      <div className="relative flex flex-col justify-between items-center p-4">
        <WritingBlock
          id={id}
          linestarters={value}
          poemInput={poemInput}
          setPoemInput={setPoemInput}
          saveAndEdit={saveAndEdit}
          fields={fields}
          setFields={setFields}
          setPoemWriting={setPoemWriting}
          setSaveAndEdit={setSaveAndEdit}
          handleUpdateStudentData={handleUpdateStudentData}
        />
        <div className="border-0 border-gray-400 rounded-md p-4 mt-4">
          <h1 className="text-left text-lg font-medium mb-4 text-gray-900 dark:text-white">
            {classString}
          </h1>
          <EditingBlock
            id={id}
            setPoemWriting={setPoemWriting}
            // keep this one
            // poemWriting={isInLesson ? poemWriting : ''}
            // this is for testing
            poemWriting={poemWriting}
            fields={fields}
            setFields={setFields}
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
