import Label from 'atoms/Form/Label';
import {Transition} from '@headlessui/react';
import React, {useContext, Fragment, useState} from 'react';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import {doResize} from 'utilities/functions';

interface FormInputProps {
  dataCy?: string;
  label?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e?: any) => void;
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
  updateHeight?: boolean;
  resize?: boolean;
  inputRef?: any;
  maxWidth?: string;
  wrapperClass?: string;
  className?: string;
  Icon?: any;
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
    updateHeight = false,
    dark = false,
    min,
    max,
    inputRef,
    onKeyDown,
    dataCy,
    Icon,
    maxWidth = 'max-w-256',
    wrapperClass = '',
    resize = false
  } = inputProps;

  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const otherInputProps: any = {};

  if (maxLength) {
    otherInputProps.maxLength = maxLength;
  }

  const [passToggle, setPassToggle] = useState(false);
  const disabledClass = disabled
    ? 'cursor-not-allowed pointer-events-none bg-gray-200'
    : '';

  const transition = 'all 300ms ease-in-out';
  return (
    <div className={wrapperClass}>
      {label && (
        <Label disabled={disabled} dark={dark} label={label} isRequired={isRequired} />
      )}
      {textarea ? (
        <textarea
          data-cy={dataCy}
          rows={rows}
          cols={cols}
          id={id}
          style={{transition}}
          value={value !== null ? value : ''}
          className={`mt-1   ${
            dark ? 'border-gray-700  text-white bg-gray-800' : ''
          } ${maxWidth} block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-${
            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
          }-600 focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-xl shadow-sm ${
            theme.outlineNone
          } ${className} ${disabledClass}`}
          disabled={disabled}
          maxLength={maxLength}
          name={name}
          ref={inputRef}
          onKeyDown={(e) => {
            onKeyDown && onKeyDown();
            resize && doResize(e.target);
          }}
          onChange={onChange}
          placeholder={placeHolder}
        />
      ) : (
        <div className={`relative mt-1 ${className}`}>
          {Icon && (
            <div className="absolute  w-auto top-0 left-1 h-full flex items-center">
              <Icon className="w-auto text-gray-500" size={20} />
            </div>
          )}
          <input
            data-cy={dataCy}
            style={{transition}}
            disabled={disabled}
            type={type === 'password' ? (passToggle ? 'text' : 'password') : type}
            min={type === 'number' ? min : undefined}
            max={type === 'number' ? max : undefined}
            ref={inputRef}
            id={id}
            maxLength={maxLength}
            name={name}
            onChange={onChange}
            className={`${
              dark ? 'border-gray-700  text-white bg-gray-800' : ''
            } block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-${
              themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
            }-600 focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-full shadow-sm ${
              theme.outlineNone
            }  ${disabledClass} ${Icon ? 'pl-10' : ''}`}
            value={value ? value : ''}
            placeholder={placeHolder}
            onKeyDown={onKeyDown}
            {...otherInputProps}
          />

          {type === 'password' && (
            <div className="absolute w-auto top-0 right-1 h-full flex items-center">
              <div
                onClick={() => setPassToggle(!passToggle)}
                className=" text-gray-500 cursor-pointer hover:text-grayscale">
                {passToggle ? (
                  <AiOutlineEye className="w-auto" size={24} />
                ) : (
                  <AiOutlineEyeInvisible className="w-auto" size={24} />
                )}
              </div>
            </div>
          )}
        </div>
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
          <p className="text-red-500 mt-1 text-xs">{error}</p>
        </Transition>
        {showCharacterUsage && (
          <div className="text-right mt-1 text-gray-400">
            {value.length} of {maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInput;
