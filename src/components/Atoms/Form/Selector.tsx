import {Select} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import {orderBy, uniqBy} from 'lodash';
import React, {forwardRef} from 'react';
import Label from './Label';

type Item = {
  label: string;
  id?: string | number;
  value?: string | boolean;
};

interface SelectorProps {
  list?: Item[];
  selectedItem?: string;

  placeholder: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | undefined;
  onChange: (value: string, option: Item) => void;
  disabled?: boolean;
  disableSort?: boolean;
  isRequired?: boolean;

  loading?: boolean;
  size?: SizeType;
  label?: string;

  width?: number | string;
  dataCy?: string;
  error?: string;

  dropdownRender?:
    | ((
        menu: React.ReactElement<any, string | React.JSXElementConstructor<any>>
      ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>)
    | undefined;

  showSearch?: boolean;
  optionFilterProp?: string;
}

// turn this component into a ref component

const Selector = forwardRef<any, SelectorProps>((selectorProps, ref) => {
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
    dropdownRender,
    optionFilterProp
  } = selectorProps;

  const uniqKey = list && list.length > 0 && list[0]?.label ? 'label' : 'name';
  const sortedList = disableSort ? list : orderBy(list, [uniqKey], ['asc']);

  return (
    <div>
      {label && <Label dark={false} label={label} isRequired={isRequired} />}
      <Select
        placeholder={placeholder}
        value={selectedItem || undefined}
        status={error.length === 0 ? '' : 'error'}
        style={{width, borderRadius: 99}}
        optionFilterProp={optionFilterProp}
        disabled={loading || disabled}
        showSearch={showSearch}
        ref={ref}
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
});

export default Selector;
