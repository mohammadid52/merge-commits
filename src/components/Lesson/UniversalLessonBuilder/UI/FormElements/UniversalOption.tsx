import {map, remove, update} from 'lodash';
import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import FormInput from '../../../../Atoms/Form/FormInput';
import RemoveInput from '../common/RemoveInput';
import {v4 as uuidv4} from 'uuid';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {getAsset} from '../../../../../assets';
import {FORM_TYPES, SELECT_ONE} from '../common/constants';
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
  const {userLanguage, clientKey} = useContext(GlobalContext);
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

  const makeRequired = (idx: number, required: boolean = false) => {
    update(list[idx], `required`, () => !required);
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

  return (
    <>
      {/* <Tabs /> */}
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
                          {/* <div className="flex items-center text-xs w-auto">
                            List
                            <Toggle checked onClick={() => {}} />
                            Inline
                          </div>
                          <span className="w-auto text-gray-500 text-xl mx-4">|</span> */}
                          <div className="flex items-center text-xs w-auto">
                            Make this required
                            <Toggle
                              checked={input.required}
                              onClick={() => makeRequired(idx, input.required)}
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
                        {/* <div className="flex items-center text-xs w-auto">
                          List
                          <Toggle checked={input.textArea} onClick={() => {}} />
                          Inline
                        </div>
                        <span className="w-auto text-gray-500 text-xl mx-4">|</span> */}
                        <div className="flex items-center text-xs w-auto">
                          Make this required
                          <Toggle
                            checked={input.required}
                            onClick={() => makeRequired(idx, input.required)}
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
      )}
    </>
  );
};
export default SelectOne;
