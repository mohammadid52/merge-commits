import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {randomNumber} from 'utilities/functions';
import noop from 'lodash/noop';
import React, {useMemo} from 'react';
import {AiOutlineEdit} from 'react-icons/ai';
import {BiTrashAlt} from 'react-icons/bi';

const genSize = (size: string) => {
  switch (size) {
    case 'small':
      return 'h-60 w-60  ';
    case 'medium':
      return 'h-72 w-72';
    case 'large':
      return 'h-80 w-80 ';
    default:
      return 'h-80 w-80';
  }
};

const genFontSize = (size: string) => {
  switch (size) {
    case 'small':
      return 22;
    case 'medium':
      return 26;
    case 'large':
      return 30;
    default:
      return 30;
  }
};

const InnerNote = React.memo(
  ({
    note,
    isInLesson,
    isStudent,
    custom,
    bgColor,
    onDeleteBtnClick,
    onEditBtnClick,
    idx,
    updateText,
    size
  }: any) => {
    let angle = useMemo(() => randomNumber(-3, 3), []);

    const {getDataValue} = useStudentDataValue();

    const defaultValue = getDataValue(note.id)[0];

    const value =
      isInLesson && isStudent
        ? defaultValue.length > 0
          ? defaultValue
          : note.value
        : note.value;

    return (
      <div
        id={note.id}
        style={{transform: 'rotate(' + angle + 'deg)'}}
        className={`_sticky ${genSize(
          size
        )}  group bg-gradient-to-t text-darkest   note-${bgColor} rounded leading-8 p-6`}>
        <textarea
          data-cy={`input-note-${note.id}`}
          style={{fontSize: `${genFontSize(size)}px`}}
          id={`note-${note.id}`}
          onChange={
            isInLesson && isStudent ? (e: any) => updateText(e, note.id, idx) : noop
          }
          // value={isInLesson ? getDataValue(note.id) : note.value}
          value={value}
        />
        {custom && isInLesson && isStudent && (
          <span className="space-x-3 opacity-0 group-hover:opacity-95 transition-all absolute mb-2 mr-2 bottom-0 right-0 w-auto">
            <button
              data-cy="edit-note-button"
              className="w-auto"
              onClick={() => onEditBtnClick(note.id)}>
              <AiOutlineEdit className="text-base text-white" />
            </button>
            <button
              data-cy="delete-sticky-note-button"
              onClick={() => onDeleteBtnClick(note.id)}
              className="w-auto">
              <BiTrashAlt className="text-lg text-white" />
            </button>
          </span>
        )}
      </div>
    );
  }
);

interface INoteBlock {
  custom?: boolean;
  note: {class?: string; value?: string; id: string};
  getDataValue?: any;
  setShowDeleteModal?: React.Dispatch<React.SetStateAction<{show: boolean; id: string}>>;
  setShowEditModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; id: string; value: string}>
  >;
  idx?: number;
  uninitialized?: boolean;
  preview?: boolean;
  updateText?: (e: any, noteId: string, idx: number) => void;
}

const Note = ({
  note,
  getDataValue,
  setShowEditModal,
  setShowDeleteModal,
  idx,
  updateText,
  uninitialized,
  preview,
  custom = false
}: INoteBlock) => {
  const isStudent = true;
  const isInLesson = useInLessonCheck();

  const bgColor = note?.class?.split(' ')[0] || 'yellow';
  const size = note?.class?.split(' ')[1] || 'medium';

  // Just show delete modal
  const onDeleteBtnClick = (noteId: string) => {
    setShowDeleteModal?.({show: true, id: noteId});
  };

  // Just show edit modal
  const onEditBtnClick = (noteId: string) => {
    setShowEditModal?.({show: true, id: noteId, value: ''});
  };

  return (
    <InnerNote
      preview={preview}
      getDataValue={getDataValue}
      updateText={updateText}
      uninitialized={uninitialized}
      bgColor={bgColor}
      size={size}
      idx={idx}
      isInLesson={isInLesson}
      isStudent={isStudent}
      custom={custom}
      onDeleteBtnClick={onDeleteBtnClick}
      onEditBtnClick={onEditBtnClick}
      note={note}
    />
  );
};

export default Note;
