import React from 'react';
import TagsInput from 'react-tagsinput';

import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

export interface IFormTagInputInterface {
  error?: string;
  tags: string[];
  handleChanges: (tags: string[]) => void;
}

const FormTagInput = ({error, tags, handleChange}: any) => {
  return (
    <>
      <TagsInput value={tags} onChange={handleChange} />
      <p className="text-red-500 text-xs">{error}</p>
    </>
  );
};

export default FormTagInput;
