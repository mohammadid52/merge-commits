import React, {useContext, useEffect, useState} from 'react';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {nanoid} from 'nanoid';
import RemoveInput from '../common/RemoveInput';
import {remove} from 'lodash';

interface ILinestarterModalDialogProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const initialInputFieldsState = [
  {
    id: 'line_1',
    type: '',
    label: '',
    value: 'Poem line starter one',
  },
  {
    id: 'line_2',
    type: '',
    label: '',
    value: 'Poem line starter two',
  },
  {
    id: 'line_3',
    type: '',
    label: '',
    value: 'Poem line starter three',
  },
  {
    id: 'line_4',
    type: '',
    label: '',
    value: 'Poem line starter four',
  },
];

const newLinestarterObj: PartContentSub = {
  id: 'line_',
  type: '',
  label: '',
  value: 'New linestarter...',
};

const LinestarterModalDialog = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: ILinestarterModalDialogProps) => {
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

  const handleAddNewLinestarter = () => {
    const longerInputFieldsArray: PartContentSub[] = [
      ...inputFieldsArray,
      {...newLinestarterObj, id: `${newLinestarterObj.id}${nanoid(4)}`},
    ];
    setInputFieldsArray(longerInputFieldsArray);
  };

  const handleDeleteLinestarter = (linestarterIdx: number) => {
    const shorterInputFieldsArray: PartContentSub[] = inputFieldsArray.filter(
      (inputObj: PartContentSub, idx: number) => idx !== linestarterIdx
    );
    setInputFieldsArray(shorterInputFieldsArray);
  };

  //////////////////////////
  //  FOR NORMAL INPUT    //
  //////////////////////////
  const onChange = (e: React.FormEvent) => {
    const {id, value} = e.target as HTMLFormElement;
    handleUpdateInputFields(id, value);
  };

  const onLineCreate = async () => {
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', 'poem', inputFieldsArray, 0);
    } else {
      createNewBlockULBHandler('', '', 'poem', inputFieldsArray, 0);
    }
    // close modal after saving
    closeAction();
    // clear fields
    setInputFieldsArray(initialInputFieldsState);
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
              <div className="mb-2" key={`linestarter_${idx}`}>
                <label
                  htmlFor={'Link'}
                  className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
                  Line-starter {idx + 1}:
                </label>
                <div className="mb-2">
                  <FormInput
                    key={`jumboform_${idx}`}
                    onChange={onChange}
                    value={inputFieldsArray[idx]?.value}
                    id={inputFieldsArray[idx]?.id}
                    placeHolder={inputFieldsArray[idx]?.value}
                    type="text"
                  />
                </div>
                <RemoveInput
                  idx={idx}
                  inputId={inputObj.id}
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
            onClick={handleAddNewLinestarter}
            className="w-auto mr-4 border-2 focus:text-white focus:border-indigo-600 focus:bg-indigo-400 border-gray-300 p-2 px-4 text-tiny hover:border-gray-500 rounded-md text-dark transition-all duration-300 ">
            + Add Field
          </button>
        </div>
        <div className="flex items-center w-auto">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={closeAction}
            transparent
          />

          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onLineCreate}
          />
        </div>
      </div>
    </>
  );
};

export default LinestarterModalDialog;
