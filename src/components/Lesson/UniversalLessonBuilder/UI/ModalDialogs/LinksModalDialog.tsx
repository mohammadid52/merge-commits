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

interface Links extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const initialInputFieldsState = [
  {
    id: 'link_1',
    type: '',
    label: 'Link to Page',
    value: 'https://www.google.com',
  },
  {
    id: 'link_2',
    type: '',
    label: 'Link to Page',
    value: 'https://www.google.com',
  },
];

const newLinkObj: PartContentSub = {
  id: 'link_',
  type: '',
  label: 'Link Label',
  value: 'Link URL',
};

const LinksModalDialog = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: Links) => {
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

  const handleAddNewLink = () => {
    const longerInputFieldsArray: PartContentSub[] = [
      ...inputFieldsArray,
      {...newLinkObj, id: `${newLinkObj.id}${nanoid(4)}`},
    ];
    setInputFieldsArray(longerInputFieldsArray);
  };

  const handleDeleteLink = (keywordIdx: number) => {
    const shorterInputFieldsArray: PartContentSub[] = inputFieldsArray.filter(
      (inputObj: PartContentSub, idx: number) => idx !== keywordIdx
    );
    setInputFieldsArray(shorterInputFieldsArray);
  };

  //////////////////////////
  //  FOR NORMAL INPUT    //
  //////////////////////////
  const [inputErrorArray, setInputErrorArray] = useState<boolean[]>([])
  const onChange = (e: React.FormEvent, idx: number) => {
    const {id, value, name} = e.target as HTMLFormElement;
    // validateUrl(value, idx);
    handleUpdateInputFields(value, name, idx);
  };

  const validateUrl = (inputUrl: string) => {
    const isYoutubeLink = inputUrl.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/g);
    return isYoutubeLink === null;
  }

  const onLinkCreate = async () => {
    const validLinkArray = inputFieldsArray.map((field: PartContentSub, idx: number) => validateUrl(field.value));
    if(!validLinkArray.includes(true)){
      if (isEditingMode) {
        updateBlockContentULBHandler('', '', 'links', inputFieldsArray, 0);
      } else {
        createNewBlockULBHandler('', '', 'links', inputFieldsArray, 0);
      }
      // close modal after saving
      closeAction();
      // clear fields
      setInputFieldsArray(initialInputFieldsState);
    } else {
      setInputErrorArray(validLinkArray)
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          {inputFieldsArray.map((inputObj: PartContentSub, idx: number) => {
            return (
              <React.Fragment key={`keyword_${idx}`}>
                <p>
                  Link {idx + 1}:{' '}
                  <span
                    onClick={() => handleDeleteLink(idx)}
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
                  className={`
                  ${!validateUrl(inputFieldsArray[idx]?.value) ? 'border-0 border-gray-300' : 'border-2 border-red-400'} 
                  mt-1 block w-full sm:text-sm sm:leading-5 
                  py-2 px-3 rounded-md shadow-sm`}
                  value={inputFieldsArray[idx]?.value}
                  placeholder={inputFieldsArray[idx]?.value}
                />
                {
                  !validateUrl(inputFieldsArray[idx]?.value) ? null : <p className={`text-red-400 text-xs`}>Please enter a valid Youtube link :)</p>
                }
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
            onClick={onLinkCreate}
          />

          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={`ADD`}
            onClick={handleAddNewLink}
          />
        </div>
      </div>
    </>
  );
};

export default LinksModalDialog;
