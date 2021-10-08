import Loader from '@atoms/Loader';
import Selector from '@components/Atoms/Form/Selector';
import {FORM_TYPES} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import ThemeModal from '@components/Molecules/ThemeModal';
import {GlobalContext} from '@contexts/GlobalContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import useStudentDataValue from '@customHooks/studentDataValue';
import Note from '@UlbBlocks/Notes/Note';
import '@UlbBlocks/Notes/NoteStyles.scss';
import {wait} from '@utilities/functions';
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {InertiaPlugin} from 'gsap/InertiaPlugin';
import {find, findIndex, map, noop, random, remove, update} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {BiSave} from 'react-icons/bi';
import {FiFilePlus} from 'react-icons/fi';
import {v4 as uuidv4} from 'uuid';
import Tooltip from '@atoms/Tooltip';
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
          left: x,
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
      onDragEnd: (e) => {},
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
        },
      },
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
  addNew,
  notesInitialized,
  noteDelete,
  grid,
  saveData,
  updateJournalData,
  preview = false,
}: INoteBlock) => {
  const {
    state: {user},
    lessonDispatch,
  } = useContext(GlobalContext);
  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();

  const [localNotes, setLocalNotes] = useState([]);

  gsap.registerPlugin(InertiaPlugin, Draggable);
  gsap.ticker.fps(60);
  const [loading, setLoading] = useState(true);

  const [isContainerRendered, setIsContainerRendered] = useState(false);
  const {setDataValue} = useStudentDataValue();

  useEffect(() => {
    if (!isContainerRendered) {
      setLoading(true);
      genSticky(grid, () => setIsContainerRendered(true));
      setLoading(false);
    }
  }, [isContainerRendered]);

  useEffect(() => {
    if (notesList && notesList.length > 0) {
      setLocalNotes([...notesList]);
    }
  }, [notesList]);

  if (jQuery.ready) {
    if (localNotes && localNotes.length > 0) {
      localNotes.forEach((note: {id: any}, idx: number) => {
        if (note) {
          const id = `#${note.id} #note-${note.id}`;

          $(id).on('click', (e) => {
            e.target.focus();
          });
        }
      });

      // try {
      //   localNotes.forEach((note: {id: any; class: string}, idx: number) => {
      //     const doc = $(`#${note.id}`);
      //     // const pos = note?.class?.split(' || ')[];
      //     const xRandom = random(0, 10);
      //     const yRandom = random(0, 20);
      //     // const [x = xRandom, y = yRandom] = pos?.split(' ') || ['100', '200'];

      //     gsap.set(doc, {
      //       left: 250 * idx,
      //     });
      //   });
      // } catch (error) {
      //   console.error(error);
      // }
    }
  }

  const [notesChanged, setNotesChanged] = useState<boolean>(false);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);

  const onUnload = () => {
    if (notesChanged) {
      return 'You have unsaved changes on this page.';
    }
  };
  // window.onbeforeunload = onUnload;

  const updateNotesContent = (html: string, noteId: string) => {
    const idx = findIndex(notesData.entryData, ['domID', noteId]);

    update(notesData, `entryData[${idx}].input`, () => html);
    setNotesData({...notesData});
    if (!notesChanged) setNotesChanged(true);
  };

  const updateText = (e: any, noteId: string, idx: number) => {
    notesInitialized ? updateNotesContent(e.target.value, noteId) : noop;
    setDataValue(noteId, [e.target.value]);
  };

  const onNoteDelete = async () => {
    const note: any =
      showDeleteModal.id && find(localNotes, (d) => d.id === showDeleteModal.id);

    setNotesChanged(true);
    setShowDeleteModal({...showDeleteModal, show: false});

    remove(notesData.entryData, ['domID', note.id]);

    setNotesData({...notesData});

    noteDelete(notesData);
  };

  const onAddNewNote = () => {
    setNotesChanged(true);
    setIsContainerRendered(false);
    const newNoteObj = {
      ...localNotes[0],
      id: uuidv4(),
      class: 'yellow medium',
      value: '',
      type: FORM_TYPES.NOTES,
    };
    localNotes.push(newNoteObj);
    setLocalNotes([...localNotes]);

    addNew(
      {
        domID: newNoteObj.id,
        type: 'content-custom || yellow medium',
        input: '',
      },
      notesData
    );

    lessonDispatch({
      type: 'ADD_NEW_INPUT',
      payload: {
        domID: newNoteObj.id,
        input: [''],
      },
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

    setNotesData({...notesData});
    await updateJournalData();

    setCurrentSelectedColor(null);
    setCurrentSelectedSize(null);
  };

  const [showDeleteModal, setShowDeleteModal] = useState({show: false, id: ''});

  const [showEditModal, setShowEditModal] = useState({show: false, id: '', value: ''});

  const [currentSelectedColor, setCurrentSelectedColor] = useState(null);
  const [currentSelectedSize, setCurrentSelectedSize] = useState(null);

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
      cancel: () => setShowDeleteModal({show: false, id: ''}),
    },
    edit: {
      save: onNoteEdit,
      cancel: () => setShowEditModal({show: false, id: '', value: ''}),
    },
  };

  const colorList = [
    {id: 0, name: 'red'},
    {id: 1, name: 'green'},
    {id: 2, name: 'blue'},
    {id: 3, name: 'yellow'},
    {id: 4, name: 'indigo'},
    {id: 5, name: 'purple'},
  ];

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
            {
              <textarea
                onChange={noop}
                className={`${genSize(
                  currentSelectedSize
                )} preview-note bg-gradient-to-t text-gray-900 from-${currentSelectedColor}-500 to-${currentSelectedColor}-300 rounded leading-8 p-6`}
                id={'note'}
                value={showEditModal?.value}
              />
            }

            <div className="border-0 p-2 py-3 my-4 flex items-center justify-around border-gray-200 dark:border-gray-700 rounded-lg ">
              {map(colorList, (color) => (
                <div
                  key={color.id}
                  onClick={() => setCurrentSelectedColor(color.name)}
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
                onChange={(_, name) => setCurrentSelectedSize(name)}
                list={[
                  {id: 0, name: 'small'},
                  {id: 1, name: 'medium'},
                  {id: 2, name: 'large'},
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

        <div className="relative flex items-start space-x-4">
          <div id="container" className="sticky-container blackboard">
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
                      key={note?.id}
                      idx={idx}
                      note={note}
                      preview={preview}
                    />
                  );
                }
              })}
          </div>

          {isInLesson && isStudent && (
            <div className="w-auto space-y-4 flex items-center flex-col justify-center">
              <Tooltip text="Add new note">
                <button
                  disabled={localNotes.length === 15}
                  onClick={onAddNewNote}
                  className="w-auto text-red-600 hover:text-red-500 transition-all">
                  <FiFilePlus className="h-10 w-10 " />
                </button>
              </Tooltip>

              {!saveInProgress && (
                <Tooltip text="Save to Notebook">
                  <button
                    onClick={() => {
                      if (notesChanged) {
                        saveData(
                          notesData,
                          () => setSaveInProgress(true),
                          () => {
                            setNotesChanged(false);
                            setSaveInProgress(false);
                          }
                        );
                      }
                    }}
                    className="w-auto text-yellow-600 hover:text-yellow-500 transition-all">
                    <BiSave className="h-10 w-10 " />
                  </button>
                </Tooltip>
              )}
              {saveInProgress && <Loader className="text-yellow-500 text-base" />}
            </div>
          )}
        </div>
      </>
    );
};

export default React.memo(NotesBlock);
