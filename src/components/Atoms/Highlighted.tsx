import escapeRegExp from 'lodash/escapeRegExp';
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
        .map((part) =>
          regex.test(part) ? (
            <mark className="iconoclast:bg-main text-white curate:bg-main" key={part}>
              {part}
            </mark>
          ) : (
            <span key={part}>{part}</span>
          )
        )}
    </span>
  );
};

export default Highlighted;
