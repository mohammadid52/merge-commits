import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import {FORM_TYPES} from '../common/constants';
import {v4 as uuidv4} from 'uuid';
import Selector from '../../../../Atoms/Form/Selector';
import ColorPicker from '../ColorPicker/ColorPicker';
import Tabs from '../UIComponents/Tabs';
import ReviewSliderBlock, {
  extractValuesFromClassString,
} from '../../../UniversalLessonBlockComponents/Blocks/ReviewSliderBlock';
import {find, map, omit} from 'lodash';

interface ReviewProps extends IContentTypeComponentProps {
  inputObj?: any;
  classString?: string;
}

const roundedCornerList = [
  {id: 0, name: 'None', value: 'rounded-none'},
  {id: 1, name: 'Small', value: 'rounded-sm'},
  {id: 2, name: 'Medium', value: 'rounded'},
  {id: 3, name: 'Large', value: 'rounded-lg'},
  {id: 4, name: 'Extra large', value: 'rounded-xl'},
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
  classString,
}: ReviewProps) => {
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setIsEditingMode(true);
      const {
        min,
        max,
        bgColor,
        fgColor,
        cardBgColor,
        rounded,
      } = extractValuesFromClassString(inputObj.class);

      setReviewFields({
        ...reviewFields,
        label: inputObj[0].label,
        value: inputObj[0].value,
        range: `${min}-${max}`,
        cardBgColor,
        cardCorners: rounded,
        bgColor,
        fgColor,
      });
    }
  }, [inputObj]);

  // fgColor = foreground color
  const [reviewFields, setReviewFields] = useState({
    label: '',
    value: ['1'],
    range: '1-5',
    previewValue: ['1'],
    bgColor: 'gray-700',
    fgColor: 'gray-800',
    cardBgColor: 'gray-700',
    cardCorners: roundedCornerList[3].name,
  });

  const [errors, setErrors] = useState({label: ''});

  const validate = () => {
    let isValid = true;
    if (!reviewFields.label) {
      isValid = false;
      errors.label = 'Please add a label';
    } else {
      isValid = true;
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
      lessonPlan: [...list.lessonPlan],
    };
    await updateLessonPageToDB(input);
  };

  const getClassValue = (): string => {
    const rounded =
      find(roundedCornerList, (item) => item.name === reviewFields.cardCorners)?.value ||
      'rounded-lg';
    return `${reviewFields.range} || ${reviewFields.bgColor} || ${reviewFields.fgColor} || ${reviewFields.cardBgColor} || ${rounded}`;
  };
  const onReviewSliderCreate = async () => {
    const isValid = validate();
    if (isValid) {
      // HOW TO READ BELOW CONSTANT -- '1-10 || red-100 || red-400 || gray-700 || rounded-lg
      const reviewSliderArray = [
        {
          id: uuidv4().toString(),
          type: FORM_TYPES.REVIEW_SLIDER,
          label: reviewFields.label,
          value: isEditingMode ? reviewFields.value : ['1'],
          class: getClassValue(),
        },
      ];
      if (isEditingMode) {
        const updatedList = updateBlockContentULBHandler(
          '',
          '',
          FORM_TYPES.REVIEW_SLIDER,
          reviewSliderArray,
          0
        );
        await addToDB(updatedList);
      } else {
        const updatedList = createNewBlockULBHandler(
          '',
          '',
          FORM_TYPES.REVIEW_SLIDER,
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
      [type === 'bg'
        ? 'bgColor'
        : type === 'fg'
        ? 'fgColor'
        : 'cardBgColor']: pickedColor,
    });
  };

  const getColorDensity = (value: string | number) => `${(Number(value) * 10) / 100}%`;

  const tabs = [
    {name: 'Component Details', current: true},
    {name: 'Preview', current: false},
  ];

  const [curTab, setCurTab] = useState(tabs[0].name);

  return (
    <>
      <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} />

      {curTab === tabs[0].name && (
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
              className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
              Select range
            </label>
            <Selector
              placeholder="Select range"
              selectedItem={reviewFields.range}
              onChange={(_, name) => setReviewFields({...reviewFields, range: name})}
              list={[
                {id: 0, name: '1-5'},
                {id: 1, name: '1-10'},
              ]}
            />
          </div>
          <div className="col-span-1 relative h-full">
            <label
              htmlFor={'bgColor'}
              className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
              Select background color
            </label>
            <button
              onClick={() => setColorPickerActiveBG(!colorPickerActiveBG)}
              className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
              <span className={'text-gray-700 w-auto text-sm mr-2 capitalize'}>
                {reviewFields.bgColor.split('-')[0]}{' '}
                {getColorDensity(reviewFields.bgColor.split('-')[1])}
              </span>

              <span
                className={`h-4 block w-4 bg-${reviewFields.bgColor} rounded-full border-3 border-gray-400`}></span>
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
              className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
              Select foreground color
            </label>
            <button
              onClick={() => setColorPickerActiveFG(!colorPickerActiveFG)}
              className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
              <span className={'text-gray-700 w-auto text-sm mr-2 capitalize'}>
                {reviewFields.fgColor.split('-')[0]}{' '}
                {getColorDensity(reviewFields.fgColor.split('-')[1])}
              </span>

              <span
                className={`h-4 block w-4 bg-${reviewFields.fgColor} rounded-full border-3 border-gray-400`}></span>
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
              className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
              Select card background color
            </label>
            <button
              onClick={() => setColorPickerActiveCardBG(!colorPickerActiveCardBG)}
              className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
              <span className={'text-gray-700 w-auto text-sm mr-2 capitalize'}>
                {reviewFields.cardBgColor.split('-')[0]}{' '}
                {getColorDensity(reviewFields.cardBgColor.split('-')[1])}
              </span>

              <span
                className={`h-4 block w-4 bg-${reviewFields.cardBgColor} rounded-full border-3 border-gray-400`}></span>
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
              className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
              Select corners
            </label>
            <Selector
              placeholder="Select corners"
              selectedItem={reviewFields.cardCorners}
              onChange={(_, name) =>
                setReviewFields({...reviewFields, cardCorners: name})
              }
              list={roundedCornerListSelector}
            />
          </div>
        </div>
      )}

      {curTab === tabs[1].name &&
        (reviewFields.label ? (
          <ReviewSliderBlock
            inputID={'preview_review_slider_id'}
            disabled={false}
            classString={getClassValue()}
            label={reviewFields.label}
            value={reviewFields.previewValue}
            onChange={(e) =>
              setReviewFields({...reviewFields, previewValue: [e.target.value]})
            }
          />
        ) : (
          <div className="h-12 bg-dark-gray rounded-lg mt-4 flex items-center justify-center">
            <p className="text-white text-lg text-center">Add label to see the preview</p>
          </div>
        ))}

      <div className="flex mt-4 justify-between px-6 pl-0 pb-4">
        {curTab === tabs[0].name ? (
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={'See the preview'}
            onClick={() => setCurTab(tabs[1].name)}
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
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onReviewSliderCreate}
          />
        </div>
      </div>
    </>
  );
};

export default ReviewSliderModal;
