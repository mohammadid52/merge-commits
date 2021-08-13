import {Transition} from '@headlessui/react';
import {ExclamationCircleIcon} from '@heroicons/react/outline';
import React from 'react';

interface InputInterface {
  type?: string;
  name?: string;
  id: string;
  placeholder: string;
  value: string;

  error: string;
  onChange: (e: any) => void;
  maxLength?: number;
  showCharacterUsage?: boolean;
}

const Input = ({
  type = 'text',
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  showCharacterUsage,
}: InputInterface) => {
  const whenError = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
    : '';

  const otherInputProps: any = {};
  if (maxLength) {
    otherInputProps.maxLength = maxLength;
  }
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
          aria-invalid="true"
          maxLength={maxLength}
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
      <div className="flex items-center justify-between">
        <p
          hidden={error.length === 0}
          className="mt-2 transition-all text-sm text-red-600"
          id="email-error">
          {error}
        </p>
        {showCharacterUsage && (
          <div className="text-right text-gray-400">
            {value.length} of {maxLength}
          </div>
        )}
      </div>
    </div>
  );
};
export default Input;
