import Label from './Label';
import React, {forwardRef, MutableRefObject} from 'react';

interface IUploadButtonProps {
  label?: string;
  disabled?: boolean;
  dark?: boolean;
  multiple?: boolean;
  isRequired?: boolean;
  file?: File;
  acceptedFilesFormat?: string;
  onUpload: React.ChangeEventHandler<HTMLInputElement>;
}

const UploadButton = forwardRef<HTMLInputElement, IUploadButtonProps>(
  (
    {onUpload, label, file, disabled, multiple, acceptedFilesFormat, isRequired, dark},
    ref
  ) => {
    return (
      <>
        {label && (
          <Label disabled={disabled} dark={dark} label={label} isRequired={isRequired} />
        )}
        <input
          id="imgFile"
          multiple={multiple}
          className="w-3/10 mt-2 block sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-full shadow-sm"
          type="file"
          disabled={!file || disabled}
          accept={acceptedFilesFormat}
          ref={ref}
          onChange={onUpload}
        />
      </>
    );
  }
);

export default UploadButton;
