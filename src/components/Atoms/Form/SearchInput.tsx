import React from 'react';
import { IconContext } from 'react-icons';
import { IoSearchSharp, IoClose } from 'react-icons/io5';

interface SearchProps {
  value?: string
  onChange?: (str: string) => void
  onKeyDown?: () => void
  closeAction?: () => void
  style?: string
}

const SearchInput: React.FC<SearchProps> = (searchProps: SearchProps) => {
  const { value, onChange, onKeyDown, closeAction, style } = searchProps;
  const search = (code: number) => {
    if (code === 13) {
      onKeyDown()
    }
  }
  return (
    <div className={`flex form-select rounded border-gray-400 ${style ? style : ''}`}>
      <span className="w-6 mr-4 cursor-pointer" onClick={onKeyDown}>
        <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
          <IoSearchSharp />
        </IconContext.Provider>
      </span>
      <input
        placeholder="Search..."
        id='searchInput'
        value={value ? value : ''}
        onChange={(e: any) => onChange(e.target.value)}
        onKeyDown={(e: any) => search(e.keyCode)}
        className="search-input" />
      {value !== '' && <span className="w-6 ml-4 cursor-pointer" onClick={closeAction}>
        <IconContext.Provider value={{ size: '1.5rem', color: '#000000' }}>
          <IoClose />
        </IconContext.Provider>
      </span>}
    </div>
  )
}

export default SearchInput