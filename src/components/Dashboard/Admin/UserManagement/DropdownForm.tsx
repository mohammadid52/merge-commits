import Label from '@components/Atoms/Form/Label';
import {useGlobalContext} from '@contexts/GlobalContext';
import {getAsset} from 'assets';
import React, {useEffect, useRef, useState} from 'react';

interface DropdownProps {
  label: string;
  items: any;
  listClassName?: string;
  userInfo: string;
  id: string;
  isRequired?: boolean;
  handleChange: (item: {code: string | boolean; name: string}) => void;
  style: boolean;
  value: string;
  noOptionMessage?: string;
  dataCy?: string;
}

// TODO: Need to make this component
// to use selector component in atom > forms > selector.

const DropdownForm = (props: DropdownProps) => {
  const {
    label,
    items,
    listClassName = '',
    userInfo,
    handleChange,
    id,
    isRequired,
    style,
    noOptionMessage,
    dataCy
  } = props;

  const getOptions = () => {
    if (userInfo === 'ACTIVE') {
      return 'Active';
    } else if (userInfo === 'SUSPENDED') {
      return 'Suspended';
    } else if (userInfo === 'INACTIVE') {
      return 'Inactive';
    } else if (userInfo === 'TRAINING') {
      return 'Training';
    } else if (userInfo === 'HOLD') {
      return 'Hold';
    } else if (userInfo === 'ADM') {
      return 'Admin';
    } else if (userInfo === 'BLD') {
      return 'Builder';
    } else if (userInfo === 'FLW') {
      return 'Fellow';
    } else if (userInfo === 'CRD') {
      return 'Coordinator';
    } else if (userInfo === 'TR') {
      return 'Teacher';
    } else if (userInfo === 'ST') {
      return 'Student';
    } else if (userInfo === '') {
      return 'Choose One';
    } else {
      return userInfo;
    }
  };

  const componentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setShowItems(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const OPTIONS = getOptions();

  const [showItems, setShowItems] = useState(false);

  let [selectItem, setItem] = useState(userInfo);

  const selection = (item: any) => {
    setItem(item.name);
    setShowItems(!showItems);
    handleChange(item);
  };

  const isSelected = (name: string) => OPTIONS === name;
  const {theme, clientKey} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <div ref={componentRef} className="space-y-1">
      <Label label={label} isRequired={isRequired} />
      <div className="relative">
        <span className="inline-block w-full rounded-md shadow-sm">
          <button
            data-cy={`dropdown-${dataCy}`}
            onClick={() => setShowItems(!showItems)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded="true"
            aria-labelledby="listbox-label"
            className={`flex cursor-pointer relative w-full rounded-md  border-0 border-gray-300 bg-white pl-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-${
              themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
            }-600 focus:border-transparent transition ease-in-out duration-150 sm:text-sm sm:leading-5`}>
            <span className="block truncate">{OPTIONS}</span>
            <span className="relative justify-end inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor">
                <path
                  d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </span>
        {showItems && (
          <div className="z-50 absolute mt-1 w-full rounded-md bg-white shadow-lg">
            <ul
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-item-3"
              className={`max-h-30 ${listClassName} rounded-md py-1 text-base leading-6 ring-1 ring-black ring-opacity-10 overflow-auto focus:outline-none sm:text-sm sm:leading-5`}>
              {items.length ? (
                items.map((item: {code: string; name: string}, key: number) => (
                  <li
                    data-cy={`dropdown-item-${dataCy}-${key}`}
                    key={key}
                    onClick={() => selection(item)}
                    id={id}
                    role="option"
                    className={` flex cursor-pointer select-none relative py-2 pl-8 pr-4 ${
                      isSelected(item.name)
                        ? 'iconoclast:bg-main text-white'
                        : 'hover:bg-indigo-100 hover:text-indigo-400'
                    }`}>
                    <span className={`block truncate"`}>{item.name}</span>
                    {isSelected(item.name) && (
                      <span
                        className={`text-white relative justify-end inset-y-0 right-0 flex items-center pr-4`}>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </li>
                ))
              ) : (
                <li className="flex justify-center relative py-2 px-4">
                  <span className="font-normal">{noOptionMessage || 'No Results'}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownForm;
