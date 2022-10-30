import React from 'react';
import {IoIosAdd} from 'react-icons/io';
import BUTTONS from '../Buttons';

interface IAddButtonActionInterface {
  className?: string;
  onClick?: () => void;
  label: string;
  disabled?: boolean;
  dataCy?: string;
}

const AddButton = ({
  className,
  disabled = false,
  onClick,
  label,
  dataCy
}: IAddButtonActionInterface) => {
  return (
    <BUTTONS
      dataCy={dataCy}
      btnClass={className}
      disabled={disabled}
      label={label}
      labelClass={'leading-6'}
      Icon={IoIosAdd}
      iconBeforeLabel
      onClick={onClick}
    />
  );
};

export default AddButton;
