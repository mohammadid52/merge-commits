import React, {useContext, useEffect, useState} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {
  EditQuestionModalDict,
  UniversalBuilderDict,
} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {uniqueId} from 'lodash';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';
import Storage from '@aws-amplify/storage';
import ULBFileUploader from '../../../../Atoms/Form/FileUploader';
import Loader from '../../../../Atoms/Loader';

interface IImageInput {
  url: string;
  width: string;
  height: string;
  caption?: string;
  imageData?: File | null;
}

interface IJumbotronModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  imageInput?: IImageInput[];
  selectedPageID?: string;
}

const initialInputFieldsState = [
  {
    id: 'background',
    type: 'background',
    label: 'Background',
    value:
      'https://images.freeimages.com/images/large-previews/d5d/powerlines-5-1389930.jpg',
  },
  {
    id: 'title',
    type: 'title',
    label: 'Title',
    value: 'Jumbo Title placeholder',
  },
  {
    id: 'subtitle',
    type: 'subtitle',
    label: 'Subtitle',
    value: 'This is the subtitle placeholder',
  },
  {
    id: 'description',
    type: 'description',
    label: 'Description',
    value: 'This is the description text placeholder',
  },
];

const JumbotronModalComponent = ({
  closeAction,
  inputObj,
  imageInput,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: IJumbotronModalComponentProps) => {
  const {userLanguage} = useContext(GlobalContext);
  const [isEditingMode] = useState<boolean>(false);

  //////////////////////////
  //  DATA STORAG         //
  //////////////////////////
  const [inputFieldsArray, setInputFieldsArray] = useState<PartContentSub[]>(
    initialInputFieldsState
  );
  useEffect(() => {
    if (inputObj) {
      if (inputObj?.value) {
        setInputFieldsArray(inputObj.value);
      }
    }
  }, [inputObj]);

  const [imageInputs, setImageInputs] = useState<IImageInput>({
    url: '',
    imageData: null,
    width: 'auto',
    height: 'auto',
    caption: '',
  });
  useEffect(() => {
    if (url !== '') {
      handleUpdateInputFields('background', imageInputs.url);
    }
  }, [imageInputs]);

  //////////////////////////
  //  FOR DATA UPDATE     //
  //////////////////////////
  const handleUpdateInputFields = (id: string, value: any) => {
    const newInputFieldsArray = inputFieldsArray.map((inputObj: PartContentSub) => {
      if (inputObj.id === id) {
        return {...inputObj, value: value};
      } else {
        return inputObj;
      }
    });
    setInputFieldsArray(newInputFieldsArray);
  };

  //////////////////////////
  //  FOR IMAGE UPLOADING //
  //////////////////////////
  const [errors, setErrors] = useState<IImageInput>({
    url: '',
    width: '',
    height: '',
  });
  const [loading, setIsLoading] = useState<boolean>(false);

  const updateFileUrl = (previewUrl: string, imageData: File | null) => {
    setImageInputs((prevValues) => ({...prevValues, url: previewUrl, imageData}));
    setErrors((prevValues) => ({...prevValues, url: ''}));
  };
  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const name: string = (event.target as HTMLInputElement).name;
  //   const value: string = (event.target as HTMLInputElement).value;
  //   setImageInputs((prevValues) => ({...prevValues, [name]: value}));
  //   setErrors((prevValues) => ({...prevValues, [name]: ''}));
  // };
  const onSave = async () => {
    const isValid: boolean = validateFormFields();
    if (isValid) {
      let temp = imageInputs.imageData.name.split('.');
      const extension = temp.pop();
      const fileName = `${Date.now()}_${temp
        .join(' ')
        .replace(new RegExp(/[ +!@#$%^&*().]/g), '_')}.${extension}`;
      setIsLoading(true);
      await uploadImageToS3(imageInputs.imageData, `${fileName}`, 'image/jpeg');
      if (isEditingMode) {
        updateBlockContentULBHandler('', '', 'video', [
          {
            ...imageInputs,
            url: `ULB/content_image_${fileName}`,
          },
        ]);
      } else {
        createNewBlockULBHandler('', '', 'image', [
          {
            ...imageInputs,
            url: `ULB/content_image_${fileName}`,
          },
        ]);
      }
      setIsLoading(false);
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
      errorMsgs.url =
        UniversalBuilderDict[userLanguage]['FORMS_ERROR_MSG']['IMAGE_REQUIRED'];
    }
    if (!width || (width !== 'auto' && !Number(width))) {
      isValid = false;
      errorMsgs.width =
        UniversalBuilderDict[userLanguage]['FORMS_ERROR_MSG']['IMAGE_WIDTH'];
    }
    if (!height || (height !== 'auto' && !Number(height))) {
      isValid = false;
      errorMsgs.height =
        UniversalBuilderDict[userLanguage]['FORMS_ERROR_MSG']['IMAGE_HEIGHT'];
    }
    setErrors(errorMsgs);
    return isValid;
  };

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`ULB/content_image_${id}`, file, {
        contentType: type,
        ContentEncoding: 'base64',
      })
        .then((result: any) => {
          console.log('File successfully uploaded to s3', result);
          resolve(true);
        })
        .catch((err: any) => {
          setErrors((prevValues) => ({
            ...prevValues,
            url: 'Unable to upload image. Please try again later. ',
          }));
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const {caption = '', url = '', width = '', height = ''} = imageInputs;

  //////////////////////////
  //  FOR NORMAL INPUT    //
  //////////////////////////
  const onChange = (e: React.FormEvent) => {
    const {id, value} = e.target as HTMLFormElement;
    handleUpdateInputFields(id, value);
  };

  const onJumbotronCreate = async () => {
    await onSave();
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', 'jumbotron', inputFieldsArray, 0);
    } else {
      createNewBlockULBHandler('', '', 'jumbotron', inputFieldsArray, 0);
    }
    // close modal after saving
    closeAction();
    // clear fields
    setInputFieldsArray(initialInputFieldsState);
  };

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          {inputFieldsArray.map((inputObj: PartContentSub, idx: number) => {
            if (inputObj.id === 'background') {
              return (
                <ULBFileUploader
                  key={`jumboform_${idx}`}
                  fileUrl={url}
                  updateFileUrl={updateFileUrl}
                  acceptedFilesFormat={'image/*'}
                  error={errors?.url}
                />
              );
            } else {
              return (
                <FormInput
                  key={`jumboform_${idx}`}
                  onChange={onChange}
                  label={inputFieldsArray[idx]?.label}
                  isRequired
                  value={inputFieldsArray[idx]?.value}
                  id={inputFieldsArray[idx]?.id}
                  placeHolder={inputFieldsArray[idx]?.value}
                  type="text"
                />
              );
            }
          })}
        </div>
      </div>

      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={closeAction}
            transparent
          />

            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={!loading ? EditQuestionModalDict[userLanguage]['BUTTON']['SAVE'] : <Loader/>}
              onClick={onJumbotronCreate}
              disabled={loading}
            />

        </div>
      </div>
    </>
  );
};

export default JumbotronModalComponent;
