import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import React, {useContext} from 'react';
import {IoClose, IoSearchSharp} from 'react-icons/io5';

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
}

const SearchInput: React.FC<SearchProps> = (searchProps: SearchProps) => {
  const {
    value,
    onChange,
    liveSearch = false,
    onKeyDown,
    closeAction,
    style,
    disabled,
    dataCy,
    isActive
  } = searchProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const search = (code: number) => {
    if (code === 13) {
      // hit enter to search
      onKeyDown();
    }
  };

  const disabledClass = disabled ? 'cursor-not-allowed bg-gray-200' : '';

  return (
    <div
      className={`flex w-auto transition-all items-center relative  rounded-full  ${
        theme.formSelect
      } ${theme.outlineNone} ${
        style ? style : ''
      }  ${disabledClass} border-0 border-transparent ${
        isActive ? 'theme-border' : ''
      } input-wrapper px-4 py-2 `}>
      <span className="w-6 mr-4 cursor-pointer" onClick={onKeyDown}>
        <IoSearchSharp
          size={'1.5rem'}
          className=" transition-all"
          color={theme.searchIcon[themeColor]}
        />
      </span>
      <input
        data-cy={dataCy}
        placeholder={liveSearch ? 'Type atleaset 3 characters...' : 'Search...'}
        id="searchInput"
        disabled={disabled}
        value={value ? value : ''}
        onChange={(e: any) => onChange(e.target.value)}
        onKeyDown={(e: any) => search(e.keyCode)}
        className={`${theme.outlineNone} bg-transparent hover:bg-transparent   `}
      />
      <AnimatedContainer
        animationType="translateY"
        className="w-auto absolute right-1"
        show={value.length > 0}>
        {value.length > 0 && (
          <span
            title="clear search"
            className=" flex justify-center  cursor-pointer hover:iconoclast:bg-200 hover:iconoclast:text-600
            hover:curate:bg-200 hover:curate:text-600
            rounded-full"
            onClick={closeAction}>
            <IoClose
              size={'1rem'}
              className="hover:iconoclast:text-main hover:curate:text-main transition-all text-gray-600"
            />
          </span>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default SearchInput;
