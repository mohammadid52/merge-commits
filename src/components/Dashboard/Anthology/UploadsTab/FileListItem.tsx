import React, {useCallback, useEffect, useState} from 'react';
import {AiOutlineFile} from 'react-icons/ai';
import {getImageFromS3} from 'utilities/services';

interface IFileListItem {
  fileIdx: number;
  fileName: string;
  fileKey: string;
  fileSize: number;
  deleteFileKey: string;
  handleToggleDelete: (fileKeyToToggle: string) => void;
  handleConfirmDelete: () => void;
  deleting: boolean;
  uploadKey?: string;
}

const FileListItem = ({
  fileIdx,
  fileName,
  fileKey,
  fileSize,
  deleteFileKey,
  handleToggleDelete,
  handleConfirmDelete,
  deleting,
  uploadKey
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
        return `${imageUrl}`;
      } else {
        return '';
      }
    },
    [fileKey]
  );

  useEffect(() => {
    const imageURL = getImageURL(`${uploadKey}${fileKey}`);
    Promise.resolve(imageURL).then((urlStr: string) => setImageUrl(urlStr));
  }, [fileKey]);

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <li
      className={`pr-4 mb-2 border-b-0 border-lightest ${
        fileIdx % 2 === 0 ? 'bg-lightest' : ''
      }`}>
      <div className="flex items-center space-x-4">
        <div className="flex flex-shrink-0 min-w-16 w-16 h-16">
          <span className="flex justify-center items-center rounded border-0 border-light   bg-lightest overflow-hidden">
            {isImage(fileName) ? (
              <img className="w-auto h-full object-cover" src={imageUrl} alt={fileName} />
            ) : (
              <AiOutlineFile className="text-light  p-2" size={'32px'} />
            )}
          </span>
        </div>

        <div className="w-full">
          <p className="text-sm font-medium text-darkest   truncate">
            <span className="text-medium ">Filename: </span>
            {fileName}
          </p>
          <p className="text-sm text-green-500 truncate">
            <span className="text-medium ">Filesize: </span>
            {fileSize} kB
          </p>
        </div>

        <div className="w-auto flex flex-row">
          {fileKey === deleteFileKey ? (
            <>
              <a
                onClick={() => handleToggleDelete(fileKey)}
                className="bg-red-500 cursor-pointer inline-flex items-center shadow-sm px-2.5 py-0.5 border border-lightest  text-sm leading-5 font-medium rounded-full text-white hover:bg-red-400">
                Cancel
              </a>
              <a
                onClick={() => handleConfirmDelete()}
                className="ml-2 bg-green-500 cursor-pointer inline-flex items-center shadow-sm px-2.5 py-0.5 border border-lightest  text-sm leading-5 font-medium rounded-full text-white hover:bg-green-400">
                {!deleting ? 'Confirm' : 'Deleting...'}
              </a>
            </>
          ) : (
            <>
              <a
                onClick={() => handleToggleDelete(fileKey)}
                className=" cursor-pointer inline-flex items-center shadow-sm px-2.5 py-0.5 border border-lightest  text-sm leading-5 font-medium rounded-full text-dark   bg-white hover:bg-lightest">
                Delete
              </a>
              <a
                target="_blank"
                href={imageUrl}
                className="ml-2 cursor-pointer inline-flex items-center shadow-sm px-2.5 py-0.5 border border-lightest  text-sm leading-5 font-medium rounded-full text-dark   bg-white hover:bg-lightest">
                View
              </a>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default React.memo(FileListItem);
