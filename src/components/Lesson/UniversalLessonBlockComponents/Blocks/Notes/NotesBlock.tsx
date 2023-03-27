import Note from '@UlbBlocks/Notes/Note';
import '@UlbBlocks/Notes/NoteStyles.scss';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import Tooltip from 'atoms/Tooltip';
import {FORM_TYPES} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {useGlobalContext} from 'contexts/GlobalContext';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {InertiaPlugin} from 'gsap/InertiaPlugin';
import {find, findIndex, map, noop, remove, update} from 'lodash';
import ThemeModal from 'molecules/ThemeModal';
import React, {useEffect, useState} from 'react';
import {BiSave} from 'react-icons/bi';
import {FiFilePlus} from 'react-icons/fi';
import {VscDebugRestart} from 'react-icons/vsc';
import {wait} from 'utilities/functions';
import {v4 as uuidv4} from 'uuid';

const genSticky = (
  {rows, cols}: {rows?: number; cols?: number},

  cb?: any
) => {
  wait(50).then(() => {
    var $container = $('#container'),
      gridWidth = 250,
      gridHeight = 250,
      gridRows = rows || 2,
      gridColumns = cols || 4,
      i,
      x,
      y;
    //loop through and create the grid (a div for each cell). Feel free to tweak the variables above
    for (i = 0; i < gridRows * gridColumns; i++) {
      y = Math.floor(i / gridColumns) * gridHeight;
      x = (i * gridWidth) % (gridColumns * gridWidth);
      $('<span/>')
        .css({
          position: 'absolute',
          width: gridWidth - 1,
          height: gridHeight - 1,
          top: y,
          left: x
        })
        .prependTo($container);
    }

    //set the container's size to match the grid, and ensure that the box widths/heights reflect the variables above

    // gsap.set('._sticky', {
    //   width: gridWidth,

    //   height: gridHeight,
    // });

    Draggable.create('._sticky', {
      bounds: $container,
      edgeResistance: 0.065,
      throwProps: true,
      type: 'x,y',
      inertia: true,
      // onDragEnd: (e) => {},
      // @ts-ignore
      autoScroll: true,

      snap: {
        x: function (endValue) {
          const landOnGrid = false;
          return landOnGrid ? Math.round(endValue / gridWidth) * gridWidth : endValue;
        },
        y: function (endValue) {
          const landOnGrid = false;

          return landOnGrid ? Math.round(endValue / gridHeight) * gridHeight : endValue;
        }
      }
    });

    if (cb && typeof cb === 'function') {
      cb();
    }
  });
};

interface INoteBlock {
  notesInitialized?: boolean;
  preview?: boolean;
  grid?: {cols?: number; rows?: number};
  value: any[];
  addNew?: (newNoteObj: any, notesData?: any) => void;
  saveData?: (notesData: any, cb?: any, cb2?: any) => void;
  notesData?: any;
  updateJournalData?: any;
  noteDelete?: (notesData: any) => void;
  setNotesData?: React.Dispatch<React.SetStateAction<any>>;
  defaultNotes?: any[];
  allNotes?: any[];
}

const genSize = (size: string) => {
  switch (size) {
    case 'small':
      return 'h-40 w-40 text-sm';
    case 'medium':
      return 'h-60 w-60 text-base';
    case 'large':
      return 'h-72 w-72 text-lg';
    default:
      return 'h-60 w-60';
  }
};

