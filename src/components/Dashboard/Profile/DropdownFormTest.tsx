import React, { useContext } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { useState } from "react";


const DropdownFormTest = ( label: any, items: any, multiSelect: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const toggle = () => setIsOpen(!isOpen);


  function handleOnClick(item : any ) {
      if (!selection.some(current => current.id === item.id)) {
          if (!multiSelect) {
              setSelection([item]);
          } else if (multiSelect) {
              setSelection([...selection, item]);
          }
      } else {
          let selectionAfterRemoval = selection;
          selectionAfterRemoval = selectionAfterRemoval.filter(
              current => current.id  ==! item.id
          );
          setSelection([...selectionAfterRemoval]);
      }
  }

function isItemInSelection(item : any ) {
    if (selection.find(current => current.id === item.id)) {
        return true;
    }
    return false;
}

  return (
    <div className="dd-wrapper">
        <div 
            tabIndex={0} 
            className="dd-header" 
            role="button" 
            onKeyPress={() => setIsOpen(!isOpen)} 
            onClick={() => setIsOpen(!isOpen)}>
                <div>
                <p>{isOpen ? 'Close' : 'Open' }</p>
            </div>
          
        </div>
        <div>
                <p>{label}</p>
        </div>
            
          
        { isOpen && (
        <ul className="dd-list">
            {items.map( (item: {id: any, value: any}) => (
                <li className="dd-list-item" key={item.id}>
                    <button 
                        type="button"
                        onClick={() => handleOnClick(item)}>
                            <span>{item.value}</span>
                            <span>{isItemInSelection(item) && 'Selected'}</span>

                    </button>
                </li>
            ))}
        </ul>
    )
    
    }
    </div>

  );
}

export default DropdownFormTest;