import React from 'react';
import {IoIosAdd} from 'react-icons/io';
import BUTTONS from '../Buttons';

interface IAddButtonActionInterface {
  className?: string;
  onClick?: () => void;
  label: string;
  disabled?: boolean;
  dataCy?: string;
  loading?: boolean;
  transparent?: boolean;
}

const AddButton = ({
  disabled = false,
  onClick,
  label,

  transparent,
  loading
}: IAddButtonActionInterface) => {
  return (
    <BUTTONS
      disabled={disabled}
      label={label}
      transparent={transparent}
      Icon={IoIosAdd}
      loading={loading}
      onClick={onClick}
    />
  );
};

export default AddButton;
