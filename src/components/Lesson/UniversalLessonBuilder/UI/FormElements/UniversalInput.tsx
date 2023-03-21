import {Checkbox} from 'antd';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import ToggleForModal from 'components/Lesson/UniversalLessonBuilder/UI/common/ToggleForModals';
import {useGlobalContext} from 'contexts/GlobalContext';
import {EditQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import {map, remove, update} from 'lodash';
import {useEffect} from 'react';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import {
  ATTACHMENTS,
  DATE_PICKER,
  FORM_TYPES,
  INPUT,
  INPUT_WITH_EMOJI,
  LINK
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

    updateContent,
    askBeforeClose,
    setUnsavedChanges,
    selectedForm,
    createNewContent,
    inputObj
  } = props;

  const {userLanguage} = useGlobalContext();

  useEffect(() => {
    if (inputObj && inputObj.length > 0) {
      if (inputObj[0].type === FORM_TYPES.ATTACHMENTS) {
        inputObj[0].isRequired && makeRequired(0);
        update(list[0], `label`, () => inputObj[0].label);
        update(list[0], 'value', () => inputObj[0].value);
      }
    }
  }, [inputObj, list]);

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
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
      isRequired: d.required
    }));

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
                          <ToggleForModal
                            label="One line answer"
                            checked={input.textArea}
                            onClick={() => changeCheckboxValue(idx, input.textArea)}
                          />
                        </>
                      )}
                      {!hideBtns && (
                        <div className="flex items-center text-xs w-auto sm:leading-5 focus:outline-none focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                          <Checkbox
                            checked={input.required}
                            onClick={() => makeRequired(idx, input.required)}>
                            Make this required
                          </Checkbox>
                        </div>
                      )}
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
                        <ToggleForModal
                          label="One line answer"
                          checked={input.textArea}
                          onClick={() => changeCheckboxValue(idx, input.textArea)}
                        />
                      </>
                    )}
                    {!hideBtns && (
                      <Checkbox
                        checked={input.required}
                        onClick={() => makeRequired(idx, input.required)}>
                        Make this required
                      </Checkbox>
                    )}
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
          <Buttons
            label={'+ Add Field'}
            onClick={addOneInputField}
            size="small"
            variant="dashed"
          />
        ) : (
          <div className="w-auto" />
        )}
        <div className="flex items-center justify-end w-auto gap-4">
          <Buttons
            size="middle"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
          />
          <Buttons
            size="middle"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onFormCreate}
          />
        </div>
      </div>
    </>
  );
};

export default UniversalInput;
