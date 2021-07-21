import React, {useContext, useState, useEffect} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {uniqueId} from 'lodash';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import RichTextEditor from '../../../../Atoms/RichTextEditor';

interface IParaModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
  setUnsavedChanges: any;
  askBeforeClose: () => void;
}

const ParaModalComponent = ({
  selectedPageID,
  closeAction,
  inputObj,
  setUnsavedChanges,
  askBeforeClose,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: IParaModalComponentProps) => {
  const {userLanguage} = useContext(GlobalContext);

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const FIELD_ID = 'paragraph';

  const [inputFieldValue, setInputFieldValue] = useState<string>('');

  useEffect(() => {
    if (inputObj && inputObj.length) {
      console.log(
        '🚀 ~ file: ParaFormDialog.tsx ~ line 29 ~ inputObj',
        inputObj[0].value
      );

      setEditorContent(inputObj[0].value, inputObj[0].value);
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const onParaCreate = async () => {
    const pageContentId: string = uniqueId(`${selectedPageID}_`);
    const partContentId: string = uniqueId(`${pageContentId}_`);
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler('', '', FIELD_ID, [
        {id: uuidv4().toString(), inputFieldValue},
      ]);
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler('', '', FIELD_ID, [
        {id: uuidv4().toString(), inputFieldValue},
      ]);
      await addToDB(updatedList);
    }
    // close modal after saving

    // clear fields
    setInputFieldValue('');
  };
  const setEditorContent = (html: string, text: string) => {
    setInputFieldValue(html);
  };
  return (
    <div>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2 max-w-256">
          {
            <RichTextEditor
              initialValue={inputFieldValue}
              onChange={(htmlContent, plainText) => {
                setUnsavedChanges(true);
                setEditorContent(htmlContent, plainText);
              }}
            />
          }
        </div>
      </div>
      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
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
