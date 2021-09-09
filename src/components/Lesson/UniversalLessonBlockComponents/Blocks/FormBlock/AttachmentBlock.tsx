import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import {Transition} from '@headlessui/react';
import {noop} from 'lodash';
import React, {useCallback, useContext, useRef, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {useDropzone} from 'react-dropzone';
import {BiDotsVerticalRounded, BiImageAdd} from 'react-icons/bi';
import {IoClose} from 'react-icons/io5';
import {useRouteMatch} from 'react-router';
import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useInLessonCheck from '../../../../../customHooks/checkIfInLesson';
import {useQuery} from '../../../../../customHooks/urlParam';
import * as mutations from '../../../../../graphql/mutations';
import {getLocalStorageData} from '../../../../../utilities/localStorage';
import {getImageFromS3} from '../../../../../utilities/services';
import Modal from '../../../../Atoms/Modal';
import {FormControlProps} from '../FormBlock';

const btnClass = (color: string) =>
  `cursor-pointer transition-all border-transparent border-2 hover:border-${color}-300 rounded-full p-1 flex items-center h-6 w-6 justify-center bg-${color}-200`;

const File = ({
  status,
  progress,
  deleteImage,
  file,
}: {
  status: string;
  deleteImage: any;
  progress: string;
  file: any;
}) => {
  const genStatus = () => {
    switch (status) {
      case 'progress':
        return 'Uploading...';
      case 'success':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Completed';
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

  const imageUrl = file ? URL.createObjectURL(file) : null;

  const onImageClick = (e: any) => {
    e.stopPropagation();
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="px-6 py-4 border-2 border-gray-200 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="w-auto flex flex-col items-start">
          <p className="text-blue-800 font-semibold text-sm w-auto tracking-wide">
            {genStatus()}
          </p>
          {status === 'progress' && progress && (
            <span className="text-gray-400 font-medium text-xs w-auto tracking-normal">
              {progress}%
            </span>
          )}
        </div>
        {status === 'success' && (
          <div className="flex items-center gap-x-6 w-auto">
            <div onClick={deleteImage} className={btnClass('red')}>
              <IoClose className="text-red-500" />
            </div>
            <ClickAwayListener onClickAway={() => setShowMenu(false)}>
              <div
                onClick={() => setShowMenu(!showMenu)}
                className={`relative ${btnClass('gray')}`}>
                <BiDotsVerticalRounded className="text-gray-500" />
                <Transition
                  style={{bottom: '1.5rem'}}
                  className="w-auto bg-white cursor-pointer select-none rounded-xl customShadow absolute right-1 border-0 border-gray-200 min-h-32 min-w-140 p-4"
                  show={showMenu}>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    {imageUrl && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">File name</dt>
                        <img
                          onClick={onImageClick}
                          src={imageUrl}
                          className="mt-1 rounded-md customShadow h-16 w-16"
                          alt={file.name}
                        />
                      </div>
                    )}
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">File name</dt>
                      <dd className="mt-1 text-sm break-all text-gray-700 font-medium">
                        {file.name}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Size</dt>
                      <dd className="mt-1 text-sm text-gray-700 font-medium">
                        {getSizeInBytes(file.size)}
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
        {status === 'progress' && progress && (
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
  handleUpdateStudentData,
}: FormControlProps) => {
  const {
    state: {
      user,
      lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {},
    },
  } = useContext(GlobalContext);

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
  const isStudent = user.role === 'ST';
  const isInLesson = useInLessonCheck();
  const inputOther = useRef(null);

  const params = useQuery(location.search);

  const openFilesExplorer = () => inputOther.current.click();
  // For Attachments - 31

  const fileIcon = getAsset('general', 'file');

  const [fileObj, setFileObj] = useState<any>(null);
  const match: any = useRouteMatch();

  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState(null);
  const [imgId, setImgId] = useState('');

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
        })
        .finally(() => setImgId(''));
    });
  };

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`ULB/studentdata_${id}`, file, {
        contentType: type,
        ContentEncoding: 'base64',
        progressCallback: ({loaded, total}: any) => {
          const progress = (loaded * 100) / total;
          setStatus('progress');
          setProgress(progress.toFixed(0));
        },
      })
        .then((result) => {
          console.log('File successfully uploaded to s3', result);
          setStatus('success');
          resolve(true);
        })
        .catch((err) => {
          setStatus('failed');

          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const deleteImage = () => {
    setFileObj(null);
    setStatus(null);
    setProgress(null);
    deletImageFromS3(`${UPLOAD_KEY}/${imgId}`);
  };

  const lessonId = match.params?.lessonID;
  console.log('🚀 ~ file: AttachmentBlock.tsx ~ line 227 ~ lessonId', lessonId);

  const UPLOAD_KEY = `ULB/studentdata/${user.id}/${lessonId}`;

  const onDrop = useCallback(async (acceptedFile) => {
    uploadFile(acceptedFile);
  }, []);

  const {authId, email} = user;

  const roomInfo = getLocalStorageData('room_info');

  /**
   * This Function will store all image data to createPersonFiles table
   */
  const uploadFileDataToTable = async (file: any, fileKey: string) => {
    try {
      const payload = {
        personAuthID: authId,
        personEmail: email,
        fileName: file.name,
        fileKey,
        lessonID: roomInfo?.activeLessonId,
        syllabusLessonID: roomInfo?.activeSyllabus,
        roomID: roomInfo?.id,
      };

      const result: any = await API.graphql(
        graphqlOperation(mutations.createPersonFiles, {input: payload})
      );
    } catch (error) {
      console.error('@uploadFileDataToTable: ', error.message);
    }
  };

  const uploadFile = async (file: any) => {
    setStatus('progress');
    setProgress('5');

    setFileObj(file);
    const id = `${UPLOAD_KEY}/${Date.now().toString()}_${file.name}`;
    setImgId(id);

    await uploadImageToS3(file, id, file.type);
    uploadFileDataToTable(file, id);
    const imageUrl: any = await getImageFromS3(id);
    if (isInLesson) {
      handleUpdateStudentData(inputID, [imageUrl]);
    }
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleFileSelection = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const RequiredMark = ({isRequired}: {isRequired: boolean}) => (
    <span className="text-red-500"> {isRequired ? '*' : null}</span>
  );

  const [showModal, setShowModal] = useState(false);

  const closeAction = () => setShowModal(false);

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
                multiple={false}
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
              show={fileObj !== null}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="mt-4 flex flex-col  gap-y-6">
              <File
                file={fileObj}
                deleteImage={deleteImage}
                status={status}
                progress={progress}
              />
            </Transition>
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
