import FormInput from '@atoms/Form/FormInput';
import Storage from '@aws-amplify/storage';
import Buttons from '@components/Atoms/Buttons';
import RichTextEditor from '@components/Atoms/RichTextEditor';
import {IFile} from '@components/Community/constants.community';
import File from '@components/Community/File';
import {Transition} from '@headlessui/react';
import {UPLOAD_KEYS} from '@lesson/constants';
import {getAsset} from 'assets';
import update from 'lodash/update';
import isEmpty from 'lodash/isEmpty';
import {nanoid} from 'nanoid';
import React, {useCallback, useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const UPLOAD_KEY = UPLOAD_KEYS.COMMUNITY;

const Announcements = ({onCancel, onSubmit}: {onCancel: () => void; onSubmit: any}) => {
  const [file, setFile] = useState<IFile>();
  const [overlayText, setOverlayText] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [fields, setFields] = useState<{description: string; descriptionHtml: string}>({
    description: '',
    descriptionHtml: '',
  });

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setUnsavedChanges(true);
    setFields({...fields, [field]: text, [fieldHtml]: html});
  };

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
      Storage.put(`${UPLOAD_KEY}${id}`, file, {
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
    async (acceptedFile) => {
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

  const _onSubmit = () => {
    const spotlightDetails = {
      media: file.fileKey,
      note: fields.description,
    };
    onSubmit(spotlightDetails);
    onCancel();
  };

  return (
    <div className="min-w-256 max-w-256">
      <div className="px-3 py-4">
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Step 1: Add an image or video
        </label>

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
                <span
                  onClick={openFilesExplorer}
                  className="text-blue-500 cursor-pointer">
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
      <div className="px-3 py-4">
        <div>
          <FormInput
            label="Step 2: Add overlay text"
            onChange={(e) => setOverlayText(e.target.value)}
            value={overlayText}
          />
        </div>
      </div>
      <div className="px-3 py-4">
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Step 3: Add a description
        </label>
        <div>
          <RichTextEditor
            placeholder={
              'Why do you want people in the community to know about what is happening'
            }
            withStyles
            initialValue={fields.description}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(
                htmlContent,
                plainText,
                'descriptionHtml',
                'description'
              )
            }
          />

          <div className="text-right text-gray-400">
            {fields.description.length} of 750
          </div>
        </div>
      </div>

      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={'Cancel'}
            onClick={onCancel}
            transparent
          />
          <Buttons btnClass="py-1 px-8 text-xs ml-2" label={'Save'} onClick={_onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Announcements;
