import Storage from '@aws-amplify/storage';
import {Switch} from '@headlessui/react';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {
  EditQuestionModalDict,
  UniversalBuilderDict,
} from '../../../../../dictionary/dictionary.iconoclast';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';
import {getImageFromS3Static} from '../../../../../utilities/services';
import {blur, tinting} from '../../../../../utilities/staticData';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import Buttons from '../../../../Atoms/Buttons';
import ULBFileUploader from '../../../../Atoms/Form/FileUploader';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import Loader from '../../../../Atoms/Loader';
import CustomizedQuoteBlock from '../../../UniversalLessonBlockComponents/Blocks/JumbotronBlock/CustomizeQuoteBlock';
import ColorPicker from '../ColorPicker/ColorPicker';
import {classNames} from '../FormElements/TextInput';
import ProgressBar from '../ProgressBar';
import AnimatedContainer from '../UIComponents/Tabs/AnimatedContainer';
import Tabs, {useTabs} from '../UIComponents/Tabs/Tabs';

const Toggle = ({
  checked,
  onClick,
  text,
  disabled,
}: {
  text?: string;

  checked: boolean;
  onClick: any;
  disabled?: boolean;
}) => {
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch.Label as="span" className="mr-3 w-auto">
        <span className="text-sm font-medium text-gray-900">{text}</span>
      </Switch.Label>
      <Switch
        disabled={disabled}
        checked={checked}
        onChange={onClick}
        className={classNames(
          checked ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        )}>
        <span
          aria-hidden="true"
          className={classNames(
            checked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          )}
        />
      </Switch>
    </Switch.Group>
  );
};
interface IImageInput {
  url: string;
  width: string;
  height: string;
  caption?: string;
  imageData?: File | null;
}

interface IJumbotronModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  classString?: string;
  imageInput?: IImageInput[];
  selectedPageID?: string;
}

const initialInputFieldsState: PartContentSub[] = [
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
    // placeholderText: 'Jumbo Title placeholder',
  },
  {
    id: 'subtitle',
    type: 'subtitle',
    label: 'Subtitle',
    value: 'This is the subtitle placeholder',
    // placeholderText: 'This is the subtitle placeholder',
  },
  {
    id: 'description',
    type: 'description',
    label: 'Description',
    value: '',
    // placeholderText: 'This is the description text placeholder',
  },
];

