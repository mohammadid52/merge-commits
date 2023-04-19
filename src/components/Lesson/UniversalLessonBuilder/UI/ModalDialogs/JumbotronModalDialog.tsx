import {
  EditQuestionModalDict,
  UniversalBuilderDict
} from '@dictionary/dictionary.iconoclast';
import {Card, Empty, Segmented, Tabs, TabsProps} from 'antd';
import Buttons from 'atoms/Buttons';
import ULBFileUploader from 'atoms/Form/FileUploader';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import {Storage} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from 'interfaces/UniversalLessonInterfaces';
import React, {useEffect, useState} from 'react';
import {getImageFromS3Static} from 'utilities/services';
import {blur, tinting} from 'utilities/staticData';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import CustomizedQuoteBlock from '../../../UniversalLessonBlockComponents/Blocks/JumbotronBlock/CustomizeQuoteBlock';
import ColorPicker from '../ColorPicker/ColorPicker';
import ProgressBar from '../ProgressBar';
import ToggleForModal from '../common/ToggleForModals';

const listOfResponsiveSizes = [
  {label: 'Mobile', value: 'w-1/2'},
  {label: 'Tablet', value: 'w-2/3'},
  {label: 'Laptop', value: 'w-8/10'},
  {label: 'Monitor', value: 'w-full'}
];

const PreviewWrapper = ({children}: {children: React.ReactNode}) => {
  const [selectedSize, setSelectedSize] = useState('Laptop');
  const size =
    listOfResponsiveSizes[
      listOfResponsiveSizes.findIndex((item) => item.label === selectedSize)
    ];
  return (
    <>
      <Segmented
        className="mb-2"
        defaultValue={selectedSize}
        onChange={(value) => setSelectedSize(value.toString())}
        options={listOfResponsiveSizes.map((d) => d.label)}
      />
      <div className={size.value}>{children}</div>
    </>
  );
};

const PreviewBlock = ({
  imageRef,
  url,
  bgClass,
  title,
  textClass,
  subtitle,
  description
}: {
  imageRef: React.RefObject<HTMLDivElement>;
  url: string;
  bgClass: string;
  textClass: string;
  subtitle: string;
  description: string;
  title: string;
}) => {
  return (
    <div
      ref={imageRef}
      className={`h-96 flex flex-col mb-4 justify-between z-10 items-center bg-cover max-w-256 bg-center rounded-lg`}
      style={{backgroundImage: `url(${url})`}}>
      <CustomizedQuoteBlock
        bgClass={bgClass}
        textClass={textClass}
        title={title}
        subtitle={subtitle}
        description={description}
      />
    </div>
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
      'https://images.freeimages.com/images/large-previews/d5d/powerlines-5-1389930.jpg'
  },
  {
    id: 'title',
    type: 'title',
    label: 'Title',
    value: 'Jumbo Title placeholder'
    // placeholderText: 'Jumbo Title placeholder',
  },
  {
    id: 'subtitle',
    type: 'subtitle',
    label: 'Subtitle',
    value: 'This is the subtitle placeholder'
    // placeholderText: 'This is the subtitle placeholder',
  },
  {
    id: 'description',
    type: 'description',
    label: 'Description',
    value: ''
    // placeholderText: 'This is the description text placeholder',
  }
];

