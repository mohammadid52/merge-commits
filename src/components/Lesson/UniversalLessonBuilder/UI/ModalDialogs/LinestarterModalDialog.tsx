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
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import {FORM_TYPES} from '../common/constants';
import DividerBlock from '../../../UniversalLessonBlockComponents/Blocks/DividerBlock';
import {FaTrashAlt} from 'react-icons/fa';
import Toggle from '../Toggle';

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
  askBeforeClose,
  setUnsavedChanges,
}: ILinestarterModalDialogProps) => {
  const {userLanguage} = useContext(GlobalContext);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  //////////////////////////
  //  DATA STORAG         //
  //////////////////////////
  const [inputFieldsArray, setInputFieldsArray] = useState<PartContentSub[]>(
    initialInputFieldsState
  );
  // states here
  const [enable, setEnable] = useState<{title: boolean; lineStarter: boolean}>({
    title: true,
    lineStarter: false,
  });

  const [fields, setFields] = useState({title: ''});
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
    setUnsavedChanges(true);
    const {id, value} = e.target as HTMLFormElement;
    handleUpdateInputFields(id, value);
  };

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };
  const onLineCreate = async () => {
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        FORM_TYPES.POEM,
        inputFieldsArray,
        0,
        fields.title
      );
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler(
        '',
        '',
        FORM_TYPES.POEM,
        inputFieldsArray,
        0,

        fields.title
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
    <div>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div
          className={`col-span-2 ${
            !enable.title ? 'pointer-events-none opacity-50' : ''
          }`}>
          <div className="flex items-center">
            <label
              htmlFor={'title'}
              className={`text-gray-700 w-auto mr-3 block text-xs font-semibold leading-5 `}>
              {'Title'}
            </label>

            <div className="flex items-center h-5 w-auto">
              <input
                id="show_title"
                aria-describedby="show_title"
                name="show_title"
                checked={enable.title}
                onChange={(e) => setEnable({...enable, title: !enable.title})}
                type="checkbox"
                className="pointer-events-auto  h-4 w-4 text-indigo-600 border-gray-500 rounded"
              />
            </div>
          </div>
          <FormInput
            id="title"
            className=""
            value={fields.title}
            onChange={(e) => setFields({...fields, title: e.target.value})}
            placeHolder="Add instructional text here"
          />
        </div>

        <div className={`col-span-2 ${!enable.lineStarter ? 'hidden' : ''}`}>
          <DividerBlock bgWhite value="Line Starter Builder" />
          {inputFieldsArray.map((inputObj: PartContentSub, idx: number) => {
            return (
              <div className="mb-2" key={`linestarter_${idx}`}>
                <label
                  htmlFor={'Link'}
                  className="mb-2 block text-xs font-semibold leading-5 text-gray-700">
                  Line-starter {idx + 1}:
                </label>
                <div className="mb-2 relative">
                  <FormInput
                    key={`lineStarter_${idx}`}
                    onChange={onChange}
                    value={inputFieldsArray[idx]?.value}
                    id={inputFieldsArray[idx]?.id}
                    placeHolder={inputFieldsArray[idx]?.value}
                    type="text"
                  />

                  <span
                    onClick={() => removeItemFromList(inputObj.id)}
                    className="w-auto absolute right-0 top-0 pr-3 pt-3 text-center transition-all duration-200  text-xs font-semibold text-red-400  cursor-pointer hover:text-red-600
                  ">
                    <FaTrashAlt />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-span-2 mt-1 mb-4 flex items-center justify-between">
          <div className="flex items-center justify-between w-56">
            <span className=" w-auto">Show Linestarter</span>
            <Toggle
              enabledColor="bg-blue-600"
              disabledColor="bg-gray-300"
              setEnabled={() => setEnable({...enable, lineStarter: !enable.lineStarter})}
              enabled={enable.lineStarter}
            />
          </div>

          {enable.lineStarter && (
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={'+ Add field'}
              onClick={handleAddNewLinestarter}
              transparent
            />
          )}
        </div>
      </div>

      <div className="flex mt-4 justify-end px-6 pb-4">
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
            onClick={onLineCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default LinestarterModalDialog;
