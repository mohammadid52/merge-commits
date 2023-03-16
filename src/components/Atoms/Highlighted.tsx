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
        .map((part, idx) =>
          regex.test(part) ? (
            <mark className="iconoclast:bg-main text-white curate:bg-main" key={idx}>
              {part}
            </mark>
          ) : (
            <span key={idx}>{part}</span>
          )
        )}
    </span>
  );
};

export default Highlighted;
