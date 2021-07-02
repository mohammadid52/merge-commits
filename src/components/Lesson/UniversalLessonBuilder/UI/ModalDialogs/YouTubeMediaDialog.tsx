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
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';

const youTubeVideoRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

const videoSizeOptions = [
  {id: 1, name: '560 x 315'},
  {id: 2, name: '640 x 360'},
  {id: 3, name: '835 x 480'},
  {id: 4, name: '1280 x 720'},
];

interface IVideoInput {
  url: string;
  size: string;
}

interface IVideoDialogProps extends IContentTypeComponentProps {
  inputObj?: IVideoInput[];
}

const YouTubeMediaDialog = ({
  inputObj,
  closeAction,
  setUnsavedChanges,
  askBeforeClose,
  createNewBlockULBHandler,
  updateBlockContentULBHandler,
}: IVideoDialogProps) => {
  const {userLanguage} = useContext(GlobalContext);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [videoInputs, setVideoInputs] = useState<IVideoInput>({
    url: '',
    size: '560 x 315',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setVideoInputs(inputObj[0]);
      setIsEditingMode(true);
    }
  }, [inputObj]);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnsavedChanges(true);
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;
    setVideoInputs((prevValues) => ({...prevValues, [name]: value}));
    setError('');
  };
  const onChangeVideoSize = (_: string, name: string) => {
    setVideoInputs((prevValues) => ({...prevValues, size: name}));
  };
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };
  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid: boolean = checkUrl();
    if (isValid) {
      if (isEditingMode) {
        const updatedList = updateBlockContentULBHandler('', '', 'video', [videoInputs]);
        console.log(updatedList);

        // await addToDB(updatedList);
      } else {
        const updatedList = createNewBlockULBHandler('', '', 'video', [videoInputs]);
        console.log(updatedList);

        // await addToDB(updatedList);
      }
      setUnsavedChanges(false);
    }
  };
  const checkUrl = () => {
    if (!videoInputs.url) {
      setError(UniversalBuilderDict[userLanguage]['FORMS_ERROR_MSG']['VIDEO_REQUIRED']);
      return false;
    }
    if (!youTubeVideoRegex.test(videoInputs.url)) {
      setError(UniversalBuilderDict[userLanguage]['FORMS_ERROR_MSG']['VIDEO_INVALID']);
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const {url = '', size = ''} = videoInputs;

  return (
    <div>
      <form onSubmit={onSave}>
        <div className={`grid grid-cols-3 gap-2`}>
          <div className={`col-span-2`}>
            <FormInput
              value={url || ''}
              id="url"
              onChange={onChange}
              name="url"
              label={UniversalBuilderDict[userLanguage]['FORMS']['VIDEO_URL_LABEL']}
              placeHolder={'Ex. https://www.youtube.com/embed/12345678912'}
              isRequired
              error={error}
            />
          </div>
          <div>
            <Selector
              onChange={onChangeVideoSize}
              list={videoSizeOptions}
              placeholder="Select Video size"
              label={UniversalBuilderDict[userLanguage]['FORMS']['VIDEO_SIZE_LABEL']}
              selectedItem={size || ''}
            />
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

export default YouTubeMediaDialog;
