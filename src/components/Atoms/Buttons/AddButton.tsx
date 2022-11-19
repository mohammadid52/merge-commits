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
}

const AddButton = ({
  className,
  disabled = false,
  onClick,
  label,
  dataCy,
  loading
}: IAddButtonActionInterface) => {
  return (
    <BUTTONS
      dataCy={dataCy}
      btnClass={className}
      disabled={disabled}
      label={label}
      labelClass={'leading-6'}
      Icon={IoIosAdd}
      loading={loading}
      iconBeforeLabel
      onClick={onClick}
    />
  );
};

export default AddButton;
