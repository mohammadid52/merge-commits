import React from 'react';
import { IconContext } from 'react-icons';
import { IoSearchSharp } from 'react-icons/io5';

interface SearchProps {
  value?: string
  onChange?: (str: string) => void
  onKeyDown?: () => void
  style?: string
}

const SearchInput: React.FC<SearchProps> = (searchProps: SearchProps) => {
  const { value, onChange, onKeyDown, style } = searchProps;
  const search = (code: number) => {
    if (code === 13) {
      onKeyDown()
    }
  }
  return (
    <div className={`flex form-select rounded border-gray-400 ${style ? style : ''}`}>
      <span className="w-6 mr-4">
        <IconContext.Provider value={{ size: '1.5rem', color: '#000000' }}>
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
    </div>
  )
}

export default SearchInput