import Loader from '@atoms/Loader';
import {GlobalContext} from '@contexts/GlobalContext';
import useScript from '@customHooks/useScript';
import Note from '@UlbBlocks/Notes/Note';
import '@UlbBlocks/Notes/NoteStyles.scss';
import {wait} from '@utilities/functions';
import gsap from 'gsap';
import {Draggable} from 'gsap/Draggable';
import {InertiaPlugin} from 'gsap/InertiaPlugin';
import {map} from 'lodash';
import React, {useContext, useState} from 'react';

interface INoteBlock {
  onChange: (e: any) => void;
  getValue?: (domID: string) => string;
  disabled?: boolean;
  value: {class?: string; value?: string; id: string}[];
  isStudent?: boolean;
  isInLesson?: boolean;
}

const NotesBlock = ({
  value: notesList,

  getValue,
  disabled,
  isInLesson,
  isStudent,
}: INoteBlock) => {
  gsap.registerPlugin(InertiaPlugin, Draggable);
  gsap.ticker.fps(60);
  const [loading, setLoading] = useState(true);

  const {lessonState, lessonDispatch} = useContext(GlobalContext);

  const status = useScript(
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'
  );

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

  const onChange = (e: any) => {
    const {id, value} = e.target;
    if (isInLesson) {
      handleUpdateStudentData(id, [value]);
    }
  };

  if (status === 'ready') {
    wait(200).then(() => {
      setLoading(false);
      var $container = $('#container'),
        gridWidth = 250,
        gridHeight = 250,
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
            width: gridWidth - 1,
            height: gridHeight - 1,
            top: y,
            left: x,
          })
          .prependTo($container);
      }

      //set the container's size to match the grid, and ensure that the box widths/heights reflect the variables above
      // gsap.set($container, {
      //   height: gridRows * gridHeight + 1,
      //   width: gridColumns * gridWidth + 1,
      // });
      gsap.set('._sticky', {
        width: gridWidth,

        height: gridHeight,
      });

      if (jQuery.ready) {
        notesList.forEach((note: {id: any}) => {
          $(`#${note.id}`).on('click', (e) => {
            e.target.focus();
          });
        });
      }
      Draggable.create('._sticky', {
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
    });
  }

  if (loading) {
    return (
      <div className="flex items-center overflow-hidden justify-center min-h-32">
        <Loader withText="Loading Notes..." className="text-gray-500 flex-col text-lg" />
      </div>
    );
  } else
    return (
      <div id="container" className="sticky-container blackboard">
        {notesList &&
          notesList.length > 0 &&
          map(notesList, (note) => (
            <Note
              onChange={onChange}
              getValue={getValue}
              disabled={disabled}
              isInLesson={isInLesson}
              isStudent={isStudent}
              key={note.id}
              note={note}
            />
          ))}
      </div>
    );
};

export default NotesBlock;
