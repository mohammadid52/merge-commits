import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import ThemeModal from '@components/Molecules/ThemeModal';
import {setState} from '@interfaces/index';
import {forEach} from 'lodash';
import React, {useState} from 'react';
import {CgNotes} from 'react-icons/cg';

const NotesFab = ({
  showNotesModal,
  setShowNotesModal,
  notes,
  darkMode,
  pageTitle,
}: {
  showNotesModal: boolean;
  setShowNotesModal: setState['boolean'];
  notes: any[];
  darkMode?: boolean;
  pageTitle?: string;
}) => {
  const mapNotesTogether = () => {
    let res: any[] = [];
    forEach(notes, (d) => {
      if (d.partContent && d.partContent.length > 0) {
        forEach(d.partContent, (_d) => {
          if (_d.value && _d.value.length > 0) {
            forEach(_d.value, (f) => {
              res.push(f);
            });
          }
        });
      }
    });
    return res;
  };

  const allNotes = mapNotesTogether();

  return (
    <div className="flex items-center justify-center overflow-hidden">
      {showNotesModal && allNotes.length > 0 && (
        <ThemeModal
          dark={darkMode}
          header={`${pageTitle} - Notes`}
          open={showNotesModal}
          setOpen={setShowNotesModal}>
          <div className="p-4">
            {/* <div
              className="h-12 mb-6 dark:border-gray-700 border-0 border-gray-200 rounded-lg"
              id="note-action-container"></div> */}
            <NotesBlock grid={{cols: 3, rows: 3}} value={allNotes} />
          </div>
        </ThemeModal>
      )}

      <div
        title={`All notes ${allNotes.length > 0 ? `(${allNotes.length})` : ''}`}
        onClick={() => setShowNotesModal(!showNotesModal)}
        className="flex items-center relative justify-center h-12 w-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full cursor-pointer iconoclast:bg-500 curate:bg-500">
        <CgNotes className="text-lg lg:text-xl text-white" />
      </div>
    </div>
  );
};

export default NotesFab;
