import {IFileComponent} from '@components/Community/constants.community';
import React from 'react';

const genStatus = (_status: string) => {
  switch (_status) {
    case 'progress':
      return 'Uploading...';
    case 'success':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'other':
      return '';
    default:
      return 'Failed';
  }
};

const genColor = (_status: string) => {
  switch (_status) {
    case 'progress':
      return 'blue';
    case 'success':
      return 'green';
    case 'failed':
      return 'red';
    case 'other':
      return 'gray';
    default:
      return 'red';
  }
};

const File = ({
  _status,
  progress,
  fileName,

  file,
}: IFileComponent) => {
  return (
    <div
      className={` px-6 py-4 border-2 border-${genColor(_status)}-200 bg-${genColor(
        _status
      )}-100 rounded-lg`}>
      <div className="flex items-center justify-between">
        <div className="w-auto flex flex-col items-start">
          <div className="text-blue-800 flex items-center font-semibold text-sm w-auto tracking-wide">
            <p className="w-auto">
              {_status === 'success' || _status === 'other'
                ? !fileName
                  ? file.name
                  : fileName
                : genStatus(_status)}
            </p>{' '}
          </div>
          {_status === 'progress' && progress && (
            <span
              className={`text-${genColor(
                _status
              )}-400 font-medium text-xs w-auto tracking-normal`}>
              {progress}%
            </span>
          )}
        </div>
      </div>

      <div className="transition-all duration-300">
        {_status === 'progress' && progress && (
          <div className="overflow-hidden w-auto h-1 mt-2 text-xs flex rounded bg-transparent">
            <div
              style={{width: `${progress}%`}}
              className="shadow-none bg-gradient-to-r from-blue-300 to-blue-500 flex transition-all duration-500 rounded-r-full flex-col text-center whitespace-nowrap text-white justify-center"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default File;
