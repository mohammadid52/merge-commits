import React, {useContext, useState} from 'react';

interface IEmptyViewWrapper {
  children?: React.ReactNode;
  revealContents?: boolean;
}

const EmptyViewWrapper = ({children, revealContents}: IEmptyViewWrapper) => {
  return (
    <div
      className={`${
        !revealContents
          ? 'min-h-48 pb-4 overflow-hidden bg-white rounded-lg shadow mb-4'
          : ''
      }`}>
      <div
        className={`flex flex-center items-center transition duration-500 ease-in-out overflow-hidden ${
          !revealContents ? 'p-12 h-full w-full opacity-100' : 'h-0 opacity-0'
        }`}>
        <p className="text-center text-lg text-gray-500">
          Please select a notebook above to view your data
        </p>
      </div>

      <div
        className={`transition duration-500 ease-in-out overflow-hidden ${
          revealContents ? 'h-auto w-full opacity-100' : 'h-0 opacity-0'
        }`}>
        {children}
      </div>
    </div>
  );
};

export default EmptyViewWrapper;
