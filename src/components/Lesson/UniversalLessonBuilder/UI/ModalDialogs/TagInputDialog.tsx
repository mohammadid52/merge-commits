import Buttons from 'atoms/Buttons';
import FormTagInput from 'atoms/Form/FormTagInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import {EditQuestionModalDict} from 'dictionary/dictionary.iconoclast';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {useEffect, useState} from 'react';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';

interface IVideoInput {
  url: string;
  size: string;
  tags: any[];
}

interface IVideoDialogProps extends IContentTypeComponentProps {
  inputObj?: IVideoInput;
}

const TagInputDialog = ({
  inputObj,
  closeAction,
  updateBlockContentULBHandler,
  askBeforeClose,
  setUnsavedChanges
}: IVideoDialogProps) => {
  const {userLanguage} = useGlobalContext();
  const [tags, setTags] = useState<IVideoInput['tags']>([]);

  const handleChange = (tags: any) => {
    setUnsavedChanges(true);
    setTags(tags);
  };
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (inputObj && inputObj.tags) {
      setTags(inputObj.tags.filter(Boolean));
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
  const onSave = async (e: any) => {
    e.preventDefault();
    if (!tags.length) {
      setError('Please enter atleast one tag');
      return;
    }
    const updatedInput = updateBlockContentULBHandler('', 'pageContent', '', {
      tags
    });

    await addToDB(updatedInput);

    setUnsavedChanges(false);
  };

  return (
    <div>
      <form onSubmit={onSave}>
        <div className={`grid grid-cols-1 gap-2`}>
          <div className={`col-span-2`}>
            <FormTagInput tags={tags} handleChange={handleChange} error={error} />
          </div>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-end">
            <Buttons
              label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={askBeforeClose}
              transparent
            />
            <Buttons
              label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
              type="submit"
              onClick={onSave}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TagInputDialog;
