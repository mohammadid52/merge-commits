import React, {useContext, Fragment} from 'react';
import {getAsset} from '../../../assets';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {doResize} from '../../../utilities/functions';

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
  error?: string;
  textarea?: boolean;
  rows?: number;
  cols?: number;
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
    textarea = false,
    rows = 1,
    cols = 125,
  } = inputProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <Fragment>
      <label htmlFor={id} className="block text-xs font-semibold leading-5 text-gray-700">
        {label} <span className="text-red-500"> {isRequired ? '*' : null}</span>
      </label>
      {textarea ? (
        <textarea
          onKeyUp={(e) => doResize(e.target)}
          style={{resize: 'none'}}
          cols={cols}
          rows={rows}
          id={id}
          name={name}
          disabled={disabled}
          placeholder={placeHolder}
          className={`mt-1 block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-${
            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
          }-600 focus:border-transparent  border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm ${
            theme.outlineNone
          }`}
          value={value || ''}
          onChange={onChange}
        />
      ) : (
        <>
          <input
            disabled={disabled}
            type={type}
            id={id}
            name={name}
            onChange={(e: any) => onChange(e)}
            className={`mt-1 block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-${
              themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
            }-600 focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm ${
              theme.outlineNone
            }`}
            value={value ? value : ''}
            placeholder={placeHolder}
          />
          <p className="text-red-500 text-xs">{error}</p>
        </>
      )}
    </Fragment>
  );
};

export default FormInput;
