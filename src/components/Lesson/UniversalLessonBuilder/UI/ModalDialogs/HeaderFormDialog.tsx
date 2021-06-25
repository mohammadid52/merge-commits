import React, {useContext, useState, useEffect} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import ColorPicker from '../ColorPicker/ColorPicker';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';

interface IHeaderModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  classString?: string;
  selectedPageID?: string;
  setUnsavedChanges: any;
  askBeforeClose?: () => void;
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
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const onChange = (e: any) => {
    setUnsavedChanges(true);
    const {value, id} = e.target;
    setInputFields({
      ...inputFields,
      [id]: value,
    });
  };
  const [inputFields, setInputFields] = useState<any>({});
  const FIELD_ID = 'header';

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFields((prevInputFields: any) => ({
        ...prevInputFields,
        [FIELD_ID]: inputObj[0],
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

  const onHeaderCreate = () => {
    const value: string = inputFields[FIELD_ID];
    const fontSizeClass: string = convertSizeNameToClass(selectedValues.size);
    const bgColorClass: string = selectedValues.color;
    const classValue = [
      fontSizeClass,
      `${bgColorClass ? `border-b-4 border-${bgColorClass}` : ''}`,
    ]
      .filter(Boolean)
      .join(' ');
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', 'header', [value], 0, classValue);
    } else {
      createNewBlockULBHandler('', '', 'header', [value], 0, classValue);
    }
    // close modal after saving
    closeAction();
    // clear fields
    setInputFields({
      ...inputFields,
      [FIELD_ID]: '',
    });
  };

  const fontSizeList = [
    {id: 1, name: 'smallest'},
    {id: 2, name: 'small'},
    {id: 3, name: 'medium'},
    {id: 4, name: 'large'},
    {id: 5, name: 'largest'},
  ];

  const [selectedValues, setSelectedValues] = useState({
    size: 'medium',
    color: '',
  });

  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const handleColorPickerSelect = (pickedColor: string) => {
    setSelectedValues({...selectedValues, color: pickedColor});
    setColorPickerActive(false);
  };

  return (
    <div>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          <FormInput
            onChange={onChange}
            label={'Header'}
            isRequired
            value={inputFields[FIELD_ID]}
            id={FIELD_ID}
            placeHolder={`Enter header text`}
            type="text"
          />
        </div>
        <Selector
          onChange={(c: any, name: string) =>
            setSelectedValues({...selectedValues, size: name})
          }
          list={fontSizeList}
          placeholder="Select font size"
          selectedItem={selectedValues.size}
        />
        <div className="relative h-full">
          <button
            onClick={() => setColorPickerActive(!colorPickerActive)}
            className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-center  h-full`}>
            <span className={'text-gray-700 w-auto text-sm mr-2'}>
              Select Border Color{' '}
            </span>

            <span
              className={`h-4 block w-4 bg-${selectedValues.color} rounded-full`}></span>
          </button>
          {colorPickerActive && (
            <ColorPicker
              classString={classString}
              callbackColor={handleColorPickerSelect}
              isMainPage={true}
              styleString={{top: '100%'}}
            />
          )}
        </div>
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
