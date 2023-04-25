import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import React, {useEffect, useState} from 'react';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import {DIVIDER} from '../common/constants';

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
    setUnsavedChanges
  } = props;
  const {userLanguage} = useGlobalContext();
  const {EditQuestionModalDict} = useDictionary();
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const onChange = (e: React.FormEvent) => {
    setUnsavedChanges(true);
    const {value} = e.target as HTMLFormElement;
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
      lessonPlan: [...list.lessonPlan]
    };
    await updateLessonPageToDB(input);
  };

  const onDividerCreate = async () => {
    const dividerData = [
      {
        id: uuidv4().toString(),
        type: DIVIDER,
        label: '',
        value: dividerText
      }
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
            <p className="text-light  text-sm italic">
              {isEditingMode ? 'Remove' : 'Skip'} this if you want to add plain divider
            </p>
          </div>
        </div>
      </div>
      <div className="flex mt-4 justify-end px-6 pl-0 pb-4">
        <div className="flex items-center w-auto gap-4">
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
            size="middle"
          />

          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onDividerCreate}
            size="middle"
          />
        </div>
      </div>
    </div>
  );
};

export default DividerModal;
