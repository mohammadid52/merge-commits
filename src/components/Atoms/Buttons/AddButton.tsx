import React from 'react';
import {IoIosAdd} from 'react-icons/io';
import BUTTONS from '../Buttons';

interface IAddButtonActionInterface {
  className?: string;
  onClick?: () => void;
  label: string;
  disabled?: boolean;
}

const AddButton = ({
  className,
  disabled = false,
  onClick,
  label,
}: IAddButtonActionInterface) => {
  return (
    <BUTTONS
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