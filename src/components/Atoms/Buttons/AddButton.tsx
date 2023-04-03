import {ButtonProps} from 'antd';
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
  size?: ButtonProps['size'];
}

const AddButton = ({
  disabled = false,
  onClick,
  label,
  size = 'middle',

  transparent,
  loading
}: IAddButtonActionInterface) => {
  return (
    <BUTTONS
      disabled={disabled}
      label={label}
      size={size}
      transparent={transparent}
      Icon={IoIosAdd}
      loading={loading}
      onClick={onClick}
    />
  );
};

export default AddButton;
