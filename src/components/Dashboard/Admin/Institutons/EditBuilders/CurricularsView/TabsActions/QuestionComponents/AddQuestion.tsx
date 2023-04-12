import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Fragment, useEffect, useState} from 'react';
import {IoMdAddCircleOutline, IoMdRemoveCircleOutline} from 'react-icons/io';

import Buttons from 'atoms/Buttons';
import CheckBox from 'atoms/Form/CheckBox';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {createQuestion} from 'graphql/mutations';
import {languageList} from '@utilities/staticData';

interface AddQuestionProps {
  goBackToPreviousStep: () => void;
  addNewQuestion: (obj: any) => void;
}

const typeList: any = [
  {id: '1', label: 'Text', value: 'text'},
  {id: '2', label: 'Input', value: 'input'},
  {id: '3', label: 'Select Many', value: 'selectMany'},
  {id: '4', label: 'Select One', value: 'selectOne'},
  {id: '5', label: 'Date Picker', value: 'datePicker'},
  {id: '6', label: 'Emoji', value: 'emoji'},
  {id: '7', label: 'Attachments', value: 'attachments'},
  {id: '8', label: 'Link', value: 'link'}
];

const selectOneOptions = [
  {
    label: '1',
    text: 'Very Difficult'
  },
  {
    label: '2',
    text: 'Difficult'
  },
  {
    label: '3',
    text: 'Easy'
  },
  {
    label: '4',
    text: 'Very Easy'
  }
];

interface InitialState {
  question: string;
  notes: string;
  label: string;
  type: InputValue;
  language: InputValue;
  isRequired: boolean;
  options: {label: string; text: string}[] | null;
  otherOpt: boolean;
  noneOfAbove: boolean;
}

interface InputValue {
  id: string;
  label: string;
  value: string;
}

