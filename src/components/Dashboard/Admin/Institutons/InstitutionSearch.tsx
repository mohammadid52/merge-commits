import React, { ReactChild } from 'react';

interface SearchProps {
  children ?: React.ReactNode;
  name: string;
  id: string;
}

const InstitutionsSearch: React.FC<SearchProps> = (search: SearchProps) => {
  return (
    <div className='col-span-1'>
      <label htmlFor={`${search.id}`} className='sr-only'>
        {search.name}
      </label>
      <div className='mt-1 border border-gray-300 py-2 px-3 rounded-md shadow-sm'>
        <input
          id={`${search.id}`}
          type='search'
          className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
          placeholder={`${search.name}`}
        />
      </div>
    </div>
  );
};

export default InstitutionsSearch;
