import Label from './Label';
import React, {forwardRef, MutableRefObject} from 'react';
import Buttons from '../Buttons';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';

interface IUploadButtonProps {
  label?: string;
  disabled?: boolean;
  dark?: boolean;
  multiple?: boolean;
  isRequired?: boolean;
  message?: {message: string; type: 'error' | 'success' | 'default'};
  acceptedFilesFormat?: string;
  onUpload: React.ChangeEventHandler<HTMLInputElement>;
}

const UploadButton = forwardRef<HTMLInputElement, IUploadButtonProps>(
  ({onUpload, label, message, disabled, multiple, acceptedFilesFormat}, ref) => {
    // @ts-ignore
    const handleFile = () => ref?.current?.click();
    return (
      <>
        <div className="w-auto">
          <Buttons
            btnClass={disabled ? 'cursor-not-allowed' : ''}
            disabled={disabled}
            onClick={handleFile}
            label={label}
          />

          <input
            multiple={multiple}
            className="hidden w-auto"
            type="file"
            accept={acceptedFilesFormat}
            ref={ref}
            onChange={onUpload}
          />
          {/* @ts-ignore */}
          <AnimatedContainer
            show={message?.message?.length > 0}
            animationType="translateY">
            {message?.message?.length > 0 && (
              <p
                className={`mt-1 text-${
                  message.type === 'default'
                    ? 'gray'
                    : message.type === 'error'
                    ? 'red'
                    : message.type === 'success'
                    ? 'green'
                    : 'gray'
                }-500 text-xs`}>
                {message.message}
              </p>
            )}
          </AnimatedContainer>
        </div>
      </>
    );
  }
);

export default UploadButton;
