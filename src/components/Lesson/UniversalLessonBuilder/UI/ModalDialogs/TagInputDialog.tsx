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
}

interface IVideoDialogProps extends IContentTypeComponentProps {
  inputObj?: IVideoInput;
}

const TagInputDialog = ({
  inputObj,
  closeAction,
  createNewBlockULBHandler,
}: any) => {
  const {userLanguage} = useContext(GlobalContext);
  const [videoInputs, setVideoInputs] = useState<IVideoInput>({
    url: '',
    size: '560 x 315',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (inputObj && inputObj.url) {
      setVideoInputs(inputObj);
    }
  }, [inputObj]);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;
    setVideoInputs((prevValues) => ({...prevValues, [name]: value}));
    setError('');
  };
  const onChangeVideoSize = (_: string, name: string) => {
    setVideoInputs((prevValues) => ({...prevValues, size: name}));
  };

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid: boolean = checkUrl();
    if (isValid) {
      createNewBlockULBHandler('', '', 'video', [videoInputs]);
      closeAction();
    }
  };
  const checkUrl = () => {
    if (!videoInputs.url) {
      setError(UniversalBuilderDict[userLanguage]['FORMS_ERROR_MSG']['VIDEO_REQUIRED']);
      return false;
    }
  };

  const {url = '', size = ''} = videoInputs;

  return (
    <div>
      <form onSubmit={onSave}>
        <div className={`grid grid-cols-1 gap-2`}>
          <div className={`col-span-2`}>
            <FormTagInput
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
