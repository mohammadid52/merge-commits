import React, {useContext} from 'react';
import {BiCloudDownload} from 'react-icons/bi';
import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
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

const OtherMedia = ({attachment}: any) => {
  const {clientKey, theme} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const getColor = (theme = 'indigo') => {
    return `hover:bg-${theme}-500 active:bg-${theme}-500 focus:bg-${theme}-500`;
  };
  return attachment.url === 'loading' ? (
    <div className="h-12 w-80 p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
      <p className="truncate w-auto">{attachment.filename}</p>
      <span className={'flex items-center justify-center h-8 w-8'}>
        <Loader color={theme.iconColor[themeColor]} />
      </span>
    </div>
  ) : (
    <div className="relative h-12 w-80 p-2 text-gray-500 border-0 border-gray-300 hover:border-gray-400 max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
      <Size size={attachment.size} />
      <p className="truncate w-auto">{attachment.filename}</p>
      <span
        onClick={() => {
          downloadFile(
            attachment.url,
            attachment.filename.replace(/\.[^/.]+$/, ''),
            attachment.type.includes('audio')
          );
        }}
        className={`${
          themeColor === 'iconoclastIndigo' ? getColor('indigo') : getColor('blue')
        } flex items-center justify-center h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white text-gray-500 text-lg`}>
        <BiCloudDownload />
      </span>
    </div>
  );
};

export default OtherMedia;
