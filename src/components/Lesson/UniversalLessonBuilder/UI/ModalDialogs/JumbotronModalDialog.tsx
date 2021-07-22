import React, {useContext, useEffect, useState} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {
  EditQuestionModalDict,
  UniversalBuilderDict,
} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';
import Storage from '@aws-amplify/storage';
import ULBFileUploader from '../../../../Atoms/Form/FileUploader';
import Loader from '../../../../Atoms/Loader';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import {getImageFromS3} from '../../../../../utilities/services';
import {getAsset} from '../../../../../assets';
import QuoteBlock from '../../../UniversalLessonBlockComponents/Blocks/JumbotronBlock/QuoteBlock';
import Selector from '../../../../Atoms/Form/Selector';
import {blur, scrim, tinting} from '../../../../../utilities/staticData';
import ColorPicker from '../ColorPicker/ColorPicker';
import CustomizedQuoteBlock from '../../../UniversalLessonBlockComponents/Blocks/JumbotronBlock/CustomizeQuoteBlock';

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
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  //////////////////////////
  //  DATA STORAG         //
  //////////////////////////
  const [inputFieldsArray, setInputFieldsArray] = useState<PartContentSub[]>(
    initialInputFieldsState
  );
  const initialStyles = {
    tinting: 'Light',
    bgColor: 'black',
    blur: 'Medium',
  };
  const [selectedStyles, setSelectedStyles] = useState(initialStyles);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFieldsArray(inputObj);
      setIsEditingMode(true);
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

  const generateClassString = `${generateTinting(selectedStyles.tinting)} bg-${
    selectedStyles.bgColor
  } || backdrop-filter ${generateBlur(selectedStyles.blur)}`;
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

      const input = {
        value: `ULB/content_image_${fileName}`,
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

  const tabs = [
    {name: 'Component Details', current: true},
    {name: 'Preview', current: false},
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const [curTab, setCurTab] = useState(tabs[0].name);

  const previewAvailable = url && url.length > 0;

  const Tabs = () => {
    return (
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            defaultValue={tabs.find((tab) => tab.current).name}>
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setCurTab(tab.name)}
                  className={classNames(
                    curTab === tab.name
                      ? `border-${
                          themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                        }-500 text-${
                          themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                        }-600`
                      : 'border-transparent focus:outline-none text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'py-4 cursor-pointer px-1 text-center border-b-3 font-medium text-sm'
                  )}
                  aria-current={curTab === tab.name ? 'page' : undefined}>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const handleColorPickerSelect = (pickedColor: string) => {
    setSelectedStyles({...selectedStyles, bgColor: pickedColor});
    setColorPickerActive(false);
  };

  return (
    <>
      <Tabs />

      {curTab === 'Component Details' && (
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
                      isRequired
                      textarea={isDesc}
                      value={inputFieldsArray[idx]?.value}
                      id={inputFieldsArray[idx]?.id}
                      placeHolder={inputFieldsArray[idx]?.value}
                      type="text"
                      rows={2}
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

      {curTab === 'Preview' &&
        (previewAvailable ? (
          <div className="my-4">
            <div
              className={`h-96 flex flex-col mb-4 justify-between z-10 items-center bg-cover bg-right-top rounded-lg`}
              style={{backgroundImage: `url(${url})`}}>
              <CustomizedQuoteBlock
                bgClass={`${generateTinting(selectedStyles.tinting)} bg-${
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
                    {selectedStyles.bgColor.split('-')[0]}
                  </span>

                  <span
                    className={`h-4 block w-4 bg-${selectedStyles.bgColor} rounded-full border-3 border-gray-400`}></span>
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
          </div>
        ) : (
          <div className="text-center text-gray-500 my-4">
            <div className="text-lg">Preview not available yet.</div>
            <div className="text-sm mt-2">
              <span
                onClick={() => setCurTab(tabs[0].name)}
                className="w-auto cursor-pointer underline text-blue-400">
                Add image
              </span>{' '}
              to see preview.
            </div>
          </div>
        ))}

      <div className="flex mt-8 justify-between items-center px-6 pb-4">
        {curTab === 'Preview' && previewAvailable ? (
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
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
