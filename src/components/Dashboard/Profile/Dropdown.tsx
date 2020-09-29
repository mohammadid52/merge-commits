import React, { useContext } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { useState } from "react";
import { IconContext } from 'react-icons';
import { IoMdSettings } from "react-icons/io";
import { FaRegLightbulb } from "react-icons/fa";
import { GlobalContext } from '../../../contexts/GlobalContext';


function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

    const { lightSwitch } = useContext(GlobalContext);

    const light = () => {
        lightSwitch();
        setIsOpen(!isOpen);
    }

    const match = useRouteMatch();

  return (
    <div className="relative flex flex-col items-end">
        
    <button className="w-auto" onClick={() => setIsOpen(!isOpen) } >
        <IconContext.Provider value={{ size: '2rem', color: '#4a5568' }}>
            <IoMdSettings />
        </IconContext.Provider>
    </button>
{ isOpen ?

    <div className="absolute z-50 mt-10 w-56 rounded-md shadow-lg">
    <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
    <div className="py-1">
        <NavLink to={`${match.url}/edit`}>
            <button 
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
            <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
            Edit
            </button>
        </NavLink>
        <button 
        onClick={light}
        className="group flex items-center px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
            <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500" viewBox="0 0 20 20" fill="currentColor">                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
            </svg>
            Light
        </button>
    
    </div>
    </div>
    </div>
    : null 

}
 

    </div>
  );
}

export default Dropdown;