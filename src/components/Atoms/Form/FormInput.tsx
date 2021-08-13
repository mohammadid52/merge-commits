import {Transition} from '@headlessui/react';
import React, {useContext, Fragment} from 'react';
import {getAsset} from '../../../assets';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {doResize} from '../../../utilities/functions';

interface FormInputProps {
  label?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  id?: string;
  name?: string;
  placeHolder?: string;
  disabled?: boolean;
  dark?: boolean;
  type?: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
  cols?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  showCharacterUsage?: boolean;

  className?: string;
}

const FormInput: React.FC<FormInputProps> = (inputProps: FormInputProps) => {
  const {
    label,
    disabled,
    isRequired,
    value = '',
    onChange,
    id,
    name,
    placeHolder,
    type = 'text',
    error = '',
    textarea = false,
    rows = 1,
    className,
    cols = 125,
    maxLength = 99999,
    showCharacterUsage = false,
    dark,
    min,
    max,

    onKeyDown,
  } = inputProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const otherInputProps: any = {};
  if (maxLength) {
    otherInputProps.maxLength = maxLength;
  }

  return (
    <Fragment>
      <label
        htmlFor={id}
        className={`${
          dark ? 'text-white' : 'text-gray-700'
        } block text-xs font-semibold leading-5 `}>
        {label} <span className="text-red-500"> {isRequired ? '*' : null}</span>
      </label>

      {textarea ? (
        <textarea
          rows={rows}
          cols={cols}
          id={id}
          value={value}
          className={`mt-1 max-w-256 block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-${
            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
          }-600 focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm ${
            theme.outlineNone
          } ${className}`}
          disabled={disabled}
          maxLength={maxLength}
          name={name}
          onKeyDown={(e) => doResize(e.target)}
          onChange={onChange}
          placeholder={placeHolder}
        />
      ) : (
        <input
          disabled={disabled}
          type={type}
          min={type === 'number' ? min : undefined}
          max={type === 'number' ? max : undefined}
          id={id}
          maxLength={maxLength}
          name={name}
          onChange={onChange}
          className={`mt-1 block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-${
            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
          }-600 focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm ${
            theme.outlineNone
          } ${className}`}
          value={value ? value : ''}
          placeholder={placeHolder}
          onKeyDown={onKeyDown}
          {...otherInputProps}
        />
      )}
      <div className="flex">
        <Transition
          show={error.length > 0}
          enter="transition duration-300"
          enterFrom="opacity-0 transform -translate-y-6"
          enterTo="opacity-100 transform translate-y-0"
          leave="transition duration-300"
          leaveFrom="opacity-100 transform translate-y-0"
          leaveTo="opacity-0 transform -translate-y-6">
          <p className="text-red-500 text-xs">{error}</p>
        </Transition>
        {showCharacterUsage && (
          <div className="text-right text-gray-400">
            {value.length} of {maxLength}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default FormInput;