const AddQuestion = (props: AddQuestionProps) => {
  const {goBackToPreviousStep, addNewQuestion} = props;
  const {userLanguage} = useGlobalContext();

  const {addQuestionDict} = useDictionary();

  const initialState = {
    question: '',
    notes: '',
    label: '',
    type: {id: '', label: '', value: ''},
    language: {id: '1', label: 'English', value: 'EN'},
    isRequired: false,
    options: [
      {label: '1', text: ''},
      {label: '2', text: ''}
    ],
    otherOpt: false,
    noneOfAbove: false
  };
  const [questionData, setQuestionData] = useState<InitialState>(initialState);
  // const [selectedDesigners, setSelectedDesigners] = useState<any[]>([]);

  const [validation, setValidation] = useState({
    question: '',
    label: '',
    type: '',
    options: '',
    message: '',
    isError: true
  });

  const onInputChange = (e: any) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value
    });
  };
  const toggleCheckBoxState = (field: string, value: boolean) => {
    setQuestionData({
      ...questionData,
      [field]: !value
    });
  };
  const optionInputChange = (index: number, e: any) => {
    // @ts-ignore
    const currentOptions = [...questionData.options];
    currentOptions[index].text = e.target.value;
    setQuestionData({
      ...questionData,
      options: currentOptions
    });
  };
  const onOptionAdd = (index: number) => {
    // adding new option field after selected options index.
    // @ts-ignore
    const currentOptions = [...questionData.options];
    const newItem = {label: (index + 2).toString(), text: ''};
    currentOptions.splice(index + 1, 0, newItem);
    let updatedOptions = currentOptions
      .map((item, i) => {
        if (i > index + 1) {
          item.label = (i + 1).toString();
          return item;
        } else {
          return null;
        }
      })
      .filter(Boolean);
    setQuestionData({
      ...questionData,
      options: updatedOptions
    });
  };
  const onOptionRemove = (index: number) => {
    // Removing option field from specific index
    // @ts-ignore
    if (questionData?.options?.length > 1) {
      const currentOptions = [...questionData.options];
      currentOptions.splice(index, 1);
      let updatedOptions = currentOptions
        .map((item, i) => {
          if (i >= index) {
            item.label = (i + 1).toString();
            return item;
          } else {
            return null;
          }
        })
        .filter(Boolean);
      setQuestionData({
        ...questionData,
        options: updatedOptions
      });
    }
  };
  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    setQuestionData({
      ...questionData,
      [field]: {
        id: id,
        name: name,
        value: val
      }
    });
  };
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

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!questionData.question?.trim().length) {
      isValid = false;
      msgs.question = addQuestionDict[userLanguage]['messages']['qrequired'];
    } else {
      msgs.question = '';
    }
    if (!questionData.type.value?.trim().length) {
      isValid = false;
      msgs.type = addQuestionDict[userLanguage]['messages']['qtyperequired'];
    } else {
      msgs.type = '';
    }
    if (!questionData.label?.trim().length) {
      isValid = false;
      msgs.label = addQuestionDict[userLanguage]['messages']['qlabelrequired'];
    } else {
      msgs.label = '';
    }
    setValidation({...msgs});
    return isValid;
  };

  const saveNewQuestion = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        const questOptions = questionData.options;
        const input = {
          label: questionData.label,
          type: questionData.type.value,
          question: questionData.question,
          // designers: selectedDesigners.map(item => item.id),
          language: questionData.language.value,
          options: questOptions ? filteredOptions(questOptions) : []
        };
        const results: any = await API.graphql(
          graphqlOperation(createQuestion, {input: input})
        );
        const newQuestion = results?.data?.createQuestion;
        if (newQuestion.id) {
          newQuestion.required = questionData.isRequired;
          setValidation({
            question: '',
            type: '',
            label: '',
            options: '',
            message: addQuestionDict[userLanguage]['messages']['qdetailsave'],
            isError: false
          });
          addNewQuestion(newQuestion);
          goBackToPreviousStep();
        }
      } catch {
        setValidation({
          question: '',
          type: '',
          label: '',
          options: '',
          message: addQuestionDict[userLanguage]['messages']['unabletosave'],
          isError: true
        });
      }
    }
  };

  useEffect(() => {
    if (questionData.type?.value === 'selectOne') {
      setQuestionData({
        ...questionData,
        options: selectOneOptions
      });
    } else if (questionData.type?.value === 'selectMany') {
      setQuestionData({
        ...questionData,
        options: [
          {label: '1', text: ''},
          {label: '2', text: ''}
        ]
      });
    }
  }, [questionData.type]);

  const {question, label, type, language, options, otherOpt, noneOfAbove} = questionData;
  return (
    <Fragment>
      <div className="w-8/10 m-auto">
        <h3 className="text-lg leading-6 font-medium text-darkest   text-center pb-8 ">
          {addQuestionDict[userLanguage]['heading']}
        </h3>
      </div>
      <div className="w-8/10 m-auto">
        <div className="">
          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <FormInput
                value={question}
                id="question"
                onChange={onInputChange}
                name="question"
                label={addQuestionDict[userLanguage]['q']}
                isRequired
              />
              {validation.question && (
                <p className="text-red-600 text-sm">{validation.question}</p>
              )}
            </div>
            <div>
              <FormInput
                value={label}
                id="Label"
                onChange={onInputChange}
                name="label"
                label={addQuestionDict[userLanguage]['qlabel']}
                isRequired
              />
              {validation.label && (
                <p className="text-red-600 text-sm">{validation.label}</p>
              )}
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                {addQuestionDict[userLanguage]['selecttype']}{' '}
                <span className="text-red-500">*</span>
              </label>
              <Selector
                selectedItem={type.label}
                placeholder={addQuestionDict[userLanguage]['selectpl']}
                list={typeList}
                onChange={(val, option: any) =>
                  onSelectOption(val, val, option.id, 'type')
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                {addQuestionDict[userLanguage]['selectlang']}
              </label>
              <Selector
                selectedItem={language.label}
                placeholder={addQuestionDict[userLanguage]['selectlanpl']}
                list={languageList}
                onChange={(val, option: any) =>
                  onSelectOption(val, val, option.id, 'language')
                }
              />
            </div>
          </div>

          {(type.value === 'selectOne' || type.value === 'selectMany') && (
            <div className="p-6">
              <div className="p-6 border-light   border-0 border-dashed">
                <p className="text-m font-medium leading-5 text-dark   mb-1">
                  {addQuestionDict[userLanguage]['addOption']}:{' '}
                </p>

                {/* Options input fields */}
                {options?.length &&
                  options.map((item, index) => (
                    <div key={item.text} className="flex w-9/10 mx-auto mt-4">
                      <div className="w-8/10">
                        <FormInput
                          value={item.text}
                          id={item.label}
                          onChange={(e) => optionInputChange(index, e)}
                          name={item.label}
                        />
                      </div>
                      <div className="w-1/10 flex items-center">
                        <span
                          className="w-auto cursor-pointer"
                          onClick={() => onOptionAdd(index)}>
                          <IoMdAddCircleOutline className="theme-text" size="2rem" />
                        </span>
                        <span
                          className="w-auto cursor-pointer"
                          onClick={() => onOptionRemove(index)}>
                          <IoMdRemoveCircleOutline className="theme-text" size="2rem" />
                        </span>
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
                      label={addQuestionDict[userLanguage]['otheropt']}
                    />
                  </div>
                  <div className="w-2/4 flex items-center">
                    <CheckBox
                      value={noneOfAbove}
                      onChange={() => toggleCheckBoxState('noneOfAbove', noneOfAbove)}
                      name="noneOfAbove"
                      label={addQuestionDict[userLanguage]['nonefabove']}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {validation.message && (
            <div className="py-4 m-auto mt-2 text-center">
              <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>
                {validation.message}
              </p>
            </div>
          )}
          <div className="flex justify-center mt-16 w-5/10 mx-auto">
            <Buttons
              label={addQuestionDict[userLanguage]['Button']['cancel']}
              onClick={goBackToPreviousStep}
              transparent
            />
            <Buttons
              label={addQuestionDict[userLanguage]['Button']['save']}
              onClick={saveNewQuestion}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AddQuestion;
