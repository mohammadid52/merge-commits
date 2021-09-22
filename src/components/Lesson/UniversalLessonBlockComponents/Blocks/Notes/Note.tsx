import useInLessonCheck from '@customHooks/checkIfInLesson';
import {randomNumber} from '@utilities/functions';
import noop from 'lodash/noop';
import React, {useMemo} from 'react';
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
    idx,
    updateText,
    uninitialized,
  }: any) => {
    let angle = useMemo(() => randomNumber(-3, 3), []);

    return (
      <div
        id={note.id}
        style={{transform: 'rotate(' + angle + 'deg)'}}
        className={`_sticky group bg-gradient-to-t text-gray-900 from-${bgColor}-500 to-${bgColor}-300 rounded leading-8 p-6`}>
        <textarea
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

  const bgColor = note.class || 'yellow';

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
