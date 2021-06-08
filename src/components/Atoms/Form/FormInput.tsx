import React, {useContext, Fragment} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';

interface FormInputProps {
  label?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  id?: string;
  name?: string;
  placeHolder?: string;
  disabled?: boolean;
  type?: string;
}

const FormInput: React.FC<FormInputProps> = (inputProps: FormInputProps) => {
  const {
    label,
    disabled,
    isRequired,
    value,
    onChange,
    id,
    name,
    placeHolder,
    type = 'text',
  } = inputProps;
  const {theme} = useContext(GlobalContext);

  return (
    <Fragment>
      <label htmlFor={id} className="block text-xs font-semibold leading-5 text-gray-700">
        {label} <span className="text-red-500"> {isRequired ? '*' : null}</span>
      </label>
      <input
        disabled={disabled}
        type={type}
        id={id}
        name={name}
        onChange={(e: any) => onChange(e)}
        className={`mt-1 block w-full sm:text-sm sm:leading-5  border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
        value={value ? value : ''}
        placeholder={placeHolder}
      />
    </Fragment>
  );
};

export default FormInput;
