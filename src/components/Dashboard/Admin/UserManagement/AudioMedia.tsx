import React from 'react';
import {BiCloudDownload} from 'react-icons/bi';

import Loader from '../../../Atoms/Loader';
import Size from './Size';

const downloadFile = (uri: string, name: string, isAudio: boolean) => {
  const a = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);

  // Set the HREF to a Blob representation of the data to be downloaded
  a.href = uri;
  if (isAudio) {
    a.setAttribute('target', '_blank');
  }
  // Use download attribute to set set desired file name
  a.setAttribute('download', name);

  // Trigger the download by simulating click
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
};

const AudioMedia = ({attachment, type}: any) => {
  return attachment.url === 'loading' ? (
    <div
      style={{width: '30rem'}}
      className="h-12 relative p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
      <p className="truncate w-auto">{attachment.filename}</p>
      <Size size={attachment.size} />

      <span className={'flex items-center justify-center h-8 w-8'}>
        <Loader color="#6366F1" />
      </span>
    </div>
  ) : (
    <div style={{width: '30rem'}} className="h-auto border-0 p-4 border-gray-300">
      <p className="truncate text-left min-w-auto p-2 pt-0 text-gray-500">
        {attachment.filename}
      </p>
      <Size size={attachment.size} />

      <div className="flex items-center justify-center">
        <audio controls className="mr-2 rounded-lg">
          <source type={type} src={attachment.url} />
          Your browser does not support the video tag.
        </audio>
        <span
          onClick={() => {
            downloadFile(
              attachment.url,
              attachment.filename.replace(/\.[^/.]+$/, ''),
              attachment.type.includes('audio')
            );
          }}
          className={
            'flex items-center justify-center h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white hover:bg-indigo-400 text-gray-500 text-lg'
          }>
          <BiCloudDownload />
        </span>
      </div>
    </div>
  );
};

export default AudioMedia;
