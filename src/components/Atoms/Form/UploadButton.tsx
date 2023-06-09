import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React, {forwardRef} from 'react';
import Buttons from '../Buttons';

interface IUploadButtonProps {
  label?: string;
  disabled?: boolean;
  dark?: boolean;
  multiple?: boolean;
  isRequired?: boolean;
  message?: {message: string; type: 'error' | 'success' | 'default'};
  id: string;
  acceptedFilesFormat?: string;
  onUpload: React.ChangeEventHandler<HTMLInputElement>;
}

const UploadButton = forwardRef<HTMLInputElement, IUploadButtonProps>(
  ({onUpload, label, message, id, disabled, multiple, acceptedFilesFormat}, ref) => {
    // @ts-ignore
    const handleFile = () => ref?.current?.click();

    const handleClick = (event: any) => {
      const {target = {}} = event || {};
      target.value = '';
    };

    return (
      <>
        <div className="w-auto">
          <Buttons disabled={disabled} onClick={handleFile} label={label} />

          <input
            multiple={multiple}
            className="hidden w-auto"
            type="file"
            id={id}
            onClick={handleClick}
            onChange={onUpload}
            accept={acceptedFilesFormat}
            ref={ref}
          />
          {/* @ts-ignore */}
          <AnimatedContainer
            show={Boolean(message?.message && message?.message?.length > 0)}
            animationType="translateY">
            {message?.message && message?.message?.length > 0 && (
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
