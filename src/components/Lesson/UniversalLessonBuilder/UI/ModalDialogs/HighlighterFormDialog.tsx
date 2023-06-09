import Buttons from 'atoms/Buttons';
import RichTextEditor from 'atoms/RichTextEditor';
import {useGlobalContext} from 'contexts/GlobalContext';
import {EditQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {useEffect, useState} from 'react';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
interface IHighlighterFormDialogProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
}

const HighlighterFormDialog = ({
  closeAction,
  inputObj,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
  askBeforeClose,
  setUnsavedChanges
}: IHighlighterFormDialogProps) => {
  const {userLanguage} = useGlobalContext();
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  //////////////////////////
  //  DATA STORAG         //
  //////////////////////////
  const [inputFieldValue, setInputFieldValue] = useState<string>('');

  useEffect(() => {
    setInputFieldValue('Enter your lyrics here...');
  }, []);

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFieldValue(inputObj[0]);
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  const onHighlighterBlockCreate = async () => {
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler(
        '',
        '',
        'highlighter-input',
        [{id: uuidv4().toString(), value: inputFieldValue}],
        0
      );

      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler(
        '',
        '',
        'highlighter-input',
        [{id: uuidv4().toString(), value: inputFieldValue}],

        0
      );
      await addToDB(updatedList);
    }

    // clear fields
    setInputFieldValue('');
    setUnsavedChanges(false);
  };

  const setEditorContent = (html: string, _: string) => {
    setInputFieldValue(html);
  };

  return (
    <>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2">
          {inputFieldValue && (
            <RichTextEditor
              initialValue={inputFieldValue ? inputFieldValue : ''}
              onChange={(htmlContent, plainText) => {
                setUnsavedChanges(true);
                setEditorContent(htmlContent, plainText);
              }}
            />
          )}
        </div>
      </div>

      <div className="flex mt-8 justify-end px-6 pb-4">
        <div className="flex justify-end gap-4">
          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
            size="middle"
          />

          <Buttons
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={onHighlighterBlockCreate}
            size="middle"
          />
        </div>
      </div>
    </>
  );
};

export default HighlighterFormDialog;
