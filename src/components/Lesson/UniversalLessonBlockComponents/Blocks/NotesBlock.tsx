import '@UlbBlocks/styles/NoteStyles.scss';
import {map} from 'lodash';
import React from 'react';

const NotesBlock = ({value: notesList}: any) => {
  return (
    <div className="sticky-container">
      {map(notesList, (note) => {
        const bgColor = note.class || 'yellow';
        return (
          <textarea
            value={note?.value}
            key={note.id}
            className={`sticky bg-${bgColor}-500 `}
          />
        );
      })}
    </div>
  );
};

export default NotesBlock;
