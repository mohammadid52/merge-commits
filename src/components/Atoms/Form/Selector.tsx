import {Transition} from '@headlessui/react';
import {ExclamationCircleIcon} from '@heroicons/react/outline';
import React, {ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {FaSpinner, FaTimes} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {getAsset} from '../../../assets';
import {GlobalContext} from '../../../contexts/GlobalContext';
import Popover from '../Popover';
import Label from './Label';

interface SelectorProps {
  list?: {id: number; name: string | number; popoverElement?: ReactNode}[];
  selectedItem?: string;
  btnClass?: string;
  additionalClass?: string;
  arrowHidden?: boolean;
  placeholder: string;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottomleft';
  onChange: (c: string, n: string, id: string) => void;
  disabled?: boolean;
  isRequired?: boolean;
  loading?: boolean;
  label?: string;
  labelTextClass?: string;
  noOptionMessage?: string;
  width?: string;
  error?: string;
  isClearable?: boolean;
  onClear?: () => void;
  setHoveringItem?: React.Dispatch<React.SetStateAction<{}>>;
}

const Selector: React.FC<SelectorProps> = (selectorProps: SelectorProps) => {
  const {
    label,
    list,
    selectedItem,
    additionalClass = '',
    btnClass,
    disabled,
    arrowHidden,
    placeholder,
    error = '',
    onChange,
    isRequired = false,
    loading = false,
    noOptionMessage = '',

    width = 'w-full',
    isClearable = false,
    onClear,

    setHoveringItem
  } = selectorProps;
  const [showList, setShowList] = useState(false);
  const currentRef: any = useRef(null);
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const updateSelectedItem = (str: string, name: string, id: string) => {
    setShowList(!showList);
    onChange(str, name, id);
    window.removeEventListener('click', handleOutsideClick, false);
  };

  const handleOutsideClick = (e: any) => {
    const stringElement = e.target.innerHTML;
    if (!stringElement || currentRef?.current?.outerHTML?.indexOf(stringElement) === -1) {
      window.removeEventListener('click', handleOutsideClick, false);
      if (showList) {
        setShowList(false);
      }
    }
  };

  useEffect(() => {
    if (showList) {
      window.addEventListener('click', handleOutsideClick, false);
    } else {
      window.removeEventListener('click', handleOutsideClick, false);
    }
  }, [showList]);

  function capitalizeFirstLetter(str: string = '') {
    if (str.length > 0) {
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      return capitalized;
    }
  }

  const isSelected = (name: string) => name && selectedItem === name;

  const SelectorItem = ({
    item
  }: {
    item: {
      name: string;
      id: any;
      value: string;
    };
  }) => {
    return (
      <>
        <li
          onMouseEnter={() => setHoveringItem(item)}
          onMouseLeave={() => setHoveringItem({})}
          onClick={() => updateSelectedItem(item.value, item.name, item.id)}
          id={item.id}
          tabIndex={-1}
          role="option"
          className={`flex cursor-pointer  select-none relative py-2 pl-8 pr-4 ${
            isSelected(item.name)
              ? 'iconoclast:bg-main text-white'
              : 'hover:bg-indigo-100 hover:text-indigo-400'
          }`}>
          <span className={`${isSelected(item.name) ? 'pl-1' : 'pl-4'} block truncate`}>
            {item.name}
          </span>
          {isSelected(item.name) && (
            <span className={`text-white relative w-auto flex items-center`}>
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
      </>
    );
  };

  return (
    <div className={`relative space-y-1 ${additionalClass}`} ref={currentRef}>
      <Label label={label} isRequired={isRequired} />
      <span className="inline-block w-full h-full rounded-md shadow-sm">
        <button
          disabled={disabled || loading}
          onClick={() => setShowList(!showList)}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={`${
            disabled || loading ? 'bg-gray-100' : ''
          } flex focus:outline-none focus:ring-2 focus:ring-${
            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
          }-600 focus:border-transparent  relative items-center cursor-pointer ${width} h-full rounded-md ${
            error.length === 0 ? 'border-gray-300' : 'border-red-300'
          }  border-0 bg-white pl-3 py-2 text-left transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
            btnClass ? btnClass : ''
          }`}>
          <span className="block truncate text-gray-700">
            {capitalizeFirstLetter(selectedItem ? selectedItem : placeholder)}
          </span>
          <div className="w-auto">
            {!loading && (
              <span
                className={`relative justify-end inset-y-0 right-0 items-center w-12 pr-2 pointer-events-none ${
                  arrowHidden ? 'hidden' : 'flex'
                }`}>
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
            )}
            {loading && (
              <IconContext.Provider
                value={{
                  size: '1.2rem',
                  style: {},
                  className: `relative mr-4 animate-spin ${theme.textColor[themeColor]}`
                }}>
                <FaSpinner />
              </IconContext.Provider>
            )}
            {isClearable && selectedItem && (
              <FaTimes className="relative mr-4" onClick={onClear} />
            )}
            {error.length > 0 && (
              <ExclamationCircleIcon
                className={`h-5 relative mr-4 w-5 text-red-500 ${
                  error.length === 0 ? 'hidden' : ''
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        </button>
      </span>
      {showList && (
        <div className="z-50 absolute mt-1 w-full rounded-md bg-white shadow-lg">
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-item-3"
            className="rounded-md  max-h-60 py-1 text-base overflow-y-auto leading-6 focus:shadow-none focus:outline-none sm:text-sm sm:leading-5">
            {list.length > 0 ? (
              list.map(
                (item: {popoverElement?: any; name: string; id: any; value: string}) => (
                  <SelectorItem item={item} key={item.id} />
                )
              )
            ) : (
              <li className="flex justify-center relative py-2 px-4">
                <span className="font-normal">{noOptionMessage || 'No Results'}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Selector;
