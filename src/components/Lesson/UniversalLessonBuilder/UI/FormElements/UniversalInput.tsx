import ToggleForModal from '@components/Lesson/UniversalLessonBuilder/UI/common/ToggleForModals';
import {map, remove, update} from 'lodash';
import React, {useContext} from 'react';
import {v4 as uuidv4} from 'uuid';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import {
  ATTACHMENTS,
  DATE_PICKER,
  FORM_TYPES,
  INPUT,
  INPUT_WITH_EMOJI,
  LINK,
} from '../common/constants';

/**
 * @param classes multipple classes separeted bt comma
 * @returns multiple classes into a single class
 * */
export const classNames = (...classes: any[]) => classes.filter(Boolean).join(' ');

const UniversalInput = (props: any) => {
  const {
    closeAction,
    numbered,
    list,
    setList,
    isEditingMode,
    setNumbered,
    updateContent,
    askBeforeClose,
    setUnsavedChanges,
    selectedForm,
    createNewContent,
  } = props;

  const {userLanguage} = useContext(GlobalContext);

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };
  const addOneInputField = () => {
    setList([...list, {id: uuidv4(), label: '', value: '', required: false}]);
  };

  const makeRequired = (idx: number, required: boolean = false) => {
    update(list[idx], `required`, () => !required);
    setList([...list]);
  };

  const onChange = (e: any, idx: number, label: boolean = true) => {
    setUnsavedChanges(true);
    const {value} = e.target;
    update(list[idx], label ? `label` : 'value', () => value);
    setList([...list]);
  };

  const changeCheckboxValue = (idx: number, currentValue: boolean) => {
    update(list[idx], 'textArea', () => !currentValue);
    setList([...list]);
  };

  const removeItemFromList = (id: string) => {
    remove(list, (n: any) => n.id === id);
    setList([...list]);
  };

  const onFormCreate = async () => {
    const inputObjArray = map(list, (d: any) => ({
      id: uuidv4(),
      type:
        selectedForm === ATTACHMENTS
          ? FORM_TYPES.ATTACHMENTS
          : selectedForm === INPUT_WITH_EMOJI
          ? FORM_TYPES.EMOJI
          : selectedForm === LINK
          ? FORM_TYPES.LINK
          : selectedForm === DATE_PICKER
          ? FORM_TYPES.DATE_PICKER
          : selectedForm === INPUT && d.textArea
          ? FORM_TYPES.TEXTAREA
          : FORM_TYPES.TEXT,
      label: d.label,
      value: d.value,
      isRequired: d.required,
    }));
    console.log(
      '🚀 ~ file: UniversalInput.tsx ~ line 97 ~ inputObjArray ~ inputObjArray',
      inputObjArray
    );

    const type: string = `form-${numbered ? 'numbered' : 'default'}`;
    if (isEditingMode) {
      const updatedList = updateContent('', '', type, inputObjArray);
      await addToDB(updatedList);
    } else {
      const updatedList = createNewContent('', '', type, inputObjArray);
      await addToDB(updatedList);
    }

    setUnsavedChanges(false);
  };

  const hideBtns = selectedForm === ATTACHMENTS;

  return (
    <>
      <div>
        {map(list, (input: any, idx: number) => {
          const shouldShowActions = idx !== list.length - 1;
          return (
            <div key={input.id} className="flex flex-col input-container">
              <div className="my-2 px-2">
                <div className="mb-2">
                  <FormInput
                    onChange={(e) => onChange(e, idx)}
                    label={`${numbered ? `${idx + 1}. ` : ''}Label`}
                    isRequired
                    value={input.label}
                    id={`formFieldInput_${input.id}`}
                    placeHolder={`Enter Label`}
                  />
                </div>
                {selectedForm !== DATE_PICKER && (
                  <div>
                    <FormInput
                      onChange={(e) => onChange(e, idx, false)}
                      label={`Placeholder`}
                      value={input.value}
                      id={`placeholder_${input.id}`}
                      placeHolder={`Briefly explain how user should respond`}
                    />
                  </div>
                )}
                {idx !== 0 ? (
                  <div className="flex my-2 items-center justify-end w-auto">
                    <div className="flex items-center mt-4 gap-x-4">
                      {selectedForm === INPUT && (
                        <>
                          <div className="sm:text-sm sm:leading-5 focus:outline-none focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm w-auto">
                            <div className="flex items-center text-xs w-auto">
                              Sentence
                              <ToggleForModal
                                checked={input.textArea}
                                onClick={() => changeCheckboxValue(idx, input.textArea)}
                              />
                              Paragraph
                            </div>
                          </div>
                        </>
                      )}
                      <div className="flex items-center text-xs w-auto sm:leading-5 focus:outline-none focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                        Make this required
                        <ToggleForModal
                          checked={input.required}
                          onClick={() => makeRequired(idx, input.required)}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeItemFromList(input.id)}
                      className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center mt-4 gap-x-4">
                    {selectedForm === INPUT && (
                      <>
                        <div className="flex items-center w-auto sm:text-sm sm:leading-5 focus:outline-none focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm ">
                          <div className="flex items-center text-xs w-auto">
                            Sentence
                            <ToggleForModal
                              checked={input.textArea}
                              onClick={() => changeCheckboxValue(idx, input.textArea)}
                            />
                            Paragraph
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex items-center text-xs w-auto sm:leading-5 focus:outline-none focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                      Make this required
                      <ToggleForModal
                        checked={input.required}
                        onClick={() => makeRequired(idx, input.required)}
                      />
                    </div>
                  </div>
                )}
              </div>
              {shouldShowActions && (
                <div className="border-b-2 border-dashed border-gray-300 my-4 "></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex mt-8 justify-between px-6 pb-4">
        {!hideBtns ? (
          <div className="flex items-center w-auto">
            <button
              onClick={addOneInputField}
              className="w-auto mr-4 border-2 focus:text-white focus:border-indigo-600 focus:bg-indigo-400 border-gray-300 p-2 px-4 text-tiny hover:border-gray-500 rounded-md text-dark transition-all duration-300 ">
              + Add Field
            </button>
            <button
              onClick={() => setNumbered(!numbered)}
              className={`${
                numbered
                  ? 'border-indigo-500 text-white bg-indigo-400'
                  : 'border-gray-300 text-dark'
              } w-auto p-2 px-4 focus:border-indigo-600 text-tiny border-2 hover:border-gray-500 rounded-md  transition-all duration-300 mr-4`}>
              {numbered ? 'Numbered' : 'Unnumbered'}
            </button>
          </div>
        ) : (
          <div className="w-auto" />
        )}
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
            onClick={onFormCreate}
          />
        </div>
      </div>
    </>
  );
};

export default UniversalInput;
