import React from 'react';

const Label = ({
  label = '',
  isRequired = false,
}: {
  label: string;
  isRequired?: boolean;
}) => {
  return (
    <label
      className={`text-gray-700 dark:text-white block text-xs font-semibold leading-5 `}>
      {label}{' '}
      {isRequired && <span className="text-red-500"> {isRequired ? '*' : null}</span>}
    </label>
  );
};

export default Label;
