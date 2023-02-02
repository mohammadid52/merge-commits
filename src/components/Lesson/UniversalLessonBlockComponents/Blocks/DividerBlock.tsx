import React from 'react';

const DividerBlock = ({value, bgWhite}: {value: any; bgWhite?: boolean}) => {
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-0 border-gray-300" />
      </div>
      <div className="relative flex w-auto justify-center">
        {value && (
          <span
            dangerouslySetInnerHTML={{__html: value}}
            className={`px-2 w-auto text-sm transition-all duration-200  text-gray-400 bg-white ${
              bgWhite ? 'dark:bg-white' : 'dark:bg-dark-gray'
            } `}></span>
        )}
      </div>
    </div>
  );
};

export default DividerBlock;
