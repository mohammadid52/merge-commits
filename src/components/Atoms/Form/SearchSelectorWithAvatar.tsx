import React, {useState, useRef, useContext, useEffect} from 'react';
import {IoIosAdd} from 'react-icons/io';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import {getImageFromS3} from 'utilities/services';
import {initials, getInitialsFromString, stringToHslColor} from 'utilities/strings';

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
  creatableLabel?: string;
  onCreate?: () => void;
}

const SearchSelectorWithAvatar = (props: selectorProps) => {
  const {
    list,
    selectedItem,
    btnClass,
    arrowHidden,
    placeholder,
    onChange,
    imageFromS3 = true,
    fetchStudentList,
    clearFilteredStudents,
    searchStatus,
    searchCallback,
    creatable,
    creatableLabel,
    onCreate
  } = props;

  const countdownTimer = 200;
  const [countdownEnabled, setCountdownEnabled] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState<string>(undefined);

  const [showList, setShowList] = useState(false);
  const currentRef: any = useRef(null);
  const [teacherList, setTeacherList] = useState([]);
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

  const getList = (listData: any) => {
    let modifiedlist: any = [];

    listData.forEach(async (item: any) => {
      const imagePath = item?.image;

      const image = await (imagePath !== null ? getImageFromS3(imagePath) : null);

      const modifiedItem = {...item, avatar: image};

      modifiedlist.push(modifiedItem);
    });

    return modifiedlist;
  };

  const filterListBySearchQuery = (nameSearch: string, list: any) => {
    return list.filter((nameObj: any) => nameObj.name.includes(nameSearch));
  };

  // React.useEffect(() => {
  //   if (list && list.length > 0) {
  //     const filteredList =
  //       searchTerm && searchTerm.length > 2
  //         ? filterListBySearchQuery(searchTerm, list)
  //         : list;
  //     if (imageFromS3) {
  //       const modifiedlist = getList(filteredList);
  //       setTeacherList(modifiedlist);
  //     } else {
  //       setTeacherList(filteredList);
  //     }
  //   }
  // }, [list, searchTerm, imageFromS3]);

  return (
    <div className="relative" ref={currentRef} onFocus={() => onFocus()}>
      <span className="inline-block w-full h-full rounded-full shadow-sm">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={`flex items-center cursor-pointer relative w-full h-full rounded-full  border-0 border-gray-400 bg-white pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
            btnClass ? btnClass : ''
          }`}>
          {/* TOGGLE SEARCH FIELD */}
          {showList ? (
            <input
              autoFocus
              className="p-0 border-none focus:border-transparent focus:outline-none"
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
                      <li
                        key={key}
                        onClick={() =>
                          updateSelectedItem(item.value, item.name, item.id, item.avatar)
                        }
                        id={item.id}
                        role="option"
                        className={`hover:${theme.backGroundLight[themeColor]} hover:text-white flex cursor-pointer select-none relative py-2 px-4`}>
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt=""
                            className="flex-shrink-0 h-6 w-6 rounded-full"
                          />
                        ) : (
                          <div
                            className="h-6 w-6 rounded-full flex flex-shrink-0 justify-center items-center text-white text-xs p-2 text-bold"
                            style={{
                              background: `${stringToHslColor(
                                getInitialsFromString(item.name)[0] +
                                  ' ' +
                                  getInitialsFromString(item.name)[1]
                              )}`,
                              textShadow: '0.1rem 0.1rem 2px #423939b3'
                            }}>
                            {item.name
                              ? initials(
                                  getInitialsFromString(item.name)[0],
                                  getInitialsFromString(item.name)[1]
                                )
                              : initials('N', 'A')}
                          </div>
                        )}
                        <span
                          className={`${
                            selectedItem.id === item.id ? 'font-semibold' : 'font-normal'
                          } pl-4 block truncate`}>
                          {item.name}
                        </span>
                        <span
                          className={`${
                            selectedItem.id === item.id ? 'display' : 'hidden'
                          } ${
                            theme.textColor[themeColor]
                          } relative w-auto flex items-center`}>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
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
