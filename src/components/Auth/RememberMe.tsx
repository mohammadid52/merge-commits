import React from 'react';

interface RememberMeProps {
  isChecked?: boolean;
  dataCy?: string;
  toggleCheckBox?: React.ChangeEventHandler<HTMLInputElement>;
}

const RememberMe = ({isChecked, toggleCheckBox, dataCy}: RememberMeProps) => {
  return (
    <div className="w-auto">
      <label className="flex items-center justify-end">
        <input
          data-cy={dataCy}
          type="checkbox"
          className="form-checkbox cursor-pointer transition-all rounded-md w-4 h-4"
          checked={isChecked}
          onChange={toggleCheckBox}
        />
        <span className={`w-auto ml-2 leading-5 text-xs text-gray-600`}>Remember Me</span>
      </label>
    </div>
  );
};

export default RememberMe;
