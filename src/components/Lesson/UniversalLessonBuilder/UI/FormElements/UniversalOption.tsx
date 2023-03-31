import {useGlobalContext} from '@contexts/GlobalContext';
import {Checkbox, Tabs, TabsProps} from 'antd';
import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import {EditQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import {filter, isEmpty, map, remove, update} from 'lodash';
import {useEffect, useState} from 'react';
import {optionResponses} from 'utilities/staticData';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import {FORM_TYPES, SELECT_MANY, SELECT_ONE} from '../common/constants';
import ToggleForModal from '../common/ToggleForModals';

const InputContainer = ({
  shouldShowActions,
  input,
  numbered,
  onChange,
  themeColor,
  idx,
  onOptionInputChange,
  onOptionAdd,
  getColor,
  onOptionRemove,
  selectedForm,
  removeExtraOption,
  addExtraOption,
  suggestionModal,
  setSuggestionModal,
  changeBool,
  changeValue,
  removeItemFromList
}: any) => {
  const [selForm, setSelForm] = useState(selectedForm);

  return (
    <div className="flex flex-col input-container">
      <div className="px-2">
        <div className="mb-2">
          <FormInput
            onChange={(e) => onChange(e, idx)}
            label={`${numbered ? idx + 1 : ''}Label`}
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
                  className="flex w-9/10 mx-auto flex-col mt-4">
                  <div className="flex items-center">
                    <div className="w-8/10">
                      <FormInput
                        disabled={item.label === 'other' || item.label === 'noneOfAbove'}
                        value={item.text}
                        className={`${
                          item.label === 'other' || item.label === 'noneOfAbove'
                            ? 'text-gray-600'
                            : ''
                        }`}
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
                  {index === input.options.length - 1 && (
                    <div className="text-gray-400 flex items-center mt-2">
                      <p
                        onClick={() => {
                          if (
                            input.options.find(
                              (item: any) => item.label === 'noneOfAbove'
                            )
                          ) {
                            removeExtraOption(idx, 'noneOfAbove');
                          } else {
                            addExtraOption(idx, 'noneOfAbove', 'None of the above');
                          }
                        }}
                        className="w-auto mr-4 hover:text-indigo-500 hover:bg-indigo-100 px-3 py-1 transition-all duration-200 cursor-pointer rounded-lg">
                        {input.options.find((item: any) => item.label === 'noneOfAbove')
                          ? 'Remove'
                          : 'Add'}{' '}
                        none of the above option
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

          {selForm === SELECT_ONE && (
            <div>
              <div className="my-4  flex flex-col items-center justify-center space-y-2">
                <p className="text-gray-500 text-center text-sm">
                  ----- Or use suggested options -----
                </p>
                <Buttons
                  label={
                    !isEmpty(suggestionModal) &&
                    suggestionModal?.idx === idx &&
                    suggestionModal?.selectedResponse?.length > 0
                      ? 'Change Options'
                      : 'Add Suggested Options'
                  }
                  onClick={() =>
                    setSuggestionModal({
                      ...suggestionModal,
                      idx,
                      data: optionResponses,
                      show: true
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {idx !== 0 ? (
          <div className="flex my-2 items-center justify-between w-auto">
            <div className="flex items-center w-auto mt-4 ">
              <Checkbox
                checked={input.required}
                onClick={() => changeBool(idx, 'required', input.required)}>
                Make this required
              </Checkbox>

              <ToggleForModal
                label="Multiple answers"
                checked={input.type === SELECT_MANY}
                onClick={() => {
                  setSelForm(input.type === SELECT_MANY ? SELECT_ONE : SELECT_MANY);
                  changeValue(
                    idx,
                    'type',
                    input.type === SELECT_MANY ? SELECT_ONE : SELECT_MANY
                  );
                }}
              />
            </div>

            <button
              onClick={() => removeItemFromList(input.id)}
              className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
              Remove Field
            </button>
          </div>
        ) : (
          <div className="flex items-center w-auto mt-4 ">
            <Checkbox
              checked={input.required}
              onClick={() => changeBool(idx, 'required', input.required)}>
              Make this required
            </Checkbox>

            <ToggleForModal
              label="Multiple answers"
              checked={input.type === SELECT_MANY}
              onClick={() => {
                setSelForm(input.type === SELECT_MANY ? SELECT_ONE : SELECT_MANY);
                changeValue(
                  idx,
                  'type',
                  input.type === SELECT_MANY ? SELECT_ONE : SELECT_MANY
                );
              }}
            />
          </div>
        )}
      </div>
      {shouldShowActions && (
        <div className="border-b-2 border-dashed border-gray-300 my-4 "></div>
      )}
    </div>
  );
};

const UniversalOption = ({
  numbered,
  closeAction,
  isEditingMode,

  selectedForm,
  list,
  setList,
  updateContent,
  setUnsavedChanges,
  askBeforeClose,
  createNewContent
}: any) => {
  const {
    clientKey,
    userLanguage,
    state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}}
  } = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {suggestionModal, setSuggestionModal} = useULBContext();

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
        type: selectedForm,
        label: '',
        options: [
          {label: '1', text: '', id: uuidv4()},
          {label: '2', text: '', id: uuidv4()}
        ]
      }
    ]);
  };
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  const onRadioCreate = async () => {
    try {
      const inputObjArray = map(list, (d: any) => ({
        id: uuidv4(),
        type: d.type === SELECT_MANY ? FORM_TYPES.MULTIPLE : FORM_TYPES.RADIO,
        label: d.label,
        isRequired: d.required,
        options: d.options,
        class: `${
          d.inLine ? 'flex-row items-center py-2' : 'flex-col items-start space-y-4 py-4'
        }`
      }));

      const type: string = `form-${numbered ? 'numbered' : 'default'}`;
      if (isEditingMode) {
        const updatedList = updateContent('', '', type, inputObjArray);

        await addToDB(updatedList);
      } else {
        const updatedList = createNewContent('', '', type, inputObjArray);

        await addToDB(updatedList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUnsavedChanges(false);
      setList([
        {
          id: uuidv4(),
          label: '',
          required: false,
          inLine: true,
          type: selectedForm,
          options: [
            {label: '1', text: '', id: uuidv4()},
            {label: '2', text: '', id: uuidv4()}
          ]
        }
      ]);

      setSuggestionModal({
        show: false,
        data: [{title: '', content: [{id: '', text: ''}]}],
        selectedResponse: [],
        idx: 0
      });
    }
  };

  const removeItemFromList = (id: string) => {
    remove(list, (n: any) => n.id === id);
    setList([...list]);
  };

  const onOptionAdd = (idx: number, idx2: number) => {
    const currentOptions = [...list[idx].options];
    const newItem = {
      label: (idx2 + 2).toString(),
      text: '',
      id: uuidv4().toString()
    };
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

  const addSuggestions = (idx: number, options: any) => {
    // {label: '2', text: '', id: uuidv4()},
    let _options = options.map((o: any) => ({
      label: o.text,
      text: o.text,
      id: o.id
    }));
    update(list[idx], `options`, () => _options);
    setList([...list]);
  };

  const addExtraOption = (idx: number, optionName: string, optionValue: string) => {
    const options = list[idx].options;

    options.push({
      label: optionName,
      text: optionValue,
      id: `${optionName}__${uuidv4()}`
    });

    setList([...list]);
  };
  const removeExtraOption = (idx: number, field: string) => {
    const options = list[idx].options;

    remove(options, (n: any) => n.label === field);
    setList([...list]);
  };

  useEffect(() => {
    if (!isEmpty(suggestionModal)) {
      if (suggestionModal.selectedResponse.length > 0) {
        addSuggestions(suggestionModal.idx, suggestionModal.selectedResponse);
      }
    }
  }, [suggestionModal, suggestionModal]);

  const changeBool = (idx: number, field: string, bool: boolean = false) => {
    update(list[idx], `${field}`, () => !bool);
    setList([...list]);
  };

  const changeValue = (idx: number, field: string, val: string) => {
    update(list[idx], `${field}`, () => val);
    setList([...list]);
  };

  const getColor = (color: string) => {
    return `hover:bg-${color}-200 text-${color}-400 border-${color}-200 hover:text-${color}-600 focus:outline-none focus:bg-${color}-200 focus:border-transparent`;
  };

  const RequiredMark = ({isRequired}: {isRequired: boolean}) => (
    <span className="text-red-500"> {isRequired ? '*' : null}</span>
  );
  const SelectMany = ({
    item,
    checked,
    onChange
  }: {
    checked: boolean;
    onChange: (e: any) => void;
    item: {text: string; label: string; id: string};
  }) => {
    const {label, text, id} = item;
    const {
      theme,
      state: {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}}
    } = useGlobalContext();

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
    checked
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
            inLine ? 'flex-row items-center' : 'flex-col items-start space-y-4 py-4'
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
    return <div className="w-auto hidden" />;
  };

  const filterCompleteQuestions = filter(list, (q) => q.label.length > 0);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Component Details`,
      children: (
        <>
          <div>
            {map(list, (input: any, idx: number) => {
              const shouldShowActions = idx !== list.length - 1;

              return (
                <InputContainer
                  key={idx}
                  input={input}
                  idx={idx}
                  shouldShowActions={shouldShowActions}
                  numbered={numbered}
                  onChange={onChange}
                  themeColor={themeColor}
                  onOptionInputChange={onOptionInputChange}
                  onOptionAdd={onOptionAdd}
                  getColor={getColor}
                  onOptionRemove={onOptionRemove}
                  selectedForm={selectedForm}
                  removeExtraOption={removeExtraOption}
                  addExtraOption={addExtraOption}
                  suggestionModal={suggestionModal}
                  setSuggestionModal={setSuggestionModal}
                  changeBool={changeBool}
                  changeValue={changeValue}
                  removeItemFromList={removeItemFromList}
                />
              );
            })}
          </div>
          <div className="flex flex-col mt-8 gap-4">
            <Buttons
              label={'+ Add Field'}
              onClick={addOneLinkField}
              size="small"
              variant="dashed"
            />

            <div className="flex items-center justify-end w-auto gap-4">
              <Buttons
                size="middle"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                onClick={askBeforeClose}
                transparent
              />
              <Buttons
                size="middle"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                onClick={onRadioCreate}
              />
            </div>
          </div>
        </>
      )
    },
    {
      key: '2',
      label: `Preview`,
      children: (
        <div>
          <div className="h-56 overflow-y-auto rounded-lg shadow bg-dark-gray py-4 px-2">
            {filterCompleteQuestions.length > 0 &&
            filterCompleteQuestions[0].options[0].text ? (
              filterCompleteQuestions.map(
                (
                  question: {
                    id: string;
                    label: string;
                    required: boolean;
                    inLine: boolean;
                    type: string;
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
                        question.type === SELECT_MANY ? true : false,
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
            <div className="flex items-center w-auto gap-4">
              <Buttons
                size="middle"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                onClick={askBeforeClose}
              />
              <Buttons
                size="middle"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                onClick={onRadioCreate}
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      <Tabs animated defaultActiveKey="1" items={items} />
    </>
  );
};
export default UniversalOption;
