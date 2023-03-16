import {Input} from 'antd';
import React from 'react';

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
    width = 200,
    disabled
  } = searchProps;

  const search = () => {
    onKeyDown?.();
  };

  return (
    <Search
      disabled={disabled}
      size="large"
      placeholder={liveSearch ? 'Type atleaset 3 characters...' : 'Search...'}
      onChange={(e: any) => onChange?.(e.target.value)}
      onSearch={search}
      style={{width}}
      allowClear
      value={value || ''}
      enterButton
    />
    // <div
    //   className={`flex w-auto transition-all items-center relative  rounded-full  ${
    //     theme.formSelect
    //   } ${theme.outlineNone} ${
    //     style ? style : ""
    //   }  ${disabledClass} border-0  ${
    //     isActive ? "theme-border" : ""
    //   } input-wrapper px-4 py-2 `}
    // >
    //   <span className="w-6 mr-4 cursor-pointer" onClick={onKeyDown}>
    //     <IoSearchSharp
    //       size={"1.5rem"}
    //       className=" transition-all"
    //       color={theme.searchIcon[themeColor]}
    //     />
    //   </span>
    //   <input
    //     data-cy={dataCy}
    //     placeholder={liveSearch ? "Type atleaset 3 characters..." : "Search..."}
    //     id="searchInput"
    //     disabled={disabled}
    //     value={value ? value : ""}
    //     onChange={(e: any) => onChange?.(e.target.value)}
    //     onKeyDown={(e: any) => search(e.keyCode)}
    //     className={`${theme.outlineNone} bg-transparent hover:bg-transparent   `}
    //   />
    //   <kbd
    //     className={
    //       "h-5 w-12 bg-gray-200  text-xs mr-2 flex items-center justify-center"
    //     }
    //   >
    //     {isMac ? "CMD" : "CTRL"}
    //   </kbd>
    //   <kbd
    //     className={
    //       "h-5 w-5 bg-gray-200  text-xs flex items-center justify-center"
    //     }
    //   >
    //     K
    //   </kbd>

    //   <AnimatedContainer
    //     animationType="translateY"
    //     className="w-auto absolute right-1"
    //     show={value.length > 0}
    //   >
    //     {value.length > 0 && (
    //       <button
    //         title="clear search"
    //         className=" flex justify-center  cursor-pointer hover:bg-gray-200
    //         rounded-full"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           closeAction?.();
    //         }}
    //       >
    //         <IoClose
    //           size={"1rem"}
    //           className="hover:iconoclast:text-main hover:curate:text-main transition-all text-gray-600"
    //         />
    //       </button>
    //     )}
    //   </AnimatedContainer>
    // </div>
  );
};

export default SearchInput;
