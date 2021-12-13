import React from 'react';
import {FormControlProps} from './FormBlock';

interface PoemBlockProps extends FormControlProps {
  onChange: (e: any) => void;
  disabled: boolean;
}

const PoemBlock = (props: PoemBlockProps) => {
  const {id, inputID, onChange, value, disabled, classString} = props;

  return (
    <div
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center`}>
      <div className="bg-gray-700 rounded-md p-4 mt-4">
        {value && (
          <input
            id={inputID}
            disabled={disabled}
            className={`w-full py-2 px-4  mt-2 rounded-xl bg-gray-100 dark:bg-darker-gray placeholder-gray-500 dark:placeholder-gray-700`}
            name={'text'}
            type={'text'}
            placeholder={value[0].label}
            onChange={onChange}
            value={value}
          />
        )}
      </div>
    </div>
  );
};

export default PoemBlock;
