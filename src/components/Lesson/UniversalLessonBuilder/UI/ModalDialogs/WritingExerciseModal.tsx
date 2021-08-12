import {findIndex, remove, update} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';
import Info from '../../../../Atoms/Alerts/Info';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Toggle from '../Toggle';
import {v4 as uuidv4} from 'uuid';
import {FaTrashAlt} from 'react-icons/fa';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';

import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import DividerBlock from '../../../UniversalLessonBlockComponents/Blocks/DividerBlock';

interface WEProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
  classString?: string;
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

const WritingExerciseModal = (props: WEProps) => {
  const {
    closeAction,
    inputObj,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    askBeforeClose,
    setUnsavedChanges,
  } = props;
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const {universalLessonDetails, selectedPageID} = useULBContext();
  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFieldsArray(inputObj);
      setIsEditingMode(true);
    }
  }, [inputObj]);

  // states here
  const [enable, setEnable] = useState<{title: boolean; lineStarter: boolean}>({
    title: true,
    lineStarter: false,
  });

  const [fields, setFields] = useState({title: ''});

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value, id} = event.target;
    setFields({...fields, [id]: value});
  };
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);

  const [inputFieldsArray, setInputFieldsArray] = useState<PartContentSub[]>(
    initialInputFieldsState
  );

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

  const onLSChange = (e: React.FormEvent) => {
    setUnsavedChanges(true);
    const {id, value} = e.target as HTMLFormElement;
    handleUpdateInputFields(id, value);
  };

  const handleAddNewLinestarter = () => {
    const longerInputFieldsArray: PartContentSub[] = [
      ...inputFieldsArray,
      {...newLinestarterObj, id: `${newLinestarterObj.id}${uuidv4()}`},
    ];
    setInputFieldsArray(longerInputFieldsArray);
  };

  const removeItemFromList = (id: string) => {
    remove(inputFieldsArray, (n) => n.id === id);
    setInputFieldsArray([...inputFieldsArray]);
  };

  const on_WE_Create = async () => {
    const currentPageIdx = findIndex(
      universalLessonDetails.lessonPlan,
      (item: any) => item.id === selectedPageID
    );

    const pageContent = [
      ...universalLessonDetails.lessonPlan[currentPageIdx].pageContent,
      {
        id: uuidv4(),
        class: '',
        partType: 'writing-exercise',
        partContent: [
          {
            id: uuidv4(),
            type: '',
            value: inputFieldsArray,
            // don't have better idea to add title
            class: fields.title,
          },
        ],
      },
    ];

    const updatedLesson = update(
      universalLessonDetails,
      `lessonPlan[${currentPageIdx}].pageContent`,
      () => pageContent
    );
    closeAction();
    await updateLessonPageToDB(updatedLesson);
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
            onClick={on_WE_Create}
          />
        </div>
      </div>
    </div>
  );
};

export default WritingExerciseModal;
