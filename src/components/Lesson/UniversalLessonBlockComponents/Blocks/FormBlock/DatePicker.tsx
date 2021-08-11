import {noop} from 'lodash';
import React from 'react';

import {IoClose} from 'react-icons/io5';
import Tooltip from '../../../../Atoms/Tooltip';

interface DatePickerProps {
  id: string;
  inputID: string;
  mode?: string;
  themeTextColor?: string;
  lessonPageTheme?: string;
  themePlaceholderColor?: string;
  disabled: boolean;

  value: string;
  onChange: (e: any) => void;
}

const CustomDatePicker = (props: DatePickerProps) => {
  const {
    id,
    inputID,
    mode,
    themeTextColor,
    lessonPageTheme,
    themePlaceholderColor,

    value,

    onChange,
  } = props;

  return (
    <div className="flex items-center space-x-2">
      <input
        id={inputID}
        disabled={mode === 'building'}
        className={`w-full py-2 px-4 ${themeTextColor} mt-2 rounded-xl ${
          lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
        } ${themePlaceholderColor}`}
        name={'datePicker'}
        type={'date'}
        onChange={onChange}
        value={value}
        placeholder={'choose a date'}
      />
      {value && value.length > 0 && (
        <Tooltip placement="bottom" text="Clear date">
          <div className="h-6 cursor-pointer w-6 bg-blue-500 text-white flex items-center justify-center rounded-full">
            <IoClose />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default CustomDatePicker;
