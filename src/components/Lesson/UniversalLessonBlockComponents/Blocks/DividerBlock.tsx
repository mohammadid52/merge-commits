import React from 'react';

const DividerBlock = ({value}: {value: string}) => {
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-0 border-gray-300" />
      </div>
      <div className="relative flex w-auto justify-center">
        {value && (
          <span className="px-2 bg-dark-gray w-auto text-sm  text-gray-400">{value}</span>
        )}
      </div>
    </div>
  );
};

export default DividerBlock;
