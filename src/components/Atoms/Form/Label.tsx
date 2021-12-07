import React from 'react';

const Label = ({
  label = '',
  className = '',
  isRequired = false,
  dark = true,
}: {
  label: string;
  isRequired?: boolean;
  className?: string;
  dark?: boolean;
}) => {
  return (
    <label
      className={`text-gray-700 ${
        dark ? 'dark:text-white' : ''
      }  block text-xs font-semibold leading-5 ${className}`}>
      {label}{' '}
      {isRequired && <span className="text-red-500"> {isRequired ? '*' : null}</span>}
    </label>
  );
};

export default Label;
