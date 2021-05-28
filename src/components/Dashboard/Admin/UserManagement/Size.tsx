import React from 'react';

const getSizeInBytes = (size: number) => {
  const inKB = size / 1024;
  const inMB = inKB / 1024;
  if (inMB < 1) {
    return `${inKB.toFixed(2)} KB`;
  } else {
    return `${inMB.toFixed(2)} MB`;
  }
};

const Size = ({size}: {size: number}) => {
  return (
    <span
      style={{
        bottom: '0rem',
        fontSize: '0.65rem',
        right: '-3.5rem',
      }}
      className="absolute size-stamp w-auto text-gray-500">
      {getSizeInBytes(size)}
    </span>
  );
};

export default Size;
