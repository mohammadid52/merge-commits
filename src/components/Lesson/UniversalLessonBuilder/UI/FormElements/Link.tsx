import {map, remove, update} from 'lodash';
import React, {useContext} from 'react';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';
import FormInput from '../../../../Atoms/Form/FormInput';
import RemoveInput from '../common/RemoveInput';
import {v4 as uuidv4} from 'uuid';
import Buttons from '../../../../Atoms/Buttons';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {FORM_TYPES} from '../common/constants';

const Link = ({
  numbered,
  closeAction,
  isEditingMode,
  setNumbered,
  updateContent,
  list,
  setList,
  createNewContent,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);

  const onChange = (e: any, idx: number, label: boolean = true) => {
    update(list[idx], `${label ? 'label' : 'value'}`, () => e.target.value);
    setList([...list]);
  };
  const removeItemFromList = (id: string) => {
    remove(list, (n: any) => n.id === id);
    setList([...list]);
  };

  const addOneLinkField = () => {
    setList([...list, {id: uuidv4(), label: '', value: ''}]);
  };

  const onLinkCreate = () => {
    const type: string = `form-${numbered ? 'numbered' : 'default'}`;
    const pageContentId: string = `${uuidv4()}_`;
    const partContentId: string = `${pageContentId}_link`;

    const inputObjArray = map(list, (d: any) => {
      return {
        id: partContentId,
        type: FORM_TYPES.LINK,
        label: d.label,
        value: d.value,
      };
    });

    if (isEditingMode) {
      updateContent('', '', type, inputObjArray, 0);
    } else {
      createNewContent('', '', type, inputObjArray, 0);
    }
    // close modal after saving
    closeAction();
  };

  return (
    <>
      <div className="">
        {list.map((inputObj: PartContentSub, idx: number) => {
          const shouldShowActions = idx !== list.length - 1;

          return (
            <div className={'mb-2 px-2'} key={`keyword_${idx}`}>
              <div className="mb-2">
                <FormInput
                  onChange={(e) => onChange(e, idx)}
                  name={'label'}
                  value={inputObj.label}
                  label={`${numbered ? `${idx + 1}. ` : ''}Link Title`}
                  placeHolder={`Enter link title`}
                />
              </div>
              <div className="mb-2">
                <FormInput
                  onChange={(e) => onChange(e, idx, false)}
                  value={inputObj?.value}
                  label={`Link Placeholder`}
                  name={'value'}
                  placeHolder={`Enter link placeholder`}
                />
              </div>

              <RemoveInput
                idx={idx}
                inputId={inputObj.id}
                removeItemFromList={removeItemFromList}
              />
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
            onClick={onLinkCreate}
          />
        </div>
      </div>
    </>
  );
};

export default Link;
