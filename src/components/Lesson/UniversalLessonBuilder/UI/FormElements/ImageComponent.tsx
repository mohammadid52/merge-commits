import React, {useState, useEffect, useContext} from 'react';

import Storage from '@aws-amplify/storage';

import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import ULBFileUploader from '../../../../Atoms/Form/FileUploader';

import {getImageFromS3, getImageFromS3Static} from '../../../../../utilities/services';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {
  EditQuestionModalDict,
  UniversalBuilderDict,
} from '../../../../../dictionary/dictionary.iconoclast';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';

interface IImageInput {
  value: string;
  width: string;
  height: string;
  caption?: string;
  imageData?: File | null;
}

interface IImageFormComponentProps extends IContentTypeComponentProps {
  handleGalleryModal: () => void;
  inputObj?: IImageInput[];
  selectedImageFromGallery?: string;
}

const ImageFormComponent = ({
  inputObj,
  closeAction,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
  handleGalleryModal,
  setUnsavedChanges,
  askBeforeClose,
  selectedImageFromGallery,
}: IImageFormComponentProps) => {
  const {
    userLanguage,
    state: {user},
  } = useContext(GlobalContext);
  const [openGallery, setOpenGallery] = useState<boolean>(false);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [imageInputs, setImageInputs] = useState<IImageInput>({
    value: '',
    imageData: null,
    width: 'auto',
    height: 'auto',
    caption: '',
  });
  const [errors, setErrors] = useState<IImageInput>({
    value: '',
    width: '',
    height: '',
  });
  const [loading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setImageInputs(inputObj[0]);
      setIsEditingMode(true);
    }
  }, [inputObj]);

  // To update the selected image from gallery to input object
  useEffect(() => {
    if (selectedImageFromGallery) {
      setImageInputs((prevValues) => ({
        ...prevValues,
        value: selectedImageFromGallery,
        imageData: null,
      }));
    }
  }, [selectedImageFromGallery]);

  const updateFileUrl = (previewUrl: string, imageData: File | null) => {
    setImageInputs((prevValues) => ({...prevValues, value: previewUrl, imageData}));
    setErrors((prevValues) => ({...prevValues, value: ''}));
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnsavedChanges(true);
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;
    setImageInputs((prevValues) => ({...prevValues, [name]: value}));
    setErrors((prevValues) => ({...prevValues, [name]: ''}));
  };

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid: boolean = validateFormFields();
    if (isValid) {
      let {imageData, ...payload} = imageInputs;
      if (imageInputs.imageData) {
        let temp = imageData.name.split('.');
        const extension = temp.pop();
        const fileName = `${Date.now()}_${temp
          .join(' ')
          .replace(new RegExp(/[ +!@#$%^&*().]/g), '_')}.${extension}`;
        setIsLoading(true);
        await uploadImageToS3(imageData, `${fileName}`, 'image/jpeg');

        const imageUrl: any = await getImageFromS3(
          `ULB/${user.id}/content_image_${fileName}`
        );

        if (imageUrl) {
          payload = {
            ...payload,
            value: imageUrl,
          };
        }
        if (isEditingMode) {
          const updatedList = updateBlockContentULBHandler('', '', 'image', [payload]);
          await addToDB(updatedList);
        } else {
          const updatedList = createNewBlockULBHandler('', '', 'image', [payload]);
          await addToDB(updatedList);
        }
      }

      setIsLoading(false);
      setUnsavedChanges(false);
    }
  };

  const validateFormFields = () => {
    const {value = '', width = '', height = ''} = imageInputs;
    let isValid = true;
    let errorMsgs = {
      value: '',
      width: '',
      height: '',
    };
    if (!value) {
      isValid = false;
      errorMsgs.value =
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
      Storage.put(`ULB/${user.id}/content_image_${id}`, file, {
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
            value: 'Unable to upload image. Please try again later. ',
          }));
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const {caption = '', value = '', width = '', height = '', imageData} = imageInputs;
  return (
    <div>
      <form onSubmit={onSave}>
        <div className={`grid grid-cols-2 gap-3`}>
          <div
            className={
              'border-0 border-dashed border-gray-400 rounded-lg h-35 cursor-pointer p-2'
            }>
            <ULBFileUploader
              acceptedFilesFormat={'image/*'}
              updateFileUrl={updateFileUrl}
              fileUrl={value}
              error={errors?.value}
              showPreview={false}
            />
            <div className="flex flex-col items-center justify-center text-gray-400">
              --- Or ---
            </div>
            <div className="flex flex-col items-center justify-center">
              <Buttons label={'Browse'} onClick={handleGalleryModal} />
            </div>
          </div>
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
                placeHolder={'Enter image caption here'}
              />
            </div>
          </div>
        </div>
        {value ? (
          <div>
            <img
              src={imageData ? value : getImageFromS3Static(value)}
              alt=""
              className={`w-auto h-30 pt-4`}
            />
          </div>
        ) : null}
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-end">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={askBeforeClose}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={
                loading
                  ? EditQuestionModalDict[userLanguage]['BUTTON']['SAVING']
                  : EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']
              }
              type="submit"
              onClick={onSave}
              disabled={loading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ImageFormComponent;
