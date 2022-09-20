import React from 'react';

interface CheckBoxProps {
  label?: string;
  value: boolean;
  onChange?: (e: any) => void;
  name: string;
  className?: string;
}

const CheckBox = (checkBoxProps: CheckBoxProps) => {
  const {label, value, onChange, name, className = ''} = checkBoxProps;

  return (
    // <label className="inline-flex justify-center items-center mr-2 mt-2">
    //   <input
    //     type="checkbox"
    //     checked={value ? true : false}
    //     name={name}
    //     className={`form-checkbox cursor-pointer text-indigo-500 mx-2 h-6 w-6`}
    //     onChange={onChange}
    //   />
    //   {label ? (
    //     <span className="mx-2 text-m font-medium leading-5 text-gray-700"> {label} </span>
    //   ) : null}
    // </label>

    <div className="relative flex items-center">
      <div className="flex items-center w-auto h-7 my-1">
        <input
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
