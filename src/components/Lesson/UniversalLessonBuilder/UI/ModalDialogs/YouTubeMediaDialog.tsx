import React, {useState} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {VscSymbolParameter} from 'react-icons/vsc';
import {
  AiOutlineFileImage,
  AiOutlineMore,
  AiOutlineQuestionCircle,
  AiOutlineYoutube,
} from 'react-icons/ai';
import {MdTitle} from 'react-icons/md';
import FormInput from '../../../../Atoms/Form/FormInput';

const youTubeVideoRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

interface IVideoDialogProps {
  onYouTubeVideoBtnToggle?: () => void;
}

const YouTubeMediaDialog = ({ onYouTubeVideoBtnToggle }: IVideoDialogProps) => {
  return (
    <div className={`z-50`}>
      <div className="relative flex items-center">
        <h2 className="w-auto bg-white text-lg font-medium text-gray-900">Add Video</h2>
      </div>
      <div className={`grid grid-cols-3 gap-2`}>
        {/* LEFT */}
        <div>
          <FormInput
            value={'name'}
            id="className"
            // onChange={onChange}
            name="className"
            label={"Enter video URL"}
            isRequired
          />
        </div>
      </div>
    </div>
  );
};

export default YouTubeMediaDialog;
