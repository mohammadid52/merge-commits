import React, {useContext, useState, useEffect} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import ColorPicker from '../ColorPicker/ColorPicker';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import {Switch} from '@headlessui/react';
import {classNames} from '../FormElements/TextInput';

interface IHeaderModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  classString?: string;
  selectedPageID?: string;
  setUnsavedChanges: any;
  askBeforeClose: () => void;
}

const Toggle = ({
  checked,
  onClick,
  text,
  disabled,
  error,
}: {
  text?: string;
  error?: string;
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
      <Switch.Label as="span" className="ml-3 w-auto">
        <span className="text-sm font-medium text-red-500">{error}</span>
      </Switch.Label>
    </Switch.Group>
  );
};

interface IInput {
  title: string;
  animated?: boolean;
}

const HeaderModalComponent = ({
  closeAction,
  inputObj,
  classString,
  setUnsavedChanges,
  askBeforeClose,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: IHeaderModalComponentProps) => {
  const {userLanguage} = useContext(GlobalContext);

  const [errors, setErrors] = useState({animation: '', title: ''});
  const [selectedValues, setSelectedValues] = useState({
    size: 'medium',
    color: 'No Border',
  });

  // ---------- constants -------------
  const NO_BORDER_SELECTED = selectedValues.color === 'No Border';

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const onChange = (e: any) => {
    setUnsavedChanges(true);
    const {value, id} = e.target;
    setInputFields({
      ...inputFields,
      [id]: value,
    });
  };

  const onAnimationToggle = () => {
    if (!NO_BORDER_SELECTED) {
      setUnsavedChanges(true);

      setInputFields({
        ...inputFields,
        animated: !inputFields.animated,
      });
    } else {
      setErrors({...errors, animation: 'Please select border color first.'});
    }
  };

  const [inputFields, setInputFields] = useState<IInput>({title: '', animated: false});

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFields((prevInputFields: any) => ({
        ...prevInputFields,
        title: inputObj[0].value,
        animated: classString.includes('animated-border-on'),
      }));
      // retrieves the result of matching a string against border color
      const matchBorderColor: any[] | null = classString.match(/border-\w\w+-\d+/);
      setSelectedValues({
        size: convertClassToSizeName(classString),
        color:
          matchBorderColor && matchBorderColor.length
            ? matchBorderColor[0].split('border-')[1]
            : '',
      });
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const convertSizeNameToClass = (sizeName: string) => {
    switch (sizeName) {
      case 'smallest':
        return 'text-base';
      case 'small':
        return 'text-lg';
      case 'medium':
        return 'text-xl';
      case 'large':
        return 'text-2xl';
      case 'largest':
        return 'text-3xl';
      default:
        return 'text-xl';
    }
  };
  const convertClassToSizeName = (classString: string) => {
    let sizeName = 'medium';
    if (classString) {
      if (classString.includes('text-base')) {
        sizeName = 'smallest';
      } else if (classString.includes('text-lg')) {
        sizeName = 'small';
      } else if (classString.includes('text-xl')) {
        sizeName = 'medium';
      } else if (classString.includes('text-2xl')) {
        sizeName = 'large';
      } else if (classString.includes('text-3xl')) {
        sizeName = 'largest';
      } else {
        sizeName = 'medium';
      }
    }
    return sizeName;
  };

  const animationClass = 'animated-border-on fade__animation-short';

  const generateBorderCSS = () =>
    `animated-border animated-border-${selectedValues.color} ${
      inputFields.animated ? animationClass : ''
    } `;

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const onHeaderCreate = async () => {
    const isValid = validate();
    if (isValid) {
      const value: string = inputFields.title;
      const fontSizeClass: string = convertSizeNameToClass(selectedValues.size);

      // const borderColorCLass: string = selectedValues.color;
      const classValue = `${generateBorderCSS()} ${fontSizeClass}`;

      if (isEditingMode) {
        const updatedList: any = updateBlockContentULBHandler(
          '',
          '',
          'header',
          [{id: uuidv4().toString(), value}],
          0,
          classValue
        );

        await addToDB(updatedList);
      } else {
        const updatedList: any = createNewBlockULBHandler(
          '',
          '',
          'header',

          [{id: uuidv4().toString(), value}],
          0,
          classValue
        );
        await addToDB(updatedList);
      }

      // close modal after saving
      // clear fields
      setInputFields({
        ...inputFields,
        animated: false,
        title: '',
      });
    }
  };

  const fontSizeList = [
    {id: 1, name: 'smallest'},
    {id: 2, name: 'small'},
    {id: 3, name: 'medium'},
    {id: 4, name: 'large'},
    {id: 5, name: 'largest'},
  ];

  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const handleColorPickerSelect = (pickedColor: string) => {
    setErrors({...errors, animation: ''});
    setSelectedValues({...selectedValues, color: pickedColor});
    setColorPickerActive(false);
  };

  const validate = (): boolean => {
    let isValid = true;

    if (inputFields.title.trim().length <= 0) {
      errors.title = 'Please add title';
      isValid = false;
    } else {
      errors.title = '';
      isValid = true;
    }

    setErrors({...errors});
    return isValid;
  };

  return (
    <div>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          <FormInput
            onChange={onChange}
            label={'Title'}
            isRequired
            value={inputFields.title}
            id={'title'}
            placeHolder={`Enter title`}
            type="text"
            error={errors.title}
          />
        </div>

        <div className="col-span-1">
          <Selector
            label={'Select font size'}
            onChange={(c: any, name: string) =>
              setSelectedValues({...selectedValues, size: name})
            }
            list={fontSizeList}
            placeholder="Select font size"
            selectedItem={selectedValues.size}
          />
        </div>

        <div className="col-span-1 relative h-full">
          <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
            Select Border Color
          </label>
          <button
            onClick={() => setColorPickerActive(!colorPickerActive)}
            className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-start  h-10 px-3`}>
            <span className={'text-gray-700 w-auto text-sm mr-2 capitalize'}>
              {selectedValues.color.split('-')[0]}
            </span>

            <span
              className={`h-4 block w-4 bg-${selectedValues.color} rounded-full border-3 border-gray-400`}></span>
          </button>
          {colorPickerActive && (
            <ColorPicker
              isMainPage
              noneLabel="No Border"
              onNoneClick={() => {
                setSelectedValues({...selectedValues, color: 'No Border'});
                setColorPickerActive(false);
              }}
              classString={classString}
              callbackColor={handleColorPickerSelect}
              styleString={{top: '100%'}}
            />
          )}
        </div>
      </div>
      <div className="col-span-1 my-4 flex items-center w-auto">
        <Toggle
          error={errors.animation}
          checked={inputFields.animated}
          text="Animated Title"
          // disabled={NO_BORDER_SELECTED}
          onClick={onAnimationToggle}
        />
      </div>
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
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onHeaderCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderModalComponent;
