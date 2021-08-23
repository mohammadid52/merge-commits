import React, {useContext, Fragment} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';

interface CheckBoxProps {
  label?: string;
  value: boolean;
  onChange?: (e: any) => void;
  name: string;
}

const CheckBox = (checkBoxProps: CheckBoxProps) => {
  const {label, value, onChange, name} = checkBoxProps;
  const {theme} = useContext(GlobalContext);

  return (
    <label className="inline-flex justify-center items-center mr-2 mt-2">
      <input
        type="checkbox"
        checked={value ? true : false}
        name={name}
        className={`form-checkbox cursor-pointer text-indigo-500 mx-2 h-6 w-6`}
        onChange={onChange}
      />
      {label ? (
        <span className="mx-2 text-m font-medium leading-5 text-gray-700"> {label} </span>
      ) : null}
    </label>
  );
};

export default CheckBox;
