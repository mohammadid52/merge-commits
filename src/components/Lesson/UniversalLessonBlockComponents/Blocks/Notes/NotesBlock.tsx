import Loader from '@atoms/Loader';
import useScript from '@customHooks/useScript';
import {setState} from '@interfaces/index';
import Note from '@UlbBlocks/Notes/Note';
import '@UlbBlocks/Notes/NoteStyles.scss';
import {wait} from '@utilities/functions';
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {InertiaPlugin} from 'gsap/InertiaPlugin';
import {map, remove} from 'lodash';
import React, {memo, useState} from 'react';

interface INoteBlock {
  disabled?: boolean;
  grid?: {cols: number; rows: number};
  value: {class?: string; value?: string; id: string}[];
}

const NotesBlock = ({
  value: notesList,
  grid: {cols = 4, rows = 2},

  disabled,
}: INoteBlock) => {
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
        gridRows = rows,
        gridColumns = cols,
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
            return true ? Math.round(endValue / gridWidth) * gridWidth : endValue;
          },
          y: function (endValue) {
            return true ? Math.round(endValue / gridHeight) * gridHeight : endValue;
          },
        },
      });
    });
  }

  const [localNotes, setLocalNotes] = useState([...notesList]);

  const onNoteDelete = (noteId: string) => {
    remove(localNotes, (note) => note.id === noteId);
    setLocalNotes([...localNotes]);
  };

  if (loading) {
    return (
      <div className="flex items-center overflow-hidden justify-center min-h-32">
        <Loader withText="Loading Notes..." className="text-gray-500 flex-col text-lg" />
      </div>
    );
  } else
    return (
      <div id="container" className="sticky-container blackboard">
        {localNotes &&
          localNotes.length > 0 &&
          map(localNotes, (note) => (
            <Note onNoteDelete={onNoteDelete} key={note.id} note={note} />
          ))}
      </div>
    );
};

export default memo(NotesBlock);
