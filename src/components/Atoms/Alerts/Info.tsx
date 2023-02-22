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

export const Warning = ({message}: {message: string | Element}) => {
  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-100 p-4">
      <div className="flex">
        <div className="flex-shrink-0 w-auto">
          <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">{message}</p>
        </div>
      </div>
    </div>
  );
};
