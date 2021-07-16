import {map, remove, update} from 'lodash';
import React, {useContext} from 'react';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import {v4 as uuidv4} from 'uuid';
import {FORM_TYPES} from '../common/constants';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';

const Checkbox = ({val}: {val: boolean}) => {
  return (
    <>
      {val ? (
        <BiCheckboxChecked className="w-auto text-3xl text-blue-600 cursor-pointer" />
      ) : (
        <BiCheckbox className="w-auto text-3xl text-blue-600 cursor-pointer" />
      )}
      <p className="w-auto cursor-pointer">textarea</p>
    </>
  );
};

import {Switch} from '@headlessui/react';

/**
 * @param classes multipple classes separeted bt comma
 * @returns multiple classes into a single class
 * */
export const classNames = (...classes: any[]) => classes.filter(Boolean).join(' ');

const Toggle = ({checked, onClick}: {checked: boolean; onClick: any}) => {
  return (
    <Switch
      checked={checked}
      onChange={onClick}
      className="mx-3 flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <span className="sr-only">Text response type</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bg-white w-full h-full rounded-md"
      />
      <span
        aria-hidden="true"
        className={classNames(
          checked ? 'bg-indigo-600' : 'bg-gray-200',
          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          checked ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
        )}
      />
    </Switch>
  );
};

const TextInput = ({
  closeAction,
  numbered,
  list,
  setList,
  setNumbered,
  isEditingMode,
  updateContent,
  setUnsavedChanges,
  askBeforeClose,
  createNewContent,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);

  const addOneInputField = () => {
    const newItem = {id: uuidv4(), textArea: false, title: '', placeholder: ''};
    setList([...list, newItem]);
  };

  const changeCheckboxValue = (idx: number, currentValue: boolean) => {
    update(list[idx], 'textArea', () => !currentValue);
    setList([...list]);
  };

  const onChange = (e: any, idx: number, placeholder: boolean = false) => {
    setUnsavedChanges(true);
    const {value} = e.target;
    update(list[idx], placeholder ? `placeholder` : 'title', () => value);
    setList([...list]);
  };

  const removeItemFromList = (id: string) => {
    remove(list, (n: any) => n.id === id);
    setList([...list]);
  };

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const onFormCreate = async () => {
    const pageContentId: string = `${uuidv4()}_`;
    const partContentId: string = `${pageContentId}_textInput`;

    const inputObjArray = map(list, (d: any) => {
      return {
        id: partContentId,
        type: d.textArea ? FORM_TYPES.TEXTAREA : FORM_TYPES.TEXT,
        label: d.title,
        value: d.placeholder,
      };
    });
    const type: string = `form-${numbered ? 'numbered' : 'default'}`;
    if (isEditingMode) {
      const updatedList = updateContent('', '', type, inputObjArray);
      await addToDB(updatedList);
    } else {
      const updatedList = createNewContent('', '', type, inputObjArray);
      await addToDB(updatedList);
    }
    // close modal after saving

    setUnsavedChanges(false);
  };

  return (
    <>
      <div>
        {map(list, (input: any, idx: number) => {
          const shouldShowActions = idx !== list.length - 1;
          return (
            <div key={input.id} className="flex flex-col input-container">
              <div className="px-2">
                <div className="mb-2 ">
                  <FormInput
                    onChange={(e) => onChange(e, idx, false)}
                    label={`${numbered ? `${idx + 1}. ` : ''}Label`}
                    isRequired
                    value={input.title}
                    id={`formFieldInput_${input.id}`}
                    placeHolder={`Enter Label`}
                  />
                </div>
                <div>
                  <FormInput
                    onChange={(e) => onChange(e, idx, true)}
                    label={'Placeholder'}
                    value={input.placeholder}
                    id={`placeholder_${input.id}`}
                    placeHolder={`Briefly explain how user should respond`}
                  />
                </div>
                {idx !== 0 ? (
                  <div className="flex my-2 items-center justify-end w-auto">
                    <div className="flex items-center mt-4 text-xs">
                      Sentence
                      <Toggle
                        checked={input.textArea}
                        onClick={() => changeCheckboxValue(idx, input.textArea)}
                      />
                      Paragraph
                    </div>

                    <button
                      onClick={() => removeItemFromList(input.id)}
                      className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center mt-4 text-xs">
                    Sentence
                    <Toggle
                      checked={input.textArea}
                      onClick={() => changeCheckboxValue(idx, input.textArea)}
                    />
                    Paragraph
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

export default TextInput;