const JumbotronModalDialog = ({
  closeAction,
  inputObj,

  classString = '',
  createNewBlockULBHandler,
  askBeforeClose,
  setUnsavedChanges,
  updateBlockContentULBHandler
}: IJumbotronModalComponentProps) => {
  const {userLanguage} = useGlobalContext();

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
    blur: 'Medium'
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
        url: imageUrl || ''
      }));
      if (classString.length > 0) {
        const tint = classString?.split(' || ')[0].split(' ')[0] || '';
        const bgColor = classString?.split(' || ')[0].split(' ')[1] || '';
        const blurClass = classString?.split(' || ')[1].split(' ')[1] || '';
        const isAnimationEnabled = classString?.split(' || ').length === 3;
        setSelectedStyles({
          tinting: getReversedTint(tint),
          bgColor: bgColor,
          blur: generateReverseBlur(blurClass) || 'Low'
        });
        setIsAnimationOn(isAnimationEnabled);
      }
      setIsEditingMode(true);
    }
  }, [inputObj]);
  const [selectedStyles, setSelectedStyles] = useState(initialStyles);
  console.log(
    '🚀 ~ file: JumbotronModalDialog.tsx:161 ~ selectedStyles:',
    selectedStyles
  );

  const [imageInputs, setImageInputs] = useState<IImageInput>({
    url: '',
    imageData: null,
    width: 'auto',
    height: 'auto',
    caption: ''
  });

  useEffect(() => {
    if (url !== '') {
      handleUpdateInputFields('background', imageInputs.url);
    }
  }, [imageInputs]);

  const imageRef = React.useRef<any>(null);

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
    height: ''
  });
  const [loading, setIsLoading] = useState<boolean>(false);

  const updateFileUrl = (previewUrl: string, imageData: File | null) => {
    setUnsavedChanges(true);

    setImageInputs((prevValues) => ({
      ...prevValues,
      url: previewUrl,
      imageData
    }));
    setErrors((prevValues) => ({...prevValues, url: ''}));
  };
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  const onEdit = async () => {
    const updatedList = updateBlockContentULBHandler(
      '',
      '',
      'jumbotron',
      inputFieldsArray,
      undefined,
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

      default:
        return 'backdrop-blur-md';
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
      default:
        return 'Medium';
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
      // @ts-ignore
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
        caption: imageInputs.caption
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
          undefined,
          generateClassString
        );
        await addToDB(updatedList);
      } else {
        const updatedList = createNewBlockULBHandler(
          '',
          '',
          'jumbotron',
          updatedData,
          undefined,
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
      height: ''
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
        acl: 'public-read',
        contentEncoding: 'base64',
        progressCallback: ({loaded, total}: any) => {
          const progress = (loaded * 100) / total;
          setUploadProgress(progress.toFixed(0));
        }
      })
        .then((result: any) => {
          console.log('File successfully uploaded to s3', result);
          setUploadProgress('done');

          resolve(true);
        })
        .catch((err: any) => {
          setErrors((prevValues) => ({
            ...prevValues,
            url: 'Unable to upload image. Please try again later. '
          }));
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const {url = ''} = imageInputs;

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

  const previewAvailable = url && url.length > 0;

  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const handleColorPickerSelect = (pickedColor: string) => {
    setSelectedStyles({...selectedStyles, bgColor: `bg-${pickedColor}`});
    setColorPickerActive(false);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Component Details`,
      children: (
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
                      'border-0 border-dashed border-light  rounded-lg h-35 cursor-pointer p-2 mb-1'
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
      )
    },
    {
      key: '2',
      label: `Settings`,
      children: (
        <>
          {previewAvailable ? (
            <div className="my-4">
              <PreviewBlock
                imageRef={imageRef}
                url={url}
                bgClass={`${generateTinting(selectedStyles.tinting)} ${
                  selectedStyles.bgColor
                }`}
                textClass={`backdrop-filter ${generateBlur(selectedStyles.blur)}`}
                title={inputFieldsArray[1]?.value || ''}
                subtitle={inputFieldsArray[2]?.value || ''}
                description={inputFieldsArray[3]?.value || ''}
              />

              <p className="italic mb-2 text-xs text-right text-medium ">
                This is how jumbotron will look on page
              </p>
              {/* <h4 className="font-semibold text-lg">Edit Jumbotron Styles: </h4> */}

              <Card type="inner" title="Configuration">
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="">
                    <Selector
                      placeholder="Tinting"
                      onChange={(name: string) => {
                        setSelectedStyles({...selectedStyles, tinting: name});
                      }}
                      label={'Select Background Opacity'}
                      selectedItem={selectedStyles.tinting}
                      list={tinting}
                    />
                  </div>

                  <div className="relative h-full">
                    <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                      Select Background Color
                    </label>
                    <button
                      onClick={() => setColorPickerActive(!colorPickerActive)}
                      className={`border-0 border-lightest  rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
                      <span className={'text-dark   w-auto text-sm mr-2 capitalize'}>
                        {selectedStyles.bgColor.split('-')[1]}
                      </span>

                      <span
                        className={`h-4 block w-4 ${selectedStyles.bgColor} rounded-full border-3 border-light `}></span>
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
                      onChange={(name: string) => {
                        setSelectedStyles({...selectedStyles, blur: name});
                      }}
                      selectedItem={selectedStyles.blur}
                      list={blur}
                    />
                  </div>
                </div>
                <div className="col-span-1 my-4 flex items-center w-auto">
                  <ToggleForModal
                    checked={isAnimationOn}
                    label="Animated Jumbotron"
                    // disabled={NO_BORDER_SELECTED}
                    onClick={onAnimationToggle}
                  />
                </div>
              </Card>
            </div>
          ) : (
            <Empty description="Preview not available yet. Please upload an image first." />
          )}

          {loading && uploadProgress !== 'done' && (
            <ProgressBar
              status={uploadProgress < 99 ? 'Uploading Image' : 'Upload Done'}
              progress={uploadProgress}
            />
          )}
        </>
      )
    },
    {
      key: '3',
      label: `Preview`,
      children: (
        <div>
          <PreviewWrapper>
            <PreviewBlock
              imageRef={imageRef}
              url={url}
              bgClass={`${generateTinting(selectedStyles.tinting)} ${
                selectedStyles.bgColor
              }`}
              textClass={`backdrop-filter ${generateBlur(selectedStyles.blur)}`}
              title={inputFieldsArray[1]?.value || ''}
              subtitle={inputFieldsArray[2]?.value || ''}
              description={inputFieldsArray[3]?.value || ''}
            />
          </PreviewWrapper>
        </div>
      )
    }
  ];

  return (
    <>
      <Tabs animated defaultActiveKey="1" items={items} />

      <div className="flex mt-8 justify-end gap-4 items-center px-6 pb-4">
        <Buttons
          label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
          onClick={askBeforeClose}
          transparent
          size="middle"
        />

        <Buttons
          label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
          loading={loading}
          size="middle"
          onClick={onJumbotronCreate}
          disabled={loading}
        />
      </div>
    </>
  );
};

export default JumbotronModalDialog;
