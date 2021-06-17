import React, {useContext, useEffect, useState} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import {
  EditQuestionModalDict,
  UniversalBuilderDict,
} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {uniqueId} from 'lodash';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../../interfaces/UniversalLessonInterfaces';
import Storage from '@aws-amplify/storage';
import ULBFileUploader from '../../../../Atoms/Form/FileUploader';
import Loader from '../../../../Atoms/Loader';
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
  const [isEditingMode] = useState<boolean>(false);

  //////////////////////////
  //  DATA STORAG         //
  //////////////////////////
  const [inputFieldValue, setInputFieldValue] = useState<string>('');
  useEffect(() => {
    if (inputObj) {
      if (inputObj?.value) {
        setInputFieldValue(inputObj.value[0]);
      }
    }
  }, [inputObj]);

  const setEditorContent = (html: string) =>
    setInputFieldValue(html);


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
  }

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          <RichTextEditor
            initialValue={inputFieldValue}
            onChange={(htmlContent, plainText) =>
              setEditorContent(htmlContent)
            }
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
            onClick={onHighlighterBlockCreate}
          />

        </div>
      </div>
      </>
  )
};

export default HighlighterFormDialog;