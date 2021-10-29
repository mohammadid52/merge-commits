import {v4 as uuidv4} from 'uuid';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {IconContext} from 'react-icons';
import {IoMdAddCircleOutline, IoMdRemoveCircleOutline} from 'react-icons/io';
import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {getTypeString, getLanguageString} from '../../../../../utilities/strings';
import Buttons from '../../../../Atoms/Buttons';
import CheckBox from '../../../../Atoms/Form/CheckBox';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import * as mutations from '../../../../../graphql/mutations';
import * as queries from '../../../../../graphql/queries';
import {isObject, map} from 'lodash';
import SearchInput from '../../../../Atoms/Form/SearchInput';
import Loader from '../../../../Atoms/Loader';
import RemoveInput from '../common/RemoveInput';
import {FORM_TYPES} from '../common/constants';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';

interface InitialState {
  question: string;
  notes: string;
  label: string;
  isRequired: boolean;
  type: InputValue;
  language: InputValue;
  options: {label: string; text: string}[] | null;
  otherOpt: boolean;
  noneOfAbove: boolean;
}

interface InputValue {
  id: string;
  name: string;
  value: string;
}

interface IHeaderModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
  isEditingMode?: boolean;
}

const CreateQuestion = ({
  setCheckpQuestions,
  setUnsavedChanges,
  checkpQuestions,
  changeStep,
}: any) => {
  const {clientKey, userLanguage, theme} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {AddNewQuestionDict} = useDictionary(clientKey);

  const [loading, setLoading] = useState(false);

  const filteredOptions = (options: {label: string; text: string}[]) => {
    let optionsObj = [...options];
    if (questionData.otherOpt) {
      optionsObj.push({label: 'other', text: 'Other'});
    }
    if (questionData.noneOfAbove) {
      optionsObj.push({label: 'none', text: 'None of the above'});
    }
    return optionsObj;
  };
  const [validation, setValidation] = useState({
    question: '',
    label: '',
    type: '',
    options: '',
    message: '',
    isError: true,
  });

  const [message, setMessage] = useState({
    msg: '',
    isError: false,
  });

  const clearErrors = () => {
    setMessage({
      isError: false,
      msg: '',
    });
  };

  const validateForm = () => {
    let isValid = true;

    if (!questionData.question?.trim().length) {
      isValid = false;
    } else if (!questionData.label?.trim().length) {
      isValid = false;

      setMessage({
        isError: true,
        msg: AddNewQuestionDict[userLanguage]['VALIDATION']['LABEL'],
      });
    } else if (!questionData.type.name?.trim().length) {
      isValid = false;

      setMessage({
        isError: true,
        msg: AddNewQuestionDict[userLanguage]['VALIDATION']['TYPE'],
      });
    } else {
      clearErrors;
    }

    return isValid;
  };
  const addQuestionsToDB = async () => {
    setLoading(true);
    try {
      const questions = Promise.all(
        checkpQuestions.map(async (item: any) => {
          const input = {
            label: item.label,
            type: item.type.value,
            question: item.question,
            language: item.language.value,
            options: filteredOptions(item.options),
          };
          const question: any = await API.graphql(
            graphqlOperation(mutations.createQuestion, {input})
          );
        })
      );
      setValidation({
        question: '',
        type: '',
        label: '',
        options: '',
        message: AddNewQuestionDict[userLanguage]['MESSAGES']['QUESTIONSAVE'],
        isError: false,
      });
    } catch {
      setValidation({
        question: '',
        type: '',
        label: '',
        options: '',
        message: AddNewQuestionDict[userLanguage]['MESSAGES']['UNABLESAVE'],
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const typeList: any = [
    {id: '1', name: 'Text', value: 'text'},
    {id: '2', name: 'Input', value: 'input'},
    {id: '3', name: 'Select Many', value: 'selectMany'},
    {id: '4', name: 'Select One', value: 'selectOne'},
    {id: '5', name: 'Date Picker', value: 'datePicker'},
    {id: '6', name: 'Emoji', value: 'emoji'},
    {id: '7', name: 'Attachments', value: 'attachments'},
    {id: '8', name: 'Link', value: 'link'},
  ];

  const languageList = [
    {id: 1, name: 'English', value: 'EN'},
    {id: 2, name: 'Spanish', value: 'ES'},
  ];

  const initialState = {
    question: '',
    notes: '',
    label: '',
    type: {id: '', name: '', value: ''},
    language: {id: '1', name: 'English', value: 'EN'},
    isRequired: false,

    options: [
      {label: '1', text: ''},
      {label: '2', text: ''},
    ],
    otherOpt: false,
    noneOfAbove: false,
  };
  const [questionData, setQuestionData] = useState<InitialState>(initialState);
  const {
    question,
    type,
    label,
    options,
    language,

    otherOpt,
    noneOfAbove,
  } = questionData;
  const onInputChange = (e: any) => {
    setUnsavedChanges(true);
    clearErrors();
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value,
    });
  };
  const toggleCheckBoxState = (field: string, value: boolean) => {
    setQuestionData({
      ...questionData,
      [field]: !value,
    });
  };
  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    clearErrors();

    setQuestionData({
      ...questionData,
      [field]: {
        id: id,
        name: name,
        value: val,
      },
    });
  };

  const clearFields = () => {
    setQuestionData(initialState);
  };

  const onQuestionSave = () => {
    const isValid = validateForm();

    if (isValid) {
      setCheckpQuestions([...checkpQuestions, questionData]);
      changeStep('QuestionLookup');
      addQuestionsToDB();
      clearFields();
    }
  };

  const optionInputChange = (index: number, e: any) => {
    const currentOptions = [...questionData.options];
    currentOptions[index].text = e.target.value;
    setQuestionData({
      ...questionData,
      options: currentOptions,
    });
  };
  const onOptionAdd = (index: number) => {
    // adding new option field after selected options index.
    const currentOptions = [...questionData.options];
    const newItem = {label: (index + 2).toString(), text: ''};
    currentOptions.splice(index + 1, 0, newItem);
    let updatedOptions = currentOptions.map((item, i) => {
      if (i > index + 1) {
        item.label = (i + 1).toString();
        return item;
      } else {
        return item;
      }
    });
    setQuestionData({
      ...questionData,
      options: updatedOptions,
    });
  };
  const onOptionRemove = (index: number) => {
    // Removing option field from specific index
    if (questionData.options.length > 1) {
      const currentOptions = [...questionData.options];
      currentOptions.splice(index, 1);
      let updatedOptions = currentOptions.map((item, i) => {
        if (i >= index) {
          item.label = (i + 1).toString();
          return item;
        } else {
          return item;
        }
      });
      setQuestionData({
        ...questionData,
        options: updatedOptions,
      });
    }
  };
  const getColor = (color: string) => {
    return `hover:bg-${color}-200 text-${color}-400 border-${color}-200 hover:text-${color}-600 focus:outline-none focus:bg-${color}-200 focus:border-transparent`;
  };

  return (
    <Fragment>
      {/* Component body */}
      <div className="p-4">
        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <FormInput
              value={question}
              id="question"
              onChange={onInputChange}
              name="question"
              label={AddNewQuestionDict[userLanguage]['QUESTION']}
              isRequired
              placeHolder={AddNewQuestionDict[userLanguage]['QUESTION']}
            />
          </div>
          <div>
            <FormInput
              value={label}
              id="Label"
              onChange={onInputChange}
              name="label"
              label={AddNewQuestionDict[userLanguage]['QUESTIONLABEL']}
              placeHolder={AddNewQuestionDict[userLanguage]['QUESTIONLABEL']}
              isRequired
            />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
              {AddNewQuestionDict[userLanguage]['SELECTTYPE']}{' '}
              <span className="text-red-500">*</span>
            </label>
            <Selector
              selectedItem={type.name}
              placeholder="Type"
              list={typeList}
              onChange={(val, name, id) => onSelectOption(val, name, id, 'type')}
            />
            {validation.type && <p className="text-red-600 text-sm">{validation.type}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
              {AddNewQuestionDict[userLanguage]['SELECTLANGUAGE']}
            </label>
            <Selector
              selectedItem={language.name}
              placeholder={AddNewQuestionDict[userLanguage]['LANGUAGE']}
              list={languageList}
              onChange={(val, name, id) => onSelectOption(val, name, id, 'language')}
            />
          </div>
        </div>
        {/* <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div className=" flex items-center">
            <CheckBox
              value={isRequired}
              onChange={() => toggleCheckBoxState('isRequired', isRequired)}
              name="isRequired"
              label={AddNewQuestionDict[userLanguage]['MAKEQUESTION']}
            />
          </div>
        </div> */}

        {(type.value === 'selectOne' || type.value === 'selectMany') && (
          <div className="p-6">
            <div className="p-6 border-gray-400  border-0 border-dashed">
              <p className="text-m font-medium leading-5 text-gray-700 mb-1">
                {AddNewQuestionDict[userLanguage]['ADDOPTION']}{' '}
              </p>

              {/* Options input fields */}
              {options?.length &&
                options.map((item, index) => (
                  <div className="flex justify-center items-center mx-auto mt-4">
                    <div className="w-72">
                      <FormInput
                        value={item.text}
                        id={item.label}
                        onChange={(e) => optionInputChange(index, e)}
                        name={item.label}
                        placeHolder={'Add Option'}
                      />
                    </div>
                    <div className="w-auto flex items-center">
                      <div className="flex items-center justify-end w-auto ml-3">
                        <button
                          onClick={() => onOptionAdd(index)}
                          className={`text-center w-20 transition-all duration-200 ${getColor(
                            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                          )} text-xs font-semibold text-gray-400 border-gray-200 px-2 py-1 cursor-pointer rounded  border-2 hover:text-gray-600`}>
                          Add
                        </button>
                      </div>
                      <div className="flex items-center justify-end w-auto ml-3">
                        <button
                          onClick={() => onOptionRemove(index)}
                          className={`text-center focus:outline-none focus:bg-red-200 focus:border-transparent w-20 transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded border-2 hover:text-red-600`}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Other options checkboxes */}
              <div className="flex w-9/10 mx-auto mt-4">
                <div className="w-2/4 flex items-center">
                  <CheckBox
                    value={otherOpt}
                    onChange={() => toggleCheckBoxState('otherOpt', otherOpt)}
                    name="otherOpt"
                    label={AddNewQuestionDict[userLanguage]['ADDOTHEROPTION']}
                  />
                </div>
                <div className="w-2/4 flex items-center">
                  <CheckBox
                    value={noneOfAbove}
                    onChange={() => toggleCheckBoxState('noneOfAbove', noneOfAbove)}
                    name="noneOfAbove"
                    label={AddNewQuestionDict[userLanguage]['ADDNONOFABOVE']}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="">
          {message.isError && (
            <div className="m-auto my-2 text-center">
              <p className={`text-red-600`}>{message.msg}</p>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={AddNewQuestionDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={() => changeStep('QuestionLookup')}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              onClick={onQuestionSave}
              label={
                loading
                  ? AddNewQuestionDict[userLanguage]['BUTTON']['SAVING']
                  : AddNewQuestionDict[userLanguage]['BUTTON']['SAVE']
              }
              disabled={loading ? true : false}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const ExistingQuestionList = ({
  checkpQuestions,
  setUnsavedChanges,
  changeStep,
  setCheckpQuestions,
}: any) => {
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [allQuestionsList, setAllQuestionsList] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {clientKey, userLanguage} = useContext(GlobalContext);

  const {QuestionLookupDict} = useDictionary(clientKey);

  const selectItem = (questId: string) => {
    const selectedItem = selectedQuestionIds.find((id) => id === questId);
    let updatedList;
    if (!selectedItem) {
      updatedList = [...selectedQuestionIds, questId];
    } else {
      updatedList = selectedQuestionIds.filter((id) => id !== questId);
    }
    setSelectedQuestionIds(updatedList);
    setUnsavedChanges(true);
  };

  const searchFromList = () => {
    const currentQuesList = [...allQuestionsList];
    const newList = currentQuesList.filter((item) => {
      // Search on question for match.
      return item.question?.toLowerCase().includes(searchInput.toLowerCase());
    });
    setQuestionsList(newList);
  };

  const removeSearchAction = () => {
    setQuestionsList(allQuestionsList);
    setSearchInput('');
  };
  const onQuestionSave = () => {
    const selectedQuestionsList = [...allQuestionsList].filter((item) =>
      selectedQuestionIds.includes(item.id)
    );

    changeStep('QuestionLookup');

    setCheckpQuestions([...selectedQuestionsList]);
  };

  const fetchQuestionsList = useCallback(async () => {
    try {
      setLoading(true);
      const fetchQuestionsData: any = await API.graphql(
        graphqlOperation(queries.listQuestions)
      );
      if (!fetchQuestionsData) {
        setError(true);
        throw new Error('fail!');
      } else {
        const QuestionsList = fetchQuestionsData.data?.listQuestions?.items;
        setQuestionsList(QuestionsList);
        setAllQuestionsList(QuestionsList);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error(error);
    }
  }, [allQuestionsList]);

  useEffect(() => {
    fetchQuestionsList();
  }, []);

  useEffect(() => {
    if (checkpQuestions?.length > 0) {
      let IDs = checkpQuestions.map((item: any) => item.id);
      setSelectedQuestionIds(IDs);
    }
  }, [checkpQuestions]);
  return (
    <Fragment>
      <div className="p-4">
        <div className="flex justify-between my-4">
          <p className="text-sm font-medium text-gray-600 flex items-center w-2/4 px-14">
            {selectedQuestionIds?.length} {QuestionLookupDict[userLanguage]['QUESELECT']}
          </p>
          <SearchInput
            value={searchInput}
            onChange={(val: string) => setSearchInput(val)}
            onKeyDown={searchFromList}
            closeAction={removeSearchAction}
            style="w-2/4"
          />
        </div>
        <div className="max-w-256">
          <Fragment>
            <div className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
              <div className="w-1.5/10 px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{QuestionLookupDict[userLanguage]['SELECTION']}</span>
              </div>
              <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{QuestionLookupDict[userLanguage]['QUESTION']}</span>
              </div>
              <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{QuestionLookupDict[userLanguage]['TYPE']}</span>
              </div>
              <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                <span>{QuestionLookupDict[userLanguage]['LANGUAGE']}</span>
              </div>
            </div>

            <div
              className={`w-full m-auto max-h-120  ${
                loading ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'
              }`}>
              {!loading ? (
                <Fragment>
                  {!error ? (
                    <Fragment>
                      {questionsList?.length ? (
                        questionsList.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                            <div className="flex w-1.5/10 items-center px-6 py-3 text-left text-s leading-4">
                              <span>
                                <CheckBox
                                  value={selectedQuestionIds?.includes(item.id)}
                                  onChange={() => selectItem(item.id)}
                                  name="selectquestion"
                                />
                              </span>
                            </div>
                            <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                              {' '}
                              {item.question}{' '}
                            </div>
                            <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                              {item.type ? getTypeString(item.type) : '--'}
                            </div>
                            <div className="flex w-1.5/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                              {item.language ? getLanguageString(item.language) : '--'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
                          <p className="mt-2 text-center text-lg text-gray-500">
                            {QuestionLookupDict[userLanguage]['QUEEMPTY']}
                          </p>
                        </div>
                      )}
                    </Fragment>
                  ) : (
                    <div className="py-12 my-6 text-center">
                      <p> {QuestionLookupDict[userLanguage]['FETCHERR']}</p>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
                  <div className="w-5/10">
                    <Loader color="rgba(107, 114, 128, 1)" />
                    <p className="mt-2 text-center text-lg text-gray-500">
                      {QuestionLookupDict[userLanguage]['FETCHING']}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-center my-6">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={QuestionLookupDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={() => changeStep('QuestionLookup')}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={QuestionLookupDict[userLanguage]['BUTTON']['SAVE']}
              onClick={onQuestionSave}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const parseType = (type: string) => {
  switch (type) {
    case 'text':
      return FORM_TYPES.TEXTAREA;
    case 'input':
      return FORM_TYPES.TEXT;
    case 'selectMany':
      return FORM_TYPES.MULTIPLE;
    case 'selectOne':
      return FORM_TYPES.RADIO;
    case 'datePicker':
      return FORM_TYPES.DATE_PICKER;
    case 'link':
      return FORM_TYPES.LINK;
    case 'emoji':
      return FORM_TYPES.EMOJI;
    case 'attachments':
      return FORM_TYPES.ATTACHMENTS;
    default:
      return FORM_TYPES.TEXT;
  }
};

const QuestionLookup = ({
  checkpQuestions,
  changeStep,
  closeAction,
  isEditingMode,
  setCheckpQuestions,
  updateBlockContentULBHandler,
  createNewBlockULBHandler,
  askBeforeClose,
}: {
  checkpQuestions: InitialState[];
  changeStep: (step: string) => void;
  closeAction: () => void;
  askBeforeClose: () => void;
  isEditingMode?: boolean;
  updateBlockContentULBHandler: any;
  createNewBlockULBHandler: any;
  setCheckpQuestions: any;
}) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);

  const {AddNewCheckPointDict, EditQuestionModalDict} = useDictionary(clientKey);

  const uniqKey = 'questionID'; // this is temporary key to filter this questions from other questions

  const generateQuestionList = () => {
    let dataToSend = map(checkpQuestions, (question) => {
      const type = parseType(
        isObject(question.type) ? question.type.value : question.type
      );
      return {
        id: `${uniqKey}_${uuidv4().toString()}`,
        type,

        label: question.question,
        value: question.label,
        options:
          type === FORM_TYPES.RADIO || type === FORM_TYPES.MULTIPLE
            ? question.options
            : null,
      };
    });
    return dataToSend;
  };
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };
  const addToULBObject = async () => {
    let valueArr = generateQuestionList();

    const formType = numbered ? 'form-numbered' : 'form-default';
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler('', '', formType, valueArr);
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler('', '', formType, valueArr);
      await addToDB(updatedList);
    }
    closeAction();
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(checkpQuestions);

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCheckpQuestions(items);
  };
  const [numbered, setNumbered] = useState(false);

  return (
    <div className="overflow-y-hidden">
      {checkpQuestions.length > 0 && (
        <div className="w-auto flex item-center justify-end mb-4">
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
      )}
      {checkpQuestions.length > 0 ? (
        <>
          <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-nowrap border-b-0 border-gray-200">
            <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{AddNewCheckPointDict[userLanguage]['NO']}</span>
            </div>
            <div className="w-5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{AddNewCheckPointDict[userLanguage]['QUESTION']}</span>
            </div>
            <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{AddNewCheckPointDict[userLanguage]['TYPE']}</span>
            </div>
          </div>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  className="overflow-y-auto custom-scrollbar max-h-132"
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {checkpQuestions.map((item: any, index: number) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          key={item.id}
                          ref={provided.innerRef}
                          className={`${snapshot.isDragging ? 'bg-gray-100' : ''}`}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <Fragment key={item.id}>
                            <div
                              key={item.id}
                              className={`flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200
                                `}>
                              <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                                {' '}
                                {index + 1}.
                              </div>
                              <div className="flex w-5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                                {' '}
                                {item.question}{' '}
                              </div>
                              <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                                {item.type ? getTypeString(item.type) : '--'}
                              </div>
                            </div>
                          </Fragment>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      ) : (
        <div className="py-6 text-center mx-auto flex justify-center items-center w-full">
          <p className="text-center text-lg text-gray-500">
            {AddNewCheckPointDict[userLanguage]['NOQUESTION']}
          </p>
        </div>
      )}

      <div className="flex w-full mx-auto py-4 justify-center ">
        <Buttons
          btnClass="mr-4"
          onClick={() => changeStep('ExistingQuestionList')}
          label={AddNewCheckPointDict[userLanguage]['BUTTON']['ADDEXIST']}
        />
        <Buttons
          btnClass="ml-4"
          onClick={() => changeStep('CreateNewQuestion')}
          label={AddNewCheckPointDict[userLanguage]['BUTTON']['CREATE']}
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
            onClick={addToULBObject}
          />
        </div>
      </div>
    </div>
  );
};

const CheckpointFormDialog = ({
  closeAction,
  isEditingMode,
  updateBlockContentULBHandler,
  createNewBlockULBHandler,
  setUnsavedChanges,
  askBeforeClose,
}: IHeaderModalComponentProps) => {
  const [checkpQuestions, setCheckpQuestions] = useState([]);

  const [activeStep, setActiveStep] = useState<
    'QuestionLookup' | 'CreateNewQuestion' | 'ExistingQuestionList'
  >('QuestionLookup');

  const changeStep = (
    step: 'QuestionLookup' | 'CreateNewQuestion' | 'ExistingQuestionList'
  ) => {
    setActiveStep(step);
  };

  const switchStep = () => {
    switch (activeStep) {
      case 'CreateNewQuestion':
        return (
          <CreateQuestion
            checkpQuestions={checkpQuestions}
            changeStep={changeStep}
            setUnsavedChanges={setUnsavedChanges}
            setCheckpQuestions={setCheckpQuestions}
          />
        );
      case 'QuestionLookup':
        return (
          <QuestionLookup
            askBeforeClose={askBeforeClose}
            isEditingMode={isEditingMode}
            updateBlockContentULBHandler={updateBlockContentULBHandler}
            createNewBlockULBHandler={createNewBlockULBHandler}
            checkpQuestions={checkpQuestions}
            changeStep={changeStep}
            closeAction={closeAction}
            setCheckpQuestions={setCheckpQuestions}
          />
        );
      case 'ExistingQuestionList':
        return (
          <ExistingQuestionList
            setCheckpQuestions={setCheckpQuestions}
            checkpQuestions={checkpQuestions}
            setUnsavedChanges={setUnsavedChanges}
            changeStep={changeStep}
          />
        );
    }
  };

  return <div>{switchStep()}</div>;
};

export default CheckpointFormDialog;
