import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {ExclamationCircleIcon} from '@heroicons/react/outline';
import {getAsset} from 'assets';
import Label from 'atoms/Form/Label';
import {GlobalContext} from 'contexts/GlobalContext';
import {orderBy} from 'lodash';
import React, {ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {FaSpinner} from 'react-icons/fa';
import {IoClose} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';

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
  style?: any;
  loading?: boolean;
  label?: string;
  labelTextClass?: string;
  noOptionMessage?: string;
  width?: string;
  error?: string;
  isClearable?: boolean;
  onClear?: () => void;
  setHoveringItem?: React.Dispatch<React.SetStateAction<{}>>;
  setSelectedItem?: React.Dispatch<React.SetStateAction<{}>>;
  dataCy?: string;
  dropdownWidth?: string;
}

const Selector: React.FC<SelectorProps> = (selectorProps: SelectorProps) => {
  const {
    label,
    list,
    selectedItem,
    additionalClass = '',
    btnClass,
    disabled,
    setSelectedItem,
    placeholder,
    style,
    error = '',
    onChange,
    isRequired = false,
    loading = false,
    noOptionMessage = '',

    width = 'w-full',
    isClearable = false,
    dropdownWidth,

    setHoveringItem,

    dataCy = ''
  } = selectorProps;
  const [showList, setShowList] = useState(false);
  const currentRef: any = useRef(null);
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const sortedList = orderBy(list, ['name'], ['asc']);

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
          data-cy={`${dataCy}-item-${item.id}`}
          onMouseEnter={() => {
            setHoveringItem && setHoveringItem(item);
          }}
          title={item.name}
          onMouseLeave={() => {
            setHoveringItem && setHoveringItem({});
          }}
          onClick={() => updateSelectedItem(item.value, item.name, item.id)}
          id={item.id}
          tabIndex={-1}
          role="option"
          className={`flex cursor-pointer  select-none relative py-2 pl-8 pr-4 ${
            isSelected(item.name)
              ? 'iconoclast:bg-main text-white'
              : 'hover:bg-indigo-100 hover:text-indigo-400'
          }`}>
          <span className={`block truncate`}>{item.name}</span>
        </li>
      </>
    );
  };

  const clearSort = () => {
    if (setSelectedItem) {
      setSelectedItem(null);
    }
  };

  return (
    <div className={`relative space-y-1 ${additionalClass}`} ref={currentRef}>
      {label && <Label dark={false} label={label} isRequired={isRequired} />}
      <span className="inline-block w-full h-full rounded-full shadow-sm">
        <button
          data-cy={`${dataCy}-button`}
          disabled={disabled || loading}
          onClick={() => setShowList(!showList)}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={`${
            disabled || loading ? 'bg-gray-100' : ''
          } flex focus:outline-none hover:theme-bg:200 hover:theme-border:400 hover:theme-text:400 focus:ring-2 focus:ring-${
            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
          }-600 focus:border-transparent  relative items-center cursor-pointer ${width} h-full rounded-full ${
            error.length === 0 ? 'border-gray-300' : 'border-red-300'
          }  border-0 bg-white px-4 py-2 text-left transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
            btnClass ? btnClass : ''
          }`}>
          <span className="block truncate text-gray-700">
            {capitalizeFirstLetter(selectedItem ? selectedItem : placeholder)}
          </span>
          {loading && (
            <IconContext.Provider
              value={{
                size: '1.2rem',
                style: {},
                className: `relative mr-2 w-auto animate-spin ${theme.textColor[themeColor]}`
              }}>
              <FaSpinner />
            </IconContext.Provider>
          )}

          {!loading && (
            <div className="h-full flex items-center ml-8 w-auto justify-center">
              <AnimatedContainer
                animationType="translateY"
                className="w-auto absolute right-1"
                show={isClearable && selectedItem !== null}>
                {isClearable && selectedItem !== null && (
                  <span
                    title="clear sort"
                    className=" flex justify-center  cursor-pointer hover:bg-gray-200
                   rounded-full"
                    onClick={clearSort}>
                    <IoClose
                      size={'1rem'}
                      className="hover:iconoclast:text-main hover:curate:text-main transition-all text-gray-600"
                    />
                  </span>
                )}
              </AnimatedContainer>

              {error.length > 0 && (
                <ExclamationCircleIcon
                  className={`h-5 relative mr-4 w-5 text-red-500 ${
                    error.length === 0 ? 'hidden' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          )}
        </button>
      </span>
      <AnimatedContainer className="z-50 absolute w-full " show={showList}>
        {showList && (
          <div className="z-50 absolute mt-1 w-full " style={{...style}}>
            <ul
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-item-3"
              className={`rounded-xl bg-white customShadow ${
                dropdownWidth || 'w-132'
              } relative  max-h-60 text-base overflow-y-auto leading-6 focus:shadow-none focus:outline-none sm:text-sm sm:leading-5`}>
              {list.length > 0 ? (
                sortedList.map(
                  (item: {
                    popoverElement?: any;
                    name: string;
                    id: any;
                    value: string;
                  }) => <SelectorItem item={item} key={item.id} />
                )
              ) : (
                <li className="flex justify-center relative py-2 px-4">
                  <span className="font-normal">{noOptionMessage || 'No Results'}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default Selector;
