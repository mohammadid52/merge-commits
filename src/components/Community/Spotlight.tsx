import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import Buttons from '@components/Atoms/Buttons';
import SelectorWithAvatar from '@components/Atoms/Form/SelectorWithAvatar';
import RichTextEditor from '@components/Atoms/RichTextEditor';
import * as customQueries from '@customGraphql/customQueries';
import * as queries from '@graphql/queries';
import {Transition} from '@headlessui/react';
import {UPLOAD_KEYS} from '@lesson/constants';
import {getFilterORArray} from '@utilities/strings';
import {getAsset} from 'assets';
import {update} from 'lodash';
import isEmpty from 'lodash/isEmpty';
import {nanoid} from 'nanoid';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDropzone} from 'react-dropzone';

interface IFile {
  _status: 'progress' | 'failed' | 'success' | 'other';
  progress: number | string | null;
  file: File;
  id?: string;
  fileKey?: string;
  fileName?: string;
}

interface IFileComponent extends IFile {
  UPLOAD_KEY?: string;
}

const File = ({
  _status,
  progress,
  fileName,

  file,
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
          </div>
          {_status === 'progress' && progress && (
            <span
              className={`text-${genColor()}-400 font-medium text-xs w-auto tracking-normal`}>
              {progress}%
            </span>
          )}
        </div>
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

const UPLOAD_KEY = UPLOAD_KEYS.COMMUNITY;

const Spotlight = ({
  instId,
  onCancel,
  onSubmit,
}: {
  instId?: string;
  onCancel: () => void;
  onSubmit: any;
}) => {
  const [teachersList, setTeachersList] = useState([]);
  const [file, setFile] = useState<IFile>();

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [fields, setFields] = useState<{note: string; noteHtml: string}>({
    note: '',
    noteHtml: '',
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

  const initialData = {
    id: '',
    name: '',
    institute: {id: instId, name: '', value: ''},
    teacher: {id: '', name: '', value: ''},
  };
  const [roomData, setRoomData] = useState(initialData);

  const [fetched, setFetched] = useState(false);

  const selectTeacher = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      teacher: {
        id: id,
        name: name,
        value: val,
      },
    });
  };

  const getInstituteInfo = async (instId: string) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.getInstitution, {
          id: instId,
        })
      );
      setRoomData((prevData) => ({
        ...prevData,
        institute: {
          ...prevData.institute,
          name: list.data.getInstitution?.name,
        },
      }));
      const serviceProviders = list.data.getInstitution?.serviceProviders?.items;
      return serviceProviders;
    } catch {}
  };

  const fetchOtherList = async () => {
    const items: any = await getInstituteInfo(instId);
    const serviceProviders = items.map((item: any) => item.providerID);
    const allInstiId = [...serviceProviders, instId];
    getTeachersList(allInstiId);
  };

  useEffect(() => {
    if (roomData.institute.id) {
      setFetched(false);
      fetchOtherList();
      setFetched(true);
    }
  }, [roomData.institute.id]);

  const getTeachersList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listStaffs, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')},
        })
      );
      const listStaffs = list.data.listStaffs.items;

      if (listStaffs?.length === 0) {
      } else {
        const sortedList = listStaffs.sort((a: any, b: any) =>
          a.staffMember?.firstName?.toLowerCase() >
          b.staffMember?.firstName?.toLowerCase()
            ? 1
            : -1
        );
        const filterByRole = sortedList.filter(
          (teacher: any) =>
            teacher.staffMember?.role === 'TR' || teacher.staffMember?.role === 'FLW'
        );
        const staffList = filterByRole.map((item: any) => ({
          id: item.staffMember?.id,
          name: `${item.staffMember?.firstName || ''} ${
            item.staffMember?.lastName || ''
          }`,
          value: `${item.staffMember?.firstName || ''} ${
            item.staffMember?.lastName || ''
          }`,
          email: item.staffMember?.email ? item.staffMember?.email : '',
          authId: item.staffMember?.authId ? item.staffMember?.authId : '',
          image: item.staffMember?.image,
        }));
        // Removed duplicates from staff list.
        const uniqIDs: string[] = [];
        const filteredArray = staffList.filter((member: {id: string}) => {
          const duplicate = uniqIDs.includes(member.id);
          uniqIDs.push(member.id);
          return !duplicate;
        });

        setTeachersList(filteredArray);
      }
    } catch {}
  };

  const {teacher} = roomData;
  const inputOther = useRef(null);
  const openFilesExplorer = () => inputOther.current.click();

  const fileIcon = getAsset('general', 'fileImg');

  const _onSubmit = () => {
    const spotlightDetails = {
      person: teacher,
      media: file.fileKey,
      note: fields.note,
    };
    onSubmit(spotlightDetails);
    onCancel();
  };

  return (
    <div className="min-w-256 max-w-256">
      <div className="px-3 py-4">
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Step 1: Select person in the community to spotlight
          <span className="text-red-500"> *</span>
        </label>

        <SelectorWithAvatar
          selectedItem={teacher}
          list={teachersList}
          loading={!fetched && teachersList.length === 0}
          placeholder={'Select Person'}
          onChange={selectTeacher}
        />
      </div>
      <div className="px-3 py-4">
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Add an image or video
          <span className="text-red-500"> *</span>
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
        <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
          Add a note about the person
          <span className="text-red-500"> *</span>
        </label>
        <div>
          <RichTextEditor
            placeholder={'Why do you want to put this person in the community spotlight?'}
            withStyles
            initialValue={fields.note}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(htmlContent, plainText, 'noteHtml', 'note')
            }
          />

          <div className="text-right text-gray-400">{fields.note.length} of 750</div>
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

export default Spotlight;
