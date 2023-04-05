import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import {Transition} from '@headlessui/react';
import {Input, Tooltip} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import Label from 'atoms/Form/Label';
import React from 'react';

interface FormInputProps {
  label?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  id?: string;
  name?: string;
  placeHolder?: string;
  disabled?: boolean;
  type?: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
  cols?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  showCharacterUsage?: boolean;
  className?: string;
  dataCy?: string;
  tooltip?: string;
  Icon?: any;
  suffix?: React.ReactNode;
  inputClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const {Password, TextArea} = Input;

const FormInput: React.FC<FormInputProps> = ({
  label,
  disabled,
  isRequired,
  value = '',
  onChange,
  id,
  name,
  placeHolder,
  type = 'text',
  error = '',
  textarea = false,
  rows = 1,
  className,
  inputClassName,
  maxLength = 99999,
  showCharacterUsage = false,
  suffix,
  min,
  tooltip,
  Icon,
  onKeyDown
}: FormInputProps) => {
  const inputProps: any = {
    disabled,
    type,
    onChange,
    value: value || undefined,
    name,
    id,
    maxLength,
    minLength: min,
    size: 'large' as SizeType,
    className: inputClassName,
    placeholder: placeHolder,
    status: error ? 'error' : '',
    prefix: Icon ? <Icon /> : undefined,
    suffix,
    showCount: showCharacterUsage,
    onKeyDown
  };

  return (
    <div className={className}>
      {label && <Label disabled={disabled} label={label} isRequired={isRequired} />}
      <Tooltip title={tooltip}>
        {textarea ? (
          <TextArea rows={rows} {...inputProps} />
        ) : type === 'password' ? (
          <Password
            {...inputProps}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        ) : (
          <Input {...inputProps} />
        )}
      </Tooltip>

      <Transition
        show={error.length > 0}
        enter="transition duration-300"
        enterFrom="opacity-0 transform -translate-y-6"
        enterTo="opacity-100 transform translate-y-0"
        leave="transition duration-300"
        leaveFrom="opacity-100 transform translate-y-0"
        leaveTo="opacity-0 transform -translate-y-6">
        <p className="text-red-500 mt-1 text-xs">{error}</p>
      </Transition>
    </div>
  );
};

export default FormInput;
