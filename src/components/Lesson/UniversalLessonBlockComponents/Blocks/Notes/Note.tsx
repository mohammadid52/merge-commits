import {randomNumber} from '@utilities/functions';
import React, {useMemo, useState} from 'react';
import noop from 'lodash/noop';
interface INoteBlock {
  onChange: (e: any) => void;
  getValue?: (domID: string) => string;
  disabled?: boolean;
  note: {class?: string; value?: string; id: string};
  isStudent?: boolean;
  isInLesson?: boolean;
}

const Note = ({
  note,
  onChange,
  disabled,
  getValue,
  isInLesson,
  isStudent,
}: INoteBlock) => {
  let angle = useMemo(() => randomNumber(-3, 3), []);

  const bgColor = note.class || 'yellow';

  return (
    <textarea
      // disabled={disabled}
      style={{transform: 'rotate(' + angle + 'deg)'}}
      id={note.id}
      className={`_sticky bg-gradient-to-t text-gray-900 from-${bgColor}-500 to-${bgColor}-300 rounded leading-8 p-6`}
      onChange={isInLesson && isStudent ? (e) => onChange(e) : noop}
      value={isInLesson ? getValue(note.id) : note.value}
    />
  );
};

export default Note;
