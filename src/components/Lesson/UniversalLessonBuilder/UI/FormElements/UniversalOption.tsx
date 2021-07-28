import {filter, map, remove, update} from 'lodash';
import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import FormInput from '../../../../Atoms/Form/FormInput';
import RemoveInput from '../common/RemoveInput';
import {v4 as uuidv4} from 'uuid';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {getAsset} from '../../../../../assets';
import {FORM_TYPES, SELECT_MANY, SELECT_ONE} from '../common/constants';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import {Switch} from '@headlessui/react';
import {classNames} from './TextInput';

const Toggle = ({checked, onClick}: {checked: boolean; onClick: any}) => {
  return (
    <Switch
      checked={checked}
      onChange={onClick}
      className="mx-3 flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <span className="sr-only">Text response type</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bg-white w-full h-full rounded-md"
      />
      <span
        aria-hidden="true"
        className={classNames(
          checked ? 'bg-indigo-600' : 'bg-gray-200',
          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          checked ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
        )}
      />
    </Switch>
  );
};

const SelectOne = ({
  numbered,
  closeAction,
  isEditingMode,
  setNumbered,
  selectedForm,
  list,
  setList,
  updateContent,
  setUnsavedChanges,
  askBeforeClose,
  createNewContent,
}: any) => {
  const {
    clientKey,
    userLanguage,
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const onOptionInputChange = (idx: number, idx2: number, e: any) => {
    update(list[idx], `options[${idx2}].text`, () => e.target.value);
    setList([...list]);
  };

  const onChange = (e: any, idx: number) => {
    setUnsavedChanges(true);
    const {value} = e.target;
    update(list[idx], 'label', () => value);
    setList([...list]);
  };

  const addOneLinkField = () => {
    setList([
      ...list,
      {
        id: uuidv4(),
        required: false,
        inLine: true,
        label: '',
        options: [
          {label: '1', text: '', id: uuidv4()},
          {label: '2', text: '', id: uuidv4()},
        ],
      },
    ]);
  };
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const onRadioCreate = async () => {
    const inputObjArray = map(list, (d: any) => {
      const pageContentId: string = `${uuidv4()}_`;
      const partContentId: string = `${pageContentId}_radioInput`;
      return {
        id: partContentId,
        type: selectedForm === SELECT_ONE ? FORM_TYPES.RADIO : FORM_TYPES.MULTIPLE,
        label: d.label,
        isRequired: d.required,
        options: d.options,
      };
    });
    const type: string = `form-${numbered ? 'numbered' : 'default'}`;
    if (isEditingMode) {
      const updatedList = updateContent('', '', type, inputObjArray);

      await addToDB(updatedList);
    } else {
      const updatedList = createNewContent('', '', type, inputObjArray);

      await addToDB(updatedList);
    }

    setUnsavedChanges(false);
  };

  const removeItemFromList = (id: string) => {
    remove(list, (n: any) => n.id === id);
    setList([...list]);
  };

  const onOptionAdd = (idx: number, idx2: number) => {
    const currentOptions = [...list[idx].options];
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
    update(list[idx], `options`, () => updatedOptions);
    setList([...list]);
  };
  const onOptionRemove = (idx: number, id: string) => {
    const options = list[idx].options;
    if (options.length === 1) return;
    else {
      remove(options, (n: any) => n.id === id);
      setList([...list]);
    }
  };

  const changeBool = (idx: number, field: string, bool: boolean = false) => {
    update(list[idx], `${field}`, () => !bool);
    setList([...list]);
  };

  const getColor = (color: string) => {
    return `hover:bg-${color}-200 text-${color}-400 border-${color}-200 hover:text-${color}-600 focus:outline-none focus:bg-${color}-200 focus:border-transparent`;
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }
  const tabs = [
    {name: 'Component Details', current: true},
    {name: 'Preview', current: false},
  ];

  const [curTab, setCurTab] = useState(tabs[0].name);

  // const previewAvailable = url && url.length > 0;

  const Tabs = () => {
    return (
      <div className="mb-4">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            defaultValue={tabs.find((tab) => tab.current).name}>
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setCurTab(tab.name)}
                  className={classNames(
                    curTab === tab.name
                      ? `border-${
                          themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                        }-500 text-${
                          themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                        }-600`
                      : 'border-transparent focus:outline-none text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'py-4 cursor-pointer px-1 text-center border-b-3 font-medium text-sm'
                  )}
                  aria-current={curTab === tab.name ? 'page' : undefined}>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const RequiredMark = ({isRequired}: {isRequired: boolean}) => (
    <span className="text-red-500"> {isRequired ? '*' : null}</span>
  );
  const SelectMany = ({
    item,
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (e: any) => void;
    item: {text: string; label: string; id: string};
  }) => {
    const {label, text, id} = item;
    const {
      theme,
      state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}},
    } = useContext(GlobalContext);

    const themePlaceholderColor =
      lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';
    return (
      <div className={`flex my-2 w-auto justify-center items-center mr-8`}>
        <input
          id={id}
          data-key={id}
          data-value={label}
          type="checkbox"
          className={`w-5 h-5 flex-shrink-0 mx-4  cursor-pointer border-0 ${themePlaceholderColor} ${
            checked ? 'bg-blueberry border-white' : 'bg-white border-black '
          }`}
          onChange={onChange}
          checked={checked}
        />

        <span className={`ml-2 ${theme.elem.text} ${themeTextColor}`}>{text}</span>
      </div>
    );
  };

  const SelectOne = ({
    item,
    onChange,
    checked,
  }: {
    onChange: (e: any) => void;
    checked: boolean;

    item: {text: string; label: string; id: string};
  }) => {
    const {label, text, id} = item;

    const themePlaceholderColor =
      lessonPageTheme === 'light' ? 'placeholder-gray-800' : '';
    return (
      <div className={`w-auto flex justify-center items-center mr-8 `}>
        <input
          id={id}
          data-key={id}
          data-value={label}
          type="radio"
          className={`w-5 h-5 flex-shrink-0 mx-4 rounded-full cursor-pointer border-0 ${themePlaceholderColor} ${
            checked ? 'bg-blueberry border-white' : 'bg-white border-black '
          }`}
          onChange={onChange}
          checked={checked}
        />

        <span className={`w-auto`}>{text}</span>
      </div>
    );
  };

  // ~~~~~~~~ SELECTMANY CHECKBOXES ~~~~~~~~ //
  const generateCheckbox = (
    values: {label: string; text: string; id: string}[],
    selectMany: boolean,
    inputID: string,
    inLine: boolean
  ) => {
    if (values && Array.isArray(values)) {
      return (
        <div
          className={`mt-2 flex flex-wrap ${themeTextColor} ${
            lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
          } py-2 px-4 rounded-xl ${
            inLine ? 'flex-row items-center' : 'flex-col items-start'
          }`}>
          {values.map((item, idx: number) =>
            selectMany ? (
              <SelectMany
                key={`question_selectMultiple_${inputID}_${idx}`}
                onChange={() => {}}
                checked={false}
                item={item}
              />
            ) : (
              <SelectOne
                onChange={() => {}}
                checked={false}
                key={`question_selectOne_${inputID}_${idx}`}
                item={item}
              />
            )
          )}
        </div>
      );
    }
  };

  const filterCompleteQuestions = filter(list, (q) => q.label.length > 0);

  return (
    <>
      <Tabs />
      {curTab === tabs[0].name && (
        <>
          <div>
            {map(list, (input: any, idx: number) => {
              const shouldShowActions = idx !== list.length - 1;

              return (
                <div key={input.id} className="flex flex-col input-container">
                  <div className="px-2">
                    <div className="mb-2">
                      <FormInput
                        onChange={(e) => onChange(e, idx)}
                        label={`${numbered ? `${idx + 1}. ` : ''}Label`}
                        isRequired
                        value={input.label}
                        id={`formField_${input.id}`}
                        placeHolder={`Enter Label`}
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
                                      themeColor === 'iconoclastIndigo'
                                        ? 'indigo'
                                        : 'blue'
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

                    {idx !== 0 ? (
                      <div className="flex my-2 items-center justify-between w-auto">
                        <div className="flex items-center w-auto mt-4 ">
                          <div className="flex items-center text-xs w-auto">
                            Inline
                            <Toggle
                              checked={input.inLine}
                              onClick={() => changeBool(idx, 'inLine', input.inLine)}
                            />
                            List
                          </div>
                          <span className="w-auto text-gray-500 text-xl mx-4">|</span>
                          <div className="flex items-center text-xs w-auto">
                            Make this required
                            <Toggle
                              checked={input.required}
                              onClick={() => changeBool(idx, 'required', input.required)}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => removeItemFromList(input.id)}
                          className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                          Remove Field
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center w-auto mt-4 ">
                        <div className="flex items-center text-xs w-auto">
                          Inline
                          <Toggle
                            checked={input.inLine}
                            onClick={() => changeBool(idx, 'inLine', input.inLine)}
                          />
                          List
                        </div>
                        <span className="w-auto text-gray-500 text-xl mx-4">|</span>
                        <div className="flex items-center text-xs w-auto">
                          Make this required
                          <Toggle
                            checked={input.required}
                            onClick={() => changeBool(idx, 'required', input.required)}
                          />
                        </div>
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
          <div className="flex mt-8 justify-between px-6 pb-4">
            <div className="flex items-center w-auto">
              <button
                onClick={addOneLinkField}
                className="w-auto mr-4 border-2 focus:text-white focus:border-indigo-600 focus:bg-indigo-400 border-gray-300 p-2 px-4 text-tiny hover:border-gray-500 rounded-md text-dark transition-all duration-300 ">
                + Add Field
              </button>
              <button
                onClick={() => setNumbered(!numbered)}
                className={`${
                  numbered
                    ? 'border-indigo-500 text-white bg-indigo-400'
                    : 'border-gray-300 text-dark'
                } w-auto p-2 px-4 focus:border-indigo-600 text-tiny border-2 hover:border-gray-500 rounded-md  transition-all duration-300 mr-4`}>
                {numbered ? 'Numbered' : 'Unnumbered'}
              </button>
            </div>
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
                onClick={onRadioCreate}
              />
            </div>
          </div>
        </>
      )}

      {curTab === tabs[1].name && (
        <div>
          <div className="h-56 overflow-y-auto rounded-lg shadow bg-dark-gray py-4 px-2">
            {list[0].label && list[0].options[0].text ? (
              filterCompleteQuestions.map(
                (
                  question: {
                    id: string;
                    label: string;
                    required: boolean;
                    inLine: boolean;
                    options: {id: string; label: string; text: string}[];
                  },
                  index: number
                ) => {
                  return (
                    <div
                      id={question.id}
                      key={'preview_question_439i3u4u23'}
                      className={`mb-4 px-4`}>
                      <label className={`text-sm ${themeTextColor}`} htmlFor="label">
                        {numbered && `${index + 1}.`} {question.label}{' '}
                        <RequiredMark isRequired={question.required} />
                      </label>
                      {generateCheckbox(
                        question.options,
                        selectedForm === SELECT_MANY ? true : false,
                        question.id,
                        question.inLine
                      )}
                    </div>
                  );
                }
              )
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-white text-lg text-center">
                  Add atleast one question with one option
                </p>
              </div>
            )}
          </div>
          <div className="flex mt-8 justify-end px-6 pb-4">
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
                onClick={onRadioCreate}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SelectOne;