const NotesBlock = ({
  value: notesList,
  notesData,
  setNotesData,
  allNotes,
  addNew,
  notesInitialized,
  noteDelete,
  grid = {},

  saveData,
  updateJournalData,
  preview = false,
  defaultNotes = []
}: INoteBlock) => {
  const {
    state: {user},
    lessonDispatch
  } = useGlobalContext();
  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

  const [localNotes, setLocalNotes] = useState<any[]>([]);

  gsap.registerPlugin(InertiaPlugin, Draggable);
  gsap.ticker.fps(60);
  const [loading, setLoading] = useState(true);

  const [isContainerRendered, setIsContainerRendered] = useState(false);
  const {setDataValue} = useStudentDataValue();

  useEffect(() => {
    setLoading(true);
    genSticky(grid, () => setIsContainerRendered(true));
    setLoading(false);
  }, [isContainerRendered, localNotes.length]);

  useEffect(() => {
    if (notesList && notesList.length > 0) {
      setLocalNotes([...notesList]);
    }
  }, [notesList]);

  function posEnd(end: any) {
    let len = end.value.length;

    // Mostly for Web Browsers
    if (end.setSelectionRange) {
      end.focus();
      end.setSelectionRange(len, len);
    } else if (end.createTextRange) {
      let t = end.createTextRange();
      t.collapse(true);
      t.moveEnd('character', len);
      t.moveStart('character', len);
      t.select();
    }
  }

  // @ts-ignore
  if (jQuery.ready) {
    if (localNotes && localNotes.length > 0) {
      localNotes.forEach((note: {id: any}) => {
        if (note) {
          const id = `#${note.id} #note-${note.id}`;

          $(id).on('click', (e) => {
            posEnd(e.target);
          });
        }
      });
    }
  }

  const [notesChanged, setNotesChanged] = useState<boolean>(false);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);

  // window.onbeforeunload = onUnload;

  const updateNotesContent = (html: string, noteId: string) => {
    const idx = findIndex(notesData.entryData, ['domID', noteId]);

    update(notesData, `entryData[${idx}].input`, () => html);
    setNotesData?.({...notesData});
    if (!notesChanged) setNotesChanged(true);
  };

  const updateText = (e: any, noteId: string) => {
    notesInitialized ? updateNotesContent(e.target.value, noteId) : noop;
    setDataValue(noteId, [e.target.value]);
  };

  const onNoteDelete = async () => {
    const note: any =
      showDeleteModal.id && find(localNotes, (d) => d.id === showDeleteModal.id);

    setNotesChanged(true);
    setShowDeleteModal({...showDeleteModal, show: false});

    remove(notesData.entryData, ['domID', note.id]);

    setNotesData?.({...notesData});

    noteDelete?.(notesData);
  };

  const onAddNewNote = () => {
    setNotesChanged(true);
    setIsContainerRendered(false);
    const newNoteObj = {
      ...localNotes[0],
      id: uuidv4(),
      class: 'yellow medium',
      value: '',
      type: FORM_TYPES.NOTES
    };
    localNotes.push(newNoteObj);
    setLocalNotes([...localNotes]);

    const domID = `post-it_${newNoteObj.id}`;

    addNew?.(
      {
        domID,
        type: 'content-custom || yellow medium',
        input: ''
      },
      notesData
    );

    lessonDispatch({
      type: 'ADD_NEW_INPUT',
      payload: {
        domID,
        input: ['']
      }
    });
  };

  const onNoteEdit = async () => {
    setShowEditModal({...showEditModal, show: false});
    setNotesChanged(true);

    const note = find(localNotes, (d) => d.id === showEditModal.id);

    const noteIdx = findIndex(localNotes, (d: any) => d.id === note.id);

    update(
      localNotes[noteIdx],
      `class`,
      () => `${currentSelectedColor} ${currentSelectedSize}`
    );
    setLocalNotes([...localNotes]);

    const idx = findIndex(notesData.entryData, ['domID', note.id]);

    update(
      notesData,
      `entryData[${idx}].type`,
      () => `content-custom || ${currentSelectedColor} ${currentSelectedSize}`
    );

    setNotesData?.({...notesData});
    await updateJournalData();

    setCurrentSelectedColor(null);
    setCurrentSelectedSize(undefined);
  };

  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    id: ''
  });

  const [showEditModal, setShowEditModal] = useState({
    show: false,
    id: '',
    value: ''
  });

  const [currentSelectedColor, setCurrentSelectedColor] = useState<string | null>(null);
  const [currentSelectedSize, setCurrentSelectedSize] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (showEditModal && showEditModal.id) {
      const currentNote = find(localNotes, (d) => d.id === showEditModal.id);
      if (currentNote.class) {
        const bgColor = currentNote.class?.split(' ')[0] || 'yellow';
        const size = currentNote.class?.split(' ')[1] || 'medium';
        if (!currentSelectedColor) {
          setCurrentSelectedColor(bgColor);
        }
        if (!currentSelectedSize) {
          setCurrentSelectedSize(size);
        }
      }
    }
  }, [currentSelectedColor, currentSelectedSize, showEditModal.id]);

  const modalBtns = {
    delete: {
      save: onNoteDelete,
      cancel: () => setShowDeleteModal({show: false, id: ''})
    },
    edit: {
      save: onNoteEdit,
      cancel: () => setShowEditModal({show: false, id: '', value: ''})
    }
  };

  const resetDefaultNotes = () => {
    allNotes &&
      allNotes.length > 0 &&
      allNotes.map((note) => {
        updateText({target: {value: note.value}}, note.id);
      });
  };

  const colorList = [
    {id: 0, name: 'red'},
    {id: 1, name: 'green'},
    {id: 2, name: 'blue'},
    {id: 3, name: 'yellow'},
    {id: 4, name: 'indigo'},
    {id: 5, name: 'purple'}
  ];

  const buttonIconSize =
    'h-8 w-8 hover:theme-bg hover:text-white rounded-full transition-all p-1';

  if (loading) {
    return (
      <div className="flex items-center overflow-hidden justify-center min-h-32">
        <Loader withText="Loading Notes..." className="text-gray-500 flex-col text-lg" />
      </div>
    );
  } else
    return (
      <>
        <ThemeModal
          max={{w: 132}}
          dark={true}
          header={`Delete Note`}
          open={showDeleteModal.show}
          setOpen={modalBtns.delete.cancel}>
          <div className="">
            <p className="text-gray-900 dark:text-white mb-4">
              Are you sure you want to delete this note?
            </p>
            <div className="flex space-x-4 items-center justify-end">
              <button
                onClick={modalBtns.delete.cancel}
                type="button"
                className="w-auto inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
              <button
                data-cy="delete-note-button"
                onClick={modalBtns.delete.save}
                type="button"
                className="w-auto inline-flex items-center px-2.5 py-1.5 border-0 border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Delete
              </button>
            </div>
          </div>
        </ThemeModal>
        <ThemeModal
          max={{w: 132}}
          dark={true}
          header={`Edit Note`}
          open={showEditModal.show}
          setOpen={modalBtns.edit.cancel}>
          <div className="flex items-center flex-col justify-center">
            <textarea
              onChange={noop}
              className={`${genSize(
                currentSelectedSize || 'medium'
              )} preview-note bg-gradient-to-t text-gray-900 from-${currentSelectedColor}-500 to-${currentSelectedColor}-300 rounded leading-8 p-6`}
              id={'note'}
              value={showEditModal?.value}
            />

            <div className="border-0 p-2 py-3 my-4 flex items-center justify-around border-gray-200 dark:border-gray-700 rounded-lg ">
              {map(colorList, (color) => (
                <div
                  key={color.id}
                  onClick={() => setCurrentSelectedColor(color?.name || '')}
                  className={`rounded-full cursor-pointer transition-all h-4 w-4 bg-${
                    color.name
                  }-500 border-2 ${
                    currentSelectedColor === color.name
                      ? ' border-white'
                      : 'border-transparent'
                  }`}
                />
              ))}
            </div>

            <div className="mb-4">
              <label
                htmlFor={'size'}
                className="mb-2 block text-xs font-semibold leading-5 text-gray-400">
                Select size
              </label>
              <Selector
                placeholder="Select size"
                selectedItem={currentSelectedSize}
                onChange={(name) => setCurrentSelectedSize(name)}
                list={[
                  {id: 0, label: 'small', value: 'small'},
                  {id: 1, label: 'medium', value: 'medium'},
                  {id: 2, label: 'large', value: 'large'}
                ]}
              />
            </div>

            <div className="flex  space-x-4 items-center justify-end">
              <button
                onClick={modalBtns.edit.cancel}
                type="button"
                className="w-auto inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
              <button
                disabled={saveInProgress}
                onClick={modalBtns.edit.save}
                type="button"
                className={`${
                  saveInProgress ? 'opacity-50' : 'opacity-100'
                } w-auto inline-flex items-center px-2.5 py-1.5 border-0 border-transparent text-xs font-medium rounded shadow-sm text-white iconoclast:bg-main curate:bg-main  hover:iconoclast:bg-600 hover:curate:bg-600 `}>
                Save
              </button>
            </div>
          </div>
        </ThemeModal>

        <div className="relative flex flex-col items-start w-full">
          {isInLesson && isStudent && (
            <div className="w-auto flex items-center  justify-center theme-border border-0 rounded-full mb-4 gap-x-4 p-2">
              {defaultNotes.length > 0 &&
                resetDefaultNotes &&
                typeof resetDefaultNotes === 'function' && (
                  <Tooltip
                    placement="top"
                    additionalClass="flex items-center justify-center"
                    text="reset to default">
                    <button
                      data-cy="reset-to-default-button"
                      onClick={resetDefaultNotes}
                      className="w-auto theme-text transition-all">
                      <VscDebugRestart className={buttonIconSize} />
                    </button>
                  </Tooltip>
                )}
              <Tooltip
                placement="top"
                additionalClass="flex items-center justify-center"
                text="Add new note">
                <button
                  data-cy="add-new-note-button"
                  disabled={localNotes.length === 15}
                  onClick={onAddNewNote}
                  className="w-auto theme-text transition-all">
                  <FiFilePlus className={buttonIconSize} />
                </button>
              </Tooltip>

              {!saveInProgress && (
                <Tooltip
                  placement="top"
                  additionalClass="flex items-center justify-center"
                  text="Save">
                  <button
                    data-cy="save-note-button"
                    onClick={() => {
                      if (notesChanged) {
                        saveData?.(
                          notesData,
                          () => setSaveInProgress(true),
                          () => {
                            setNotesChanged(false);
                            setSaveInProgress(false);
                          }
                        );
                      }
                    }}
                    className="w-auto theme-text transition-all">
                    <BiSave className={buttonIconSize} />
                  </button>
                </Tooltip>
              )}
              {saveInProgress && <Loader className="text-yellow-500 text-base" />}
            </div>
          )}
          <div id="container" className="sticky-container blackboard w-full text-white">
            {localNotes &&
              localNotes.length > 0 &&
              map(localNotes, (note, idx) => {
                if (note) {
                  return (
                    <Note
                      custom={note.custom}
                      updateText={updateText}
                      setShowEditModal={setShowEditModal}
                      setShowDeleteModal={setShowDeleteModal}
                      key={`${note?.id}_${idx}_${idx}`}
                      idx={idx}
                      note={note}
                      preview={preview}
                    />
                  );
                }
                return <div className="hidden w-auto" />;
              })}
          </div>
        </div>
      </>
    );
};

export default React.memo(NotesBlock);
