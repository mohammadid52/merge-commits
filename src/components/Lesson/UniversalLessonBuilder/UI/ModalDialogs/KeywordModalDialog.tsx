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
import { nanoid } from 'nanoid';

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
    if (inputObj) {
      // setInputFieldsArray(inputObj);
      console.log('keyword modal input obj --', inputObj)
      setIsEditingMode(true);
    }
  }, [inputObj]);

  //////////////////////////
  //  FOR DATA UPDATE     //
  //////////////////////////
  const handleUpdateInputFields = (id: string, value: any) => {
    const newInputFieldsArray = inputFieldsArray.map((inputObj: PartContentSub) => {
      if (inputObj.id === id) {
        return {...inputObj, value: value};
      } else {
        return inputObj;
      }
    });
    setInputFieldsArray(newInputFieldsArray);
  };

  const handleAddNewKeyword = () => {
    const longerInputFieldsArray: PartContentSub[] = [
      ...inputFieldsArray,
      {...newKeywordObj, id: `${newKeywordObj.id}${nanoid(4)}`},
    ];
    setInputFieldsArray(longerInputFieldsArray)
  }

  //////////////////////////
  //  FOR NORMAL INPUT    //
  //////////////////////////
  const onChange = (e: React.FormEvent) => {
    const {id, value} = e.target as HTMLFormElement;
    handleUpdateInputFields(id, value);
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
              <FormInput
                key={`keyword_${idx}`}
                onChange={onChange}
                label={inputFieldsArray[idx]?.label}
                isRequired
                value={inputFieldsArray[idx]?.value}
                id={inputFieldsArray[idx]?.id}
                placeHolder={inputFieldsArray[idx]?.value}
                type="text"
              />
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
  )
};

export default KeywordModalDialog;
