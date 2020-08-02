import React, { useContext, useState } from 'react';
import './style.css'



function SelectBox( {label, items =[]} ) {
   
    let [selectedItem, setSelectItem] = useState(items[0].value);

    const [showItems, setShowItems] =useState(false);
    
    const selectItem = (item) => {
        setSelectItem(item.value);
        
        setShowItems(!showItems);

    }

    return (


        <div className="select-box--container">
            <div>
                <p>{label}</p>
            </div>
            <div className="select-box--selected-item">
                selected: {selectedItem}
            </div>
            
        <div className="select-box-arrow"
            onClick={() => setShowItems(!showItems)}>
                
                <span 
                className={`${showItems ? 'select-box--arrow-up' 
                : 'select-box--arrow-down'}`} />
        </div>
        
        { showItems && (
        <ul className="dd-list">
            {items.map(item => (
                <li className="dd-list-item" 
                key={item.id}
                onClick={() => selectItem(item)}
                // onChange={e=>setSelectItem(item.value)}
                
                >
                    <button 
                        type="button"
                      >
                            <span className={selectedItem === item.value ? 'selected' : ''}>
                            {item.value}</span>
                           

                    </button>
                </li>
            ))}
        </ul>
    )}
    {/* <input type="hidden" value={selectedItem.id} name={label}></input> */}

    </div>
    )

}

export default SelectBox;