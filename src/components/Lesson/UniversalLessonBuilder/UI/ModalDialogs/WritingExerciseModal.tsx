import {remove} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {
  Options,
  PartContentSub,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import Info from '../../../../Atoms/Alerts/Info';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Toggle from '../Toggle';
import {v4 as uuidv4} from 'uuid';
import {FaTrashAlt} from 'react-icons/fa';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import DividerBlock from '../../../UniversalLessonBlockComponents/Blocks/DividerBlock';
import {FORM_TYPES} from '../common/constants';

interface WEProps extends IContentTypeComponentProps {
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

const WritingExerciseModal = (props: WEProps) => {
  const {
    closeAction,
    inputObj,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    askBeforeClose,
    setUnsavedChanges,
    classString = 'title-show || lineStarter-hide',
  } = props;
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  // states here
  const [enable, setEnable] = useState<{title: boolean; lineStarter: boolean}>({
    title: true,
    lineStarter: false,
  });

  useEffect(() => {
    if (inputObj && inputObj.length) {
      const [title, lineStarter] = classString.split(' || ');
      if (title === 'title-show') {
        enable.title = true;
      } else {
        enable.title = false;
      }
      if (lineStarter === 'lineStarter-show') {
        enable.lineStarter = true;
      } else {
        enable.lineStarter = false;
      }

      setFields({...fields, title: inputObj[0].label});
      if (inputObj[0].options) {
        setInputFieldsArray(inputObj[0].options);
      }

      setEnable({...enable});
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const [fields, setFields] = useState({title: ''});

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value, id} = event.target;
    setFields({...fields, [id]: value});
  };
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);

  const [inputFieldsArray, setInputFieldsArray] = useState<Options[]>(
    initialInputFieldsState
  );

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

  const onLSChange = (e: React.FormEvent) => {
    setUnsavedChanges(true);
    const {id, value} = e.target as HTMLFormElement;
    handleUpdateInputFields(id, value);
  };

  const handleAddNewLinestarter = () => {
    const longerInputFieldsArray: Options[] = [
      ...inputFieldsArray,
      {...newLinestarterObj, id: `${newLinestarterObj.id}${uuidv4()}`},
    ];
    setInputFieldsArray(longerInputFieldsArray);
  };

  const removeItemFromList = (id: string) => {
    remove(inputFieldsArray, (n) => n.id === id);
    setInputFieldsArray([...inputFieldsArray]);
  };

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };
  const on_WE_Create = async () => {
    const inputObjArray = {
      id: uuidv4(),
      type: FORM_TYPES.WRITING_EXERCISE,
      label: fields.title,
      options: inputFieldsArray,
    };
    const dynamicClass = `title-${enable.title ? 'show' : 'hide'} || lineStarter-${
      enable.lineStarter ? 'show' : 'hide'
    }`;
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        FORM_TYPES.WRITING_EXERCISE,
        [inputObjArray],
        0,
        // this is a trick to keep the label stored in DB even after disabling it
        dynamicClass
      );
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler(
        '',
        '',
        FORM_TYPES.WRITING_EXERCISE,

        [inputObjArray],
        0,
        dynamicClass
      );

      await addToDB(updatedList);
    }

    // clear fields
    setInputFieldsArray(initialInputFieldsState);
    setUnsavedChanges(false);
  };

  return (
    <div>
      <Info text="Note: This component is for journal" />
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
            onChange={onChange}
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
                    onChange={onLSChange}
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
            onClick={on_WE_Create}
          />
        </div>
      </div>
    </div>
  );
};

export default WritingExerciseModal;
