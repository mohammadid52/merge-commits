import React from 'react';

interface CheckBoxProps {
  label?: string;
  value: boolean;
  onChange?: (e: any) => void;
  name: string;
  className?: string;
  dataCy?: string;
}

const CheckBox = (checkBoxProps: CheckBoxProps) => {
  const {label, value, onChange, name, dataCy, className = ''} = checkBoxProps;

  return (
    <div className="relative flex items-center">
      <div className="flex items-center w-auto h-7 my-1">
        <input
          data-cy={dataCy}
          name={name}
          onChange={onChange}
          checked={value ? true : false}
          type="checkbox"
          className={`${className} cursor-pointer transition-all focus:ring-indigo-500 h-4 w-4 iconoclast:text-main curate:text-main border-gray-400 rounded`}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label htmlFor="comments" className="font-medium text-gray-700">
            {label}
          </label>
        </div>
      )}
    </div>
  );
};

export default CheckBox;
