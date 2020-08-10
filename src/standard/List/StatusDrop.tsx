import React, { useState } from 'react';

const FormDrop = () => {
    const items = [
        { 
            id: 1,
            name: 'ACTIVE',
        },
        { 
            id: 2,
            name: 'SUSPENDED',
        },
        { 
            id: 3,
            name: 'INACTIVE',
        },
        { 
            id: 4,
            name: 'HOLD',
        },
        
    ]
    let [selectedItem, setSelectItem] = useState(items[0].name);
    const [showItems, setShowItems] =useState(false);
    const [selection, setSelection] = useState([]);
    
    const selectItem = (item: any) => {
        setSelectItem(item.value);   
        setShowItems(!showItems);
    }


    return (
        <th className="px-8 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span className="">
                <button onClick={() => setShowItems(!showItems)} type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
                className="w-28 flex items-center justify-center">
                    <span className="w-4/10 block bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Status
                    </span>
                    <span className="w-4/10 relative justify-end inset-y-0 right-0 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    </span>
                </button>
                </span>
            
            <div className="relative">
                
                { showItems && (
               
                <div className="z-50 absolute mt-1 w-full rounded-md bg-white shadow-lg">
                <ul role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
                
                    {items.map( (item: {id: number, name: string}) => (
                    <li 
                        key={item.id}
                        onClick={() => selectItem(item)}
                        id="listbox-item-0" role="option" className={`text-xs hover:bg-indigo-400 hover:text-white flex cursor-default select-none relative py-0.5 px-4`}>
                        <span className={`font-bold block hover:bg-indigo-400 hover:text-white`}>
                            {item.name}
                        </span>
                    </li>
                    ))}


                </ul>
                </div>
                )}
            </div>
            </th>

    );

}

export default FormDrop;