import React, {useEffect, useState} from 'react';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import {EditQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from 'interfaces/UniversalLessonInterfaces';
import {remove} from 'lodash';
import {nanoid} from 'nanoid';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import RemoveInput from '../common/RemoveInput';

interface Links extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const initialInputFieldsState = [
  {
    id: 'link_1',
    type: '',
    label: 'Link to Page',
    value: 'https://www.google.com'
  },
  {
    id: 'link_2',
    type: '',
    label: 'Link to Page',
    value: 'https://www.google.com'
  }
];

const newLinkObj: PartContentSub = {
  id: 'link_',
  type: '',
  label: 'Link Label',
  value: 'Link URL'
};

const LinksModalDialog = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
  askBeforeClose,
  setUnsavedChanges
}: Links) => {
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
      {...newLinkObj, id: `${newLinkObj.id}${nanoid(4)}`}
    ];
    setInputFieldsArray(longerInputFieldsArray);
  };

  const removeItemFromList = (id: string) => {
    remove(inputFieldsArray, (n) => n.id === id);
    setInputFieldsArray([...inputFieldsArray]);
  };

  //////////////////////////
  //  FOR NORMAL INPUT    //
  //////////////////////////
  const [_, setInputErrorArray] = useState<boolean[]>([]);
  const onChange = (e: React.FormEvent, idx: number) => {
    setUnsavedChanges(true);
    const {value, name} = e.target as HTMLFormElement;

    handleUpdateInputFields(value, name, idx);
  };

  const validateUrl = (inputUrl: string) => {
    const isUrl = inputUrl.match(/^https?:\/\//);
    return isUrl === null;
  };
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };
    await updateLessonPageToDB(input);
  };
  const onLinkCreate = async () => {
    const validLinkArray = inputFieldsArray.map((field: PartContentSub) =>
      validateUrl(field?.value || '')
    );
    if (!validLinkArray.includes(true)) {
      if (isEditingMode) {
        const updatedList = updateBlockContentULBHandler(
          '',
          '',
          'links',
          inputFieldsArray,
          0
        );
        await addToDB(updatedList);
      } else {
        const updatedList = createNewBlockULBHandler(
          '',
          '',
          'links',
          inputFieldsArray,
          0
        );
        await addToDB(updatedList);
      }

      // clear fields
      setInputFieldsArray(initialInputFieldsState);
      setUnsavedChanges(false);
    } else {
      setInputErrorArray(validLinkArray);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          {inputFieldsArray.map((inputObj: PartContentSub, idx: number) => {
            return (
              <div className={'my-2'} key={`keyword_${idx}`}>
                <label
                  htmlFor={'Link'}
                  className="mb-2 block text-xs font-semibold leading-5 text-dark  ">
                  Link {idx + 1}:
                </label>
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
                    label="Enter url"
                    isRequired
                    error={
                      !validateUrl(inputFieldsArray?.[idx]?.value || '')
                        ? ''
                        : // <p className={`text-red-400 text-xs`}>
                          'Please enter a valid link'
                      // </p>
                    }
                    placeHolder={inputFieldsArray[idx]?.value}
                  />
                </div>

                <RemoveInput
                  idx={idx}
                  inputId={inputObj?.id || ''}
                  removeItemFromList={removeItemFromList}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex mt-4 justify-between px-6 pb-4">
        <div className="flex items-center w-auto">
          <button
            onClick={handleAddNewLink}
            className="w-auto mr-4 border-2 focus:text-white focus:border-indigo-600 focus:bg-indigo-400 border-lightest  p-2 px-4 text-tiny hover:border-medium  rounded-md text-dark transition-all duration-300 ">
            + Add Field
          </button>
        </div>
        <div className="flex items-center w-auto gap-4">
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
          />

          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onLinkCreate}
          />
        </div>
      </div>
    </>
  );
};

export default LinksModalDialog;
