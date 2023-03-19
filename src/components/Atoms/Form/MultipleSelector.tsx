import {Select, SelectProps} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import Label from './Label';

interface Item {
  id?: string;
  name?: string;
  value: string;
}
interface MultipleSelectorProps {
  list?: SelectProps['options'];
  selectedItems?: Item[];
  btnClass?: string;
  arrowHidden?: boolean;
  noOptionMessage?: string;
  placeholder: string;
  disabledText?: string;
  onChange: (value: string[], option: Item[]) => void;
  disabled?: boolean;
  size?: SizeType;
  withAvatar?: boolean;
  isRequired?: boolean;
  label?: string;
  width?: string | number;
}

const MultipleSelector = (props: MultipleSelectorProps) => {
  const {
    list,
    disabled,

    selectedItems,

    placeholder,
    isRequired,
    onChange,
    size = 'large',
    width = '100%',

    label
  } = props;

  const value = selectedItems?.filter(Boolean);

  return (
    <div className="">
      {label && <Label dark={false} label={label} isRequired={isRequired} />}
      <Select
        mode="multiple"
        allowClear
        size={size}
        style={{width}}
        disabled={disabled}
        placeholder={placeholder}
        // @ts-ignore
        value={value}
        // @ts-ignore
        onChange={onChange}
        // @ts-ignore
        options={list}
      />
    </div>
  );
};

export default MultipleSelector;
