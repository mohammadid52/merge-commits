import useScript from '@customHooks/useScript';
import Note from '@UlbBlocks/Notes/Note';
import '@UlbBlocks/Notes/NoteStyles.scss';
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {InertiaPlugin} from 'gsap/InertiaPlugin';
import {map} from 'lodash';
import React from 'react';

const NotesBlock = ({value: notesList}: any) => {
  gsap.registerPlugin(InertiaPlugin, Draggable);
  gsap.ticker.fps(60);

  const status = useScript(
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'
  );
  if (status === 'ready') {
    var $container = $('#container'),
      gridWidth = 240,
      gridHeight = 300,
      gridRows = 2,
      gridColumns = 4,
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
          // border: '1px solid #454545',
          width: gridWidth - 1,
          height: gridHeight - 1,
          top: y,
          left: x,
        })
        .prependTo($container);
    }

    //set the container's size to match the grid, and ensure that the box widths/heights reflect the variables above
    gsap.set($container, {
      height: gridRows * gridHeight + 1,
      width: gridColumns * gridWidth + 1,
    });
    gsap.set('.sticky', {
      width: gridWidth,

      height: gridHeight,
      // lineHeight: gridHeight + 'px',
    });

    notesList.forEach((note: {id: any}, idx: number) => {
      gsap.set(`#${note.id}`, {
        left: gridWidth * idx,
      });
    });

    notesList.forEach((note: {id: any}) => {
      $(`#${note.id}`).on('click', (e) => {
        // $('sticky-textarea').focus();
        e.target.focus();
      });
    });

    //the update() function is what creates the Draggable according to the options selected (snapping).

    Draggable.create('.sticky', {
      bounds: $container,
      edgeResistance: 0.065,
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
  }

  return (
    <div id="container" className="sticky-container">
      {map(notesList, (note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NotesBlock;
