import React, {useContext, useEffect, useState} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {
  EditQuestionModalDict,
  UniversalBuilderDict,
} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';
import Storage from '@aws-amplify/storage';
import ULBFileUploader from '../../../../Atoms/Form/FileUploader';
import Loader from '../../../../Atoms/Loader';
import {nanoid} from 'nanoid';
import RemoveInput from '../common/RemoveInput';
import {remove} from 'lodash';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import {FaTrashAlt} from 'react-icons/fa';

interface KeywordModalDialog extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const initialInputFieldsState = [
  {
    id: 'keyword_1',
    type: '',
    label: 'Keyword Title',
    value: 'Keyword description',
  },
];

const newKeywordObj: PartContentSub = {
  id: 'keyword_',
  type: '',
  label: 'Keyword Title',
  value: 'Keyword description',
};

const KeywordModalDialog = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  askBeforeClose,
  setUnsavedChanges,
  updateBlockContentULBHandler,
}: KeywordModalDialog) => {
  const {userLanguage} = useContext(GlobalContext);
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
      lessonPlan: [...list.lessonPlan],
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
      {...newKeywordObj, id: `${newKeywordObj.id}${nanoid(4)}`},
    ];
    setInputFieldsArray(longerInputFieldsArray);
  };

  const handleDeleteKeyword = (keywordIdx: number) => {
    const shorterInputFieldsArray: PartContentSub[] = inputFieldsArray.filter(
      (inputObj: PartContentSub, idx: number) => idx !== keywordIdx
    );
    setInputFieldsArray(shorterInputFieldsArray);
  };

  //////////////////////////
  //  FOR NORMAL INPUT    //
  //////////////////////////
  const onChange = (e: React.FormEvent, idx: number) => {
    setUnsavedChanges(true);
    const {id, value, name} = e.target as HTMLFormElement;
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
              <div className="my-2" key={`keyword_${idx}`}>
                <div className="w-auto flex items-center justify-between">
                  <label
                    htmlFor={'Link'}
                    className="mb-2 w-auto block text-xs font-semibold leading-5 text-gray-700">
                    Word Tile {idx + 1}:
                  </label>
                  {idx !== 0 ? (
                    <span
                      onClick={() => removeItemFromList(inputObj.id)}
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
                    placeHolder={inputFieldsArray[idx]?.label}
                  />
                </div>
                <div className="mb-2">
                  <FormInput
                    onChange={(e) => onChange(e, idx)}
                    value={inputFieldsArray[idx]?.value}
                    name={'value'}
                    placeHolder={inputFieldsArray[idx]?.value}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex mt-4 justify-between px-6 pb-4">
        <div className="flex items-center w-auto">
          <button
            onClick={handleAddNewKeyword}
            className="w-auto mr-4 border-2 focus:text-white focus:border-indigo-600 focus:bg-indigo-400 border-gray-300 p-2 px-4 text-tiny hover:border-gray-500 rounded-md text-dark transition-all duration-300 ">
            + Add Field
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
            onClick={onKeywordCreate}
          />
        </div>
      </div>
    </>
  );
};

export default KeywordModalDialog;
