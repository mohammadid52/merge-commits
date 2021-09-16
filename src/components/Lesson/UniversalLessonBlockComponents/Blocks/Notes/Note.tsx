import {randomNumber} from '@utilities/functions';
import React, {useMemo, useState} from 'react';

const Note = ({note}: {note: {class?: string; value?: string; id: string}}) => {
  let angle = useMemo(() => randomNumber(-3, 3), []);
  const [_text, setText] = useState(note?.value || '');
  const bgColor = note.class || 'yellow';

  return (
    <textarea
      style={{transform: 'rotate(' + angle + 'deg)'}}
      id={note.id}
      // id="sticky-textarea"

      className={`_sticky bg-gradient-to-t text-gray-900 from-${bgColor}-500 to-${bgColor}-300 rounded leading-8 p-6`}
      value={_text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};

export default Note;
