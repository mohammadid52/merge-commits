import {Button, Tooltip} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  label?: string | any;
  onClick?: (event?: any) => void;
  transparent?: boolean;
  redBtn?: boolean;
  Icon?: any;
  disabled?: boolean;
  greenBtn?: boolean;
  loading?: boolean;
  insideElement?: React.ReactNode;
  size?: SizeType;
  variant?: 'link' | 'text' | 'default' | 'primary' | 'ghost' | 'dashed';
  className?: string;
  tooltip?: string;
  dataCy?: string;
}

const Buttons: React.FC<ButtonProps> = (btnProps: ButtonProps): React.ReactElement => {
  const {
    label,
    Icon,
    tooltip,
    redBtn,
    variant = 'primary',
    transparent,
    type = 'button',
    onClick,
    disabled,
    loading = false,
    greenBtn,
    insideElement = null,
    size = 'large',
    className
  } = btnProps;

  return (
    <Tooltip title={tooltip}>
      <Button
        loading={loading}
        danger={redBtn}
        className={`${className} ${
          greenBtn ? 'green-btn' : ''
        } flex items-center justify-center`}
        htmlType={type}
        size={size}
        // style={{borderRadius: 999}}
        type={transparent ? 'default' : variant}
        disabled={disabled}
        icon={Icon ? <Icon /> : undefined}
        onClick={onClick}>
        {label}
        {insideElement}
      </Button>
    </Tooltip>
  );
};

export default Buttons;
