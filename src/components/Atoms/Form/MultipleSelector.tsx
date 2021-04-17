import React, { useState, useRef, useContext, useEffect } from 'react';
import { getAsset } from '../../../assets';
import { GlobalContext } from '../../../contexts/GlobalContext';

interface MultipleSelectorProps {
  list?: { id: string; name: string; value?: string }[];
  selectedItems?: { id?: string; name?: string; value?: string }[];
  btnClass?: string;
  arrowHidden?: boolean;
  placeholder: string;
  onChange: (id: string, name: string, value: string) => void;
  disabled?: boolean;
}

const MultipleSelector = (props: MultipleSelectorProps) => {
  const { list, disabled, selectedItems, btnClass, arrowHidden, placeholder, onChange } = props;
  const [showList, setShowList] = useState(false);
  const currentRef: any = useRef(null);

  const { theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const handleOutsideClick = (e: any) => {
    const stringElement = e.target.innerHTML;
    if (!stringElement || currentRef.current.outerHTML.indexOf(stringElement) === -1) {
      window.removeEventListener('click', handleOutsideClick, false);
      if (showList) setShowList(false);
    }
  };

  useEffect(() => {
    if (showList) {
      window.addEventListener('click', handleOutsideClick, false);
    } else {
      window.removeEventListener('click', handleOutsideClick, false);
    }
  }, [showList]);

  return (
    <div className="relative" ref={currentRef}>
      <span className="inline-block w-full h-full rounded-md shadow-sm">
        <button
          disabled={disabled}
          onClick={() => setShowList(!showList)}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={`${
            disabled ? 'bg-gray-100' : ''
          } flex items-center cursor-pointer relative w-full h-full rounded-md  border-0 border-gray-400 bg-white pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
            btnClass ? btnClass : ''
          }`}>
          <span className="block truncate text-gray-700">
            {selectedItems.length
              ? selectedItems.length < 3
                ? selectedItems.map(
                    (item, index) => item.name + `${selectedItems.length - 1 === index ? '.' : ',' + ' '}`
                  )
                : `${selectedItems.length} items Selected`
              : placeholder}
          </span>
          <span
            className={`relative justify-end inset-y-0 right-0 items-center pr-2 pointer-events-none ${
              arrowHidden ? 'hidden' : 'flex'
            }`}>
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </span>
      {showList && (
        <div className="z-50 absolute mt-1 w-full rounded-md bg-white shadow-lg">
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-item-3"
            className="max-h-60 focus:shadow-none rounded-md py-1 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5">
            {list.length > 0 ? (
              list.map((item: { id: string; name: string; value: string }, key: number) => (
                <li
                  key={key}
                  onClick={() => onChange(item.id, item.name, item.value)}
                  id={item.id}
                  role="option"
                  className={`hover:${theme.backGroundLight[themeColor]} hover:text-white flex cursor-pointer select-none relative py-2 px-4`}>
                  <span
                    className={`${selectedItems.find((i) => i.id === item.id) ? 'display' : 'hidden'} ${
                      theme.textColor[themeColor]
                    } relative w-auto flex items-center`}>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span
                    className={`${
                      selectedItems.find((i) => i.id === item.id) ? 'font-semibold' : 'font-normal pl-9'
                    } pl-4 block truncate`}>
                    {item.name}
                  </span>
                </li>
              ))
            ) : (
              <li className="flex justify-center relative py-2 px-4">
                <span className="font-normal"> No Results</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultipleSelector;
