import React, {useContext, useState} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {forEach, map, uniqueId} from 'lodash';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';

// {
//     id: 'page_2_part_1_questionGroup-1',
//     type: 'form-default',
//     value: [
//       {
//         id: 'title',
//         type: 'text-input',
//         label: 'Title',
//         value: 'This is the placeholder',
//       },
//       {
//         id: 'story',
//         type: 'text-area',
//         label: '',
//         value: 'This is the placeholder',
//       },
//     ],
//   },

const InputModalComponent = ({
  //   onChange,
  selectedPageID,
  //   setInputFields,
  //   inputFields,
  closeAction,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);
  const {addFromULBHandler} = useULBContext();
  const [inputFields, setInputFields] = useState<any>({});
  const onChange = (e: any) => {
    const {value, id} = e.target;
    setInputFields({
      ...inputFields,
      [id]: value,
    });
  };
  const onInputCreate = () => {
    const pageContentId: string = uniqueId(`${selectedPageID}_`);
    const partContentId: string = uniqueId(`${pageContentId}_`);

    const inputObjArray = generateInputAndPlaceholderValues();
    forEach(inputObjArray, (dataObj: any) => {
      const newDataObject = {
        id: pageContentId,
        partType: 'default',
        class: 'rounded-lg',
        partContent: [
          {
            id: partContentId,
            type: 'form-numbered',
            value: [dataObj],
          },
        ],
      };
      addFromULBHandler(selectedPageID, newDataObject);
    });

    // add data to list
    // close modal after saving
    closeAction();
    // clear fields
    forEach(inputList, ({id}: any) => {
      setInputFields({
        ...inputFields,
        [`formFieldInput_${id}`]: '',
        [`placeholder_${id}`]: '',
      });
    });
  };

  const [inputList, setInputList] = useState([{id: '9999'}]);

  const generateInputAndPlaceholderValues = () => {
    let values: any[] = [];
    forEach(inputList, ({id}: any) => {
      const inputValue = inputFields[`formFieldInput_${id}`];
      const placeHolderValue = inputFields[`placeholder_${id}`];
      const item = {
        id: uniqueId(),
        type: 'text-input',
        value: placeHolderValue,
        label: inputValue,
      };
      values.push(item);
    });

    return values;
  };

  const addOneInputField = () => {
    const newItem = {id: uniqueId()};
    setInputList([...inputList, newItem]);
  };

  return (
    <div>
      <div className="flex flex-col my-2">
        {map(inputList, (input: any, idx: number) => {
          const shouldShowActions = idx !== inputList.length - 1;
          return (
            <div className="flex flex-col ">
              <div className="flex items-center col-span-2">
                <div className="mr-4">
                  <FormInput
                    onChange={onChange}
                    label={'Form Title'}
                    isRequired
                    value={inputFields[`formFieldInput_${input.id}`]}
                    id={`formFieldInput_${input.id}`}
                    placeHolder={`Enter Form Field Title`}
                  />
                </div>
                <div>
                  <FormInput
                    onChange={onChange}
                    label={'Placeholder'}
                    isRequired
                    value={inputFields[`placeholder_${input.id}`]}
                    id={`placeholder_${input.id}`}
                    placeHolder={`Enter placeholder`}
                  />
                </div>
              </div>
              {shouldShowActions && (
                <div className="border-b-2 border-dashed border-gray-400 my-4"></div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <button
          onClick={addOneInputField}
          className="w-auto border-0 border-gray-300 p-2 px-4 text-tiny hover:border-gray-500 rounded-md text-dark transition-all duration-300 ">
          + Add Input
        </button>
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
            onClick={onInputCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default InputModalComponent;
