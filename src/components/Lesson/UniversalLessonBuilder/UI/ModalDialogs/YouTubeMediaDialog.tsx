import React, {useEffect, useState} from 'react';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';

import {useGlobalContext} from 'contexts/GlobalContext';
import {
  EditQuestionModalDict,
  UniversalBuilderDict
} from 'dictionary/dictionary.iconoclast';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
const youTubeVideoRegex =
  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

const videoSizeOptions = [
  {id: 1, label: '560 x 315', value: '560 x 315'},
  {id: 2, label: '640 x 360', value: '640 x 360'},
  {id: 3, label: '835 x 480', value: '835 x 480'},
  {id: 4, label: '1280 x 720', value: '1280 x 720'}
];

interface IVideoInput {
  value: string;
  width: string;
  height: string;
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
  updateBlockContentULBHandler
}: IVideoDialogProps) => {
  const {userLanguage} = useGlobalContext();
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [videoInputs, setVideoInputs] = useState<IVideoInput>({
    value: '',
    width: '560',
    height: '315'
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
  const onChangeVideoSize = (name: string) => {
    const height = name.split(' x ')[1];
    const width = name.split(' x ')[0];
    setVideoInputs((prevValues) => ({...prevValues, height, width}));
  };
  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };
  const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid: boolean = checkUrl();
    if (isValid) {
      const input = {id: uuidv4().toString(), ...videoInputs};

      if (isEditingMode) {
        const updatedList = updateBlockContentULBHandler('', '', 'video', [input]);
        await addToDB(updatedList);
      } else {
        const updatedList: any = createNewBlockULBHandler('', '', 'video', [input]);
        await addToDB(updatedList);
      }
      setUnsavedChanges(false);
    }
  };
  const checkUrl = () => {
    if (!videoInputs.value) {
      setError(UniversalBuilderDict[userLanguage]['FORMS_ERROR_MSG']['VIDEO_REQUIRED']);
      return false;
    }
    if (!youTubeVideoRegex.test(videoInputs.value)) {
      setError(UniversalBuilderDict[userLanguage]['FORMS_ERROR_MSG']['VIDEO_INVALID']);
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const {value = '', height = '', width = ''} = videoInputs;
  const size = `${width} x ${height}`;
  return (
    <div>
      <form onSubmit={onSave}>
        <div className={`grid grid-cols-3 gap-2`}>
          <div className={`col-span-2`}>
            <FormInput
              value={value || ''}
              id="value"
              onChange={onChange}
              name="value"
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
        <div className="flex mt-8 justify-end px-6 pb-4">
          <div className="flex justify-end gap-4">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              size="middle"
              label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
              onClick={askBeforeClose}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              size="middle"
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
