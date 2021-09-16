import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import {Transition} from '@headlessui/react';
import {removeExtension} from '@utilities/functions';
import {getImageFromS3Static} from '@utilities/services';
import {findIndex, map, noop, reject, remove, update} from 'lodash';
import {nanoid} from 'nanoid';
import React, {useCallback, useContext, useRef, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {useDropzone} from 'react-dropzone';
import {AiOutlineEyeInvisible} from 'react-icons/ai';
import {BiImageAdd} from 'react-icons/bi';
import {useRouteMatch} from 'react-router';
import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useInLessonCheck from '../../../../../customHooks/checkIfInLesson';
import {useQuery} from '../../../../../customHooks/urlParam';
import * as mutations from '../../../../../graphql/mutations';
import {getLocalStorageData} from '../../../../../utilities/localStorage';
import Modal from '../../../../Atoms/Modal';
import {UPLOAD_KEYS} from '../../../constants';
import {FormControlProps} from '../FormBlock';
import {EditQuestionModalDict} from '@dictionary/dictionary.iconoclast';
import Buttons from '@components/Atoms/Buttons';

interface IFile {
  _status: 'progress' | 'failed' | 'success' | 'other';
  progress: number | string | null;
  file: File;
  id?: string;
  fileKey?: string;
  fileName?: string;
}

const btnClass = (color: string) =>
  `cursor-pointer transition-all border-transparent border-2 hover:border-${color}-300 rounded-full p-1 flex items-center h-6 w-6 justify-center bg-${color}-200`;

interface IFileComponent extends IFile {
  deleteImage: (imgId: string) => void;
  UPLOAD_KEY?: string;
  updateFilename: (id: string, filename: string) => void;
}

const File = ({
  _status,
  progress,
  fileName,
  deleteImage,
  fileKey,
  file,
  updateFilename,
  id,
  UPLOAD_KEY,
}: IFileComponent) => {
  const genStatus = () => {
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

  const [showMenu, setShowMenu] = useState(false);
  const getSizeInBytes = (size: number) => {
    const inKB = size / 1024;
    const inMB = inKB / 1024;
    if (inMB < 1) {
      return `${inKB.toFixed(2)} KB`;
    } else {
      return `${inMB.toFixed(2)} MB`;
    }
  };

  // const getFile = async () => await getImageFromS3(imgId);

  const imageUrl = file
    ? URL.createObjectURL(file)
    : getImageFromS3Static(`${UPLOAD_KEY}${fileKey}`);

  const onImageClick = (e: any) => {
    e.stopPropagation();
    window.open(imageUrl, '_blank');
  };

  const genColor = () => {
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

  const Btn = ({
    label,
    onClick,
    color = 'green',
  }: {
    label: string;
    color?: string;
    onClick?: () => void;
  }) => (
    <span
      onClick={onClick}
      className={`inline-flex w-auto border-2 items-center px-2 py-0.5 rounded text-xs font-medium border-${color}-200 ml-2 hover:border-${color}-300 cursor-pointer transition-all text-${color}-800`}>
      {label}
    </span>
  );

  const [_fileName, setFileName] = useState(removeExtension(fileName) || '');
  const [editingFilename, setEditingFilename] = useState(false);

  const onFileNameSave = () => {
    updateFilename(id, removeExtension(_fileName));
    setEditingFilename(false);
  };

  return (
    <div
      className={` px-6 py-4 border-2 border-${genColor()}-200 bg-${genColor()}-100 rounded-lg`}>
      <div className="flex items-center justify-between">
        <div className="w-auto flex flex-col items-start">
          <div className="text-blue-800 flex items-center font-semibold text-sm w-auto tracking-wide">
            <p className="w-auto">
              {_status === 'success' || _status === 'other'
                ? !fileName
                  ? file.name
                  : fileName
                : genStatus()}
            </p>{' '}
            {(_status === 'success' || _status === 'other') && !editingFilename && (
              <Btn
                onClick={() => setEditingFilename(true)}
                label={_fileName ? 'Change file label' : 'Add file label'}
              />
            )}
            {(_status === 'success' || _status === 'other') && editingFilename && (
              <div className="ml-2 w-auto flex items-center space-x-2">
                <input
                  className={`w-auto px-2 py-0.5 border-2 bg-transparent text-${
                    _status === 'other' ? 'gray' : 'green'
                  }-800 border-${
                    _status === 'other' ? 'gray' : 'green'
                  }-200 focus:border-${
                    _status === 'other' ? 'gray' : 'green'
                  }-300 rounded`}
                  value={_fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder={'file name'}
                />
                <Btn onClick={onFileNameSave} label={'save'} />
                <Btn
                  color="red"
                  onClick={() => {
                    setFileName(fileName);
                    setEditingFilename(false);
                  }}
                  label={'Cancel'}
                />
              </div>
            )}
          </div>
          {_status === 'progress' && progress && (
            <span
              className={`text-${genColor()}-400 font-medium text-xs w-auto tracking-normal`}>
              {progress}%
            </span>
          )}
        </div>
        {(_status === 'success' || _status === 'other') && (
          <div className="flex items-center gap-x-6 w-auto">
            {/* <div onClick={() => deleteImage(fileKey)} className={btnClass('red')}>
              <IoClose className="text-red-500" />
            </div> */}
            <ClickAwayListener onClickAway={() => setShowMenu(false)}>
              <div
                onClick={() => setShowMenu(!showMenu)}
                className={`relative ${btnClass('gray')}`}>
                <AiOutlineEyeInvisible className="text-gray-500" />
                <Transition
                  style={{bottom: '1.5rem'}}
                  className="w-auto bg-white cursor-pointer select-none rounded-xl customShadow absolute right-1 border-0 border-gray-200 min-h-32 min-w-140 p-4"
                  show={showMenu}>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">File preview</dt>
                      <img
                        onClick={onImageClick}
                        src={imageUrl}
                        className="mt-1 rounded-md customShadow h-16 w-16"
                        alt={file?.name}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">File name</dt>
                      <dd className="mt-1 text-sm break-all text-gray-700 font-medium">
                        {removeExtension(_fileName)}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Size</dt>
                      <dd className="mt-1 flex items-center justify-between  text-sm text-gray-700 font-medium">
                        <p className="w-auto">{getSizeInBytes(file?.size)}</p>
                        <div
                          onClick={() => deleteImage(fileKey)}
                          className="w-auto text-red-500 hover:text-red-800">
                          delete
                        </div>
                      </dd>
                    </div>
                  </dl>
                </Transition>
              </div>
            </ClickAwayListener>
          </div>
        )}
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

const AttachmentBlock = ({
  inputID,
  label,
  value,
  numbered,
  index,
  required,
  id,
}: FormControlProps) => {
  const {
    lessonState,
    userLanguage,
    state: {
      user,
      lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {},
    },
  } = useContext(GlobalContext);

  const lessonType = lessonState?.lessonData?.type;

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();
  const inputOther = useRef(null);

  const openFilesExplorer = () => inputOther.current.click();
  // For Attachments - 31

  const fileIcon = getAsset('general', 'file');

  const match: any = useRouteMatch();

  const deletImageFromS3 = (key: string) => {
    // Remove image from bucket
    return new Promise((resolve, reject) => {
      Storage.remove(key)
        .then((result) => {
          console.log('deleted: ', key);
          resolve(result);
        })
        .catch((err) => {
          console.error(err.message);

          reject(err);
        });
    });
  };

  const updateProgress = (file: IFile, progress: IFile['progress']) => {
    const idx = getId(file);
    update(filesUploading[idx], `progress`, () => progress);
    setFilesUploading([...filesUploading]);
  };

  const updateStatus = (file: IFile, _status: IFile['_status']) => {
    const idx = getId(file);
    update(filesUploading[idx], `_status`, () => _status);
    setFilesUploading([...filesUploading]);
  };

  const deleteImage = (fileKey: string) => {
    remove(filesUploading, (f) => f.fileKey === fileKey);
    setFilesUploading([...filesUploading]);
    deletImageFromS3(`${UPLOAD_KEY}${fileKey}`);
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
          updateStatus(currentFile, 'success');
          updateProgress(currentFile, null);

          console.log('File successfully uploaded to s3', result);

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

  const lessonId = match.params?.lessonID;

  const UPLOAD_KEY = UPLOAD_KEYS.getStudentDataUploadKey(user.id, lessonId);

  const {authId, email} = user;

  const roomInfo = getLocalStorageData('room_info');

  const [uploading, setUploading] = useState(false);

  const getSizeInBytesInt = (size: number): number => {
    const inKB = size / 1024;
    const inMB = inKB / 1024;
    if (inMB < 1) {
      return parseInt(inKB.toFixed(2));
    } else {
      return parseInt(inMB.toFixed(2));
    }
  };

  const onUploadAllFiles = async () => {
    setUploading(true);
    try {
      const payload = {
        personAuthID: authId,
        personEmail: email,
        files: map(filesUploading, (file: any) => ({
          fileName: file.fileName,
          fileKey: file.fileKey,
          fileSize: getSizeInBytesInt(file.file?.size),
        })),
        lessonPageID: roomInfo?.activeLessonId,
        lessonID: roomInfo?.activeLessonId,
        syllabusLessonID: roomInfo?.activeSyllabus,
        lessonType: lessonType,
        roomID: roomInfo?.id,
      };

      const result: any = await API.graphql(
        graphqlOperation(mutations.createPersonFiles, {input: payload})
      );
      resetAll();
    } catch (error) {
      console.error('@uploadFileDataToTable: ', error);
    } finally {
      setUploading(false);
    }
  };

  const [filesUploading, setFilesUploading] = useState<IFile[]>([]);

  const mapNewFiles = (acceptedFiles: any) => {
    for (const file of acceptedFiles) {
      const id = nanoid(6);
      const fakeInitProgress = Math.floor(Math.random() * 10) + 1;

      const initState: IFile = {
        _status: 'progress',
        progress: fakeInitProgress.toString(),
        file,
        fileName: file.name,
        id,
      };
      filesUploading.push(initState);

      setFilesUploading([...filesUploading]);
    }
  };

  const uploadNewFiles = async () => {
    if (filesUploading.length > 0) {
      const notUploadedFiles = reject(
        filesUploading,
        (f) => f._status === 'success' || f._status === 'other'
      );

      for (const file of notUploadedFiles) {
        let temp = file.file.name.split('.');
        const extension = temp.pop();
        const fileName = `${Date.now()}_${temp
          .join(' ')
          .replace(new RegExp(/[ +!@#$%^&*().]/g), '_')}.${extension}`;
        updateImgId(file, fileName);
        await uploadImageToS3(file.file, fileName, file.file.type, file);
      }
    }
  };

  const getId = (file: IFile) => findIndex(filesUploading, (f) => f.id === file.id);

  const updateImgId = (file: IFile, fileKey: IFile['fileKey']) => {
    const idx = getId(file);
    update(filesUploading[idx], `fileKey`, () => fileKey);
    setFilesUploading([...filesUploading]);
  };

  const uploadFile = useCallback(
    async (acceptedFiles) => {
      mapNewFiles(acceptedFiles);
      await uploadNewFiles();
    },
    [filesUploading]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: uploadFile,
  });

  const handleFileSelection = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files);
    }
  };

  const RequiredMark = ({isRequired}: {isRequired: boolean}) => (
    <span className="text-red-500"> {isRequired ? '*' : null}</span>
  );

  const [showModal, setShowModal] = useState(false);

  const updateFilename = (id: string, filename: string) => {
    const idx = findIndex(filesUploading, (f) => f.id === id);
    update(filesUploading[idx], `fileName`, () => filename);
    setFilesUploading([...filesUploading]);
  };

  const closeAction = () => setShowModal(false);

  const resetAll = () => {
    closeAction();
    setUploading(false);
    setFilesUploading([]);
  };

  return (
    <>
      {showModal && (
        <Modal
          title={label}
          showHeader
          showFooter={false}
          closeAction={closeAction}
          closeOnBackdrop={false}>
          <div className="px-6 min-w-256 min-h-72">
            <h4 className="text-lg text-gray-600 font-medium">{value}</h4>
            <div
              {...getRootProps()}
              className={`border-${
                isDragActive ? 'blue' : 'gray'
              }-400 border-2 transition-all duration-300 flex items-center flex-col justify-center border-dashed rounded-xl h-56`}>
              <input
                {...getInputProps()}
                ref={inputOther}
                onChange={isInLesson && isStudent ? handleFileSelection : () => {}}
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
                    onClick={isInLesson ? openFilesExplorer : noop}
                    className="text-blue-500 cursor-pointer">
                    browse
                  </span>
                </p>
              )}
            </div>
            <Transition
              show={filesUploading.length > 0}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="mt-4 flex flex-col  gap-y-6">
              {map(filesUploading, (file: IFile) => (
                <File
                  fileKey={file.fileKey}
                  updateFilename={updateFilename}
                  file={file.file}
                  id={file.id}
                  deleteImage={deleteImage}
                  _status={file._status}
                  progress={file.progress}
                  fileName={file.fileName}
                />
              ))}
            </Transition>

            <div className="flex mt-8 justify-center px-6 pb-4">
              <div className="flex justify-end">
                <Buttons
                  btnClass="py-1 px-4 text-xs mr-2"
                  label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                  onClick={resetAll}
                  disabled={uploading}
                  transparent
                />
                <Buttons
                  disabled={uploading}
                  btnClass="py-1 px-8 text-xs ml-2"
                  label={uploading ? 'Uploading' : 'Upload'}
                  onClick={onUploadAllFiles}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
      <div id={id} key={inputID} className={`mb-4 p-4`}>
        <label className={`text-sm ${themeTextColor}`} htmlFor="label">
          {numbered && index} {label} <RequiredMark isRequired={required} />
        </label>
        <div className="mt-2">
          <span
            role="button"
            tabIndex={-1}
            onClick={isInLesson ? () => setShowModal(true) : noop}
            className={`border-0 ${
              lessonPageTheme === 'light' ? 'border-gray-500' : 'border-white'
            } flex items-center justify-center ${
              lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
            } text-base px-4 py-2 ${themeTextColor} hover:text-sea-green hover:border-sea-green transition-all duration-300 rounded-xl shadow-sm`}>
            <BiImageAdd className={`w-auto mr-2`} />
            Upload Attachments
          </span>
        </div>
      </div>
    </>
  );
};
export default AttachmentBlock;
