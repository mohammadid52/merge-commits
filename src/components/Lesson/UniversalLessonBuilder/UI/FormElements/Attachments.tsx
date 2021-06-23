import {map, remove, update} from 'lodash';
import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import {v4 as uuidv4} from 'uuid';
import {
  ATTACHMENTS,
  DATE_PICKER,
  FORM_TYPES,
  INPUT_WITH_EMOJI,
  LINK,
} from '../common/constants';

const Attachments = ({
  closeAction,
  numbered,
  list,
  setList,
  isEditingMode,
  setNumbered,
  updateContent,
  selectedForm,
  createNewContent,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);

  const addOneInputField = () => {
    setList([...list, {id: uuidv4(), label: '', value: ''}]);
  };

  const onChange = (e: any, idx: number, label: boolean = true) => {
    const {value} = e.target;
    update(list[idx], label ? `label` : 'value', () => value);
    setList([...list]);
  };

  const removeItemFromList = (id: string) => {
    remove(list, (n: any) => n.id === id);
    setList([...list]);
  };

  const onFormCreate = () => {
    const pageContentId: string = `${uuidv4()}_`;
    const partContentId: string = `${pageContentId}_${
      selectedForm === ATTACHMENTS
        ? 'attachments'
        : selectedForm === DATE_PICKER
        ? 'datePicker'
        : selectedForm === INPUT_WITH_EMOJI
        ? 'emojiInput'
        : selectedForm === LINK
        ? 'linkInput'
        : 'attachments'
    }`;

    const inputObjArray = map(list, (d: any) => {
      return {
        id: partContentId,
        type:
          selectedForm === ATTACHMENTS
            ? FORM_TYPES.ATTACHMENTS
            : selectedForm === INPUT_WITH_EMOJI
            ? FORM_TYPES.EMOJI
            : selectedForm === LINK
            ? FORM_TYPES.LINK
            : FORM_TYPES.DATE_PICKER,
        label: d.label,
        value: d.value,
      };
    });
    const type: string = `form-${numbered ? 'numbered' : 'default'}`;
    if (isEditingMode) {
      updateContent('', '', type, inputObjArray);
    } else {
      createNewContent('', '', type, inputObjArray);
    }

    // close modal after saving
    closeAction();
  };

  const title =
    selectedForm === ATTACHMENTS
      ? ATTACHMENTS
      : selectedForm === INPUT_WITH_EMOJI
      ? INPUT_WITH_EMOJI
      : selectedForm === DATE_PICKER
      ? DATE_PICKER
      : selectedForm === LINK
      ? LINK
      : '';

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
                    label={`${numbered ? `${idx + 1}. ` : ''}${title} Title`}
                    isRequired
                    value={input.label}
                    id={`formFieldInput_${input.id}`}
                    placeHolder={`Enter Title`}
                  />
                </div>
                <div>
                  <FormInput
                    onChange={(e) => onChange(e, idx, false)}
                    label={`${title} Placeholder`}
                    value={input.value}
                    id={`placeholder_${input.id}`}
                    placeHolder={`Enter Placeholder`}
                  />
                </div>
                {idx !== 0 && (
                  <div className="flex my-2 items-center justify-end w-auto mx-3">
                    <button
                      onClick={() => removeItemFromList(input.id)}
                      className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}>
                      Remove
                    </button>
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
            {numbered ? 'Ordered Form' : 'Unordered Form'}
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
            onClick={onFormCreate}
          />
        </div>
      </div>
    </>
  );
};

export default Attachments;
