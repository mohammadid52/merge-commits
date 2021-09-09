import React, {Fragment, useContext, useEffect, useState} from 'react';
import {IoIosKeypad, IoMdAddCircleOutline, IoMdRemoveCircleOutline} from 'react-icons/io';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {RiArrowRightLine} from 'react-icons/ri';
import {getAsset} from '../../../../../../assets';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import Buttons from '../../../../../Atoms/Buttons';
import CheckBox from '../../../../../Atoms/Form/CheckBox';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../Atoms/Form/Selector';

interface EditQuestionProps {
  changeStep: (step: string) => void;
  setCheckpQuestions: (obj: any) => void;
}
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
  name: string;
  value: string;
}

const EditQuestion = (props: EditQuestionProps) => {
  const {changeStep} = props;

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
  // const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    question: '',
    label: '',
    type: '',
    options: '',
    message: '',
    isError: true,
  });

  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {EditQuestionDict} = useDictionary(clientKey);

  const typeList: any = [
    {id: '1', name: 'Text', value: 'text'},
    {id: '2', name: 'Input', value: 'input'},
    {id: '3', name: 'Select Many', value: 'selectMany'},
    {id: '4', name: 'Select One', value: 'selectOne'},
  ];

  const languageList = [
    {id: 1, name: 'English', value: 'EN'},
    {id: 2, name: 'Spanish', value: 'ES'},
  ];

  const selectOneOptions = [
    {
      label: '1',
      text: 'Very Difficult',
    },
    {
      label: '2',
      text: 'Difficult',
    },
    {
      label: '3',
      text: 'Easy',
    },
    {
      label: '4',
      text: 'Very Easy',
    },
  ];

  const onInputChange = (e: any) => {
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
  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    setQuestionData({
      ...questionData,
      [field]: {
        id: id,
        name: name,
        value: val,
      },
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
      msgs.question = EditQuestionDict[userLanguage]['VALIDATION']['INPUT'];
    } else {
      msgs.question = '';
    }
    if (!questionData.type.value?.trim().length) {
      isValid = false;
      msgs.type = EditQuestionDict[userLanguage]['VALIDATION']['TYPE'];
    } else {
      msgs.type = '';
    }
    if (!questionData.label?.trim().length) {
      isValid = false;
      msgs.label = EditQuestionDict[userLanguage]['VALIDATION']['LABEL'];
    } else {
      msgs.label = '';
    }
    setValidation({...msgs});
    return isValid;
  };

  const saveQuestionChanges = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true);
        const questOptions = questionData.options;
        const input = {
          label: questionData.label,
          type: questionData.type.value,
          question: questionData.question,
          // designers: selectedDesigners.map(item => item.id),
          language: questionData.language.value,
          options: filteredOptions(questionData.options),
        };
        // const results: any = await API.graphql(
        //   graphqlOperation(mutations.createQuestion, { input: input })
        // );
        // const newQuestion = results?.data?.createQuestion;
        // if (newQuestion.id) {
        //   newQuestion.required = questionData.isRequired;
        //   setCheckpQuestions(newQuestion)
        //   setValidation({
        //     question: '',
        //     type: '',
        //     label: '',
        //     options: '',
        //     message: 'Question details has been saved.',
        //     isError: false
        //   });
        // }
        setLoading(false);
      } catch {
        setValidation({
          question: '',
          type: '',
          label: '',
          options: '',
          message: EditQuestionDict[userLanguage]['MESSAGES']['UNABLESAVE'],
          isError: true,
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (questionData.type?.value === 'selectOne') {
      setQuestionData({
        ...questionData,
        options: selectOneOptions,
      });
    } else if (questionData.type?.value === 'selectMany') {
      setQuestionData({
        ...questionData,
        options: [
          {label: '1', text: ''},
          {label: '2', text: ''},
        ],
      });
    }
  }, [questionData.type]);

  const {
    question,
    notes,
    label,
    type,
    language,
    isRequired,
    options,
    otherOpt,
    noneOfAbove,
  } = questionData;
  return (
    <Fragment>
      <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6 flex items-center">
        <span className="w-6 h-6 flex items-center mr-4" onClick={() => console.log('')}>
          <IconContext.Provider value={{size: '1.5rem', color: 'darkgrey'}}>
            <IoIosKeypad />
          </IconContext.Provider>
        </span>

        {/* Breadcrums */}
        <h4 className="text-base leading-6 font-medium text-gray-900 flex items-center">
          <span
            className="w-auto flex-shrink-0 cursor-pointer"
            onClick={() => changeStep('SelectedCheckPointsList')}>
            {EditQuestionDict[userLanguage]['ASSESSMENTBUILDER']}
          </span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{size: '1.5rem', color: 'darkgrey'}}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">
            {EditQuestionDict[userLanguage]['CHECKPOINT']}
          </span>
          <span className="w-6 h-6 flex items-center mx-4">
            <IconContext.Provider value={{size: '1.5rem', color: 'darkgrey'}}>
              <RiArrowRightLine />
            </IconContext.Provider>
          </span>
          <span className="font-normal text-gray-600 w-auto flex-shrink-0">
            {EditQuestionDict[userLanguage]['EDITQUE']}
          </span>
        </h4>
      </div>

      {/* Component body */}
      <div className="p-4">
        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <FormInput
              value={question}
              id="question"
              onChange={onInputChange}
              name="question"
              label={EditQuestionDict[userLanguage]['QUESTION']}
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
              label={EditQuestionDict[userLanguage]['QUESTIONLABEL']}
              isRequired
            />
            {validation.label && (
              <p className="text-red-600 text-sm">{validation.label}</p>
            )}
          </div>
        </div>

        {/* <TextArea value={""} rows={3} id='question' onChange={onInputChange} name='question' label="Question" isRequired />
          <div>
            <TextArea value={""} rows={3} id='notes' onChange={onInputChange} name='notes' label="Notes" />
          </div> */}

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div>
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {EditQuestionDict[userLanguage]['SELECTTYPE']}{' '}
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
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              {EditQuestionDict[userLanguage]['SELECTLANGUAGE']}
            </label>
            <Selector
              selectedItem={language.name}
              placeholder={EditQuestionDict[userLanguage]['LANGUAGE']}
              list={languageList}
              onChange={(val, name, id) => onSelectOption(val, name, id, 'language')}
            />
          </div>
        </div>

        <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
          <div className=" flex items-center">
            <CheckBox
              value={isRequired}
              onChange={() => toggleCheckBoxState('isRequired', isRequired)}
              name="isRequired"
              label={EditQuestionDict[userLanguage]['QUEREQUIRED']}
            />
          </div>
        </div>

        {(type.value === 'selectOne' || type.value === 'selectMany') && (
          <div className="p-6">
            <div className="p-6 border-gray-400  border-0 border-dashed">
              <p className="text-m font-medium leading-5 text-gray-700 mb-1">
                {EditQuestionDict[userLanguage]['ADDOPTION']}:{' '}
              </p>

              {/* Options input fields */}
              {options?.length &&
                options.map((item, index) => (
                  <div className="flex w-9/10 mx-auto mt-4">
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
                        className={`w-auto cursor-pointer ${theme.textColor[themeColor]} `}
                        onClick={() => onOptionAdd(index)}>
                        <IconContext.Provider
                          value={{size: '2rem', color: theme.iconColor[themeColor]}}>
                          <IoMdAddCircleOutline />
                        </IconContext.Provider>
                      </span>
                      <span
                        className={`w-auto cursor-pointer ${theme.textColor[themeColor]} `}
                        onClick={() => onOptionRemove(index)}>
                        <IconContext.Provider
                          value={{size: '2rem', color: theme.iconColor[themeColor]}}>
                          <IoMdRemoveCircleOutline />
                        </IconContext.Provider>
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
                    label={EditQuestionDict[userLanguage]['OTHEROPT']}
                  />
                </div>
                <div className="w-2/4 flex items-center">
                  <CheckBox
                    value={noneOfAbove}
                    onChange={() => toggleCheckBoxState('noneOfAbove', noneOfAbove)}
                    name="noneOfAbove"
                    label={EditQuestionDict[userLanguage]['NONEOFABOVE']}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 px-6 pb-4">
          {validation.message && (
            <div className="py-4 m-auto mt-2 text-center">
              <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>
                {validation.message}
              </p>
            </div>
          )}
          <div className="flex justify-center my-6">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={EditQuestionDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={() => changeStep('SelectedCheckPointsList')}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={
                loading
                  ? EditQuestionDict[userLanguage]['BUTTON']['SAVING']
                  : EditQuestionDict[userLanguage]['BUTTON']['SAVE']
              }
              onClick={saveQuestionChanges}
              disabled={loading ? true : false}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditQuestion;
