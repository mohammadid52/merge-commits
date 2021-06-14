import React, {useContext, useState, useEffect} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {uniqueId} from 'lodash';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
const ParaModalComponent = ({
  selectedPageID,
  closeAction,
  inputObj,
  updateBlockContentULBHandler,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);
  const {addFromULBHandler} = useULBContext();
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  
  const FIELD_ID = 'paragraph';
  
  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFields((prevInputFields: any) => ({
        ...prevInputFields,
        [FIELD_ID]: inputObj[0],
      }));
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const onChange = (e: any) => {
    const {value, id} = e.target;
    setInputFields({
      ...inputFields,
      [id]: value,
    });
  };
  const [inputFields, setInputFields] = useState<any>({});

  const onParaCreate = () => {
    const value: string = inputFields[FIELD_ID];
    const pageContentId: string = uniqueId(`${selectedPageID}_`);
    const partContentId: string = uniqueId(`${pageContentId}_`);
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', 'paragraph', [value]);
    } else {
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
    }
    // close modal after saving
    closeAction();
    // clear fields
    setInputFields({
      ...inputFields,
      [FIELD_ID]: '',
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
            value={inputFields[FIELD_ID]}
            id={FIELD_ID}
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

export default ParaModalComponent;
