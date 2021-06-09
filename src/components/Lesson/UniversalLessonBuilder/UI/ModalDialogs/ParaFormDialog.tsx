import React, {useContext, useState} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import ColorPicker from '../ColorPicker/ColorPicker';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {uniqueId} from 'lodash';
import {doResize} from '../../../../../utilities/functions';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
const HeaderModalComponent = ({
  onChange,
  selectedPageID,
  setInputFields,
  inputFields,

  inputValue,
  closeAction,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);
  const {addFromULBHandler} = useULBContext();

  const onParaCreate = () => {
    const fieldId = 'paragraph';
    const value: string = inputFields[fieldId];
    const pageContentId: string = uniqueId(`${selectedPageID}_`);
    const partContentId: string = uniqueId(`${pageContentId}_`);

    const newDataObject = {
      id: pageContentId,
      partType: 'default',
      class: 'rounded-lg',
      partContent: [
        {
          id: partContentId,
          type: 'paragraph',
          value: [value],
        },
      ],
    };
    // add data to list
    addFromULBHandler(selectedPageID, newDataObject);
    // close modal after saving
    closeAction();
    // clear fields
    setInputFields({
      ...inputFields,
      [fieldId]: '',
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          <FormInput
            onChange={onChange}
            label={'Paragraph'}
            isRequired
            value={inputValue}
            id={'paragraph'}
            placeHolder={`Enter text`}
            textarea
            rows={2}
            cols={100}
          />
        </div>
      </div>
      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={closeAction}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onParaCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderModalComponent;
