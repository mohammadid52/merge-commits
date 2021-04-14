import React from 'react';

export const StringifyBlock = (props: { id: string; anyObj: any }) => {
  const { id, anyObj } = props;
  return (
    <p id={id} className={`bg-white bg-opacity-20`}>
      {JSON.stringify(anyObj)}
    </p>
  );
};
