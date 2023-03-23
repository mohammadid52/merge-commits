import React from 'react';
import {InformationCircleIcon, ExclamationIcon} from '@heroicons/react/solid';

export default function Info({
  text,
  className,
  customText
}: {
  text?: string;
  className?: string;
  customText?: React.ReactNode;
}) {
  return (
    <div style={{backgroundColor: '#eff6ff'}} className={`rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0 w-auto">
          <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between w-auto">
          {customText ? customText : <p className="text-sm text-blue-700">{text}</p>}
        </div>
      </div>
    </div>
  );
}

export const Warning = ({message}: {message: React.ReactNode}) => {
  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-100 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-auto">
          <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm mb-0 text-yellow-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export const Error = ({message}: {message: React.ReactNode}) => {
  return (
    <div className="p-2">
      <div className="flex">
        <div className="flex-shrink-0 w-auto">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};
