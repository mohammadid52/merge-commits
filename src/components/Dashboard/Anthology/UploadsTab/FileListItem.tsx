import React, {useCallback, useEffect, useState} from 'react';
import {IconContext} from 'react-icons';
import {AiOutlineFile} from 'react-icons/ai';
import {getImageFromS3} from '../../../../utilities/services';

interface IFileListItem {
  fileIdx: number;
  fileName: string;
  fileKey: string;
  deleteFileKey: string;
  handleToggleDelete: (fileKeyToToggle: string) => void;
  handleConfirmDelete: () => void;
}

const FileListItem = ({
  fileIdx,
  fileName,
  fileKey,
  deleteFileKey,
  handleToggleDelete,
  handleConfirmDelete,
}: IFileListItem) => {
  // ##################################################################### //
  // ######################## HANDLE IMAGE LOADING ####################### //
  // ##################################################################### //

  const [imageUrl, setImageUrl] = useState<string>('');

  const isImage = (filenameStr: string) => {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filenameStr);
  };

  const getImageURL = useCallback(
    async (uniqKey: string) => {
      const imageUrl: any = await getImageFromS3(uniqKey);
      if (imageUrl) {
        return imageUrl;
      } else {
        return '';
      }
    },
    [fileKey]
  );

  useEffect(() => {
    const imageURL = getImageURL(fileKey);
    Promise.resolve(imageURL).then((urlStr: string) => setImageUrl(urlStr));
  }, [fileKey]);

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <li
      className={`pr-4 mb-2 border-b-0 border-gray-200 ${
        fileIdx % 2 === 0 ? 'bg-gray-50' : ''
      }`}>
      <div className="flex items-center space-x-4">
        <div className="p-2 flex flex-shrink-0 min-w-16 w-16 h-16">
          <span className="rounded-full shadow  bg-gray-400 overflow-hidden">
            {isImage(fileName) ? (
              <img src={imageUrl} alt={fileName} />
            ) : (
              <IconContext.Provider value={{size: '48px', color: 'darkgrey'}}>
                <AiOutlineFile />
              </IconContext.Provider>
            )}
          </span>
        </div>
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
          <p className="text-sm text-gray-500 truncate">{fileName}</p>
        </div>
        <div className="w-auto mx-2">
          {fileKey === deleteFileKey ? (
            <>
              <a
                onClick={() => handleToggleDelete(fileKey)}
                className="cursor-pointer inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </a>
              <a
                onClick={() => handleConfirmDelete()}
                className="cursor-pointer inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                Confirm
              </a>
            </>
          ) : (
            <a
              onClick={() => handleToggleDelete(fileKey)}
              className="cursor-pointer inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
              Delete
            </a>
          )}
        </div>
        <div className="w-auto">
          <a className="cursor-pointer inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
            View
          </a>
        </div>
      </div>
    </li>
  );
};

export default React.memo(FileListItem);
