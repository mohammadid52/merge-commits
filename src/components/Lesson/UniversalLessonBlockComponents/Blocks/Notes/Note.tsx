import {randomNumber} from '@utilities/functions';
import React, {useEffect, useMemo, useRef, useState} from 'react';

const Note = ({note}: {note: {class?: string; value?: string; id: string}}) => {
  let angle = useMemo(() => randomNumber(-3, 6), []);
  const [_text, setText] = useState(note?.value || '');
  const bgColor = note.class || 'yellow';
  const inputRef = useRef(null);

  return (
    <textarea
      style={{transform: 'rotate(' + angle + 'deg)'}}
      id={note.id}
      // id="sticky-textarea"
      ref={inputRef}
      className={`sticky bg-${bgColor}-500`}
      value={_text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};

export default Note;
