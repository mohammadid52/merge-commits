import React, {useContext, useState, useEffect} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {map, remove, update} from 'lodash';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';

import {getAsset} from '../../../../../assets';
import {v4 as uuidv4} from 'uuid';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import RemoveInput from '../common/RemoveInput';
import {
  FORM_TYPES,
  INPUT,
  INPUT_WITH_EMOJI,
  SELECT_ONE,
  LINK,
  SELECT_MANY,
} from '../common/constants';

interface InputModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  contentType?: any;
}

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

const TextInput = ({
  list,
  onChange,
  numbered,
  removeItemFromList,
  changeCheckboxValue,
}: any) => {
  return (
    <div>
      {map(list, (input: any, idx: number) => {
        const shouldShowActions = idx !== list.length - 1;
        return (
          <div key={input.id} className="flex flex-col input-container">
            <div className="px-2">
              <div className="mb-2 ">
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
};

const SelectOne = ({
  list,
  onChange,
  numbered,
  onOptionInputChange,
  getColor,
  removeItemFromList,
  onOptionRemove,
  onOptionAdd,
  themeColor,
}: any) => {
  return (
    <div>
      {map(list, (input: any, idx: number) => {
        const shouldShowActions = idx !== list.length - 1;
        console.log(list);

        return (
          <div key={input.id} className="flex flex-col input-container">
            <div className="px-2">
              <div className="mb-2">
                <FormInput
                  onChange={(e) => onChange(e, idx)}
                  label={`${numbered ? `${idx + 1}. ` : ''}Radio Input`}
                  isRequired
                  value={input.label}
                  id={`formField_${input.id}`}
                  placeHolder={`Enter Title`}
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
                        <div className="w-auto flex items-center">
                          <div className="flex items-center justify-end w-auto ml-3">
                            <button
                              onClick={() => onOptionAdd(idx, index)}
                              className={`text-center w-20 transition-all duration-200 ${getColor(
                                themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                              )} text-xs font-semibold text-gray-400 border-gray-200 px-2 py-1 cursor-pointer rounded  border-2 hover:text-gray-600`}>
                              Add
                            </button>
                          </div>
                          <div className="flex items-center justify-end w-auto ml-3">
                            <button
                              onClick={() => onOptionRemove(idx, item.id)}
                              className={`text-center focus:outline-none focus:bg-red-200 focus:border-transparent w-20 transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded border-2 hover:text-red-600`}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <RemoveInput
                idx={idx}
                inputId={input.id}
                removeItemFromList={removeItemFromList}
              />
            </div>
            {shouldShowActions && (
              <div className="border-b-2 border-dashed border-gray-300 my-4 "></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SelectMany = ({
  list,
  onChange,
  numbered,
  onOptionInputChange,
  getColor,
  removeItemFromList,
  onOptionRemove,
  onOptionAdd,
  themeColor,
}: any) => {
  return (
    <div>
      {map(list, (input: any, idx: number) => {
        const shouldShowActions = idx !== list.length - 1;

        return (
          <div key={input.id} className="flex flex-col input-container">
            <div className="px-2">
              <div className="mb-2">
                <FormInput
                  onChange={(e) => onChange(e, idx)}
                  label={`${numbered ? `${idx + 1}. ` : ''}Checkpoint Input`}
                  isRequired
                  value={input.label}
                  id={`formField_${input.id}`}
                  placeHolder={`Enter Title`}
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
                            id={`formFieldMultipleOption_${idx}_${index}`}
                            onChange={(e) => onOptionInputChange(idx, index, e)}
                            name={item.label}
                            placeHolder={`Option ${index + 1}`}
                          />
                        </div>
                        <div className="w-auto flex items-center">
                          <div className="flex items-center justify-end w-auto ml-3">
                            <button
                              onClick={() => onOptionAdd(idx, index)}
                              className={`text-center w-20 transition-all duration-200 ${getColor(
                                themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                              )} text-xs font-semibold text-gray-400 border-gray-200 px-2 py-1 cursor-pointer rounded  border-2 hover:text-gray-600`}>
                              Add
                            </button>
                          </div>
                          <div className="flex items-center justify-end w-auto ml-3">
                            <button
                              onClick={() => onOptionRemove(idx, item.id)}
                              className={`text-center focus:outline-none focus:bg-red-200 focus:border-transparent w-20 transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded border-2 hover:text-red-600`}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <RemoveInput
                idx={idx}
                inputId={input.id}
                removeItemFromList={removeItemFromList}
              />
            </div>
            {shouldShowActions && (
              <div className="border-b-2 border-dashed border-gray-300 my-4 "></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const InputWithEmoji = ({list, onChange, numbered, removeItemFromList}: any) => {
  return (
    <div>
      {map(list, (input: any, idx: number) => {
        const shouldShowActions = idx !== list.length - 1;
        return (
          <div key={input.id} className="flex flex-col input-container">
            <div className="mb-4 px-2">
              <div className="mb-2">
                <FormInput
                  onChange={(e) => onChange(e, idx)}
                  label={`${numbered ? `${idx + 1}. ` : ''}Form Title`}
                  isRequired
                  value={list[idx].title}
                  id={`formFieldInput_${input.id}`}
                  placeHolder={`Enter Form Field Title`}
                />
              </div>
              <div>
                <FormInput
                  onChange={(e) => onChange(e, idx, true)}
                  label={'Placeholder'}
                  value={list[idx].placeholder}
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
};

const InputModalComponent = ({
  closeAction,
  contentType,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: InputModalComponentProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setNumbered(contentType.includes('numbered'));
      if (inputObj[0].type === FORM_TYPES.RADIO) {
        setRadioList(
          inputObj.map((input: any) => ({
            ...input,
            options: input.value,
          }))
        );
        setSelectedFormType(SELECT_ONE);
      } else if (inputObj[0].type === FORM_TYPES.EMOJI) {
        setEmojiInputList(
          inputObj.map((input: any) => ({
            ...input,
            title: input.label,
            placeholder: input.value,
          }))
        );
        setSelectedFormType(INPUT_WITH_EMOJI);
      } else {
        setInputList(
          inputObj.map((input: any) => ({
            ...input,
            textArea: input.type.includes('area'),
            title: input.label,
            placeholder: input.value,
          }))
        );
        setSelectedFormType(INPUT);
      }
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const modifiedOptions = (opt: any) =>
    map(opt, (o) => ({
      label: o.label,
      text: o.text,
    }));

  const valueArray = (partContentId: string) => {
    if (isEmoji) {
      return map(emojiInputList, (d: any) => {
        return {
          id: partContentId,
          type: FORM_TYPES.EMOJI,
          label: d.title,
          value: d.placeholder,
        };
      });
    } else if (isMultiple) {
      return map(manyOptionList, (d: any) => {
        return {
          id: partContentId,
          type: FORM_TYPES.MULTIPLE,
          label: d.label,
          value: modifiedOptions(d.options),
        };
      });
    } else if (isRadio) {
      return map(radioList, (d: any) => {
        return {
          id: partContentId,
          type: FORM_TYPES.RADIO,
          label: d.label,
          value: modifiedOptions(d.options),
        };
      });
    } else {
      return map(inputList, (d: any) => {
        return {
          id: partContentId,
          type: d.textArea ? FORM_TYPES.TEXTAREA : FORM_TYPES.TEXT,
          label: d.title,
          value: d.placeholder,
        };
      });
    }
  };

  const onFormCreate = () => {
    const pageContentId: string = `${uuidv4()}_`;
    const partContentId: string = `${pageContentId}_`;

    const inputObjArray = valueArray(partContentId);
    const type: string = `form-${numbered ? 'numbered' : 'default'}`;
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', type, inputObjArray);
    } else {
      createNewBlockULBHandler('', '', type, inputObjArray);
    }

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
  const [manyOptionList, setManyOptionList] = useState([
    {id: '9999', label: '', options: DEFAULT_OPTIONS},
  ]);

  const [radioList, setRadioList] = useState([
    {id: '9999', label: '', options: DEFAULT_OPTIONS},
  ]);

  const formTypes = [
    {label: INPUT, type: FORM_TYPES.TEXT},
    {label: SELECT_ONE, type: FORM_TYPES.RADIO},
    {label: SELECT_MANY, type: FORM_TYPES.MULTIPLE},
    {label: LINK, type: FORM_TYPES.LINK},
    {label: INPUT_WITH_EMOJI, type: FORM_TYPES.EMOJI},
  ];
  const DEFAULT_FORM_TYPE = formTypes[0].label;

  const [selectedFormType, setSelectedFormType] = useState<string>(DEFAULT_FORM_TYPE);
  const isRadio = selectedFormType === SELECT_ONE;
  const isMultiple = selectedFormType === SELECT_MANY;
  const isEmoji = selectedFormType === INPUT_WITH_EMOJI;

  const addOneInputField = () => {
    if (isRadio) {
      const newItem = {id: uuidv4(), label: '', options: DEFAULT_OPTIONS};
      setRadioList([...radioList, newItem]);
    } else if (isMultiple) {
      const newItem = {id: uuidv4(), label: '', options: DEFAULT_OPTIONS};

      setManyOptionList([...manyOptionList, newItem]);
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

  const onChange = (e: any, idx?: number, placeHolder: boolean = false) => {
    const {value} = e.target;
    if (isRadio) {
      update(radioList[idx], `label`, () => value);
      setRadioList([...radioList]);
    } else if (isMultiple) {
      update(manyOptionList[idx], `label`, () => value);
      setManyOptionList([...manyOptionList]);
    } else if (isEmoji) {
      update(emojiInputList[idx], placeHolder ? `placeholder` : 'title', () => value);
      setRadioList([...radioList]);
    } else {
      update(inputList[idx], placeHolder ? `placeholder` : 'title', () => value);
      setRadioList([...radioList]);
    }
  };

  const onOptionInputChange = (idx: number, idx2: number, e: any) => {
    if (isRadio) {
      update(radioList[idx], `options[${idx2}].text`, () => e.target.value);
      setRadioList([...radioList]);
    } else {
      update(manyOptionList[idx], `options[${idx2}].text`, () => e.target.value);
      setManyOptionList([...manyOptionList]);
    }
  };

  const onOptionAdd = (idx: number, idx2: number) => {
    if (isRadio) {
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
    } else if (isMultiple) {
      const currentOptions = [...manyOptionList[idx].options];
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
      update(manyOptionList[idx], `options`, () => updatedOptions);
      setManyOptionList([...manyOptionList]);
    }
  };

  const onOptionRemove = (idx: number, id: string) => {
    if (isRadio) {
      const options = radioList[idx].options;
      if (options.length === 1) return;
      else {
        remove(options, (n) => n.id === id);
        setRadioList([...radioList]);
      }
    } else if (isMultiple) {
      const options = manyOptionList[idx].options;
      if (options.length === 1) return;
      else {
        remove(options, (n) => n.id === id);
        setManyOptionList([...manyOptionList]);
      }
    }
  };

  const [numbered, setNumbered] = useState(false);
  const getColor = (color: string) => {
    return `hover:bg-${color}-200 text-${color}-400 border-${color}-200 hover:text-${color}-600 focus:outline-none focus:bg-${color}-200 focus:border-transparent`;
  };
  const getForm = (type: string) => {
    switch (type) {
      case INPUT:
        return (
          <TextInput
            list={inputList}
            numbered={numbered}
            onChange={onChange}
            removeItemFromList={removeItemFromList}
            changeCheckboxValue={changeCheckboxValue}
          />
        );
      case SELECT_ONE:
        return (
          <SelectOne
            list={radioList}
            numbered={numbered}
            onOptionRemove={onOptionRemove}
            onOptionAdd={onOptionAdd}
            onOptionInputChange={onOptionInputChange}
            getColor={getColor}
            themeColor={themeColor}
            onChange={onChange}
            removeItemFromList={removeItemFromList}
            changeCheckboxValue={changeCheckboxValue}
          />
        );
      case SELECT_MANY:
        return (
          <SelectMany
            list={manyOptionList}
            numbered={numbered}
            onOptionRemove={onOptionRemove}
            onOptionAdd={onOptionAdd}
            onOptionInputChange={onOptionInputChange}
            getColor={getColor}
            themeColor={themeColor}
            onChange={onChange}
            removeItemFromList={removeItemFromList}
            changeCheckboxValue={changeCheckboxValue}
          />
        );

      case INPUT_WITH_EMOJI:
        return (
          <InputWithEmoji
            list={emojiInputList}
            numbered={numbered}
            onChange={onChange}
            removeItemFromList={removeItemFromList}
            changeCheckboxValue={changeCheckboxValue}
          />
        );
    }
  };

  return (
    <div className="max-h-200 relative overflow-y-auto">
      <div className="w-auto flex item-center justify-between mb-4">
        <div className="flex items-center w-auto">
          {!isEditingMode &&
            map(formTypes, ({label}) => (
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
