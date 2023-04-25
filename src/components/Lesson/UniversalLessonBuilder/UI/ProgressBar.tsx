import React from 'react';

const ProgressBar = ({
  progress,
  status = 'Task in progress',
}: {
  progress: string | number;
  status?: string;
}) => {
  return (
    <div className="relative pt-1 mt-4">
      <div className="flex mb-2 items-center justify-between">
        <div className="w-auto">
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
            {status}
          </span>
        </div>
        <div className="text-right w-auto">
          <span className="text-xs font-semibold inline-block text-indigo-600">
            {progress}%
          </span>
        </div>
      </div>
      <div className="overflow-hidden w-auto h-2 mb-4 text-xs flex rounded bg-indigo-200">
        <div
          style={{width: `${progress}%`}}
          className="shadow-none flex transition-all duration-500 rounded-r-full flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
