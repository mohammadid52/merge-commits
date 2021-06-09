import React, {useState, useEffect} from 'react';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import Buttons from '../../../../Atoms/Buttons';

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

interface IVideoDialogProps {
  inputObj?: IVideoInput;
  closeAction: () => void;
  createNewBlockULBHandler: (
    targetID: string,
    propertyToTarget: string,
    contentType: string,
    inputValue: any
  ) => void;
}

const YouTubeMediaDialog = ({
  inputObj,
  closeAction,
  createNewBlockULBHandler,
}: IVideoDialogProps) => {
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
  };
  const onChangeVideoSize = (_: string, name: string) => {
    setVideoInputs((prevValues) => ({...prevValues, size: name}));
  };

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid: boolean = checkUrl();
    if (isValid) {
      createNewBlockULBHandler('', 'pageContent', 'video', [videoInputs]);
      closeAction();
    }
  };
  const checkUrl = () => {
    if (!videoInputs.url) {
      setError('Please enter youtube video url');
      return false;
    }
    if (!youTubeVideoRegex.test(videoInputs.url)) {
      setError('Please enter valid youtube video url');
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
              label={'Enter video URL'}
              placeHolder={'Ex. https://www.youtube.com/embed/12345678912'}
              isRequired
            />
            <p className="text-red-500 text-xs">{error}</p>
          </div>
          <div>
            <Selector
              onChange={onChangeVideoSize}
              list={videoSizeOptions}
              placeholder="Select Video size"
              label="Video size"
              selectedItem={size || ''}
            />
          </div>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-end">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={'Cancel'}
              onClick={closeAction}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={'Save'}
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
