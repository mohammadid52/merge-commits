import React, {useState, useEffect} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import ULBFileUploader from '../../../../Atoms/Form/FileUploader';

interface IImageInput {
  url: string;
  width: string;
  height: string;
  caption?: string;
}

interface IVideoDialogProps {
  inputObj?: IImageInput;
  closeAction: () => void;
  createNewBlockULBHandler: (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputValue: any
  ) => void;
}

const ImageFormComponent = ({
  inputObj,
  closeAction,
  createNewBlockULBHandler,
}: IVideoDialogProps) => {
  const [imageInputs, setImageInputs] = useState<IImageInput>({
    url: '',
    width: 'auto',
    height: 'auto',
    caption: '',
  });
  const [errors, setErrors] = useState<IImageInput>({
    url: '',
    width: '',
    height: '',
  });

  useEffect(() => {
    if (inputObj && inputObj.url) {
      setImageInputs(inputObj);
    }
  }, [inputObj]);
  const updateFileUrl = (url: string) => {
    setImageInputs((prevValues) => ({...prevValues, url}));
    setErrors((prevValues) => ({...prevValues, [url]: ''}));
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;
    setImageInputs((prevValues) => ({...prevValues, [name]: value}));
    setErrors((prevValues) => ({...prevValues, [name]: ""}));
  };

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid: boolean = validateFormFields();
    if (isValid) {
      createNewBlockULBHandler('', 'pageContent', 'image', [imageInputs]);
      closeAction();
    }
  };

  const validateFormFields = () => {
    const {url = '', width = '', height = ''} = imageInputs;
    let isValid = true;
    let errorMsgs = {
      url: '',
      width: '',
      height: '',
    };
    if (!url) {
      isValid = false;
      errorMsgs.url = 'Please upload image';
    }
    if (!width || (width !== "auto" && !Number(width))) {
      isValid = false;
      errorMsgs.width = 'Please enter valid width for image or set it to auto';
    }
    if (!height || (height !== 'auto' && !Number(height))) {
      isValid = false;
      errorMsgs.height = 'Please enter valid height for image or set it to auto';
    }
    setErrors(errorMsgs);
    return isValid;
  };

  const {caption = '', url = '', width = '', height = ''} = imageInputs;
  return (
    <div>
      <form onSubmit={onSave}>
        <div className={`grid grid-cols-2 gap-3`}>
          <ULBFileUploader
            acceptedFilesFormat={'image/*'}
            updateFileUrl={updateFileUrl}
            fileUrl={url}
            error={errors?.url}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormInput
                value={height || ''}
                id="height"
                onChange={handleInputChange}
                name="height"
                label={'Height'}
                placeHolder={'Ex. 100'}
                isRequired
                error={errors?.height}
              />
            </div>
            <div>
              <FormInput
                value={width || ''}
                id="width"
                onChange={handleInputChange}
                name="width"
                label={'Width'}
                placeHolder={'Ex. 100'}
                isRequired
                error={errors?.width}
              />
            </div>
            <div className="col-span-2">
              <FormInput
                value={caption || ''}
                id="caption"
                onChange={handleInputChange}
                name="caption"
                label={'Caption'}
                placeHolder={'Enter title here'}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-end">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={'Cancel'}
              onClick={closeAction}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={'Save'}
              type="submit"
              onClick={onSave}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ImageFormComponent;
