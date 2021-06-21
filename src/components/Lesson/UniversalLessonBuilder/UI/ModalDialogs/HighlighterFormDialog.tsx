import React, { useContext, useEffect, useState } from 'react';
import { EditQuestionModalDict } from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import { IContentTypeComponentProps } from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import RichTextEditor from '../../../../Atoms/RichTextEditor';

interface IHighlighterFormDialogProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const HighlighterFormDialog = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: IHighlighterFormDialogProps) => {
  const {userLanguage} = useContext(GlobalContext);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  //////////////////////////
  //  DATA STORAG         //
  //////////////////////////
  const [inputFieldValue, setInputFieldValue] = useState<string>('');

  useEffect(()=>{
    setInputFieldValue('Enter your lyrics here...')
  },[])

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFieldValue(inputObj[0]);
      setIsEditingMode(true);
    }
  }, [inputObj]);


  const onHighlighterBlockCreate = () => {
    if (isEditingMode) {
      updateBlockContentULBHandler('', '', 'highlighter', [inputFieldValue], 0);
    } else {
      createNewBlockULBHandler('', '', 'highlighter', [inputFieldValue], 0);
    }
    // close modal after saving
    closeAction();
    // clear fields
    setInputFieldValue('');
  };

  const setEditorContent = (html: string, text: string) => {
    setInputFieldValue(html);
  }

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          {inputFieldValue && <RichTextEditor
              initialValue={inputFieldValue ? inputFieldValue : ''}
              onChange={(htmlContent, plainText) => setEditorContent(htmlContent, plainText)}
            />}
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
            onClick={onHighlighterBlockCreate}
          />
        </div>
      </div>
    </>
  );
};

export default HighlighterFormDialog;
