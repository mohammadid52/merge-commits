import React, {useContext, useEffect, useState} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IoMdAddCircleOutline, IoMdRemoveCircleOutline} from 'react-icons/io';
import * as mutations from '../../../../../graphql/mutations';

import Modal from '../../../../Atoms/Modal';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import TextArea from '../../../../Atoms/Form/TextArea';
import CheckBox from '../../../../Atoms/Form/CheckBox';
import Selector from '../../../../Atoms/Form/Selector';
import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {find, isEmpty} from 'lodash';
import API, {graphqlOperation} from '@aws-amplify/api';

interface EditQuestionModalProps {
  closeAction?: () => void;
  saveAction?: (updatedData: any, isRequired: boolean) => void;
  checkpItem?: any;
}

interface InitialState {
  question: string;
  note: string;
  label: string;
  type: InputValue;
  language: InputValue;
  options: {label: string; text: string}[] | null;
  otherOpt?: boolean;
  noneOfAbove?: boolean;
}

interface InputValue {
  id: string;
  name: string;
  value: string;
}

const EditQuestionModal = (props: EditQuestionModalProps) => {
  const {closeAction, saveAction, checkpItem} = props;
  console.log(
    '🚀 ~ file: EditQuestionModal.tsx ~ line 43 ~ EditQuestionModal ~ props',
    props
  );

  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {EditQuestionModalDict, BreadcrumsTitles} = useDictionary(clientKey);
  const questionItems = checkpItem.question;

  const initialState = {
    question: '',
    note: '',
    label: '',
    type: {id: '1', name: 'Text', value: 'text'},
    language: {id: '1', name: 'English', value: 'EN'},
    options: [
      {label: '1', text: ''},
      {label: '2', text: ''},
    ],
    otherOpt: false,
    noneOfAbove: false,
  };

  const typeList: any = [
    {id: '1', name: 'Text', value: 'text'},
    {id: '2', name: 'Input', value: 'input'},
    {id: '3', name: 'Select Many', value: 'selectMany'},
    {id: '4', name: 'Select One', value: 'selectOne'},
  ];

  const languageList: any = [
    {id: 1, name: 'English', value: 'EN'},
    {id: 2, name: 'Spanish', value: 'ES'},
  ];

  const [required, setRequired] = useState(checkpItem.required || false);
  const [saving, setSaving] = useState(false);

  const updateRequiredValue = async () => {
    try {
      const results: any = await API.graphql(
        graphqlOperation(mutations.updateCheckpointQuestions, {
          input: {id: checkpItem.id, required},
        })
      );
      const savedData = results?.data?.updateCheckpointQuestions;
      return savedData;
    } catch {}
  };

  const toggleCheckBoxState = (field: string, value: boolean) => {
    setQuestionData({
      ...questionData,
      [field]: !value,
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
  const filteredOptions = (options: {label: string; text: string}[]) => {
    let optionsObj = [...options];

    const hasOther = optionsObj.find((o) => o.label === 'other');
    const hasNone = optionsObj.find((o) => o.label === 'none');

    if (questionData.otherOpt && !hasOther) {
      optionsObj.push({label: 'other', text: 'Other'});
    }
    if (questionData.noneOfAbove && !hasNone) {
      optionsObj.push({label: 'none', text: 'None of the above'});
    }
    return optionsObj;
  };
  const saveQuestion = async () => {
    const isValid = validateForm();
    if (isValid) {
      setSaving(true);
      try {
        const tempInput = {
          id: questionItems.id,
          label: questionData.label,
          type: questionData.type.value,
          language: questionData.language.value,
          question: questionData.question,
          note: questionData.note,
        };

        let input = {};
        if (type.id === '3' || type.id === '4') {
          input = {
            ...tempInput,
            options: filteredOptions(questionData.options),
          };
        } else {
          input = {
            ...tempInput,
          };
        }

        const results: any = await API.graphql(
          graphqlOperation(mutations.updateQuestion, {input: input})
        );

        if (required !== checkpItem.required) {
          await updateRequiredValue();
        }
        const savedData = results?.data?.updateQuestion;

        saveAction(savedData, required);
        setSaving(false);
      } catch {}
    }
  };

  useEffect(() => {
    if (!isEmpty(questionItems)) {
      const hasOther = find(questionItems.options, (o: any) => o.label === 'other');

      const hasNone = find(questionItems.options, (o: any) => o.label === 'none');

      const updatedQuestionItems = {
        type: find(typeList, (t) => t.value === questionItems.type) || typeList[0],
        language:
          find(languageList, (t) => t.value === questionItems.language) ||
          languageList[0],
        question: questionItems.question,
        note: questionItems.note,
        label: questionItems.label,
        options: questionItems.options,
        otherOpt: hasOther ? true : false,
        noneOfAbove: hasNone ? true : false,
      };

      setQuestionData(updatedQuestionItems);
    }
  }, [questionItems]);

  const [questionData, setQuestionData] = useState<InitialState>(initialState);

  const onInputChange = (e: any) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value,
    });
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

  const [message, setMessage] = useState({
    msg: '',
    isError: true,
  });

  const validateForm = () => {
    let isValid = true;
    const clearError = () => setMessage({isError: false, msg: ''});

    if (!questionData.question?.trim().length) {
      setMessage({isError: true, msg: 'Question field cannot be empty'});
      isValid = false;
    } else {
      clearError();
    }
    if (!questionData.type.value?.trim().length) {
      isValid = false;
      setMessage({isError: true, msg: 'Type field cannot be empty'});
    } else {
      clearError();
    }
    if (!questionData.label?.trim().length) {
      isValid = false;
      setMessage({isError: true, msg: 'Label field cannot be empty'});
    } else {
      clearError();
    }
    return isValid;
  };

  const optionInputChange = (index: number, e: any) => {
    const currentOptions = [...questionData.options];
    currentOptions[index].text = e.target.value;
    setQuestionData({
      ...questionData,
      options: currentOptions,
    });
  };

  const changeRequire = () => {
    setRequired(!required);
  };

  const {
    question,
    note,
    label,
    type,
    language,
    options,
    otherOpt,
    noneOfAbove,
  } = questionData;

  return (
    <Modal
      showHeader={true}
      title={EditQuestionModalDict[userLanguage]['TITLE']}
      showHeaderBorder={true}
      showFooter={false}
      closeAction={closeAction}>
      <div className="">
        <div className="grid grid-cols-2 min-w-256 py-4">
          <div className="px-6">
            <TextArea
              value={question}
              rows={3}
              id="question"
              onChange={onInputChange}
              name="question"
              label={EditQuestionModalDict[userLanguage]['QUESTION']}
              isRequired
            />
          </div>
          <div className="px-6">
            <TextArea
              value={note}
              rows={3}
              id="note"
              onChange={onInputChange}
              name="note"
              label={EditQuestionModalDict[userLanguage]['NOTELABEL']}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 min-w-256 py-4">
          <div className="px-6">
            <FormInput
              value={label}
              id="Label"
              onChange={onInputChange}
              name="label"
              label={EditQuestionModalDict[userLanguage]['QUESTIONLABEL']}
              isRequired
            />
          </div>

          <div className="px-6">
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Language
            </label>
            <Selector
              selectedItem={language.name || ''}
              placeholder={EditQuestionModalDict[userLanguage]['LANGUAGE']}
              list={languageList}
              onChange={(val, name, id) => onSelectOption(val, name, id, 'language')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 min-w-256 py-4">
          <div className="px-6">
            <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
              Select Type
            </label>
            <Selector
              selectedItem={type.name}
              placeholder={EditQuestionModalDict[userLanguage]['TYPE']}
              list={typeList}
              onChange={(val, name, id) => onSelectOption(val, name, id, 'type')}
            />
          </div>
          <div className="px-6 flex items-center">
            <CheckBox
              value={required}
              onChange={changeRequire}
              name="isRequired"
              label={EditQuestionModalDict[userLanguage]['MAKEQUESTIONREQUIRED']}
            />
          </div>
        </div>

        {(type.value === 'selectOne' || type.value === 'selectMany') && (
          <div className="p-6">
            <div className="p-6 border-gray-400  border-0 border-dashed">
              <p className="text-m font-medium leading-5 text-gray-700 mb-1">
                {EditQuestionModalDict[userLanguage]['ADDOPTION']}:{' '}
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
                    label={EditQuestionModalDict[userLanguage]['ADDOTHEROPTION']}
                  />
                </div>
                <div className="w-2/4 flex items-center">
                  <CheckBox
                    value={noneOfAbove}
                    onChange={() => toggleCheckBoxState('noneOfAbove', noneOfAbove)}
                    name="noneOfAbove"
                    label={EditQuestionModalDict[userLanguage]['ADDNOTEABOVE']}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {message ? (
          <div className="py-4 m-auto mt-2 text-center">
            <p className={`${message.isError ? 'text-red-600' : 'text-green-600'}`}>
              {message.msg}{' '}
            </p>
          </div>
        ) : null}
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-end">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={closeAction}
              transparent
            />
            <Buttons
              disabled={saving}
              btnClass="py-1 px-8 text-xs ml-2"
              label={
                EditQuestionModalDict[userLanguage]['BUTTON'][
                  `${saving ? 'SAVING' : 'SAVE'}`
                ]
              }
              onClick={saveQuestion}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditQuestionModal;
