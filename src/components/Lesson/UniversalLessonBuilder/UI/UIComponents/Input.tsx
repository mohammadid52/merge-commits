import {ExclamationCircleIcon} from '@heroicons/react/outline';
import React from 'react';

interface InputInterface {
  type?: string;
  name?: string;
  id: string;
  placeholder: string;
  value: string;
  defaultValue: string;
  error: string;
  onChange: (e: any) => void;
}

const Input = ({
  type = 'text',
  name,
  id,
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
}: InputInterface) => {
  const whenError = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
    : '';
  return (
    <div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          onChange={onChange}
          id={id}
          className={`${whenError} block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md`}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          aria-invalid="true"
          aria-describedby={error}
        />
        <div
          hidden={error.length === 0}
          className="absolute inset-y-0 w-auto right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon
            className={`h-5 w-5 text-red-500 ${error.length === 0 ? 'hidden' : ''}`}
            aria-hidden="true"
          />
        </div>
      </div>
      <p
        hidden={error.length === 0}
        className="mt-2 transition-all text-sm text-red-600"
        id="email-error">
        {error}
      </p>
    </div>
  );
};
export default Input;
