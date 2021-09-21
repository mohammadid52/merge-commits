import {GlobalContext} from '@contexts/GlobalContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
import {randomNumber} from '@utilities/functions';
import noop from 'lodash/noop';
import React, {useContext, useMemo} from 'react';
import {AiOutlineEdit} from 'react-icons/ai';
import {BiTrashAlt} from 'react-icons/bi';

const InnerNote = React.memo(
  ({
    note,
    isInLesson,
    isStudent,
    getDataValue,
    bgColor,
    onDeleteBtnClick,
    onEditBtnClick,
    onChange,
  }: any) => {
    let angle = useMemo(() => randomNumber(-3, 3), []);

    return (
      <div
        id={note.id}
        style={{transform: 'rotate(' + angle + 'deg)'}}
        className={`_sticky group bg-gradient-to-t text-gray-900 from-${bgColor}-500 to-${bgColor}-300 rounded leading-8 p-6`}>
        <textarea
          id={'note'}
          onChange={isInLesson && isStudent ? (e) => onChange(e, note.id) : noop}
          value={isInLesson ? getDataValue(note.id) : note.value}
        />
        {isInLesson && isStudent && (
          <span className="space-x-3 opacity-0 group-hover:opacity-95 transition-all absolute mb-2 mr-2 bottom-0 right-0 w-auto">
            <button className="w-auto" onClick={() => onEditBtnClick(note.id)}>
              <AiOutlineEdit className="text-base text-white" />
            </button>
            <button onClick={() => onDeleteBtnClick(note.id)} className="w-auto">
              <BiTrashAlt className="text-lg text-white" />
            </button>
          </span>
        )}
      </div>
    );
  }
);

interface INoteBlock {
  note: {class?: string; value?: string; id: string};

  setShowDeleteModal?: React.Dispatch<React.SetStateAction<{show: boolean; id: string}>>;
  setShowEditModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; id: string; value: string}>
  >;
}

const Note = ({note, setShowEditModal, setShowDeleteModal}: INoteBlock) => {
  const {
    lessonState,
    lessonDispatch,
    state: {user},
  } = useContext(GlobalContext);

  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

  const getStudentDataValue = (domID: string) => {
    const pageData = lessonState.studentData[lessonState.currentPage];
    const getInput = pageData
      ? pageData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput !== undefined) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDataValue = (domID: string): string => getStudentDataValue(domID);

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

  const onChange = (e: any, id: string) => {
    const {value} = e.target;
    if (isInLesson) {
      handleUpdateStudentData(id, [value]);
    }
  };
  const bgColor = note.class || 'yellow';

  // Just show delete modal
  const onDeleteBtnClick = (noteId: string) => {
    setShowDeleteModal({show: true, id: noteId});
  };

  // Just show delete modal
  const onEditBtnClick = (noteId: string) => {
    setShowEditModal({show: true, id: noteId, value: getDataValue(noteId)});
  };

  return (
    <InnerNote
      onChange={onChange}
      bgColor={bgColor}
      isInLesson={isInLesson}
      isStudent={isStudent}
      getDataValue={getDataValue}
      onDeleteBtnClick={onDeleteBtnClick}
      onEditBtnClick={onEditBtnClick}
      note={note}
    />
  );
};

export default Note;
