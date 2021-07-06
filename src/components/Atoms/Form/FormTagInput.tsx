import React from 'react';
import TagsInput from 'react-tagsinput';

import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

export interface IFormTagInputInterface {
  error?: string;
  tags: string[];
  handleChanges: (tags: string[]) => void;
}

const FormTagInput = ({className, error, tags, handleChange}: any) => {
  return (
    <>
      <TagsInput
        value={tags}
        className={className}
        onChange={handleChange}
        tagProps={{
          className: `inline-block bg-blue-200 border-blue-400 text-blue-700 w-auto p-2 mb-2 mr-1 rounded-sm custom-tagsinput-tag`,
          classNameRemove: 'react-tagsinput-remove',
        }}
      />
      <p className="text-red-500 text-xs">{error}</p>
    </>
  );
};

export default FormTagInput;
