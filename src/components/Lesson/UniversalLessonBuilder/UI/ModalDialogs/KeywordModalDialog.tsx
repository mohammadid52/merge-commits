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
  {
    id: 'keyword_2',
    type: '',
    label: 'Keyword Title',
    value: 'Keyword description',
  },
  {
    id: 'keyword_3',
    type: '',
    label: 'Keyword Title',
    value: 'Keyword description',
  },
  {
    id: 'keyword_4',
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
    const {id, value, name} = e.target as HTMLFormElement;
    handleUpdateInputFields(value, name, idx);
  };

  const onKeywordCreate = async () => {
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', 'keywords', inputFieldsArray, 0);
    } else {
      createNewBlockULBHandler('', '', 'keywords', inputFieldsArray, 0);
    }
    // close modal after saving
    closeAction();
    // clear fields
    setInputFieldsArray(initialInputFieldsState);
  };

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          {inputFieldsArray.map((inputObj: PartContentSub, idx: number) => {
            return (
              <React.Fragment key={`keyword_${idx}`}>
                <p>
                  Word Tile {idx + 1}:{' '}
                  <span
                    onClick={() => handleDeleteKeyword(idx)}
                    className={`font-semibold text-xs text-red-400 cursor-pointer`}>
                    Delete?{' '}
                  </span>
                </p>
                <input
                  onChange={(e) => onChange(e, idx)}
                  name={'label'}
                  className={`mt-1 block w-full sm:text-sm sm:leading-5  border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm`}
                  value={inputFieldsArray[idx]?.label}
                  placeholder={inputFieldsArray[idx]?.label}
                />
                <input
                  onChange={(e) => onChange(e, idx)}
                  name={'value'}
                  className={`mt-1 block w-full sm:text-sm sm:leading-5  border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm`}
                  value={inputFieldsArray[idx]?.value}
                  placeholder={inputFieldsArray[idx]?.value}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={closeAction}
            transparent
          />

          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onKeywordCreate}
          />

          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={`ADD`}
            onClick={handleAddNewKeyword}
          />
        </div>
      </div>
    </>
  );
};

export default KeywordModalDialog;
