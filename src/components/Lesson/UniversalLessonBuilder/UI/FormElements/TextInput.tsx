import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import {EditQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import {map, remove, update} from 'lodash';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import {FORM_TYPES} from '../common/constants';

import {Checkbox, Form, Switch} from 'antd';

export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

const TextInput = ({
  closeAction,
  numbered,
  list,
  setList,

  isEditingMode,
  updateContent,
  setUnsavedChanges,
  askBeforeClose,
  createNewContent
}: any) => {
  const {userLanguage} = useGlobalContext();

  const addOneInputField = () => {
    const newItem = {
      id: uuidv4(),
      textArea: false,
      title: '',
      placeholder: ''
    };
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
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  const onFormCreate = async () => {
    const inputObjArray = map(list, (d: any) => {
      const pageContentId: string = `${uuidv4()}_`;
      const partContentId: string = `${pageContentId}_textInput`;
      return {
        id: partContentId,
        type: d.textArea ? FORM_TYPES.TEXTAREA : FORM_TYPES.TEXT,
        label: d.title,
        value: d.placeholder,
        isRequired: d.required
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
                    label={`${numbered ? idx + 1 : ''}Label`}
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
                    <Form.Item label="One line answer" valuePropName="checked">
                      <Switch
                        checked={!Boolean(input.textArea)}
                        onClick={() => changeCheckboxValue(idx, input.textArea)}
                      />
                    </Form.Item>

                    <button
                      onClick={() => removeItemFromList(input.id)}
                      className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <Form.Item label="long answer" valuePropName="checked">
                    <Switch
                      checked={Boolean(input.textArea)}
                      onClick={() => changeCheckboxValue(idx, input.textArea)}
                    />
                  </Form.Item>
                )}
                <div className="flex items-center text-xs w-auto">
                  <Checkbox
                    checked={input.required}
                    onClick={() => {
                      update(list[idx], `required`, () => !input.required);
                      setList([...list]);
                    }}>
                    Make this required
                  </Checkbox>
                </div>
              </div>

              {shouldShowActions && (
                <div className="border-b-2 border-dashed border-gray-300 my-4 "></div>
              )}
            </div>
          );
        })}
      </div>
      <Buttons
        label={'+ Add Field'}
        onClick={addOneInputField}
        size="small"
        variant="dashed"
      />

      <div className="flex mt-8 justify-between px-6 pb-4">
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

export default TextInput;
