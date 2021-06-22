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
  DATE_PICKER,
  ATTACHMENTS,
} from '../common/constants';
import TextInput from '../FormElements/TextInput';
import SelectOne from '../FormElements/SelectOne';
import SelectMany from '../FormElements/SelectMany';
import InputWithEmoji from '../FormElements/InputWithEmoji';
import Link from '../FormElements/Link';

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
}: InputModalComponentProps) => {
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
      } else if (inputObj[0].type === FORM_TYPES.MULTIPLE) {
        setManyOptionList(
          inputObj.map((input: any) => ({
            ...input,
            options: input.value,
          }))
        );
        setSelectedFormType(SELECT_MANY);
      } else if (inputObj[0].type === FORM_TYPES.EMOJI) {
        setEmojiInputList(
          inputObj.map((input: any) => ({
            ...input,
            title: input.label,
            placeholder: input.value,
          }))
        );
        setSelectedFormType(INPUT_WITH_EMOJI);
      } else if (inputObj[0].type === FORM_TYPES.LINK) {
        setLinkList(
          inputObj.map((input: any) => ({
            ...input,
            title: input.label,
            placeholder: input.value,
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
      options: [
        {label: '1', text: '', id: uuidv4()},
        {label: '2', text: '', id: uuidv4()},
      ],
    },
  ]);

  const [linkList, setLinkList] = useState([
    {id: uuidv4(), title: '', placeholder: ''},
    {id: uuidv4(), title: '', placeholder: ''},
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
  };

  const getForm = (type: string) => {
    switch (type) {
      case INPUT:
        return <TextInput {...commonFormProps} list={inputList} setList={setInputList} />;
      case LINK:
        return <Link {...commonFormProps} list={linkList} setList={setLinkList} />;
      case SELECT_ONE:
        return <SelectOne {...commonFormProps} list={radioList} setList={setRadioList} />;
      case SELECT_MANY:
        return (
          <SelectMany
            {...commonFormProps}
            list={manyOptionList}
            setList={setManyOptionList}
          />
        );

      case INPUT_WITH_EMOJI:
        return (
          <InputWithEmoji
            {...commonFormProps}
            list={emojiInputList}
            setList={setEmojiInputList}
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
      </div>

      <div className="flex flex-col my-2">{getForm(selectedFormType)}</div>
    </div>
  );
};

export default InputModalComponent;
