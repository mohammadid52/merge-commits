import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import {Transition} from '@headlessui/react';
import {Input, Tooltip} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import Label from 'atoms/Form/Label';
import React from 'react';
import {BiErrorCircle} from 'react-icons/bi';

interface FormInputProps {
  dataCy?: string;
  label?: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e?: any) => void;
  id?: string;
  name?: string;
  placeHolder?: string;
  disabled?: boolean;
  dark?: boolean;
  type?: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
  cols?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  showCharacterUsage?: boolean;
  updateHeight?: boolean;
  resize?: boolean;
  inputRef?: any;
  maxWidth?: string;
  wrapperClass?: string;
  autoComplete?: string;
  className?: string;
  Icon?: any;
  suffix?: React.ReactNode;
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

  maxLength = 99999,
  showCharacterUsage = false,
  suffix,
  dark = false,
  min,

  Icon
}: FormInputProps) => {
  const inputProps: any = {
    disabled,
    type,
    onChange,
    value,
    name,
    id,
    maxLength,
    minLength: min,
    size: 'large' as SizeType,
    className: '',
    placeholder: placeHolder,
    status: error ? 'error' : '',
    prefix: error ? <BiErrorCircle /> : Icon ? <Icon /> : undefined,
    suffix,
    showCount: showCharacterUsage
  };

  return (
    <div>
      {label && (
        <Label disabled={disabled} dark={dark} label={label} isRequired={isRequired} />
      )}
      {textarea ? (
        <TextArea rows={rows} {...inputProps} />
      ) : type === 'password' ? (
        <Tooltip trigger={['focus']} placement="topLeft">
          <Password
            {...inputProps}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Tooltip>
      ) : (
        <Input {...inputProps} />
      )}

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
