import React, { useContext, useState } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

interface DropdownProps {
    label: any,
    items: any,
}


const DropdownForm = ( props: DropdownProps ) => {

    const {label, items} = props;

    let [selectedItem, setSelectItem] = useState(items[0].value);

    const [showItems, setShowItems] =useState(false);

    const [highlight, setHighlight] = useState(false);

    const setStyle = (highlight: any) => {
        setHighlight(highlight);
    }
    
    const selectItem = (item: any) => {
        setSelectItem(item.value);   
        setShowItems(!showItems);
    }

    // const handleHighlight = (e) => {
    //     console.log(e.target);
    //     // e.target.style.background = 'red'
    // }

    return (

        <div className="space-y-1">
            <label id="listbox-label" className="block text-sm leading-5 font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                <span className="inline-block w-full rounded-md shadow-sm">
                <button onClick={() => setShowItems(!showItems)} type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" className="flex cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                    <span className="block truncate">
                    {selectedItem}
                    </span>
                    <span className="relative justify-end inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    </span>
                </button>
                </span>
                { showItems && (
               
                <div className="z-50 absolute mt-1 w-full rounded-md bg-white shadow-lg">
                <ul role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
                
                    {items.map( (item: {id: number, value: string}) => (
                    <li 
                        key={item.id}
                        onClick={() => selectItem(item)}
                        id="listbox-item-0" role="option" className={`hover:bg-indigo-400 hover:text-white flex cursor-default select-none relative py-2 pl-8 pr-4`}>
                        
                        <span className={`${selectedItem === item.value ? 'font-semibold' : 'font-normal'} block truncate"`}>
                            {item.value}
                        </span>
                        <span className={`${selectedItem === item.value ? 'display' : 'hidden'} text-indigo-600 relative justify-end inset-y-0 right-0 flex items-center pr-4`}>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </li>
                    ))}


                </ul>
                </div>
                )}
            </div>
            </div>

    );

}

export default DropdownForm;