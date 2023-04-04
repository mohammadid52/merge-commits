import {Button, Tooltip} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import React from 'react';
import {NavLink} from 'react-router-dom';

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
  url?: string;
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
    size = 'middle',
    className,
    url
  } = btnProps;

  const buttonComponent = (
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
  );

  return (
    <Tooltip title={tooltip}>
      {/* add icon if transparent is true */}

      {/* use NavLink if variant is link */}
      {url && url.length > 0 ? (
        <NavLink to={url}>{buttonComponent}</NavLink>
      ) : (
        buttonComponent
      )}
    </Tooltip>
  );
};

export default Buttons;
