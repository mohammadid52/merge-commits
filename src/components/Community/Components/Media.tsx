import useAuth from '@customHooks/useAuth';
import {logError, uploadImageToS3} from 'graphql-functions/functions';
import {Transition} from '@headlessui/react';
import {getAsset} from 'assets';
import FormInput from 'atoms/Form/FormInput';
import Label from 'atoms/Form/Label';
import {COMMUNITY_UPLOAD_KEY, IFile} from 'components/Community/constants.community';
import File from 'components/Community/File';
import {REGEX} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import isEmpty from 'lodash/isEmpty';
import update from 'lodash/update';
import {nanoid} from 'nanoid';
import React, {useCallback, useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';

interface MediaProps {
  file?: IFile;
  videoLink?: string;
  initialImage?: string;
  setFile?: React.Dispatch<React.SetStateAction<IFile>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setVideoLink?: React.Dispatch<React.SetStateAction<string>>;
}

const Media = ({
  file,
  setFile,
  setError,
  initialImage = '',
  videoLink,
  setVideoLink
}: MediaProps) => {
  const updateProgress = (file: IFile, progress: IFile['progress']) => {
    update(file, `progress`, () => progress);
    setFile?.({...file});
  };

  const updateStatus = (file: IFile, _status: IFile['_status']) => {
    update(file, `_status`, () => _status);
    setFile?.({...file});
  };

  const updateImgId = (file: IFile, fileKey: IFile['fileKey']) => {
    update(file, `fileKey`, () => fileKey);
    setFile?.({...file});
  };

  const {authId, email} = useAuth();

  const _uploadImageToS3 = async (
    file: any,
    id: string,
    type: string,
    currentFile: any
  ) => {
    uploadImageToS3(file, `${COMMUNITY_UPLOAD_KEY}${id}`, type, {
      auth: {authId, email},
      onSuccess: (result: any) => {
        console.log('File successfully uploaded to s3', result);
        updateStatus(currentFile, 'success');
        updateProgress(currentFile, null);
        setError('');
      },

      onError: (error: any) => {
        updateStatus(currentFile, 'failed');
        updateProgress(currentFile, null);
        logError(error, {authId: authId, email: email}, 'Media');
        console.error('Error in uploading file to s3', error);
      },
      progressCallback: ({progress}: {progress: number}): void => {
        if (progress) {
          updateStatus(currentFile, 'progress');

          updateProgress(currentFile, progress?.toFixed(0));
        }
      }
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
      id
    };

    setFile?.({...initState});
    let temp = initState?.file?.name?.split('.');
    const extension = temp.pop();
    const fileName = `${Date.now()}_${temp
      .join(' ')
      .replace(new RegExp(/[ +!@#$%^&*().]/g), '_')}.${extension}`;
    updateImgId(initState, fileName);
    await _uploadImageToS3(initState.file, fileName, initState.file.type, initState);
  };

  const uploadFile = useCallback(
    async (acceptedFile: any) => {
      await uploadNewFiles(acceptedFile);
    },
    [file]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: uploadFile,
    // @ts-ignore
    accept: 'image/x-png,image/gif,image/jpeg'
  });

  const handleFileSelection = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const inputOther = useRef<any>(null);
  const openFilesExplorer = () => inputOther.current.click();

  const fileIcon = getAsset('general', 'fileImg');

  const [errors, setErrors] = useState({videoLink: ''});
  const uploadedVideoLink: boolean =
    !isEmpty(file) && (file._status === 'success' || file._status === 'progress');

  const onVideoLinkChange = (e: any): void => {
    const {value = ''} = e.target;
    setVideoLink?.(value);
    const isValidUrl = REGEX.Youtube.test(value);
    if (isValidUrl) {
      setErrors({...errors, videoLink: ''});
    } else {
      setErrors({...errors, videoLink: 'Invalid url'});
    }
  };

  const isUploadedFromPC = Boolean(uploadedVideoLink);

  return (
    <div className="px-3 py-4">
      <Label label="Step 1: Add an image or video" />

      <div>
        <div
          {...getRootProps()}
          className={`border-${
            isDragActive ? 'blue' : 'gray'
          }-400 border-2 relative transition-all duration-300 flex items-center flex-col justify-center border-dashed rounded-xl h-56`}>
          <input
            {...getInputProps()}
            ref={inputOther}
            onChange={handleFileSelection}
            type="file"
            className="hidden"
          />

          {initialImage && (
            <img
              src={initialImage}
              alt=""
              className="w-32 h-auto rounded-md absolute top-1 left-1"
            />
          )}

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

      <p className="text-center text-medium  mt-2"> --- or --- </p>

      <Label label="Upload Youtube/Vimeo link" />
      <FormInput
        dataCy="spotlight-link-input"
        placeHolder="eg. https://www.youtube.com/watch?v=MiebCHmiszs"
        value={videoLink}
        disabled={isUploadedFromPC}
        onChange={onVideoLinkChange}
        id="videoLink"
        error={errors.videoLink}
      />
    </div>
  );
};

export default Media;
