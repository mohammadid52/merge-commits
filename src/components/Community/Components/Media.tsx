import Label from '@components/Atoms/Form/Label';
import File from '@components/Community/File';
import {getAsset} from 'assets';
import React, {useCallback, useRef} from 'react';
import {useDropzone} from 'react-dropzone';
import isEmpty from 'lodash/isEmpty';
import update from 'lodash/update';
import {COMMUNITY_UPLOAD_KEY, IFile} from '@components/Community/constants.community';
import Storage from '@aws-amplify/storage';
import {nanoid} from 'nanoid';
import {Transition} from '@headlessui/react';

const Media = ({
  file,
  setFile,
  setError,
}: {
  file: IFile;
  setFile: React.Dispatch<React.SetStateAction<IFile>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const updateProgress = (file: IFile, progress: IFile['progress']) => {
    update(file, `progress`, () => progress);
    setFile({...file});
  };

  const updateStatus = (file: IFile, _status: IFile['_status']) => {
    update(file, `_status`, () => _status);
    setFile({...file});
  };

  const updateImgId = (file: IFile, fileKey: IFile['fileKey']) => {
    update(file, `fileKey`, () => fileKey);
    setFile({...file});
  };

  const uploadImageToS3 = async (
    file: any,
    id: string,
    type: string,
    currentFile: any
  ) => {
    // Upload file to s3 bucket
    return new Promise((resolve, reject) => {
      Storage.put(`${COMMUNITY_UPLOAD_KEY}${id}`, file, {
        contentType: type,
        ContentEncoding: 'base64',
        progressCallback: ({loaded, total}: any) => {
          const progress = (loaded * 100) / total;

          updateStatus(currentFile, 'progress');

          updateProgress(currentFile, progress.toFixed(0));
        },
      })
        .then((result) => {
          console.log('File successfully uploaded to s3', result);
          updateStatus(currentFile, 'success');
          updateProgress(currentFile, null);
          setError('');
          resolve(true);
        })
        .catch((err) => {
          updateStatus(currentFile, 'failed');
          updateProgress(currentFile, null);
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const uploadNewFiles = async (acceptedFile: any) => {
    const id = nanoid(6);
    const fakeInitProgress = Math.floor(Math.random() * 10) + 1;

    const initState: IFile = {
      _status: 'progress',
      progress: fakeInitProgress.toString(),
      file: acceptedFile,
      fileName: acceptedFile.name,
      id,
    };

    setFile({...initState});
    let temp = initState.file.name.split('.');
    const extension = temp.pop();
    const fileName = `${Date.now()}_${temp
      .join(' ')
      .replace(new RegExp(/[ +!@#$%^&*().]/g), '_')}.${extension}`;
    updateImgId(initState, fileName);
    await uploadImageToS3(initState.file, fileName, initState.file.type, initState);
  };

  const uploadFile = useCallback(
    async (acceptedFile: any) => {
      await uploadNewFiles(acceptedFile);
    },
    [file]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: uploadFile,
  });

  const handleFileSelection = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const inputOther = useRef(null);
  const openFilesExplorer = () => inputOther.current.click();

  const fileIcon = getAsset('general', 'fileImg');

  return (
    <div className="px-3 py-4">
      <Label label="Step 1: Add an image or video" />

      <div>
        <div
          {...getRootProps()}
          className={`border-${
            isDragActive ? 'blue' : 'gray'
          }-400 border-2 transition-all duration-300 flex items-center flex-col justify-center border-dashed rounded-xl h-56`}>
          <input
            {...getInputProps()}
            ref={inputOther}
            onChange={handleFileSelection}
            type="file"
            className="hidden"
          />
          <img src={fileIcon} alt="file-icon" className="w-28 mb-2 h-auto" />
          {isDragActive ? (
            <p className="text-blue-800 text-center font-semibold w-auto tracking-normal">
              Drop the files here
            </p>
          ) : (
            <p className="text-blue-800 text-center font-semibold w-auto tracking-normal">
              Drag 'n' drop your files here, or{' '}
              <span onClick={openFilesExplorer} className="text-blue-500 cursor-pointer">
                browse
              </span>
            </p>
          )}
        </div>
        <Transition
          show={!isEmpty(file)}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="mt-4 flex flex-col  gap-y-6">
          {!isEmpty(file) && (
            <File
              fileKey={file?.fileKey || 'file'}
              file={file.file}
              id={file.id}
              _status={file._status}
              progress={file.progress}
              fileName={file.fileName}
            />
          )}
        </Transition>
      </div>
    </div>
  );
};

export default Media;
