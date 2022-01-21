import Buttons from '@atoms/Buttons';
import ULBFileUploader from '@atoms/Form/FileUploader';
import FormInput from '@atoms/Form/FormInput';
import Storage from '@aws-amplify/storage';
import Label from '@components/Atoms/Form/Label';
import ToggleForModal from '@components/Lesson/UniversalLessonBuilder/UI/common/ToggleForModals';
import DummyContent from '@components/Lesson/UniversalLessonBuilder/UI/Preview/DummyContent';
import PreviewLayout from '@components/Lesson/UniversalLessonBuilder/UI/Preview/Layout/PreviewLayout';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {
  Tabs3,
  useTabs,
} from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import {GlobalContext} from '@contexts/GlobalContext';
import {
  EditQuestionModalDict,
  UniversalBuilderDict,
} from '@dictionary/dictionary.iconoclast';
import {IContentTypeComponentProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import {getImageFromS3Static} from '@utilities/services';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import React, {useContext, useEffect, useState} from 'react';
import ProgressBar from '../ProgressBar';

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
  customVideo?: boolean;
}

const ImageFormComponent = ({
  inputObj,
  closeAction,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
  handleGalleryModal,
  setUnsavedChanges,
  customVideo = false,
  askBeforeClose,
  selectedImageFromGallery,
}: IImageFormComponentProps) => {
  const {
    userLanguage,
    state: {user},
  } = useContext(GlobalContext);

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [imageInputs, setImageInputs] = useState<IImageInput>({
    value: '',
    imageData: null,
    width: 'auto',
    height: 'auto',
    caption: '',
  });

  const [uploadProgress, setUploadProgress] = useState<string | number>(0);

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
    // closeAction();

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

        payload = {
          ...payload,
          value: `ULB/${user.id}/content_image_${fileName}`,
        };
        const styles = getStyles();
        if (isEditingMode) {
          const updatedList = updateBlockContentULBHandler(
            '',
            '',
            customVideo ? 'custom_video' : 'image',
            [payload],
            0,
            styles
          );

          await addToDB(updatedList);
        } else {
          const updatedList = createNewBlockULBHandler(
            '',
            '',
            customVideo ? 'custom_video' : 'image',
            [payload],
            0,
            styles
          );

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
        progressCallback: ({loaded, total}: any) => {
          const progress = (loaded * 100) / total;
          setUploadProgress(progress.toFixed(0));
        },
      })
        .then((result: any) => {
          console.log('File successfully uploaded to s3', result);

          setUploadProgress('done');
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

  useEffect(() => {
    if (uploadProgress === 'done') {
      closeAction();
    }
  }, [uploadProgress]);

  const {caption = '', value = '', imageData} = imageInputs;

  const {curTab, setCurTab, helpers} = useTabs();
  const [onSetupTab, onPreviewTab] = helpers;

  const [selectedStyles, setSelectedStyles] = useState({
    isRounded: true,
    isBorder: true,
  });
  const getStyles = () => {
    let styles = '';
    if (selectedStyles.isBorder) {
      styles = styles + ' border-2 dark:border-gray-600 border-gray-400';
    }
    if (selectedStyles.isRounded) {
      styles = styles + ' rounded-2xl';
    }

    return styles;
  };

  const [error, setError] = useState('');
  useEffect(() => {
    if (value && error) {
      setError('');
    }
  }, [value]);

  return (
    <div className="2xl:min-w-256 max-w-screen 2xl:max-w-256">
      <Tabs3 curTab={curTab} setCurTab={setCurTab} />

      <AnimatedContainer show={onSetupTab}>
        {onSetupTab && (
          <form onSubmit={onSave}>
            <div className={`grid grid-cols-2 gap-6`}>
              <div
                className={
                  ' col-span-2 border-0 border-dashed border-gray-400 rounded-lg h-35 cursor-pointer p-2'
                }>
                <ULBFileUploader
                  acceptedFilesFormat={customVideo ? 'video/*' : 'image/*'}
                  updateFileUrl={updateFileUrl}
                  fileUrl={value}
                  error={errors?.value}
                  customVideo={customVideo}
                  isEditingMode={isEditingMode}
                  showPreview={true}
                />
                <div className="flex flex-col items-center justify-center text-gray-400">
                  --- Or ---
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Buttons label={'Browse'} onClick={handleGalleryModal} />
                </div>
              </div>
              <div className="disabled col-span-1">
                <Label dark={false} label="Styles" />
                <div className="mt-1 flex items-center text-xs w-auto sm:leading-5 focus:outline-none focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm ">
                  <div className="flex items-center text-xs w-auto sm:leading-5py-2 px-3 ">
                    Corners rounded
                    <ToggleForModal
                      checked={selectedStyles.isRounded}
                      onClick={() => {
                        if (!value) {
                          setError(
                            `Please select an ${customVideo ? 'video' : 'image'} first`
                          );
                        } else {
                          setSelectedStyles({
                            ...selectedStyles,
                            isRounded: !selectedStyles.isRounded,
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center text-xs w-auto sm:leading-5py-2 px-3 ">
                    Border
                    <ToggleForModal
                      checked={selectedStyles.isBorder}
                      onClick={() => {
                        if (!value) {
                          setError(
                            `Please select an ${customVideo ? 'video' : 'image'} first`
                          );
                        } else {
                          setSelectedStyles({
                            ...selectedStyles,
                            isBorder: !selectedStyles.isBorder,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>

              <div className="col-span-1">
                <FormInput
                  value={caption || ''}
                  id="caption"
                  onChange={handleInputChange}
                  name="caption"
                  label={'Caption'}
                  placeHolder={`Enter ${customVideo ? 'video' : 'image'} caption here`}
                />
              </div>
            </div>

            {loading && uploadProgress !== 'done' && (
              <ProgressBar
                status={
                  uploadProgress < 99
                    ? `Uploading ${customVideo ? 'Video' : 'Image'}`
                    : 'Upload Done'
                }
                progress={uploadProgress}
              />
            )}

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
        )}
      </AnimatedContainer>
      <AnimatedContainer show={onPreviewTab}>
        {onPreviewTab && (
          <div>
            <PreviewLayout
              notAvailable={
                !value ? `No ${customVideo ? 'video' : 'image'} found` : false
              }>
              {customVideo ? (
                <div className="w-auto h-auto mx-auto mt-6">
                  <video
                    controls
                    className={`${getStyles()} mx-auto`}
                    src={imageData ? value : getImageFromS3Static(value)}>
                    <source />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div>
                  <img
                    src={imageData ? value : getImageFromS3Static(value)}
                    alt=""
                    className={`w-full ${getStyles()} h-96 xl:h-132 2xl:h-156 mt-4`}
                  />
                </div>
              )}

              <DummyContent />
            </PreviewLayout>
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default ImageFormComponent;
