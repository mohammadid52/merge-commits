import React from 'react';

const Label = ({
  label = '',
  className = '',
  isRequired = false,
  dark = true,
  disabled = false
}: {
  label: string;
  isRequired?: boolean;
  className?: string;
  dark?: boolean;
  disabled?: boolean;
}) => {
  return (
    <label
      className={` ${
        dark ? 'text-white' : 'text-gray-700'
      }  block text-xs font-semibold leading-5 ${className} ${
        disabled ? 'opacity-80' : ''
      }`}>
      {label}{' '}
      {isRequired && <span className="text-red-500"> {isRequired ? '*' : null}</span>}
    </label>
  );
};

export default Label;
