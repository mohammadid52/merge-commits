import {Storage} from '@aws-amplify/storage';
import {Transition} from '@headlessui/react';
import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {findIndex, map, reject, remove, update} from 'lodash';
import {nanoid} from 'nanoid';
import {useCallback, useEffect, useRef, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {useDropzone} from 'react-dropzone';
import {removeExtension} from 'utilities/functions';
import {getImageFromS3Static} from 'utilities/services';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {UPLOAD_KEYS} from '../../../constants';
import {FORM_TYPES} from '../common/constants';

interface IDownloadDialogProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

interface IFile {
  _status: 'progress' | 'failed' | 'success' | 'other';
  progress: number | string | null;
  file: File | null;
  id?: string;
  fileKey?: string;
  fileName?: string;
}

interface IFileComponent extends IFile {
  deleteImage: (imgId: string) => void;
  updateFilename: (id: string, filename: string) => void;
}

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
      .finally(() => {});
  });
};

const UPLOAD_KEY = UPLOAD_KEYS.TEACHER_UPLOAD;

const File = ({
  _status,
  progress,
  fileName,
  deleteImage,
  fileKey,
  file,
  updateFilename,
  id = ''
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
    color = 'green'
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

  const [_fileName, setFileName] = useState(fileName || '');
  const [editingFilename, setEditingFilename] = useState(false);

  const onFileNameSave = () => {
    if (id) {
      updateFilename(id, removeExtension(_fileName));
      setEditingFilename(false);
    }
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
                  ? file?.name
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
                    setFileName(fileName || '');
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
            <div
              onClick={() => fileKey && deleteImage(fileKey)}
              className="w-auto cursor-pointer font-medium text-red-500 hover:text-red-800">
              Delete
            </div>
            <ClickAwayListener onClickAway={() => setShowMenu(false)}>
              <div onClick={() => setShowMenu(!showMenu)} className={`relative `}>
                <div className="iconoclast:text-400 curate:text-400 hover:iconoclast:text-600 hover:curate:text-600 cursor-pointer font-medium">
                  Preview
                </div>
                <Transition
                  style={{bottom: '1.5rem'}}
                  className="w-auto bg-white cursor-pointer select-none rounded-xl customShadow absolute right-1 border-0 border-lightest min-h-32 min-w-56 p-4"
                  show={showMenu}>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-medium ">File preview</dt>
                      <img
                        onClick={onImageClick}
                        src={imageUrl}
                        className="mt-1 rounded-md customShadow h-16 w-16"
                        alt={file?.name}
                      />
                    </div>
                    {(file?.name || fileName) && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-medium ">File name</dt>
                        <dd className="mt-1 text-sm break-all text-dark   font-medium">
                          {file?.name || fileName}
                        </dd>
                      </div>
                    )}
                    {file?.size && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-medium ">Size</dt>
                        <dd className="mt-1 flex items-center justify-between  text-sm text-dark   font-medium">
                          <p className="w-auto">{getSizeInBytes(file?.size)}</p>
                        </dd>
                      </div>
                    )}
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

const DownloadModal = (props: IDownloadDialogProps) => {
  const {
    closeAction,
    inputObj,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    askBeforeClose,
    setUnsavedChanges
  } = props;

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [filesUploading, setFilesUploading] = useState<IFile[]>([]);

  useEffect(() => {
    if (inputObj && inputObj.length > 0) {
      setIsEditingMode(true);
      const f: IFile[] = map(inputObj, (d) => {
        return {
          id: d.id,
          fileKey: d.value,
          fileName: d.label,
          _status: 'other',
          progress: null,
          file: null
        };
      });
      setFilesUploading(f);
    }
  }, [inputObj]);

  const mapNewFiles = (acceptedFiles: any) => {
    for (const file of acceptedFiles) {
      const id = nanoid(6);
      const fakeInitProgress = Math.floor(Math.random() * 10) + 1;

      const initState: IFile = {
        _status: 'progress',
        progress: fakeInitProgress.toString(),
        file,
        fileName: file.name,
        id
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
        if (file.file) {
          let temp = file.file.name.split('.');
          const extension = temp.pop();
          const fileName = `${Date.now()}_${temp
            .join(' ')
            .replace(new RegExp(/[ +!@#$%^&*().]/g), '_')}.${extension}`;
          updateImgId(file, fileName);
          await uploadImageToS3(file.file, fileName, file.file.type, file);
        }
      }
    }
  };

  const uploadFile = useCallback(
    async (acceptedFiles: any) => {
      setUnsavedChanges(true);

      mapNewFiles(acceptedFiles);
      await uploadNewFiles();
    },
    [filesUploading]
  );

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: uploadFile
  });

  const {userLanguage} = useGlobalContext();

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
        acl: 'public-read',
        contentEncoding: 'base64',
        progressCallback: ({loaded, total}: any) => {
          const progress = (loaded * 100) / total;

          updateStatus(currentFile, 'progress');

          updateProgress(currentFile, progress.toFixed(0));
        }
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

  const getId = (file: IFile) => findIndex(filesUploading, (f) => f.id === file.id);

  const updateImgId = (file: IFile, fileKey: IFile['fileKey']) => {
    const idx = getId(file);
    update(filesUploading[idx], `fileKey`, () => fileKey);
    setFilesUploading([...filesUploading]);
  };

  const updateFilename = (id: string, filename: string) => {
    const idx = findIndex(filesUploading, (f) => f.id === id);
    update(filesUploading[idx], `fileName`, () => filename);
    setFilesUploading([...filesUploading]);
  };

  const handleFileSelection = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files);
    }
  };

  const inputOther = useRef<any>(null);

  const fileIcon = getAsset('general', 'file');

  const openFilesExplorer = () => inputOther?.current?.click?.();

  const {EditQuestionModalDict} = useDictionary();

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  const onDownloadCreate = async () => {
    const _files = map(filesUploading, (f) => {
      if (f) {
        return {
          id: f.id,
          label: removeExtension(f.fileName || f?.file?.name || '') || '',
          value: f.fileKey
        };
      }
      return null;
    }).filter(Boolean);

    const parentKey = 'downloadable-files';
    if (isEditingMode) {
      const updatedList: any = updateBlockContentULBHandler(
        '',
        '',
        FORM_TYPES.DOWNLOAD,
        _files,
        0,
        '',
        parentKey
      );

      await addToDB(updatedList);
    } else {
      const updatedList: any = createNewBlockULBHandler(
        '',
        '',
        FORM_TYPES.DOWNLOAD,

        _files,
        0,
        '',
        parentKey
      );
      await addToDB(updatedList);
    }
  };

  return (
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
          multiple={true}
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
        show={filesUploading.length > 0}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="mt-4 flex flex-col  gap-y-6">
        {map(filesUploading, (file: IFile) => {
          return (
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
          );
        })}
      </Transition>
      <div className="flex mt-8 justify-end px-6 pb-4">
        <div className="flex justify-end gap-4">
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
            size="middle"
          />
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onDownloadCreate}
            size="middle"
          />
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
