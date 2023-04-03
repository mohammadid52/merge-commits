import {getAsset} from 'assets';
import {BiCloudDownload} from 'react-icons/bi';

import {useGlobalContext} from '@contexts/GlobalContext';
import Loader from 'atoms/Loader';
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
  const {clientKey, theme} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const getColor = (theme = 'indigo') => {
    return `hover:bg-${theme}-500 active:bg-${theme}-500 focus:bg-${theme}-500`;
  };
  return attachment.url === 'loading' ? (
    <div
      style={{width: '30rem'}}
      className="h-12 relative p-2 text-medium  border-0 border-lightest  hover:border-light  max-w-7xl min-w-56 rounded-md transition-all cursor-pointer flex justify-between items-center px-4">
      <p className="truncate w-auto">{attachment.filename}</p>
      <Size size={attachment.size} />

      <span className={'flex items-center justify-center h-8 w-8'}>
        <Loader />
      </span>
    </div>
  ) : (
    <div
      style={{width: '30rem'}}
      className="relative h-auto border-0 p-4 border-lightest ">
      <p className="truncate text-left min-w-auto p-2 pt-0 text-medium ">
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
          className={`${
            themeColor === 'iconoclastIndigo' ? getColor('indigo') : getColor('blue')
          } flex items-center justify-center h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white text-medium  text-lg`}>
          <BiCloudDownload />
        </span>
      </div>
    </div>
  );
};

export default AudioMedia;
