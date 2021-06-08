import React, {useState, useEffect} from 'react';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';

const youTubeVideoRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

interface IVideoDialogProps {
  url?: string;
  closeAction: () => void;
  createNewBlockULBHandler: (targetID: string, inputValue: any) => void;
}

const YouTubeMediaDialog = ({
  url,
  closeAction,
  createNewBlockULBHandler,
}: IVideoDialogProps) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setVideoUrl(videoUrl);
  }, [url]);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = (event.target as HTMLInputElement).value;
    setVideoUrl(value);
  };
  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid: boolean = checkUrl();
    if (isValid) {
      createNewBlockULBHandler('', {type:'video', value:[videoUrl]});
      closeAction();
    }
  };
  const checkUrl = () => {
    if (!youTubeVideoRegex.test(videoUrl)) {
      setError('Please enter valid youtube video url');
      return false;
    } else {
      setError('');
      return true;
    }
  };
  return (
    <div>
      <form onSubmit={onSave}>
        <div className={`grid grid-cols-3`}>
          <div>
            <FormInput
              value={videoUrl}
              id="className"
              onChange={onChange}
              name="className"
              label={'Enter video URL'}
              isRequired
            />
            <p>{error}</p>
          </div>
        </div>
        <div className="flex mt-8 justify-center px-6 pb-4">
          <div className="flex justify-end">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={'Cancel'}
              // onClick={closeAction}
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
