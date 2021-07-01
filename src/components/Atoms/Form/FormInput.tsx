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
  dark?: boolean;
  type?: string;
  error?: string;
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
    error = '',
    dark,
  } = inputProps;
  const {theme} = useContext(GlobalContext);

  return (
    <Fragment>
      <label
        htmlFor={id}
        className={`${
          dark ? 'text-white' : 'text-gray-700'
        } block text-xs font-semibold leading-5 `}>
        {label} <span className="text-red-500"> {isRequired ? '*' : null}</span>
      </label>
      <input
        disabled={disabled}
        type={type}
        id={id}
        name={name}
        onChange={(e: any) => onChange(e)}
        className={`mt-1 block w-full sm:text-sm sm:leading-5 py-2 px-3  shadow-sm ${
          dark
            ? `${theme.elem.textInput} rounded-xl`
            : `rounded-md ${theme.outlineNone} border-0 border-gray-300`
        }
        `}
        value={value ? value : ''}
        placeholder={placeHolder}
      />
      <p className="text-red-500 text-xs">
        {error}
      </p>
    </Fragment>
  );
};

export default FormInput;
