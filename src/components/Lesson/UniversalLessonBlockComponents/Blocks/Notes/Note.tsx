import useInLessonCheck from '@customHooks/checkIfInLesson';
import {randomNumber} from '@utilities/functions';
import noop from 'lodash/noop';
import React, {useMemo} from 'react';
import {AiOutlineEdit} from 'react-icons/ai';
import {BiTrashAlt} from 'react-icons/bi';

const genSize = (size: string) => {
  switch (size) {
    case 'small':
      return 'h-40 w-40 ';
    case 'medium':
      return 'h-60 w-60 ';
    case 'large':
      return 'h-72 w-72 ';
    default:
      return 'h-60 w-60 ';
  }
};

const genFontSize = (size: string) => {
  switch (size) {
    case 'small':
      return 16;
    case 'medium':
      return 22;
    case 'large':
      return 26;
    default:
      return 22;
  }
};

const InnerNote = React.memo(
  ({
    note,
    isInLesson,
    isStudent,

    bgColor,
    onDeleteBtnClick,
    onEditBtnClick,
    idx,
    updateText,
    size,
  }: any) => {
    let angle = useMemo(() => randomNumber(-3, 3), []);

    return (
      <div
        id={note.id}
        style={{transform: 'rotate(' + angle + 'deg)'}}
        className={`_sticky ${genSize(
          size
        )}  group bg-gradient-to-t text-gray-900 from-${bgColor}-500 to-${bgColor}-300 rounded leading-8 p-6`}>
        <textarea
          style={{fontSize: `${genFontSize(size)}px`}}
          id={'note'}
          onChange={
            isInLesson && isStudent ? (e: any) => updateText(e, note.id, idx) : noop
          }
          // value={isInLesson ? getDataValue(note.id) : note.value}
          value={note.value}
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
  getDataValue?: any;
  setShowDeleteModal?: React.Dispatch<React.SetStateAction<{show: boolean; id: string}>>;
  setShowEditModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; id: string; value: string}>
  >;
  idx?: number;
  uninitialized?: boolean;
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
}: INoteBlock) => {
  const isStudent = true;
  const isInLesson = useInLessonCheck();

  const bgColor = note.class.split(' ')[0] || 'yellow';
  const size = note.class.split(' ')[1] || 'medium';

  // Just show delete modal
  const onDeleteBtnClick = (noteId: string) => {
    setShowDeleteModal({show: true, id: noteId});
  };

  // Just show edit modal
  const onEditBtnClick = (noteId: string) => {
    setShowEditModal({show: true, id: noteId, value: ''});
  };

  return (
    <InnerNote
      getDataValue={getDataValue}
      updateText={updateText}
      uninitialized={uninitialized}
      bgColor={bgColor}
      size={size}
      idx={idx}
      isInLesson={isInLesson}
      isStudent={isStudent}
      onDeleteBtnClick={onDeleteBtnClick}
      onEditBtnClick={onEditBtnClick}
      note={note}
    />
  );
};

export default Note;
