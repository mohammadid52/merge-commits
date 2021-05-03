import React, {useContext} from 'react';
import {IconContext} from 'react-icons';
import {IoSearchSharp, IoClose} from 'react-icons/io5';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {getAsset} from '../../../assets';

interface SearchProps {
  value?: string;
  onChange?: (str: string) => void;
  onKeyDown?: () => void;
  closeAction?: () => void;
  style?: string;
}

const SearchInput: React.FC<SearchProps> = (searchProps: SearchProps) => {
  const {value, onChange, onKeyDown, closeAction, style} = searchProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const search = (code: number) => {
    if (code === 13) {
      onKeyDown();
    }
  };
  return (
    <div
      className={`flex w-auto py-3 px-4 rounded  ${theme.formSelect} ${
        theme.outlineNone
      } ${style ? style : ''}`}>
      <span className="w-6 mr-4 cursor-pointer" onClick={onKeyDown}>
        <IconContext.Provider
          value={{size: '1.5rem', color: theme.searchIcon[themeColor]}}>
          <IoSearchSharp />
        </IconContext.Provider>
      </span>
      <input
        placeholder="Search..."
        id="searchInput"
        value={value ? value : ''}
        onChange={(e: any) => onChange(e.target.value)}
        onKeyDown={(e: any) => search(e.keyCode)}
        className={`${theme.outlineNone}`}
      />
      {value !== '' && (
        <span className="w-6 ml-4 cursor-pointer" onClick={closeAction}>
          <IconContext.Provider value={{size: '1.5rem', color: '#000000'}}>
            <IoClose />
          </IconContext.Provider>
        </span>
      )}
    </div>
  );
};

export default SearchInput;
