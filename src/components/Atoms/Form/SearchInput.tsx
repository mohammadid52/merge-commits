import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import useKeyPress from '@customHooks/useKeyPress';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import React, {useContext, useEffect} from 'react';
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

  const isMac = navigator.userAgent.includes('Mac');

  const onCmd = useKeyPress(isMac ? 'Meta' : 'Ctrl');

  const onK = useKeyPress('k');

  const triggerSearch = onCmd && onK;

  useEffect(() => {
    if (triggerSearch) {
      const el = document.getElementById('searchInput');

      el && el.focus();
    }
  }, [triggerSearch]);

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
      <kbd
        className={'h-5 w-12 bg-gray-200  text-xs mr-2 flex items-center justify-center'}>
        {isMac ? 'CMD' : 'CTRL'}
      </kbd>
      <kbd className={'h-5 w-5 bg-gray-200  text-xs flex items-center justify-center'}>
        K
      </kbd>

      <AnimatedContainer
        animationType="translateY"
        className="w-auto absolute right-1"
        show={value.length > 0}>
        {value.length > 0 && (
          <button
            title="clear search"
            className=" flex justify-center  cursor-pointer hover:bg-gray-200
            rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              closeAction();
            }}>
            <IoClose
              size={'1rem'}
              className="hover:iconoclast:text-main hover:curate:text-main transition-all text-gray-600"
            />
          </button>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default SearchInput;
