import {escapeRegExp} from 'lodash';
import React from 'react';

const Highlighted = ({text = '', highlight = ''}) => {
  if (!highlight?.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text?.split(regex);
  return (
    <span>
      {parts
        .filter((part) => part)
        .map((part, i) =>
          regex.test(part) ? (
            <mark className="iconoclast:bg-main text-white curate:bg-main" key={i}>
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </span>
  );
};

export default Highlighted;
