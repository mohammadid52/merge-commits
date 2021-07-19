import React, {useContext, useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import WritingBlock from './PoemBlock/WritingBlock';
import {StudentPageInput} from '../../../../interfaces/UniversalLessonInterfaces';
import EditingBlock from './PoemBlock/EditingBlock';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import {isString} from 'lodash';

interface PoemBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
}

const PoemBlock = (props: PoemBlockProps) => {
  const {id, value} = props;
  const {state, dispatch, lessonState, lessonDispatch} = useContext(GlobalContext);
  const [poemInput, setPoemInput] = useState<StudentPageInput[]>([]);
  // const [poemWriting, setPoemWriting] = useState<string>('');
  const [saveAndEdit, setSaveAndEdit] = useState<boolean>(false);

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
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
    const getInput = pageData.find(
      (inputObj: StudentPageInput) => inputObj.domID === domID
    );
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
    if (poemInput && poemInput.length > 0) {
      const concatenated = poemInput.reduce(
        (acc: string, poemInputObj: StudentPageInput) => {
          return `${acc}<p>${poemInputObj.input[0]}</p>`;
        },
        ''
      );

      if (isString(concatenated)) {
        // handleUpdateStudentData(id, [concatenated]);
      }
    }
  }, [poemInput]);

  const handleSaveAndEdit = () => {
    setSaveAndEdit(!saveAndEdit);
  };

  return (
    <div
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-50`}>
      <div className="relative flex flex-col justify-between items-center">
        {!saveAndEdit ? (
          <WritingBlock
            id={id}
            linestarters={value}
            poemInput={poemInput}
            setPoemInput={setPoemInput}
            saveAndEdit={saveAndEdit}
            setSaveAndEdit={setSaveAndEdit}
          />
        ) : (
          <EditingBlock
            id={id}
            poemWriting={isInLesson ? getStudentDataValue(id)[0] : ''}
            handleUpdateStudentData={handleUpdateStudentData}
          />
        )}
      </div>
      <button
        onClick={() => handleSaveAndEdit()}
        className={`self-center w-auto px-3 h-8 bg-yellow-500 text-gray-900 flex justify-center items-center rounded-xl mt-2 text-gray-200`}>
        Save and Edit Your Poem
      </button>
    </div>
  );
};

export default PoemBlock;
