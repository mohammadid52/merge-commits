import React, {useContext, useEffect, useState} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {uniqueId} from 'lodash';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';

interface IImageInput {
  url: string;
  width: string;
  height: string;
  caption?: string;
  imageData?: File | null;
}

interface IJumbotronModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const initialInputFieldsState = [
  {
    id: 'background',
    type: 'background',
    label: 'Background',
    value:
      'https://images.freeimages.com/images/large-previews/d5d/powerlines-5-1389930.jpg',
  },
  {
    id: 'title',
    type: 'title',
    label: 'Title',
    value: 'Jumbo Title placeholder',
  },
  {
    id: 'subtitle',
    type: 'subtitle',
    label: 'Subtitle',
    value: 'This is the subtitle placeholder',
  },
  {
    id: 'description',
    type: 'description',
    label: 'Description',
    value: 'This is the description text placeholder',
  },
];

const JumbotronModalComponent = ({
  selectedPageID,
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: IJumbotronModalComponentProps) => {
  const {userLanguage} = useContext(GlobalContext);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const FIELD_ID = 'jumbotron';

  const [inputFieldsArray, setInputFieldsArray] = useState<PartContentSub[]>(initialInputFieldsState);
  useEffect(() => {
    if (inputObj) {
      if (inputObj?.value) {
        setInputFieldsArray(inputObj.value);
      }
    }
  }, [inputObj]);

  const onChange = (e: React.FormEvent) => {
    const {id, value} = e.target as HTMLFormElement;
    const newInputFieldsArray = inputFieldsArray.map((inputObj: PartContentSub) => {
      if (inputObj.id === id) {
        return {...inputObj, value: value};
      } else {
        return inputObj;
      }
    });
    setInputFieldsArray(newInputFieldsArray);
  };

  const onJumbotronCreate = () => {
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', 'jumbotron', inputFieldsArray, 0);
    } else {
      createNewBlockULBHandler('', '', 'jumbotron', inputFieldsArray, 0);
    }
    // close modal after saving
    closeAction();
    // clear fields
    setInputFieldsArray(initialInputFieldsState)
  };

  return (
    <div>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          {inputFieldsArray.map((inputObj: PartContentSub, idx: number) => (
            <FormInput
              onChange={onChange}
              label={inputFieldsArray[idx]?.label}
              isRequired
              value={inputFieldsArray[idx]?.value}
              id={inputFieldsArray[idx]?.id}
              placeHolder={inputFieldsArray[idx]?.value}
              type="text"
            />
          ))}
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
            onClick={onJumbotronCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default JumbotronModalComponent;
