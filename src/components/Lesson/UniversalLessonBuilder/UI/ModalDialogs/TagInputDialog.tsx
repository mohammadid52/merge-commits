import React, {useState, useEffect, useContext} from 'react';

import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import Buttons from '../../../../Atoms/Buttons';

import {
  UniversalBuilderDict,
  EditQuestionModalDict,
} from '../../../../../dictionary/dictionary.iconoclast';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {IContentTypeComponentProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import FormTagInput from '../../../../Atoms/Form/FormTagInput';

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
  setUnsavedChanges,
}: IVideoDialogProps) => {
  const {userLanguage} = useContext(GlobalContext);
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

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tags.length) {
      setError('Please enter atleast one tag');
      return;
    }
    updateBlockContentULBHandler('', 'pageContent', '', {tags});
    closeAction();
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
              btnClass="py-1 px-4 text-xs mr-2"
              label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={askBeforeClose}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
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
