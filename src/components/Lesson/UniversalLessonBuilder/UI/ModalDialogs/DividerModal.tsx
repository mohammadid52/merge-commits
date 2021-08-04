import React, {useContext, useState, useEffect} from 'react';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import FormInput from '../../../../Atoms/Form/FormInput';
import {v4 as uuidv4} from 'uuid';
import {DIVIDER} from '../common/constants';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import Buttons from '../../../../Atoms/Buttons';

interface Divider extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const DividerModal = (props: Divider) => {
  const {
    closeAction,
    inputObj,
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    askBeforeClose,
    setUnsavedChanges,
  } = props;
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {EditQuestionModalDict} = useDictionary(clientKey);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const onChange = (e: React.FormEvent) => {
    setUnsavedChanges(true);
    const {value, name} = e.target as HTMLFormElement;
    setDividerText(value);
  };

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setIsEditingMode(true);
      setDividerText(inputObj[0].value);
    }
  }, [inputObj]);

  const [dividerText, setDividerText] = useState('');

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };
    await updateLessonPageToDB(input);
  };

  const onDividerCreate = async () => {
    const dividerData = [
      {
        id: uuidv4().toString(),
        type: DIVIDER,
        label: '',
        value: dividerText,
      },
    ];

    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        DIVIDER,
        dividerData,
        0,
        'px-4'
      );
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler(
        '',
        '',
        DIVIDER,
        dividerData,
        0,
        'px-4'
      );
      await addToDB(updatedList);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 my-2 gap-4">
        <div className="col-span-3">
          <div className={'my-2'}>
            <div className="mb-2">
              <FormInput
                label={'Enter divider text'}
                onChange={onChange}
                name={'dividerText'}
                value={dividerText}
                placeHolder={'eg. to be continued'}
              />
            </div>
            <p className="text-gray-400 text-sm italic">
              {isEditingMode ? 'Remove' : 'Skip'} this if you want to add plain divider
            </p>
          </div>
        </div>
      </div>
      <div className="flex mt-4 justify-end px-6 pl-0 pb-4">
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
            onClick={onDividerCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default DividerModal;
