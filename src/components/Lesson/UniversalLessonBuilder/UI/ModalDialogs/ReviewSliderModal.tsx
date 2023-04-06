import {Tabs, TabsProps} from 'antd';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {find, map, omit} from 'lodash';
import React, {useEffect, useState} from 'react';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import ReviewSliderBlock, {
  extractValuesFromClassString
} from '../../../UniversalLessonBlockComponents/Blocks/ReviewSliderBlock';
import ColorPicker from '../ColorPicker/ColorPicker';
import {FORM_TYPES} from '../common/constants';
import DummyContent from '../Preview/DummyContent';
import PreviewLayout from '../Preview/Layout/PreviewLayout';

interface ReviewProps extends IContentTypeComponentProps {
  inputObj?: any;
  classString?: string;
}

const roundedCornerList = [
  {id: 0, label: 'None', value: 'rounded-none'},
  {id: 1, label: 'Small', value: 'rounded-sm'},
  {id: 2, label: 'Medium', value: 'rounded'},
  {id: 3, label: 'Large', value: 'rounded-lg'},
  {id: 4, label: 'Extra large', value: 'rounded-xl'}
];

// remove value from property from list
const roundedCornerListSelector = map(roundedCornerList, (item) => omit(item, ['value']));

const ReviewSliderModal = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
  askBeforeClose,
  setUnsavedChanges,
  classString
}: ReviewProps) => {
  const {userLanguage} = useGlobalContext();
  const {EditQuestionModalDict} = useDictionary();
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setIsEditingMode(true);
      const values = extractValuesFromClassString(inputObj[0].class);

      const {
        min = 1,
        max = 5,
        bgColor = '',
        fgColor = '',
        cardBgColor = '',
        rounded = ''
      } = values || {};

      const roundedParsedValue =
        find(roundedCornerList, (item) => item?.value === rounded)?.label ||
        roundedCornerList[3].label;

      setReviewFields({
        ...reviewFields,
        label: inputObj[0].label,
        value: inputObj[0].value,
        range: `${min}-${max}`,
        cardBgColor,
        cardCorners: roundedParsedValue,
        bgColor,
        fgColor
      });
    }
  }, [inputObj]);

  // fgColor = foreground color
  const [reviewFields, setReviewFields] = useState({
    label: '',
    value: ['1'],
    range: '1-5',
    previewValue: ['1'],
    bgColor: 'dark  ',
    fgColor: 'darkest   ',
    cardBgColor: 'dark  ',
    cardCorners: roundedCornerList[3].label
  });

  const [errors, setErrors] = useState({label: ''});

  const validate = () => {
    let isValid = true;
    if (!reviewFields.label) {
      isValid = false;
      errors.label = 'Please add a label';
    } else {
      errors.label = '';
    }
    setErrors({...errors});
    return isValid;
  };

  const onChange = (e: React.FormEvent) => {
    setUnsavedChanges(true);
    const {value, name} = e.target as HTMLFormElement;
    setReviewFields({...reviewFields, [name]: value});
    setErrors({...errors, [name]: ''});
  };

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };
    await updateLessonPageToDB(input);
  };

  const getClassValue = (): string => {
    const rounded =
      find(roundedCornerList, (item) => item.label === reviewFields.cardCorners)?.value ||
      'rounded-lg';
    return `${reviewFields.range} || ${reviewFields.bgColor} || ${reviewFields.fgColor} || ${reviewFields.cardBgColor} || ${rounded}`;
  };

  const onReviewSliderCreate = async () => {
    const isValid = validate();
    if (isValid) {
      // HOW TO READ BELOW CONSTANT -- '1-10 || red-100 || red-400 || dark   || rounded-lg
      const reviewSliderArray = [
        {
          id: uuidv4().toString(),
          type: FORM_TYPES.REVIEW_SLIDER,
          label: reviewFields.label,
          value: isEditingMode ? reviewFields.value : 1,
          class: getClassValue()
        }
      ];

      if (isEditingMode) {
        const updatedList = updateBlockContentULBHandler(
          '',
          '',
          `${FORM_TYPES.REVIEW_SLIDER}-form`,
          reviewSliderArray,
          0
        );
        await addToDB(updatedList);
      } else {
        const updatedList = createNewBlockULBHandler(
          '',
          '',
          `${FORM_TYPES.REVIEW_SLIDER}-form`,
          reviewSliderArray,
          0
        );
        await addToDB(updatedList);
      }
    }
  };

  const [colorPickerActiveBG, setColorPickerActiveBG] = useState<boolean>(false);
  const [colorPickerActiveFG, setColorPickerActiveFG] = useState<boolean>(false);
  const [colorPickerActiveCardBG, setColorPickerActiveCardBG] = useState<boolean>(false);

  const handleColorPickerSelect = (pickedColor: string, type: string) => {
    setReviewFields({
      ...reviewFields,
      [type === 'bg' ? 'bgColor' : type === 'fg' ? 'fgColor' : 'cardBgColor']: pickedColor
    });
  };

  const getColorDensity = (value: string | number) => `${(Number(value) * 10) / 100}%`;

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Component Details`,
      children: (
        <div className="grid grid-cols-3 my-2 gap-4">
          <div className="col-span-3">
            <div className={'my-2'}>
              <div className="mb-2">
                <FormInput
                  label={'Enter review title'}
                  onChange={onChange}
                  error={errors.label}
                  name={'label'}
                  isRequired
                  value={reviewFields?.label}
                  placeHolder={'Rate you experience'}
                />
              </div>
            </div>
          </div>
          <h3 className="col-span-3 text-base text-black font-medium">
            Customize slider
          </h3>
          <div className="col-span-1 ">
            <label
              htmlFor={'range'}
              className="mb-2 block text-xs font-semibold leading-5 text-dark  ">
              Select range
            </label>
            <Selector
              placeholder="Select range"
              selectedItem={reviewFields.range}
              onChange={(name) => setReviewFields({...reviewFields, range: name})}
              list={[
                {id: 0, value: '1-5', label: '1-5'},
                {id: 1, value: '1-10', label: '1-10'}
              ]}
            />
          </div>
          <div className="col-span-1 relative h-full">
            <label
              htmlFor={'bgColor'}
              className="mb-2 block text-xs font-semibold leading-5 text-dark  ">
              Select background color
            </label>
            <button
              onClick={() => setColorPickerActiveBG(!colorPickerActiveBG)}
              className={`border-0 border-lightest  rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
              <span className={'text-dark   w-auto text-sm mr-2 capitalize'}>
                {reviewFields.bgColor?.split('-')[0]}{' '}
                {getColorDensity(reviewFields.bgColor?.split('-')[1])}
              </span>

              <span
                className={`h-4 block w-4 bg-${reviewFields.bgColor} rounded-full border-3 border-light `}></span>
            </button>
            {colorPickerActiveBG && (
              <ColorPicker
                isMainPage
                classString={classString}
                callbackColor={(pickedColor) => {
                  setColorPickerActiveBG(false);
                  handleColorPickerSelect(pickedColor, 'bg');
                }}
                styleString={{top: '100%'}}
              />
            )}
          </div>
          <div className="col-span-1 relative h-full">
            <label
              htmlFor={'foreground'}
              className="mb-2 block text-xs font-semibold leading-5 text-dark  ">
              Select foreground color
            </label>
            <button
              onClick={() => setColorPickerActiveFG(!colorPickerActiveFG)}
              className={`border-0 border-lightest  rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
              <span className={'text-dark   w-auto text-sm mr-2 capitalize'}>
                {reviewFields.fgColor?.split('-')[0]}{' '}
                {getColorDensity(reviewFields.fgColor?.split('-')[1])}
              </span>

              <span
                className={`h-4 block w-4 bg-${reviewFields.fgColor} rounded-full border-3 border-light `}></span>
            </button>
            {colorPickerActiveFG && (
              <ColorPicker
                isMainPage
                classString={classString}
                callbackColor={(pickedColor) => {
                  setColorPickerActiveFG(false);
                  handleColorPickerSelect(pickedColor, 'fg');
                }}
                styleString={{top: '100%'}}
              />
            )}
          </div>
          <h3 className="col-span-3 text-base text-black font-medium">Customize card</h3>
          <div className="col-span-1 relative h-full">
            <label
              htmlFor={'foreground'}
              className="mb-2 block text-xs font-semibold leading-5 text-dark  ">
              Select card background color
            </label>
            <button
              onClick={() => setColorPickerActiveCardBG(!colorPickerActiveCardBG)}
              className={`border-0 border-lightest  rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
              <span className={'text-dark   w-auto text-sm mr-2 capitalize'}>
                {reviewFields.cardBgColor?.split('-')[0]}{' '}
                {getColorDensity(reviewFields.cardBgColor?.split('-')[1])}
              </span>

              <span
                className={`h-4 block w-4 bg-${reviewFields.cardBgColor} rounded-full border-3 border-light `}></span>
            </button>
            {colorPickerActiveCardBG && (
              <ColorPicker
                isMainPage
                classString={classString}
                callbackColor={(pickedColor) => {
                  setColorPickerActiveCardBG(false);
                  handleColorPickerSelect(pickedColor, 'cardBg');
                }}
                styleString={{top: '100%'}}
              />
            )}
          </div>
          <div className="col-span-1 ">
            <label
              htmlFor={'range'}
              className="mb-2 block text-xs font-semibold leading-5 text-dark  ">
              Select corners
            </label>
            <Selector
              placeholder="Select corners"
              selectedItem={reviewFields.cardCorners}
              onChange={(name) => setReviewFields({...reviewFields, cardCorners: name})}
              list={roundedCornerListSelector}
            />
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: `Preview`,
      children: (
        <PreviewLayout
          notAvailable={
            reviewFields.label.length === 0 ? 'Add label to see the preview' : false
          }>
          <DummyContent />

          <ReviewSliderBlock
            inputID={'preview_review_slider_id'}
            disabled={false}
            classString={getClassValue()}
            label={reviewFields.label}
            value={reviewFields.previewValue}
            onChange={(e) =>
              setReviewFields({
                ...reviewFields,
                previewValue: [e.target.value]
              })
            }
          />
          <DummyContent />
        </PreviewLayout>
      )
    }
  ];

  return (
    <>
      <Tabs items={items} />

      <div className="flex mt-4 justify-between px-6 pl-0 pb-4">
        <div className="flex items-center justify-end w-auto gap-4">
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
            size="middle"
          />

          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onReviewSliderCreate}
            size="middle"
          />
        </div>
      </div>
    </>
  );
};

export default ReviewSliderModal;
