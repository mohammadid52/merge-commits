import React from 'react';

const Label = ({
  label = '',
  className = '',
  isRequired = false,
}: {
  label: string;
  isRequired?: boolean;
  className?: string;
}) => {
  return (
    <label
      className={`text-gray-700 dark:text-white block text-xs font-semibold leading-5 ${className}`}>
      {label}{' '}
      {isRequired && <span className="text-red-500"> {isRequired ? '*' : null}</span>}
    </label>
  );
};

export default Label;
