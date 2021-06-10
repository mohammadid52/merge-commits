import React, {useCallback, useContext} from 'react';
import {useDropzone} from 'react-dropzone';
import {FaCloudUploadAlt} from 'react-icons/fa';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {UniversalBuilderDict} from '../../../dictionary/dictionary.iconoclast';
import {replaceAll} from '../../../utilities/strings';

interface IULBFileUploader {
  acceptedFilesFormat?: string;
  error?: string;
  fileUrl: string;
  multiple?: boolean;
  updateFileUrl: (url: string, imageData: File | null) => void;
}

const ULBFileUploader = ({
  acceptedFilesFormat,
  fileUrl,
  error,
  multiple = false,
  updateFileUrl,
}: IULBFileUploader) => {
  const {userLanguage} = useContext(GlobalContext);
  const otherProps: any = {};
  if (acceptedFilesFormat) {
    otherProps.accept = acceptedFilesFormat;
  }
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File | null) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        // const binaryStr = reader.result;
        updateFileUrl(URL.createObjectURL(file), file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {getRootProps, getInputProps, fileRejections} = useDropzone({
    onDrop,
    multiple,
    ...otherProps,
  });
  const label: string = multiple ? 'some files' : 'file';
  return (
    <div
      {...getRootProps()}
      className={'border-0 border-dashed border-gray-400 rounded-lg h-35 cursor-pointer'}>
      <input {...getInputProps()} />
      <div className={'flex flex-col items-center justify-center h-full'}>
        {fileUrl ? (
          <img src={fileUrl} alt="" className={`w-30 h-30 mx-auto`} />
        ) : (
          <>
            <FaCloudUploadAlt size="50" className="text-gray-400" />
            <p className="text-center mt-2 text-gray-400">
              {replaceAll(
                UniversalBuilderDict[userLanguage]['FORMS']['FILE_UPLOAD_TEXT'],
                {label}
              )}
            </p>
          </>
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
