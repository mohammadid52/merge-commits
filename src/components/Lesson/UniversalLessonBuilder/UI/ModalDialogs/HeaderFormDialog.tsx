import React, {useContext, useState} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import ColorPicker from '../ColorPicker/ColorPicker';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {uniqueId} from 'lodash';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';

const HeaderModalComponent = ({
  selectedPageID,

  closeAction,
  isEditingMode,
  updateBlockContentULBHandler,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);
  const {addFromULBHandler} = useULBContext();

  const onChange = (e: any) => {
    const {value, id} = e.target;
    setInputFields({
      ...inputFields,
      [id]: value,
    });
  };
  const [inputFields, setInputFields] = useState<any>({});
  const FIELD_ID = 'header';

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
  const onHeaderCreate = () => {
    const value: string = inputFields[FIELD_ID];
    const pageContentId: string = uniqueId(`${selectedPageID}_`);
    const partContentId: string = uniqueId(`${pageContentId}_`);
    const fontSizeClass: string = convertSizeNameToClass(selectedValues.size);
    const bgColorClass: string = selectedValues.color;
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', 'header-section', [value]);
    } else {
      const newDataObject = {
        id: pageContentId,
        partType: 'default',
        class: 'rounded-lg',
        partContent: [
          {
            id: partContentId,
            type: 'header-section',
            value: [value],
            class: `${fontSizeClass} border-${bgColorClass}`,
          },
        ],
      };
      // add data to list
      addFromULBHandler(selectedPageID, newDataObject);
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
    color: 'sea-green',
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
        <button
          onClick={() => setColorPickerActive(!colorPickerActive)}
          className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-center`}>
          <span className={'text-gray-700 w-auto text-sm mr-2'}>
            Select Border Color{' '}
          </span>

          <span
            className={`h-4 block w-4 bg-${selectedValues.color} rounded-full`}></span>
        </button>
        {colorPickerActive && (
          <ColorPicker classString={''} callbackColor={handleColorPickerSelect} />
        )}
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
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onHeaderCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderModalComponent;
