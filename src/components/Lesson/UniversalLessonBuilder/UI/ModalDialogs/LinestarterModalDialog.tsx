import React, {useContext, useEffect, useState} from 'react';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {
  Options,
  PartContentSub,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {nanoid} from 'nanoid';
import {isEmpty, remove} from 'lodash';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import {FORM_TYPES} from '../common/constants';
import DividerBlock from '../../../UniversalLessonBlockComponents/Blocks/DividerBlock';
import {FaTrashAlt} from 'react-icons/fa';
import Toggle from '../Toggle';
import {v4 as uuidv4} from 'uuid';

interface ILinestarterModalDialogProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
  classString?: string;
}

const initialInputFieldsState = [
  {
    id: 'line_1',

    label: '',
    text: 'Poem line starter one',
  },
  {
    id: 'line_2',

    label: '',
    text: 'Poem line starter two',
  },
  {
    id: 'line_3',

    label: '',
    text: 'Poem line starter three',
  },
  {
    id: 'line_4',

    label: '',
    text: 'Poem line starter four',
  },
];

const newLinestarterObj: Options = {
  id: 'line_',

  label: '',
  text: 'New linestarter...',
};

const LinestarterModalDialog = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
  askBeforeClose,
  setUnsavedChanges,
  classString = 'title-show || lineStarter-hide',
}: ILinestarterModalDialogProps) => {
  const {userLanguage} = useContext(GlobalContext);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  //////////////////////////
  //  DATA STORAGE         //
  //////////////////////////
  const [inputFieldsArray, setInputFieldsArray] = useState<Options[]>(
    initialInputFieldsState
  );

  useEffect(() => {
    if (inputObj && inputObj.length) {
      if (inputObj[0].options) {
        setInputFieldsArray(inputObj[0].options);
      }

      setIsEditingMode(true);
    }
  }, [inputObj]);

  //////////////////////////
  //  FOR DATA UPDATE     //
  //////////////////////////
  const handleUpdateInputFields = (id: string, value: any) => {
    const newInputFieldsArray = inputFieldsArray.map((inputObj: Options) => {
      if (inputObj.id === id) {
        return {...inputObj, text: value};
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
    const shorterInputFieldsArray: Options[] = inputFieldsArray.filter(
      (inputObj: Options, idx: number) => idx !== linestarterIdx
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
  // const onLineCreate = async () => {
  //   if (isEditingMode) {
  //     const updatedList = updateBlockContentULBHandler(
  //       '',
  //       '',
  //       FORM_TYPES.POEM,
  //       enable.lineStarter ? inputFieldsArray : [{}],
  //       0,
  //       enable.title ? fields.title : ''
  //     );
  //     await addToDB(updatedList);
  //   } else {
  //     const updatedList = createNewBlockULBHandler(
  //       '',
  //       '',
  //       FORM_TYPES.POEM,
  //       enable.lineStarter ? inputFieldsArray : [{}],
  //       0,
  //       enable.title ? fields.title : ''
  //     );
  //     await addToDB(updatedList);
  //   }

  //   // clear fields
  //   setInputFieldsArray(initialInputFieldsState);
  //   setUnsavedChanges(false);
  // };

  const onLineCreate = async () => {
    const lineStarterObject = {
      id: `${FORM_TYPES.POEM}-content-${nanoid(6)}`,
      type: `${FORM_TYPES.POEM}-content`,
      options: inputFieldsArray,
      value: '',
    };

    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        `poem-form-default`,

        [lineStarterObject],
        0
      );
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler(
        '',
        '',
        `poem-form-default`,

        [lineStarterObject],
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
    <div>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className={`col-span-2 `}>
          <DividerBlock bgWhite value="Line Starter Builder" />
          {inputFieldsArray.map((inputObj: Options, idx: number) => {
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
                    value={inputFieldsArray[idx]?.text}
                    id={inputFieldsArray[idx]?.id}
                    placeHolder={inputFieldsArray[idx]?.text}
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
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2 self-end"
            label={'+ Add field'}
            onClick={handleAddNewLinestarter}
            transparent
          />
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
