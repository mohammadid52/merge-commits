import Loader from '@atoms/Loader';
import useScript from '@customHooks/useScript';
import Note from '@UlbBlocks/Notes/Note';
import '@UlbBlocks/Notes/NoteStyles.scss';
import {wait} from '@utilities/functions';
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {InertiaPlugin} from 'gsap/InertiaPlugin';
import {find, findIndex, map, noop, remove, update} from 'lodash';
import React, {memo, useContext, useEffect, useState} from 'react';
import {UniversalLesson} from '@interfaces/UniversalLessonInterfaces';
import {GlobalContext} from '@contexts/GlobalContext';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import ThemeModal from '@components/Molecules/ThemeModal';
import {BiSave} from 'react-icons/bi';
import {FiFilePlus} from 'react-icons/fi';
import {FORM_TYPES} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {v4 as uuidv4} from 'uuid';

interface INoteBlock {
  grid?: {cols?: number; rows?: number};
  value: {class?: string; value?: string; id: string}[];
  currentLesson?: UniversalLesson | null;
}

const NotesBlock = ({
  value: notesList,
  grid: {cols = 4, rows = 2},
  currentLesson = null,
}: INoteBlock) => {
  const {lessonState} = useContext(GlobalContext);

  const status = useScript(
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'
  );
  gsap.registerPlugin(InertiaPlugin, Draggable);
  // gsap.ticker.fps(60);
  const [loading, setLoading] = useState(true);

  if (status === 'ready') {
    wait(50).then(() => {
      setLoading(false);
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

      gsap.set('._sticky', {
        width: gridWidth,

        height: gridHeight,
      });

      if (jQuery.ready) {
        notesList.forEach((note: {id: any}) => {
          $(`#${note.id} #note`).on('click', (e) => {
            e.target.focus();
          });
        });
      }

      Draggable.create('._sticky', {
        bounds: $container,
        edgeResistance: 0.065,
        throwProps: true,
        type: 'x,y',
        inertia: true,

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
    });
  }

  const [localNotes, setLocalNotes] = useState([]);

  useEffect(() => {
    if (notesList && notesList.length > 0) {
      setLocalNotes([...notesList]);
    }
  }, [notesList]);

  const [currentLocalLesson, setCurrentLocalLesson] = useState(currentLesson);

  const onNoteDelete = () => {
    const note: any =
      showDeleteModal.id && find(localNotes, (d) => d.id === showDeleteModal.id);
    remove(localNotes, (_note) => _note.id === note.id);
    setLocalNotes([...localNotes]);

    const updateLesson = async () => {
      const currentPageIdx = lessonState.currentPage;
      if (currentLesson) {
        const pageContent = currentLesson.lessonPlan[currentPageIdx].pageContent;
        const pagePartIdx = findIndex(pageContent, (d) => d.id === note.pagePartId);
        const partContent = pageContent[pagePartIdx].partContent;
        const partContentIdx = findIndex(partContent, (d) => d.id === note.partContentId);
        const valueArr = partContent[partContentIdx].value;

        remove(valueArr, (d) => d.id === note.id);

        update(
          currentLocalLesson,
          `lessonPlan[${currentPageIdx}].pageContent[${pagePartIdx}].partContent[
          ${partContentIdx}
        ].value`,
          () => valueArr
        );

        setCurrentLocalLesson({...currentLocalLesson});

        try {
          modalBtns.delete.cancel();

          const input = {
            id: currentLocalLesson.id,
            lessonPlan: [...currentLocalLesson.lessonPlan],
          };

          await updateLessonPageToDB(input);
        } catch (error) {
          console.error('@onNoteDelete - NotesBlock.tsx', error);
        } finally {
        }
      }
    };

    updateLesson();
  };

  const onAddNewNote = () => {
    const newNoteObj = {
      ...localNotes[0],
      id: uuidv4(),
      class: 'yellow',
      value: '',
      type: FORM_TYPES.NOTES,
    };
    localNotes.push(newNoteObj);
    setLocalNotes([...localNotes]);
    const note = localNotes[0];
    const updateLesson = async () => {
      const currentPageIdx = lessonState.currentPage;
      if (currentLesson) {
        const pageContent = currentLesson.lessonPlan[currentPageIdx].pageContent;

        const pagePartIdx = findIndex(pageContent, (d) => d.id === note.pagePartId);

        const partContent = pageContent[pagePartIdx].partContent;
        const partContentIdx = findIndex(partContent, (d) => d.id === note.partContentId);
        let valueArr = partContent[partContentIdx].value;

        const updated = update(
          currentLocalLesson,
          `lessonPlan[${currentPageIdx}].pageContent[${pagePartIdx}].partContent[
          ${partContentIdx}
        ].value`,
          () => {
            valueArr.push({
              type: FORM_TYPES.NOTES,
              value: '',
              class: 'yellow',
              id: newNoteObj.id,
            });

            return valueArr;
          }
        );

        setCurrentLocalLesson({...currentLocalLesson});

        try {
          const input = {
            id: updated.id,
            lessonPlan: [...updated.lessonPlan],
          };

          await updateLessonPageToDB(input);
        } catch (error) {
          console.error('@onNoteAdd - NotesBlock.tsx', error);
        }
      }
    };

    updateLesson();
  };

  const onNoteEdit = () => {
    const note: any = currentNote;

    const noteIdx = findIndex(localNotes, (d: any) => d.id === note.id);

    update(localNotes[noteIdx], `class`, () => currentSelectedColor);
    setLocalNotes([...localNotes]);

    const updateLesson = async () => {
      const currentPageIdx = lessonState.currentPage;
      if (currentLesson) {
        const pageContent = currentLesson.lessonPlan[currentPageIdx].pageContent;

        const pagePartIdx = findIndex(pageContent, (d) => d.id === note.pagePartId);

        const partContent = pageContent[pagePartIdx].partContent;
        const partContentIdx = findIndex(partContent, (d) => d.id === note.partContentId);
        let valueArr = partContent[partContentIdx].value;
        const noteIdx = findIndex(valueArr, (d: any) => d.id === note.id);

        const updated = update(
          currentLocalLesson,
          `lessonPlan[${currentPageIdx}].pageContent[${pagePartIdx}].partContent[
          ${partContentIdx}
        ].value`,
          () => {
            valueArr[noteIdx].class = currentSelectedColor;

            return valueArr;
          }
        );

        setCurrentLocalLesson({...currentLocalLesson});
        modalBtns.edit.cancel();

        try {
          const input = {
            id: updated.id,
            lessonPlan: [...updated.lessonPlan],
          };

          await updateLessonPageToDB(input);
        } catch (error) {
          console.error('@onNoteEdit - NotesBlock.tsx', error);
        } finally {
          setCurrentSelectedColor(null);
        }
      }
    };

    updateLesson();
  };

  const [showDeleteModal, setShowDeleteModal] = useState({show: false, id: ''});
  const [showEditModal, setShowEditModal] = useState({show: false, id: '', value: ''});
  const currentNote =
    showEditModal.id && find(localNotes, (d) => d.id === showEditModal.id);

  const [currentSelectedColor, setCurrentSelectedColor] = useState(null);

  useEffect(() => {
    if (currentNote.class && !currentSelectedColor) {
      setCurrentSelectedColor(currentNote.class);
    }
  }, [currentNote.class, currentSelectedColor]);

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
            {currentNote && (
              <textarea
                onChange={noop}
                className={`preview-note bg-gradient-to-t text-gray-900 from-${currentSelectedColor}-500 to-${currentSelectedColor}-300 rounded leading-8 p-6`}
                id={'note'}
                value={showEditModal?.value}
              />
            )}

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

            <div className="flex  space-x-4 items-center justify-end">
              <button
                onClick={modalBtns.edit.cancel}
                type="button"
                className="w-auto inline-flex items-center px-2.5 py-1.5 border-0 border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
              <button
                onClick={modalBtns.edit.save}
                type="button"
                className="w-auto inline-flex items-center px-2.5 py-1.5 border-0 border-transparent text-xs font-medium rounded shadow-sm text-white iconoclast:bg-main curate:bg-main  hover:iconoclast:bg-600 hover:curate:bg-600 ">
                Save
              </button>
            </div>
          </div>
        </ThemeModal>
        <div className="relative flex items-start space-x-4">
          <div id="container" className="sticky-container blackboard">
            {localNotes &&
              localNotes.length > 0 &&
              map(localNotes, (note) => (
                <Note
                  setShowEditModal={setShowEditModal}
                  setShowDeleteModal={setShowDeleteModal}
                  key={note.id}
                  note={note}
                />
              ))}
          </div>

          <div className="w-auto space-y-4 flex items-center flex-col justify-center">
            <button
              onClick={onAddNewNote}
              title="Add new note"
              className="w-auto text-red-600 hover:text-red-500 transition-all">
              <FiFilePlus className="h-10 w-10 " />
            </button>
            <button
              title="Save to class notes"
              className="w-auto text-yellow-600 hover:text-yellow-500 transition-all">
              <BiSave className="h-10 w-10 " />
            </button>
          </div>
        </div>
      </>
    );
};

export default React.memo(NotesBlock);
