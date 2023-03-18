import {Select} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import {orderBy, uniqBy} from 'lodash';
import React from 'react';
import Label from './Label';

type Item = {
  label: string;
  id?: string | number;
  value?: string;
};

interface SelectorProps {
  list?: Item[];
  selectedItem?: string;
  btnClass?: string;
  additionalClass?: string;
  arrowHidden?: boolean;
  placeholder: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | undefined;
  onChange: (value: string, option: Item) => void;
  disabled?: boolean;
  disableSort?: boolean;
  isRequired?: boolean;
  style?: any;
  loading?: boolean;
  size?: SizeType;
  label?: string;
  labelTextClass?: string;
  noOptionMessage?: string;
  width?: number | string;
  error?: string;
  btnId?: string;
  isClearable?: boolean;
  onClear?: () => void;
  setHoveringItem?: React.Dispatch<React.SetStateAction<{}>>;
  setSelectedItem?: React.Dispatch<React.SetStateAction<{}>>;
  dropdownRender?:
    | ((
        menu: React.ReactElement<any, string | React.JSXElementConstructor<any>>
      ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>)
    | undefined;
  dataCy?: string;
  dropdownWidth?: string;
  showSearch?: boolean;
  noSpace?: boolean;
  direction?: 'left' | 'right' | 'topleft' | 'topright';
}

const Selector: React.FC<SelectorProps> = (selectorProps: SelectorProps) => {
  const {
    list,
    selectedItem,
    disabled,
    placeholder = 'Select value',
    error = '',
    onChange,
    showSearch = false,
    loading = false,
    size = 'large',
    width = '100%',
    disableSort = false,
    placement,
    label,
    isRequired,
    dropdownRender
  } = selectorProps;

  const uniqKey = list && list.length > 0 && list[0]?.label ? 'label' : 'name';
  const sortedList = disableSort ? list : orderBy(list, [uniqKey], ['asc']);

  return (
    <div>
      {label && <Label dark={false} label={label} isRequired={isRequired} />}
      <Select
        placeholder={placeholder}
        value={selectedItem}
        status={error.length === 0 ? '' : 'error'}
        style={{width, borderRadius: 99}}
        disabled={disabled}
        showSearch={showSearch}
        size={size}
        dropdownRender={dropdownRender}
        loading={loading}
        // @ts-ignore
        onChange={onChange}
        placement={placement}
        options={uniqBy(sortedList, uniqKey)}
      />
    </div>
  );
};

export default Selector;
