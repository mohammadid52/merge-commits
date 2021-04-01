import React, { useState, useRef, useContext } from 'react';
import { getAsset } from '../../../assets';
import { GlobalContext } from '../../../contexts/GlobalContext';

interface SelectorProps {
  list?: { id: number, name: string }[]
  selectedItem?: string
  btnClass?: string
  arrowHidden?: boolean
  placeholder: string
  onChange: (c: string, n: string, id: string) => void
}

const Selector: React.FC<SelectorProps> = (selectorProps: SelectorProps) => {
  const { list, selectedItem, btnClass, arrowHidden, placeholder, onChange } = selectorProps;
  const [showList, setShowList] = useState(false);
  const currentRef: any = useRef(null);
  const { theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const updateSelectedItem = (str: string, name: string, id: string) => {
    setShowList(!showList);
    onChange(str, name, id);
    window.removeEventListener("click", handleOutsideClick, false);
  }

  const onFocus = () => {
    if (!showList) {
      window.addEventListener("click", handleOutsideClick, false);
      setShowList(true)
    }
  }

  const handleOutsideClick = (e: any) => {
    const stringElement = e.target.innerHTML;
    if (!stringElement || currentRef.current.outerHTML.indexOf(stringElement) === -1) {
      window.removeEventListener("click", handleOutsideClick, false);
      setShowList(false);
    };
  }

  return (
    <div className="relative" ref={currentRef} onFocus={() => onFocus()}>
      <span className="inline-block w-full h-full rounded-md shadow-sm">
        <button type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
          className={`flex items-center cursor-pointer relative w-full h-full rounded-md  border-0 border-gray-400 bg-white pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${btnClass ? btnClass : ''}`}
        >
          <span className="block truncate text-gray-700" >
            {selectedItem ? selectedItem : placeholder}
          </span>
          <span className={`relative justify-end inset-y-0 right-0 items-center pr-2 pointer-events-none ${arrowHidden ? 'hidden' : 'flex'}`}>
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </span>
      {
        showList && (
          <div className="z-50 absolute mt-1 w-full rounded-md bg-white shadow-lg max-h-48 overflow-y-auto">
            <ul role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" className="max-h-60 rounded-md py-1 text-base leading-6 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm sm:leading-5">
              {list.length > 0 ? (list.map((item: { name: string, id: any, value: string }, key: number) => (
                <li
                  key={key}
                  onClick={() => updateSelectedItem(item.value, item.name, item.id)}
                  id={item.id}
                  role="option" className={`hover:${theme.backGroundLight[themeColor]} hover:text-white flex cursor-pointer select-none relative py-2 px-4`}>
                  <span className={`${selectedItem === item.name ? 'display' : 'hidden'} ${theme.textColor[themeColor]} relative w-auto flex items-center`}>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className={`${selectedItem === item.name ? 'font-semibold pl-4' : 'font-normal pl-8'} block truncate`}>
                    {item.name}
                  </span>
                </li>
              ))) : (
                  <li className="flex justify-center relative py-2 px-4">
                    <span className="font-normal"> No Results</span>
                  </li>
                )
              }
            </ul>
          </div>
        )
      }
    </div>
  )
}

export default Selector