import React, {useEffect, useState} from 'react';

import AddButton from '@components/Atoms/Buttons/AddButton';
import HStack from '@components/Atoms/HStack';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import {EditQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from 'interfaces/UniversalLessonInterfaces';
import {remove} from 'lodash';
import {nanoid} from 'nanoid';
import {FaTrashAlt} from 'react-icons/fa';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';

interface KeywordModalDialogProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const initialInputFieldsState = [
  {
    id: 'keyword_1',
    type: '',
    label: '',
    value: ''
  }
];

const newKeywordObj: PartContentSub = {
  ...initialInputFieldsState[0]
};

const KeywordModalDialog = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  askBeforeClose,
  setUnsavedChanges,
  updateBlockContentULBHandler
}: KeywordModalDialogProps) => {
  const {userLanguage} = useGlobalContext();
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  //////////////////////////
  //  DATA STORAG         //
  //////////////////////////
  const [inputFieldsArray, setInputFieldsArray] = useState<PartContentSub[]>(
    initialInputFieldsState
  );
  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFieldsArray(inputObj);
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  //////////////////////////
  //  FOR DATA UPDATE     //
  //////////////////////////
  const handleUpdateInputFields = (value: any, name: string, idx: number) => {
    const newInputFieldsArray = inputFieldsArray.map(
      (inputObj: PartContentSub, inputObjIdx: number) => {
        if (inputObjIdx === idx) {
          return {...inputObj, [`${name}`]: value};
        } else {
          return inputObj;
        }
      }
    );
    setInputFieldsArray(newInputFieldsArray);
  };

  const handleAddNewKeyword = () => {
    const longerInputFieldsArray: PartContentSub[] = [
      ...inputFieldsArray,
      {...newKeywordObj, id: `${newKeywordObj.id}${nanoid(4)}`}
    ];
    setInputFieldsArray(longerInputFieldsArray);
  };

  //////////////////////////
  //  FOR NORMAL INPUT    //
  //////////////////////////
  const onChange = (e: React.FormEvent, idx: number) => {
    setUnsavedChanges(true);
    const {value, name} = e.target as HTMLFormElement;
    handleUpdateInputFields(value, name, idx);
  };

  const onKeywordCreate = async () => {
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        'keywords',
        inputFieldsArray,
        0
      );
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler(
        '',
        '',
        'keywords',
        inputFieldsArray,
        0
      );
      await addToDB(updatedList);
    }

    // clear fields
    setInputFieldsArray(initialInputFieldsState);
    setUnsavedChanges(false);
  };

  const removeItemFromList = (id: string) => {
    remove(inputFieldsArray, (n) => n.id === id);
    setInputFieldsArray([...inputFieldsArray]);
  };

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          {inputFieldsArray.map((inputObj: PartContentSub, idx: number) => {
            return (
              <div className="my-2 animate-fadeIn" key={`keyword_${idx}`}>
                <div className="w-auto flex items-center justify-between">
                  <label
                    htmlFor={'Link'}
                    className="mb-2 w-auto block text-xs font-semibold leading-5 text-gray-700">
                    Word Tile {idx + 1}:
                  </label>
                  {idx !== 0 ? (
                    <span
                      onClick={() => removeItemFromList(inputObj.id || '')}
                      className="w-auto text-center transition-all duration-200  text-xs font-semibold text-red-400  cursor-pointer hover:text-red-600
                    mb-2
                  ">
                      <FaTrashAlt />
                    </span>
                  ) : (
                    <span className="w-auto" />
                  )}
                </div>

                <div className="mb-2">
                  <FormInput
                    onChange={(e) => onChange(e, idx)}
                    name={'label'}
                    value={inputFieldsArray[idx]?.label}
                    placeHolder={'Keyword Title'}
                  />
                </div>
                <div className="mb-2">
                  <FormInput
                    onChange={(e) => onChange(e, idx)}
                    value={inputFieldsArray[idx]?.value}
                    name={'value'}
                    placeHolder={'Keyword Description'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <HStack justify="between" className=" mt-4">
        <div className="flex items-center w-auto">
          <AddButton
            onClick={handleAddNewKeyword}
            label={'Add new keyword title'}
            transparent
          />
        </div>
        <HStack className="gap-4 justify-end items-center flex">
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
            size="middle"
          />

          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onKeywordCreate}
            size="middle"
          />
        </HStack>
      </HStack>
    </>
  );
};

export default KeywordModalDialog;
