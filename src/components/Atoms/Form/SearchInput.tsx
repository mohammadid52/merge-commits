import {Input} from 'antd';
import React, {useEffect} from 'react';

interface SearchProps {
  value?: string;
  onChange?: (str: string) => void;
  onKeyDown?: () => void;
  closeAction?: () => void;
  style?: string;
  liveSearch?: boolean;
  disabled?: boolean;
  dataCy?: string;
  isActive?: boolean;
  width?: number;
}

const {Search} = Input;

const SearchInput: React.FC<SearchProps> = (searchProps: SearchProps) => {
  const {
    value = '',
    onChange,
    liveSearch = false,
    onKeyDown,
    width = 350,
    disabled,
    closeAction
  } = searchProps;

  const search = () => {
    onKeyDown?.();
  };

  useEffect(() => {
    document.querySelector('.ant-input-clear-icon')?.addEventListener('click', () => {
      closeAction?.();
    });
  }, []);

  return (
    <Search
      disabled={disabled}
      size="large"
      placeholder={liveSearch ? 'Type atleaset 3 characters...' : 'Search...'}
      onChange={(e: any) => onChange?.(e.target.value)}
      onSearch={search}
      style={{width, borderRadius: 99}}
      allowClear
      value={value || ''}
      enterButton
    />
  );
};

export default SearchInput;
