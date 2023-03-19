import {useEffect, useState} from 'react';

import Buttons from 'atoms/Buttons';
import RichTextEditor from 'atoms/RichTextEditor';
import {useGlobalContext} from 'contexts/GlobalContext';
import {EditQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {isEmpty} from 'lodash';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';

interface IParaModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  selectedPageID?: string;
  setUnsavedChanges: any;
  askBeforeClose: () => void;
}

const ParaModalComponent = ({
  closeAction,
  inputObj,
  setUnsavedChanges,
  askBeforeClose,
  createNewBlockULBHandler,
  updateBlockContentULBHandler
}: IParaModalComponentProps) => {
  const {userLanguage} = useGlobalContext();

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const FIELD_ID = 'paragraph';
  const [fields, setFields] = useState<{
    paragraph: string;
    paragraphHtml: string;
  }>({
    paragraph: !isEmpty(inputObj) ? inputObj[0].value : '',
    paragraphHtml: !isEmpty(inputObj) ? inputObj[0].value : ''
  });

  useEffect(() => {
    if (!isEmpty(inputObj)) {
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

  const onParaCreate = async () => {
    if (isEditingMode) {
      const updatedList = updateBlockContentULBHandler('', '', FIELD_ID, [
        {id: uuidv4().toString(), value: fields['paragraphHtml']}
      ]);
      await addToDB(updatedList);
    } else {
      const updatedList = createNewBlockULBHandler('', '', FIELD_ID, [
        {id: uuidv4().toString(), value: fields['paragraphHtml']}
      ]);
      await addToDB(updatedList);
    }

    // clear fields
    setFields({paragraph: '', paragraphHtml: ''});
  };
  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setUnsavedChanges(true);
    setFields({...fields, [`${field}`]: text, [`${fieldHtml}`]: html});
  };

  const {paragraph} = fields;

  return (
    <div>
      <div className="grid grid-cols-2 my-2 gap-4">
        <div className="col-span-2 max-w-256">
          <RichTextEditor
            withStyles
            initialValue={paragraph}
            onChange={(htmlContent, plainText) =>
              onEditorStateChange(htmlContent, plainText, 'paragraphHtml', 'paragraph')
            }
          />
        </div>
      </div>
      <div className="flex mt-8 justify-end px-6 pb-4">
        <div className="flex justify-end gap-4">
          <Buttons
            size="middle"
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={askBeforeClose}
            transparent
          />
          <Buttons
            size="middle"
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
