import React from 'react';

interface ICommonActionBtns {
  button1Label?: string;
  button2Label?: string;
  button1Action?: () => void;
  button2Action?: () => void;
  isDeletable?: boolean;
}

const CommonActionsBtns = ({
  button1Label = 'Edit',
  button2Label = 'Delete',
  button1Action,
  button2Action,
  isDeletable = true
}: ICommonActionBtns) => {
  return (
    <div className="flex items-center w-auto gap-x-4">
      {button1Action && (
        <div
          onClick={button1Action}
          className="w-auto theme-text cursor-pointer hover:underline hover:theme-text:500">
          {button1Label}
        </div>
      )}
      {button2Action && (
        <div
          onClick={button2Action}
          className={` ${
            isDeletable
              ? 'text-red-500 cursor-pointer hover:text-red-600 hover:underline pointer-events-all'
              : 'cursor-not-allowed text-red-300 pointer-events-none'
          } w-auto`}>
          {button2Label}
        </div>
      )}
    </div>
  );
};

export default CommonActionsBtns;
