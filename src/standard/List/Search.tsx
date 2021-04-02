import React from 'react';

interface SearchProps {
    id: any,
    name: any
}

const Search = (props: SearchProps) => {
   const { id, name } = props;

    return (    
        ///change WIDTH and MARGIN if needed
        <div className="col-span-1">
            <label htmlFor={`${id}`} className="sr-only">{name}</label>
            <div className="mt-1  border-0 border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                <input id={`${id}`} type="search" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder={`${name}`}/>
            </div>
        </div>
    )

}

export default Search;