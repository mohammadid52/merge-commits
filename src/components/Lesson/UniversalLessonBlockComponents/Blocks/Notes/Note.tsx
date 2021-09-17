import {GlobalContext} from '@contexts/GlobalContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
import {randomNumber} from '@utilities/functions';
import noop from 'lodash/noop';
import {BiTrashAlt} from 'react-icons/bi';
import {AiOutlineEdit} from 'react-icons/ai';
import React, {useContext, useMemo, useState} from 'react';
import ThemeModal from '@components/Molecules/ThemeModal';
interface INoteBlock {
  note: {class?: string; value?: string; id: string};
  onNoteDelete: (noteId: string) => void;
}

const Note = ({note, onNoteDelete}: INoteBlock) => {
  let angle = useMemo(() => randomNumber(-3, 3), []);

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Just show delete modal
  const onDeleteBtnClick = () => {
    setShowDeleteModal(true);
  };

  const modalBtns = {
    onCancel: () => {
      setShowDeleteModal(false);
    },
    onDelete: (noteId: string) => {
      setShowDeleteModal(false);
      onNoteDelete(noteId);
    },
  };

  return (
    <>
      <ThemeModal
        max={{w: 132}}
        dark={true}
        header={`Delete Note`}
        open={showDeleteModal}
        setOpen={setShowDeleteModal}>
        <div className="">
          <p className="text-gray-900 dark:text-white mb-4">
            Are you sure you want to delete this note?
          </p>
          <div className="flex space-x-4 items-center justify-end">
            <button
              onClick={modalBtns.onCancel}
              type="button"
              className="w-auto inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button
              onClick={() => modalBtns.onDelete(note.id)}
              type="button"
              className="w-auto inline-flex items-center px-2.5 py-1.5 border-0 border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        </div>
      </ThemeModal>

      <div
        id={note.id}
        style={{transform: 'rotate(' + angle + 'deg)'}}
        className={`_sticky group bg-gradient-to-t text-gray-900 from-${bgColor}-500 to-${bgColor}-300 rounded leading-8 p-6`}>
        <textarea
          id={'note'}
          onChange={isInLesson && isStudent ? (e) => onChange(e, note.id) : noop}
          value={isInLesson ? getDataValue(note.id) : note.value}
        />
        <span className="opacity-0 group-hover:opacity-95 transition-all absolute mb-2 mr-2 bottom-0 right-0 w-auto">
          {/* <button className="w-auto">
          <AiOutlineEdit className="text-base text-white" />
        </button> */}
          <button onClick={onDeleteBtnClick} className="w-auto">
            <BiTrashAlt className="text-lg text-white" />
          </button>
        </span>
      </div>
    </>
  );
};

export default Note;