const JumbotronModalDialog = ({
  closeAction,
  inputObj,
  imageInput,
  classString,
  createNewBlockULBHandler,
  askBeforeClose,
  setUnsavedChanges,
  updateBlockContentULBHandler,
}: IJumbotronModalComponentProps) => {
  const {userLanguage} = useContext(GlobalContext);

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [isAnimationOn, setIsAnimationOn] = useState(false);

  //////////////////////////
  //  DATA STORAG         //
  //////////////////////////
  const [inputFieldsArray, setInputFieldsArray] = useState<PartContentSub[]>(
    initialInputFieldsState
  );
  const initialStyles = {
    tinting: 'Light',
    bgColor: 'bg-black',
    blur: 'Medium',
  };
  const [uploadProgress, setUploadProgress] = useState<string | number>(0);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      const imageUrl: string | undefined = inputObj.find(
        (input: any) => input.type === 'background'
      )?.value;

      setInputFieldsArray(inputObj);
      setImageInputs((prevValues) => ({
        ...prevValues,
        url: imageUrl || '',
      }));
      if (classString.length > 0) {
        const tint = classString?.split(' || ')[0].split(' ')[0] || '';
        const bgColor = classString?.split(' || ')[0].split(' ')[1] || '';
        const blurClass = classString?.split(' || ')[1].split(' ')[1] || '';
        const isAnimationEnabled = classString?.split(' || ').length === 3;
        setSelectedStyles({
          tinting: getReversedTint(tint),
          bgColor: bgColor,
          blur: generateReverseBlur(blurClass),
        });
        setIsAnimationOn(isAnimationEnabled);
      }
      setIsEditingMode(true);
    }
  }, [inputObj]);
  const [selectedStyles, setSelectedStyles] = useState(initialStyles);

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

  const imageRef = React.useRef();

  const onAnimationToggle = () => {
    if (imageRef && imageRef?.current) {
      if (!isAnimationOn) {
        // @ts-ignore
        imageRef?.current?.classList.add('fade__animation');
        setIsAnimationOn(true);
      } else {
        // @ts-ignore
        imageRef?.current?.classList.remove('fade__animation');
        setIsAnimationOn(false);
      }
    }
  };

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
    setUnsavedChanges(true);

    setImageInputs((prevValues) => ({...prevValues, url: previewUrl, imageData}));
    setErrors((prevValues) => ({...prevValues, url: ''}));
  };
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const onEdit = async () => {
    const updatedList = updateBlockContentULBHandler(
      '',
      '',
      'jumbotron',
      inputFieldsArray,
      null,
      generateClassString
    );

    await addToDB(updatedList);
  };

  const generateTinting = (level: string) => {
    switch (level) {
      case 'None':
        return `bg-opacity-0`;
      case 'Light':
        return `bg-opacity-10`;

      case 'Medium':
        return `bg-opacity-50`;

      case 'Dark':
        return `bg-opacity-75`;

      default:
        return `bg-opacity-0`;
    }
  };

  const getReversedTint = (opacity: string) => {
    switch (opacity) {
      case `bg-opacity-0`:
        return 'None';
      case 'bg-opacity-10':
        return `Light`;

      case 'bg-opacity-50':
        return `Medium`;

      case 'bg-opacity-75':
        return `Dark`;

      default:
        return `None`;
    }
  };

  const generateBlur = (level: string) => {
    switch (level) {
      case 'Low':
        return 'backdrop-blur-sm';
      case 'Medium':
        return 'backdrop-blur-md';

      case 'High':
        return 'backdrop-blur-lg';
    }
  };
  const generateReverseBlur = (level: string) => {
    switch (level) {
      case 'backdrop-blur-sm':
        return 'Low';
      case 'backdrop-blur-md':
        return 'Medium';

      case 'backdrop-blur-lg':
        return 'High';
    }
  };

  const generateClassString = `${generateTinting(selectedStyles.tinting)} ${
    selectedStyles.bgColor
  } || backdrop-filter ${generateBlur(selectedStyles.blur)} ${
    isAnimationOn ? ' || fade__animation ' : ''
  }`;
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
      const image = getImageFromS3Static(`ULB/content_image_${fileName}`);
      const input = {
        value: image,
        height: imageInputs.height,
        width: imageInputs.width,
        caption: imageInputs.caption,
      };
      const updatedData = inputFieldsArray.map((item) =>
        item.type === 'background' ? {...item, ...input} : item
      );
      if (isEditingMode) {
        const updatedList = updateBlockContentULBHandler(
          '',
          '',
          'jumbotron',
          updatedData,
          null,
          generateClassString
        );
        await addToDB(updatedList);
      } else {
        const updatedList = createNewBlockULBHandler(
          '',
          '',
          'jumbotron',
          updatedData,
          null,
          generateClassString
        );
        await addToDB(updatedList);
      }
      setIsLoading(false);
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
    setUnsavedChanges(true);
    const {id, value} = e.target as HTMLFormElement;
    handleUpdateInputFields(id, value);
  };

  const onJumbotronCreate = async () => {
    if (isEditingMode) {
      await onEdit();
    } else {
      await onSave();
    }

    setUnsavedChanges(false);

    // clear fields
    setInputFieldsArray(initialInputFieldsState);
  };

  const {curTab, setCurTab, helpers, goTo} = useTabs();
  const [onSetupTab, onPreviewTab] = helpers;
  const [toSetupTab] = goTo;

  const previewAvailable = url && url.length > 0;

  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const handleColorPickerSelect = (pickedColor: string) => {
    setSelectedStyles({...selectedStyles, bgColor: `bg-${pickedColor}`});
    setColorPickerActive(false);
  };

  return (
    <>
      <Tabs curTab={curTab} setCurTab={setCurTab} />

      <AnimatedContainer animationType="scale" show={onSetupTab}>
        {onSetupTab && (
          <div className="grid grid-cols-2 my-2 gap-4">
            <div className="col-span-2">
              {inputFieldsArray.map((inputObj: PartContentSub, idx: number) => {
                if (inputObj.id === 'background' && !isEditingMode) {
                  return (
                    <ULBFileUploader
                      key={`jumboform_${idx}`}
                      fileUrl={url}
                      updateFileUrl={updateFileUrl}
                      acceptedFilesFormat={'image/*'}
                      error={errors?.url}
                      classString={
                        'border-0 border-dashed border-gray-400 rounded-lg h-35 cursor-pointer p-2 mb-1'
                      }
                    />
                  );
                } else {
                  if (isEditingMode && inputObj.id === 'background') return;
                  const isDesc = inputObj.id === 'description';
                  return (
                    <div className="mb-2" key={`jumboform_${idx}`}>
                      <FormInput
                        onChange={onChange}
                        label={inputFieldsArray[idx]?.label}
                        isRequired={!isDesc}
                        textarea={isDesc}
                        value={inputFieldsArray[idx]?.value}
                        id={inputFieldsArray[idx]?.id}
                        placeHolder={inputFieldsArray[idx]?.placeholderText}
                        type="text"
                        rows={5}
                        showCharacterUsage={isDesc}
                        maxLength={650}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </AnimatedContainer>

      <AnimatedContainer animationType="scale" show={onPreviewTab}>
        {onPreviewTab &&
          (previewAvailable ? (
            <div className="my-4">
              <div
                ref={imageRef}
                className={`h-96 flex flex-col mb-4 justify-between z-10 items-center bg-cover max-w-256 bg-center rounded-lg`}
                style={{backgroundImage: `url(${url})`}}>
                <CustomizedQuoteBlock
                  bgClass={`${generateTinting(selectedStyles.tinting)} ${
                    selectedStyles.bgColor
                  }`}
                  textClass={`backdrop-filter ${generateBlur(selectedStyles.blur)}`}
                  title={inputFieldsArray[1]?.value || ''}
                  subtitle={inputFieldsArray[2]?.value || ''}
                  description={inputFieldsArray[3]?.value || ''}
                />
              </div>
              <p className="italic text-xs text-right text-gray-600">
                This is how jumbotron will look on page
              </p>
              <h4 className="font-semibold text-lg">Edit Jumbotron Styles: </h4>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="">
                  <Selector
                    placeholder="Tinting"
                    onChange={(c: any, name: string) =>
                      setSelectedStyles({...selectedStyles, tinting: name})
                    }
                    label={'Select Background Opacity'}
                    selectedItem={selectedStyles.tinting}
                    list={tinting}
                  />
                </div>

                <div className="relative h-full">
                  <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                    Select Background Color
                  </label>
                  <button
                    onClick={() => setColorPickerActive(!colorPickerActive)}
                    className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
                    <span className={'text-gray-700 w-auto text-sm mr-2 capitalize'}>
                      {selectedStyles.bgColor.split('-')[1]}
                    </span>

                    <span
                      className={`h-4 block w-4 ${selectedStyles.bgColor} rounded-full border-3 border-gray-400`}></span>
                  </button>
                  {colorPickerActive && (
                    <ColorPicker
                      isMainPage
                      classString={classString}
                      callbackColor={handleColorPickerSelect}
                      styleString={{top: '100%'}}
                    />
                  )}
                </div>
                <div className="">
                  <Selector
                    label={'Select Blur'}
                    placeholder="Blur"
                    onChange={(c: any, name: string) =>
                      setSelectedStyles({...selectedStyles, blur: name})
                    }
                    selectedItem={selectedStyles.blur}
                    list={blur}
                  />
                </div>
              </div>
              <div className="col-span-1 my-4 flex items-center w-auto">
                <Toggle
                  checked={isAnimationOn}
                  text="Animated Jumbotron"
                  // disabled={NO_BORDER_SELECTED}
                  onClick={onAnimationToggle}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 my-4">
              <div className="text-lg">Preview not available yet.</div>
              <div className="text-sm mt-2">
                <span
                  onClick={() => setCurTab(toSetupTab)}
                  className="w-auto cursor-pointer underline text-blue-400">
                  Add image
                </span>{' '}
                to see preview.
              </div>
            </div>
          ))}

        {loading && uploadProgress !== 'done' && (
          <ProgressBar
            status={uploadProgress < 99 ? 'Uploading Image' : 'Upload Done'}
            progress={uploadProgress}
          />
        )}
      </AnimatedContainer>

      <div className="flex mt-8 justify-between items-center px-6 pb-4">
        {onPreviewTab && previewAvailable ? (
          <Buttons
            btnClass="py-1 px-8 text-xs"
            label={'Reset to default'}
            onClick={() => setSelectedStyles(initialStyles)}
          />
        ) : (
          <div className="w-auto" />
        )}

        <div className="flex items-center w-auto">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
          />

          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={
              !loading ? (
                EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']
              ) : (
                <Loader />
              )
            }
            onClick={onJumbotronCreate}
            disabled={loading}
          />
        </div>
      </div>
    </>
  );
};

export default JumbotronModalDialog;
