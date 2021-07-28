import React, {useState, useEffect} from 'react';

import {map} from 'lodash';

import {v4 as uuidv4} from 'uuid';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {
  FORM_TYPES,
  INPUT,
  INPUT_WITH_EMOJI,
  SELECT_ONE,
  LINK,
  SELECT_MANY,
  DATE_PICKER,
  ATTACHMENTS,
} from '../common/constants';
import TextInput from '../FormElements/TextInput';
import UniversalOption from '../FormElements/UniversalOption';
import UniversalInput from '../FormElements/UniversalInput';

interface InputModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  contentType?: any;
}

const InputModalComponent = ({
  closeAction,
  contentType,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
  setUnsavedChanges,
  askBeforeClose,
}: InputModalComponentProps) => {
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setNumbered(contentType.includes('numbered'));
      if (inputObj[0].type === FORM_TYPES.RADIO) {
        setRadioList(
          inputObj.map((input: any) => ({
            id: input.id,
            options: input.options,
            label: input.label,
            required: input.isRequired,
          }))
        );
        setSelectedFormType(SELECT_ONE);
      } else if (inputObj[0].type === FORM_TYPES.MULTIPLE) {
        setManyOptionList(
          inputObj.map((input: any) => ({
            id: input.id,
            options: input.options,
            label: input.label,
            required: input.isRequired,
          }))
        );
        setSelectedFormType(SELECT_MANY);
      } else if (inputObj[0].type === FORM_TYPES.EMOJI) {
        setEmojiInputList(
          inputObj.map((input: any) => ({
            ...input,
            title: input.label,
            placeholder: input.value,
            required: input.isRequired,
          }))
        );
        setSelectedFormType(INPUT_WITH_EMOJI);
      } else if (inputObj[0].type === FORM_TYPES.LINK) {
        setLinkList(
          inputObj.map((input: any) => ({
            ...input,
            title: input.label,
            placeholder: input.value,
            required: input.isRequired,
          }))
        );
        setSelectedFormType(LINK);
      } else {
        setInputList(
          inputObj.map((input: any) => ({
            ...input,
            textArea: input.type.includes('area'),
            title: input.label,
            placeholder: input.value,
            required: input.isRequired,
          }))
        );
        setSelectedFormType(INPUT);
      }
      setIsEditingMode(true);
    }
  }, [inputObj]);

  //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<INPUT LIST STARTS HERE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const [inputList, setInputList] = useState([
    {textArea: false, id: uuidv4(), title: '', placeholder: ''},
  ]);
  const [emojiInputList, setEmojiInputList] = useState([
    {id: uuidv4(), title: '', placeholder: ''},
  ]);
  const [manyOptionList, setManyOptionList] = useState([
    {
      id: uuidv4(),
      label: '',
      require: false,
      options: [
        {label: '1', text: '', id: uuidv4()},
        {label: '2', text: '', id: uuidv4()},
      ],
    },
  ]);

  const [radioList, setRadioList] = useState([
    {
      id: uuidv4(),
      label: '',
      require: false,
      options: [
        {label: '1', text: '', id: uuidv4()},
        {label: '2', text: '', id: uuidv4()},
      ],
    },
  ]);

  const [linkList, setLinkList] = useState([
    {id: uuidv4(), require: false, label: '', value: ''},
  ]);
  const [attachmentList, setAttachmentList] = useState([
    {id: uuidv4(), require: false, label: '', value: ''},
  ]);
  const [datePickerList, setDatePickerList] = useState([
    {id: uuidv4(), require: false, label: '', value: ''},
  ]);

  //  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<INPUT LIST ENDS HERE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const formTypes = [
    {label: INPUT, type: FORM_TYPES.TEXT},
    {label: SELECT_ONE, type: FORM_TYPES.RADIO},
    {label: SELECT_MANY, type: FORM_TYPES.MULTIPLE},
    {label: LINK, type: FORM_TYPES.LINK},
    {label: INPUT_WITH_EMOJI, type: FORM_TYPES.EMOJI},
    {label: ATTACHMENTS, type: FORM_TYPES.ATTACHMENTS},
    {label: DATE_PICKER, type: FORM_TYPES.DATE_PICKER},
  ];
  const DEFAULT_FORM_TYPE = formTypes[0].label;

  const [selectedFormType, setSelectedFormType] = useState<string>(DEFAULT_FORM_TYPE);

  const [numbered, setNumbered] = useState(false);

  const commonFormProps = {
    isEditingMode,
    createNewContent: createNewBlockULBHandler,
    updateContent: updateBlockContentULBHandler,
    numbered,
    setNumbered,
    closeAction,
    askBeforeClose,
    setUnsavedChanges,
  };

  const getForm = (type: string) => {
    switch (type) {
      case INPUT:
        return (
          <TextInput
            {...commonFormProps}
            selectedForm={type}
            list={inputList}
            setList={setInputList}
          />
        );

      case SELECT_ONE:
      case SELECT_MANY:
        return (
          <UniversalOption
            {...commonFormProps}
            selectedForm={type}
            list={type === SELECT_ONE ? radioList : manyOptionList}
            setList={type === SELECT_ONE ? setRadioList : setManyOptionList}
          />
        );

      case ATTACHMENTS:
      case LINK:
      case DATE_PICKER:
      case INPUT_WITH_EMOJI:
        return (
          <UniversalInput
            {...commonFormProps}
            selectedForm={type}
            list={
              type === ATTACHMENTS
                ? attachmentList
                : type === DATE_PICKER
                ? datePickerList
                : type === INPUT_WITH_EMOJI
                ? emojiInputList
                : type === LINK
                ? linkList
                : attachmentList
            }
            setList={
              type === ATTACHMENTS
                ? setAttachmentList
                : type === DATE_PICKER
                ? setDatePickerList
                : type === INPUT_WITH_EMOJI
                ? setEmojiInputList
                : type === LINK
                ? setLinkList
                : setAttachmentList
            }
          />
        );
    }
  };

  return (
    <div className="max-h-200 relative overflow-y-auto">
      <div className="flex flex-col w-auto">
        {!isEditingMode && (
          <>
            <label
              htmlFor={''}
              className="block text-xs font-semibold leading-5 text-gray-700">
              Select form type
            </label>
            <div className="w-auto flex item-center justify-start mb-4 mt-1">
              {map(formTypes, ({label}) => (
                <button
                  key={label}
                  onClick={() => setSelectedFormType(label)}
                  className={`${
                    label === selectedFormType
                      ? 'border-indigo-500 text-white bg-indigo-400'
                      : 'border-gray-300 text-dark'
                  } w-auto focus:border-indigo-600 p-2 px-4 text-tiny border-2 hover:border-gray-500 rounded-md  transition-all duration-100 mr-4`}>
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col my-2">{getForm(selectedFormType)}</div>
    </div>
  );
};

export default InputModalComponent;
