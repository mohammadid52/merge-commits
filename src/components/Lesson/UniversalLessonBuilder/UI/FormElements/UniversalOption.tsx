import {map, remove, update} from 'lodash';
import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import FormInput from '../../../../Atoms/Form/FormInput';
import RemoveInput from '../common/RemoveInput';
import {v4 as uuidv4} from 'uuid';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {getAsset} from '../../../../../assets';
import {FORM_TYPES, SELECT_ONE} from '../common/constants';

const SelectOne = ({
  numbered,
  closeAction,
  isEditingMode,
  setNumbered,
  selectedForm,
  list,
  setList,
  updateContent,
  createNewContent,
}: any) => {
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const onOptionInputChange = (idx: number, idx2: number, e: any) => {
    update(list[idx], `options[${idx2}].text`, () => e.target.value);
    setList([...list]);
  };

  const onChange = (e: any, idx: number) => {
    const {value} = e.target;
    update(list[idx], 'label', () => value);
    setList([...list]);
  };

  const addOneLinkField = () => {
    setList([
      ...list,
      {
        id: uuidv4(),
        label: '',
        options: [
          {label: '1', text: '', id: uuidv4()},
          {label: '2', text: '', id: uuidv4()},
        ],
      },
    ]);
  };

  const onRadioCreate = () => {
    const pageContentId: string = `${uuidv4()}_`;
    const partContentId: string = `${pageContentId}_radioInput`;

    const modifiedOptions = (opt: any) =>
      map(opt, (o) => ({
        label: o.label,
        text: o.text,
      }));

    const inputObjArray = map(list, (d: any) => {
      return {
        id: partContentId,
        type: selectedForm === SELECT_ONE ? FORM_TYPES.RADIO : FORM_TYPES.MULTIPLE,
        label: d.label,
        value: modifiedOptions(d.options),
      };
    });
    const type: string = `form-${numbered ? 'numbered' : 'default'}`;
    if (isEditingMode) {
      updateContent('', '', type, inputObjArray);
    } else {
      createNewContent('', '', type, inputObjArray);
    }

    // // close modal after saving
    closeAction();
  };

  const removeItemFromList = (id: string) => {
    remove(list, (n: any) => n.id === id);
    setList([...list]);
  };

  const onOptionAdd = (idx: number, idx2: number) => {
    const currentOptions = [...list[idx].options];
    const newItem = {label: (idx2 + 2).toString(), text: '', id: uuidv4().toString()};
    currentOptions.splice(idx2 + 1, 0, newItem);
    let updatedOptions = currentOptions.map((item, i) => {
      if (i > idx2 + 1) {
        item.label = (i + 1).toString();
        return item;
      } else {
        return item;
      }
    });
    update(list[idx], `options`, () => updatedOptions);
    setList([...list]);
  };
  const onOptionRemove = (idx: number, id: string) => {
    const options = list[idx].options;
    if (options.length === 1) return;
    else {
      remove(options, (n: any) => n.id === id);
      setList([...list]);
    }
  };

  const getColor = (color: string) => {
    return `hover:bg-${color}-200 text-${color}-400 border-${color}-200 hover:text-${color}-600 focus:outline-none focus:bg-${color}-200 focus:border-transparent`;
  };

  return (
    <>
      <div>
        {map(list, (input: any, idx: number) => {
          const shouldShowActions = idx !== list.length - 1;

          return (
            <div key={input.id} className="flex flex-col input-container">
              <div className="px-2">
                <div className="mb-2">
                  <FormInput
                    onChange={(e) => onChange(e, idx)}
                    label={`${numbered ? `${idx + 1}. ` : ''}Radio Input`}
                    isRequired
                    value={input.label}
                    id={`formField_${input.id}`}
                    placeHolder={`Enter Title`}
                  />
                  {/* Options input fields */}
                  {input.options?.length &&
                    input.options?.map((item: any, index: number) => {
                      // @ts-ignore

                      return (
                        <div
                          key={index.toLocaleString()}
                          className="flex w-9/10 mx-auto mt-4">
                          <div className="w-8/10">
                            <FormInput
                              value={item.text}
                              id={`formFieldRadioOption_${idx}_${index}`}
                              onChange={(e) => onOptionInputChange(idx, index, e)}
                              name={item.label}
                              placeHolder={`Option ${index + 1}`}
                            />
                          </div>
                          <div className="w-auto flex items-center">
                            <div className="flex items-center justify-end w-auto ml-3">
                              <button
                                onClick={() => onOptionAdd(idx, index)}
                                className={`text-center w-20 transition-all duration-200 ${getColor(
                                  themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                                )} text-xs font-semibold text-gray-400 border-gray-200 px-2 py-1 cursor-pointer rounded  border-2 hover:text-gray-600`}>
                                Add
                              </button>
                            </div>
                            <div className="flex items-center justify-end w-auto ml-3">
                              <button
                                onClick={() => onOptionRemove(idx, item.id)}
                                className={`text-center focus:outline-none focus:bg-red-200 focus:border-transparent w-20 transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded border-2 hover:text-red-600`}>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <RemoveInput
                  idx={idx}
                  inputId={input.id}
                  removeItemFromList={removeItemFromList}
                />
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
            onClick={addOneLinkField}
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
            onClick={onRadioCreate}
          />
        </div>
      </div>
    </>
  );
};
export default SelectOne;
