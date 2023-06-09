import useDictionary from '@customHooks/dictionary';
import {useGlobalContext} from 'contexts/GlobalContext';

import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {FaCloudUploadAlt} from 'react-icons/fa';
import {getImageFromS3Static} from 'utilities/services';
import {replaceAll} from 'utilities/strings';

interface IULBFileUploader {
  acceptedFilesFormat?: string;
  classString?: string;
  error?: string;
  fileUrl: string;
  multiple?: boolean;
  showPreview?: boolean;
  customVideo?: boolean;
  isEditingMode?: boolean;
  updateFileUrl: (url: string, imageData: File | null) => void;
}

const ULBFileUploader = ({
  acceptedFilesFormat,
  classString,
  error,
  fileUrl,
  multiple = false,
  showPreview = true,
  updateFileUrl,
  customVideo = false,
  isEditingMode = false
}: IULBFileUploader) => {
  const {userLanguage} = useGlobalContext();

  const {UniversalBuilderDict} = useDictionary();
  const otherProps: any = {};
  if (acceptedFilesFormat) {
    otherProps.accept = acceptedFilesFormat;
  }
  const onDrop = useCallback((acceptedFiles: (File | null)[]) => {
    acceptedFiles.forEach((file: File | null) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        // const binaryStr = reader.result;
        file && updateFileUrl(URL.createObjectURL(file), file);
      };
      file && reader.readAsArrayBuffer(file);
    });
  }, []);
  const {getRootProps, getInputProps, fileRejections} = useDropzone({
    onDrop,
    multiple,
    ...otherProps
  });
  const label: string = multiple ? 'some files' : 'file';

  const getImageFile = (fileUrl: any) =>
    isEditingMode
      ? fileUrl.includes('blob')
        ? fileUrl
        : getImageFromS3Static(fileUrl)
      : fileUrl;

  return (
    <div {...getRootProps()} className={classString}>
      <input {...getInputProps()} />
      <div className={'flex flex-col items-center justify-center h-full'}>
        {showPreview && fileUrl ? (
          customVideo ? (
            <div className="w-56 h-auto mx-auto rounded">
              <video className="rounded-lg mx-auto" src={getImageFile(fileUrl)}>
                <source />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <img
              src={getImageFile(fileUrl)}
              alt=""
              className={`w-56 h-auto mx-auto rounded`}
            />
          )
        ) : (
          <div className="py-4">
            <FaCloudUploadAlt size="50" className="text-light " />
            <p className="text-center mt-2 text-light ">
              {replaceAll(
                UniversalBuilderDict[userLanguage]['FORMS']['FILE_UPLOAD_TEXT'],
                {label}
              )}
            </p>
          </div>
        )}
      </div>
      <p className="text-red-500 text-xs">
        {fileRejections && fileRejections.length
          ? fileRejections[0].errors[0].message
          : error
          ? error
          : ''}
      </p>
    </div>
  );
};

export default ULBFileUploader;
