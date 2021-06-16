import React, {useContext, useState, useEffect} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {filter, forEach, map, remove, uniqueId, update} from 'lodash';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';
import {label} from 'aws-amplify';
import {IconContext} from 'react-icons';
import {IoMdAddCircleOutline, IoMdRemoveCircleOutline} from 'react-icons/io';
import {getAsset} from '../../../../../assets';
import {v4 as uuidv4} from 'uuid';

const InputModalComponent = ({
  selectedPageID,
  closeAction,
  contentType,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: any) => {
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const {addFromULBHandler} = useULBContext();

  // useEffect(() => {
  //   if (inputObj && inputObj.length) {
  //     let fieldsValue = {};
  //     setInputList(inputObj);
  //     // setIsEditingMode(true);
  //     forEach(inputObj, ({id, label, value}: any) => {
  //       fieldsValue = {
  //         ...fieldsValue,
  //         [`formFieldInput_${id}`]: label,
  //         [`placeholder_${id}`]: value,
  //       };
  //     });
  //     setInputFields(fieldsValue);
  //   }
  // }, [inputObj]);

  const modifiedOptions = (opt: any) =>
    map(opt, (o) => ({
      label: o.label,
      text: o.text,
    }));

  const valueArray = (partContentId: string) => {
    if (isEmoji) {
      return map(emojiInputList, (d: any, idx: number) => {
        return {
          id: partContentId,
          type: 'emoji-input',
          label: d.title,
          value: d.placeholder,
        };
      });
    } else if (isRadio) {
      return map(radioList, (d: any, idx: number) => {
        return {
          id: partContentId,
          type: 'radio-input',
          label: d.label,
          value: modifiedOptions(d.options),
        };
      });
    } else {
      return map(inputList, (d: any, idx: number) => {
        return {
          id: partContentId,
          type: `text-${d.textArea ? 'area' : 'input'}`,
          label: d.title,
          value: d.placeholder,
        };
      });
    }
  };

  const pushToULB = (pageContentId: string, partContentId: string, value: any) => {
    const newDataObject = {
      id: pageContentId,
      partType: 'default',
      class: 'rounded-lg',
      partContent: [
        {
          id: `${partContentId}_questionGroup`,
          type: `form-${numbered ? 'numbered' : 'default'}`,
          value,
        },
      ],
    };

    addFromULBHandler(selectedPageID, newDataObject);
  };

  const onFormCreate = () => {
    const pageContentId: string = `${uuidv4()}_`;
    const partContentId: string = `${pageContentId}_`;

    const inputObjArray = valueArray(partContentId);

    // add data to list
    pushToULB(pageContentId, partContentId, inputObjArray);

    // // close modal after saving
    closeAction();
  };

  const DEFAULT_OPTIONS = [
    {label: '1', text: '', id: '0'},
    {label: '2', text: '', id: '1'},
  ];

  const INITIAL_VALUE = {id: '9999', title: '', placeholder: ''};

  const [inputList, setInputList] = useState([{textArea: false, ...INITIAL_VALUE}]);
  const [emojiInputList, setEmojiInputList] = useState([{...INITIAL_VALUE}]);
  const [radioList, setRadioList] = useState([
    {id: '9999', label: '', options: DEFAULT_OPTIONS},
  ]);
  // this is UI list that shows multiple input fields on form

  // const [inputFields, setInputFields] = useState<any>({});
  // this is the data object that contains key values

  const INPUT = 'Input';
  const SELECT_ONE = 'Select One';
  const INPUT_WITH_EMOJI = 'Input With Emoji';
  const formTypes = [{label: INPUT}, {label: SELECT_ONE}, {label: INPUT_WITH_EMOJI}];
  const DEFAULT_FORM_TYPE = formTypes[0].label;

  const [selectedFormType, setSelectedFormType] = useState<string>(DEFAULT_FORM_TYPE);
  const isRadio = selectedFormType === SELECT_ONE;
  const isEmoji = selectedFormType === INPUT_WITH_EMOJI;

  const generateInputAndPlaceholderValues = () => {
    let values: any[] = [];
    forEach(
      inputList,
      ({
        id,
        textArea,
        title,
        placeholder,
      }: {
        id: string;
        textArea: boolean;
        title: string;
        placeholder: string;
      }) => {
        const item = {
          id,
          type: `text-${textArea ? 'area' : 'input'}`,
          value: placeholder || '',
          label: title,
        };
        values.push(item);
      }
    );

    return values;
  };

  const addOneInputField = () => {
    if (isRadio) {
      const newItem = {id: uuidv4(), label: '', options: DEFAULT_OPTIONS};
      setRadioList([...radioList, newItem]);
    } else if (isEmoji) {
      const newItem = {id: uuidv4(), title: '', placeholder: ''};
      setEmojiInputList([...emojiInputList, newItem]);
    } else {
      const newItem = {id: uuidv4(), textArea: false, title: '', placeholder: ''};
      setInputList([...inputList, newItem]);
    }
  };

  const changeCheckboxValue = (idx: number, currentValue: boolean) => {
    inputList[idx].textArea = !currentValue;
    setInputList([...inputList]);
  };

  const removeItemFromList = (id: string) => {
    if (isRadio) {
      remove(radioList, (n) => n.id === id);
      setRadioList([...radioList]);
    } else if (isEmoji) {
      remove(emojiInputList, (n) => n.id === id);
      setEmojiInputList([...emojiInputList]);
    } else {
      remove(inputList, (n) => n.id === id);
      setInputList([...inputList]);
    }
  };

  const Checkbox = ({val}: {val: boolean}) => {
    return (
      <>
        {val ? (
          <BiCheckboxChecked className="w-auto text-3xl text-blue-600 cursor-pointer" />
        ) : (
          <BiCheckbox className="w-auto text-3xl text-blue-600 cursor-pointer" />
        )}
        <p className="w-auto cursor-pointer">textarea</p>
      </>
    );
  };

  const onChange = (e: any, idx?: number, placeHolder: boolean = false) => {
    const {value} = e.target;
    if (isRadio) {
      update(radioList[idx], `label`, () => value);
      setRadioList([...radioList]);
    } else if (isEmoji) {
      update(emojiInputList[idx], placeHolder ? `placeholder` : 'title', () => value);
      setRadioList([...radioList]);
    } else {
      update(inputList[idx], placeHolder ? `placeholder` : 'title', () => value);
      setRadioList([...radioList]);
    }
  };

  const onOptionInputChange = (idx: number, idx2: number, e: any) => {
    update(radioList[idx], `options[${idx2}].text`, () => e.target.value);
    setRadioList([...radioList]);
  };

  const onOptionAdd = (idx: number, idx2: number) => {
    // adding new option field after selected options index.
    const currentOptions = [...radioList[idx].options];
    const newItem = {label: (idx2 + 2).toString(), text: '', id: uuidv4().toString()};
    currentOptions.splice(idx2 + 1, 0, newItem);
    let updatedOptions = currentOptions.map((item, i) => {
      if (i > idx2 + 1) {
        item.label = (i + 1).toString();
        return item;
      } else {
        return item;
      }
    });

    update(radioList[idx], `options`, () => updatedOptions);

    setRadioList([...radioList]);
  };

  const onOptionRemove = (idx: number, id: string) => {
    const options = radioList[idx].options;
    if (options.length === 1) return;
    else {
      remove(options, (n) => n.id === id);
      setRadioList([...radioList]);
    }
  };

  const [numbered, setNumbered] = useState(false);

  const getForm = (type: 'Input' | 'Select One' | 'Input With Emoji' | string) => {
    switch (type) {
      case INPUT:
        return (
          <div>
            {map(inputList, (input: any, idx: number) => {
              const shouldShowActions = idx !== inputList.length - 1;
              return (
                <div key={input.id} className="flex flex-col input-container">
                  <div className="">
                    <div className="mb-2">
                      <FormInput
                        onChange={(e) => onChange(e, idx, false)}
                        label={`${numbered ? `${idx + 1}. ` : ''}Form Title`}
                        isRequired
                        value={input.title}
                        id={`formFieldInput_${input.id}`}
                        placeHolder={`Enter Form Field Title`}
                      />
                    </div>
                    <div>
                      <FormInput
                        onChange={(e) => onChange(e, idx, true)}
                        label={'Placeholder'}
                        value={input.placeholder}
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
                          onClick={() => removeItemFromList(input.id)}
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
        );
      case SELECT_ONE:
        return (
          <div>
            {map(radioList, (input: any, idx: number) => {
              const shouldShowActions = idx !== radioList.length - 1;

              return (
                <div key={input.id} className="flex flex-col input-container">
                  <div className="">
                    <div className="mb-2">
                      <FormInput
                        onChange={(e) => onChange(e, idx)}
                        label={`${numbered ? `${idx + 1}. ` : ''}Radio Input`}
                        isRequired
                        value={radioList[idx].label}
                        id={`formFieldRadio_${input.id}`}
                        placeHolder={`Enter Radio Input Title`}
                      />
                      {/* Options input fields */}
                      {input.options?.length &&
                        input.options?.map((item: any, index: number) => {
                          // @ts-ignore

                          return (
                            <div
                              key={index.toLocaleString()}
                              className="flex w-9/10 mx-auto mt-4">
                              <div className="w-8/10">
                                <FormInput
                                  value={item.text}
                                  id={`formFieldRadioOption_${idx}_${index}`}
                                  onChange={(e) => onOptionInputChange(idx, index, e)}
                                  name={item.label}
                                  placeHolder={`Option ${index + 1}`}
                                />
                              </div>
                              <div className="w-1/10 ml-2 flex items-center">
                                <span
                                  className={`w-auto cursor-pointer ${theme.textColor[themeColor]} `}
                                  onClick={() => onOptionAdd(idx, index)}>
                                  <IconContext.Provider
                                    value={{
                                      size: '2rem',
                                      color: theme.iconColor[themeColor],
                                    }}>
                                    <IoMdAddCircleOutline />
                                  </IconContext.Provider>
                                </span>
                                <span
                                  className={`w-auto cursor-pointer ${theme.textColor[themeColor]} `}
                                  onClick={() => onOptionRemove(idx, item.id)}>
                                  <IconContext.Provider
                                    value={{
                                      size: '2rem',
                                      color: theme.iconColor[themeColor],
                                    }}>
                                    <IoMdRemoveCircleOutline />
                                  </IconContext.Provider>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {idx !== 0 && (
                      <div className="flex my-2 items-center justify-end w-auto mx-3">
                        <button
                          onClick={() => removeItemFromList(input.id)}
                          className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                          Remove
                        </button>
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
        );

      case INPUT_WITH_EMOJI:
        return (
          <div>
            {map(emojiInputList, (input: any, idx: number) => {
              const shouldShowActions = idx !== emojiInputList.length - 1;
              return (
                <div key={input.id} className="flex flex-col input-container">
                  <div className="mb-4">
                    <div className="mb-2">
                      <FormInput
                        onChange={(e) => onChange(e, idx)}
                        label={`${numbered ? `${idx + 1}. ` : ''}Form Title`}
                        isRequired
                        value={emojiInputList[idx].title}
                        id={`formFieldInput_${input.id}`}
                        placeHolder={`Enter Form Field Title`}
                      />
                    </div>
                    <div>
                      <FormInput
                        onChange={(e) => onChange(e, idx, true)}
                        label={'Placeholder'}
                        value={emojiInputList[idx].placeholder}
                        id={`placeholder_${input.id}`}
                        placeHolder={`Enter placeholder`}
                      />
                    </div>
                    {idx !== 0 && (
                      <div className="flex my-2 items-center justify-end w-auto mx-3">
                        <button
                          onClick={() => removeItemFromList(input.id)}
                          className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                          Remove
                        </button>
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
        );
    }
  };

  return (
    <div className="max-h-200 relative overflow-y-auto">
      <div className="w-auto flex item-center justify-between mb-4">
        <div className="flex items-center w-auto">
          {map(formTypes, ({label}) => (
            <button
              key={label}
              onClick={() => setSelectedFormType(label)}
              className={`${
                label === selectedFormType
                  ? 'border-indigo-500 text-white bg-indigo-400'
                  : 'border-gray-300 text-dark'
              } w-auto focus:border-indigo-600 p-2 px-4 text-tiny border-2 hover:border-gray-500 rounded-md  transition-all duration-300 mr-4`}>
              {label}
            </button>
          ))}
        </div>
        <button
          key={label}
          onClick={() => setNumbered(!numbered)}
          className={`${
            numbered
              ? 'border-indigo-500 text-white bg-indigo-400'
              : 'border-gray-300 text-dark'
          } w-auto p-2 px-4 focus:border-indigo-600 text-tiny border-2 hover:border-gray-500 rounded-md  transition-all duration-300 mr-4`}>
          {numbered ? 'Ordered Form' : 'Unordered Form'}
        </button>
      </div>

      <div className="flex flex-col my-2">{getForm(selectedFormType)}</div>
      <div className="flex items-center w-auto">
        <button
          onClick={addOneInputField}
          className="w-auto mr-4 border-2 focus:text-white focus:border-indigo-600 focus:bg-indigo-400 border-gray-300 p-2 px-4 text-tiny hover:border-gray-500 rounded-md text-dark transition-all duration-300 ">
          + Add Field
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
            onClick={onFormCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default InputModalComponent;
