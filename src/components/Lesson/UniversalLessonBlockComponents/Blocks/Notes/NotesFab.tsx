import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import ThemeModal from '@components/Molecules/ThemeModal';
import {setState} from '@interfaces/index';
import {UniversalLesson} from '@interfaces/UniversalLessonInterfaces';
import forEach from 'lodash/forEach';
import React from 'react';
import {CgNotes} from 'react-icons/cg';

const NotesFab = ({
  showNotesModal,
  setShowNotesModal,
  notes,
  darkMode,
  currentLesson,
  pageTitle,
}: {
  showNotesModal: boolean;
  setShowNotesModal: setState['boolean'];
  notes: any[];
  darkMode?: boolean;
  pageTitle?: string;
  currentLesson?: UniversalLesson;
}) => {
  const mapNotesTogether = () => {
    let res: any[] = [];
    forEach(notes, (d) => {
      if (d.partContent && d.partContent.length > 0) {
        forEach(d.partContent, (_d) => {
          if (_d.value && _d.value.length > 0) {
            forEach(_d.value, (f) => {
              res.push({...f, pagePartId: d.id, partContentId: _d.id});
            });
          }
        });
      }
    });
    return res;
  };

  const allNotes = mapNotesTogether();

  return (
    <div className="flex relative items-center justify-center overflow-hidden">
      {allNotes.length > 0 && (
        <ThemeModal
          dark={darkMode}
          overflowClass={'overflow-hidden'}
          header={`${pageTitle} - Notes`}
          open={showNotesModal}
          setOpen={setShowNotesModal}>
          <div className="p-4 relative 4">
            <NotesBlock
              showNotesModal={showNotesModal}
              grid={{cols: 3, rows: 3}}
              value={allNotes}
            />
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
