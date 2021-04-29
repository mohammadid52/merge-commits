import React, {useContext, useEffect} from 'react';
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

const SearchInputToggle: React.FC<SearchProps> = (searchProps: SearchProps) => {
  const {value, onChange, onKeyDown, closeAction, style} = searchProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const search = (code: number) => {
    if (code === 13) {
      onKeyDown();
    }
  };

  const [showFull, setShowFull] = React.useState(false);

  useEffect(() => {
    if (!showFull) {
      onChange('');
    }
  }, [showFull]);

  return (
    <div
      style={{width: showFull ? '200px' : '32px'}}
      onBlur={() => setShowFull(false)}
      className={`flex w-auto transition items-center py-1 rounded px-2 justify-center ${
        theme.formSelect
      } ${theme.outlineNone} ${style ? style : ''}`}>
      <span
        style={{minWidth: 24, minHeight: 24, maxWidth: 24}}
        className={`items-center justify-center flex cursor-pointer`}
        onClick={() => {
          setShowFull(!showFull);
          onKeyDown();
        }}>
        <IconContext.Provider
          value={{size: '1.2rem', color: theme.searchIcon[themeColor]}}>
          <IoSearchSharp />
        </IconContext.Provider>
      </span>
      <input
        placeholder="Search..."
        id="searchInput"
        value={value ? value : ''}
        onChange={(e: any) => onChange(e.target.value)}
        onKeyDown={(e: any) => search(e.keyCode)}
        className={`text-sm ${theme.outlineNone}`}
      />
      {value !== '' && (
        <span className="w-6 ml-4 cursor-pointer" onClick={closeAction}>
          <IconContext.Provider value={{size: '1.2rem', color: '#000000'}}>
            <IoClose />
          </IconContext.Provider>
        </span>
      )}
    </div>
  );
};

export default SearchInputToggle;
