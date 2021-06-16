import React, {useContext, useState, useEffect} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {every, filter, forEach, map, uniqueId, values} from 'lodash';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';

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
  selectedPageID,
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const {addFromULBHandler} = useULBContext();

  const onChange = (e: any) => {
    const {value, id} = e.target;
    setInputFields({
      ...inputFields,
      [id]: value,
    });
  };

  useEffect(() => {
    if (inputObj && inputObj.length) {
      let fieldsValue = {};
      setInputList(inputObj.map((input:any) => ({...input, textArea: input.type.includes('area')})));
      forEach(inputObj, ({id, label, value}: any) => {
        fieldsValue = {
          ...fieldsValue,
          [`formFieldInput_${id}`]: label,
          [`placeholder_${id}`]: value,
        };
      });
      setInputFields(fieldsValue);
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const onInputCreate = () => {
    const pageContentId: string = uniqueId(`${selectedPageID}_`);
    const partContentId: string = uniqueId(`${pageContentId}_`);
    // const readyToGo = validateFieldBeforeSave();
    const inputObjArray = generateInputAndPlaceholderValues();
    const contentType = `form-${numberedForm ? 'numbered' : 'default'}`;
    if (isEditingMode) {
      updateBlockContentULBHandler(
        '',
        '',
        contentType,
        inputObjArray,
      );
    } else {
      createNewBlockULBHandler(
        '',
        '',
        contentType,
        inputObjArray,
      );
      }
    // const newDataObject = {
    //   id: pageContentId,
    //   partType: 'default',
    //   class: 'rounded-lg',
    //   partContent: [
    //     {
    //       id: `${partContentId}_questionGroup`,
    //       type: `form-${numberedForm ? 'numbered' : 'default'}`,
    //       value: inputObjArray,
    //     },
    //   ],
    // };
    // // add data to list
    // addFromULBHandler(selectedPageID, newDataObject);
    // // close modal after saving
    closeAction();
    // // clear fields
    forEach(inputList, ({id}: any) => {
      setInputFields({
        ...inputFields,
        [`formFieldInput_${id}`]: '',
        [`placeholder_${id}`]: '',
      });
    });
  };

  const [inputList, setInputList] = useState([{id: '9999', textArea: false}]);
  const [numberedForm, setNumberedForm] = useState(false);
  const [inputFields, setInputFields] = useState<any>({});

  const generateInputAndPlaceholderValues = () => {
    let values: any[] = [];
    forEach(inputList, ({id, textArea}: {id: string; textArea: boolean}) => {
      const inputValue = inputFields[`formFieldInput_${id}`];
      const placeHolderValue = inputFields[`placeholder_${id}`];
      const item = {
        id: uniqueId(),
        type: `text-${textArea ? 'area' : 'input'}`,
        value: placeHolderValue || '',
        label: inputValue,
      };
      values.push(item);
    });

    return values;
  };

  const validateFieldBeforeSave = (): boolean => {
    let inputFieldValueArray = values(inputFields);
    let isAllFieldsFilled: boolean = every(
      inputFieldValueArray,
      (value: string) => value !== ''
    );

    return !isAllFieldsFilled;
  };

  const addOneInputField = () => {
    const newItem = {id: uniqueId(), textArea: false};
    setInputList([...inputList, newItem]);
  };

  const changeCheckboxValue = (idx: number, currentValue: boolean) => {
    inputList[idx].textArea = !currentValue;
    setInputList([...inputList]);
  };

  const removeInputFromList = (id: string) => {
    const itemRemovedList = filter(inputList, (input: any) => input.id !== id);
    setInputList([...itemRemovedList]);
  };

  const Checkbox = ({val}: {val: boolean}) => {
    return (
      <>
        {val ? (
          <BiCheckboxChecked className="w-auto text-3xl text-blue-600" />
        ) : (
          <BiCheckbox className="w-auto text-3xl text-blue-600" />
        )}
        <p className="w-auto">textarea</p>
      </>
    );
  };

  return (
    <div className="max-h-200 overflow-y-auto">
      <div className="flex flex-col my-2">
        {map(inputList, (input: any, idx: number) => {
          const shouldShowActions = idx !== inputList.length - 1;
          return (
            <div key={input.id} className="flex flex-col input-container">
              <div className="">
                <div className="mb-2">
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
                    value={inputFields[`placeholder_${input.id}`]}
                    id={`placeholder_${input.id}`}
                    placeHolder={`Enter placeholder`}
                  />
                </div>
                {idx !== 0 ? (
                  <div className="flex my-2 items-center justify-end w-auto mx-3">
                    <div
                      onClick={() => changeCheckboxValue(idx, input.textArea)}
                      className="flex items-center mr-2 justify-between self-end text-gray-500 font-medium w-auto">
                      <Checkbox val={input.textArea} />
                    </div>

                    <button
                      onClick={() => removeInputFromList(input.id)}
                      className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => changeCheckboxValue(idx, input.textArea)}
                    className="flex cursor-pointer items-center justify-end text-gray-500 font-medium w-auto mx-3 self-end mt-2">
                    <Checkbox val={input.textArea} />
                  </div>
                )}
              </div>
              {shouldShowActions && (
                <div className="border-b-2 border-dashed border-gray-300 my-4 "></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center w-auto">
        <button
          onClick={addOneInputField}
          className="w-auto mr-4 border-0 border-gray-300 p-2 px-4 text-tiny hover:border-gray-500 rounded-md text-dark transition-all duration-300 ">
          + Add Input
        </button>

        <button
          onClick={() => setNumberedForm(!numberedForm)}
          className="w-auto border-0 border-gray-300 p-2 px-4 text-tiny hover:border-gray-500 rounded-md text-dark transition-all duration-300 ">
          Form type : {numberedForm ? 'Numbered' : 'Default'}
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
