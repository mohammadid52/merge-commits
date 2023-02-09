import StudentName from '@components/MicroComponents/StudentName';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import React, {useContext, useRef, useState} from 'react';
import {IoIosAdd} from 'react-icons/io';
import {getInitialsFromString, initials, stringToHslColor} from 'utilities/strings';
import Placeholder from '../Placeholder';
import Label from './Label';

interface selectorProps {
  list?: {id: number; name: string; avatar?: string}[];
  selectedItem?: {value?: string; id?: string};
  btnClass?: string;
  arrowHidden?: boolean;
  placeholder: string;
  imageFromS3?: boolean;
  onChange: (c: string, n: string, id: string, avatar: string) => void;
  fetchStudentList?: (searchQuery: string) => void;
  clearFilteredStudents?: () => void;
  searchStatus?: boolean;
  searchCallback?: React.Dispatch<React.SetStateAction<boolean>>;
  creatable?: boolean;
  isRequired?: boolean;
  creatableLabel?: string;
  onCreate?: () => void;
  dataCy?: string;
  label?: string;
  width?: string;
}

const SearchSelectorWithAvatar = (props: selectorProps) => {
  const {
    list,
    label,
    width = 'w-full',
    selectedItem,
    btnClass,
    arrowHidden,
    placeholder,
    onChange,
    isRequired = false,
    imageFromS3 = true,
    fetchStudentList,
    clearFilteredStudents,
    searchStatus,
    searchCallback,
    creatable,
    creatableLabel,
    onCreate,
    dataCy
  } = props;

  const countdownTimer = 200;
  const [countdownEnabled, setCountdownEnabled] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState<string>(undefined);

  const [showList, setShowList] = useState(false);
  const currentRef: any = useRef(null);
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const updateSelectedItem = (str: string, name: string, id: string, avatar: string) => {
    setShowList(!showList);
    onChange(str, name, id, avatar);
    window.removeEventListener('click', handleOutsideClick, false);
  };

  const onFocus = () => {
    if (!showList) {
      window.addEventListener('click', handleOutsideClick, false);
      setShowList(true);
    }
  };

  const handleOutsideClick = (e: any) => {
    const stringElement = e.target.innerHTML;
    const id = e.target.id;
    if (id !== 'searchForStudent') {
      if (!stringElement || currentRef.current.outerHTML.indexOf(stringElement) === -1) {
        window.removeEventListener('click', handleOutsideClick, false);
        setShowList(false);
      }
    }
  };

  const handleSearchChange = (e: any) => {
    const {value} = e.target as HTMLInputElement;
    const firstLetterCapitalized = value.charAt(0).toUpperCase() + value.slice(1);
    setSearchTerm(firstLetterCapitalized);

    if (countdownEnabled) {
      clearTimeout(countdownEnabled);
    }

    if (value.length > 0) {
      if (!searchStatus) searchCallback(true);
    } else {
      if (searchStatus) searchCallback(false);
    }

    if (value.length < 2) {
      clearFilteredStudents();
    } else {
      setCountdownEnabled(
        setTimeout(() => {
          fetchStudentList(searchTerm);
          clearTimeout(countdownEnabled);
        }, countdownTimer)
      );
    }
  };

  return (
    <div className="relative" ref={currentRef} onFocus={() => onFocus()}>
      {label && <Label dark={false} label={label} isRequired={isRequired} />}
      <span className={`inline-block ${width} h-full rounded-full shadow-sm`}>
        <button
          data-cy={`${dataCy}-button`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={` flex focus:outline-none hover:theme-bg:200 hover:theme-border:400 hover:theme-text:400 focus:ring-2 focus:ring-${
            themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
          }-600 focus:border-transparent  relative items-center cursor-pointer ${width} h-full rounded-full  border-0 bg-white px-4 pr-0 py-2 justify-between text-left transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
            btnClass ? btnClass : ''
          }`}>
          {/* TOGGLE SEARCH FIELD */}
          {showList ? (
            <input
              data-cy={`${dataCy}-input`}
              autoFocus
              className="p-0 border-none focus:border-transparent active:border-transparent
               bg-transparent shadowNoneOnFocus text-base focus:outline-none"
              onChange={handleSearchChange}
              id={`searchForStudent`}
              type={`text`}
              value={searchTerm ? searchTerm : ''}
              placeholder={selectedItem?.value ? selectedItem.value : placeholder}
            />
          ) : (
            <span className="block truncate text-gray-700">
              {selectedItem?.value ? selectedItem.value : placeholder}
            </span>
          )}

          <span
            className={`relative justify-end inset-y-0 right-0 items-center pr-2 pointer-events-none ${
              arrowHidden ? 'hidden' : 'flex'
            } w-auto`}>
            {/* UPDOWN ARROW */}
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

      {showList && (
        <div className="z-50 absolute mt-1 w-full rounded-xl bg-white customShadow">
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-item-3"
            className="max-h-60 rounded-xl py-1 text-base leading-6 ring-1 ring-black ring-opacity-10 overflow-auto focus:outline-none sm:text-sm sm:leading-5">
            {searchStatus ? (
              <li className="flex justify-center relative py-2 px-4">
                <span className="font-normal">
                  {searchTerm.length > 2 ? 'Searching...' : 'type atleast 2 letters'}{' '}
                </span>
              </li>
            ) : (
              <>
                {creatable && (
                  <li
                    onClick={onCreate}
                    role="option"
                    className={`flex cursor-pointer select-none relative py-2 px-4 ${theme.textColor[themeColor]}`}>
                    <div
                      className={`w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center`}>
                      <IoIosAdd className="w-auto" />
                    </div>
                    <span className={`pl-4 block truncate`}>
                      {creatableLabel || 'Add new'}
                    </span>
                  </li>
                )}
                {list.length ? (
                  list.map(
                    (
                      item: {name: string; id: any; value: string; avatar?: string},
                      key: number
                    ) => (
                      <li className="">
                        <StudentName
                          onHover
                          key={key}
                          item={{student: item}}
                          onClick={() =>
                            updateSelectedItem(
                              item.value,
                              item.name,
                              item.id,
                              item.avatar
                            )
                          }
                        />
                      </li>
                    )
                  )
                ) : (
                  <li className="flex justify-center relative py-2 px-4">
                    <span className="font-normal"> No Results</span>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchSelectorWithAvatar;
