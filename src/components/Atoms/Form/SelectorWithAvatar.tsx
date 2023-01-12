import React, {useState, useRef, useContext} from 'react';
import {IconContext} from 'react-icons';
import {FaSpinner} from 'react-icons/fa';

import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import {getImageFromS3} from 'utilities/services';
import {initials, getInitialsFromString, stringToHslColor} from 'utilities/strings';
import Label from './Label';

interface selectorProps {
  list?: {id: number; name: string; avatar?: string}[];
  selectedItem?: {value?: string; id?: string};
  btnClass?: string;
  loading?: boolean;
  arrowHidden?: boolean;
  placeholder: string;
  imageFromS3?: boolean;
  disabled?: boolean;
  onChange: (c: string, n: string, id: string, avatar: string) => void;
  dataCy?: string;
  isRequired?: boolean;
  label?: string;
}

const SelectorWithAvatar = (props: selectorProps) => {
  const {
    list,
    selectedItem,
    btnClass,
    arrowHidden,
    disabled,
    placeholder,
    onChange,
    imageFromS3 = true,
    loading,
    dataCy,
    isRequired,
    label
  } = props;

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
    if (!loading) {
      if (!showList) {
        window.addEventListener('click', handleOutsideClick, false);
        setShowList(true);
      }
    }
  };

  const handleOutsideClick = (e: any) => {
    const stringElement = e.target.innerHTML;
    if (!stringElement || currentRef.current.outerHTML.indexOf(stringElement) === -1) {
      window.removeEventListener('click', handleOutsideClick, false);
      setShowList(false);
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

  React.useEffect(() => {
    if (list && list.length > 0) {
      if (imageFromS3) {
        const modifiedlist = getList(list);
        setTeacherList(modifiedlist);
      } else {
        setTeacherList(list);
      }
    }
  }, [list, imageFromS3]);

  return (
    <div className="relative" ref={currentRef} onFocus={() => onFocus()}>
      {label && <Label dark={false} label={label} isRequired={isRequired} />}
      <span className="inline-block w-full h-full rounded-full shadow-sm">
        <button
          data-cy={`selector-${dataCy}-button`}
          type="button"
          disabled={disabled || loading}
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={` ${
            disabled
              ? 'bg-gray-200 pointer-events-none cursor-not-allowed'
              : 'cursor-pointer'
          } flex items-center  relative w-full h-full rounded-full  border-0 border-gray-300 bg-white pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
            btnClass ? btnClass : ''
          }`}>
          <span className="block truncate text-gray-700">
            {selectedItem?.value ? selectedItem.value : placeholder}
          </span>
          {!loading && (
            <span
              className={`relative justify-end inset-y-0 right-0 items-center pr-2 pointer-events-none ${
                arrowHidden ? 'hidden' : 'flex'
              }`}>
              {/* UPDOWN ARRAW */}
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
                className: `relative w-auto mr-4 animate-spin ${theme.textColor[themeColor]}`
              }}>
              <FaSpinner />
            </IconContext.Provider>
          )}
        </button>
      </span>
      {showList && !loading && (
        <div className="z-50 absolute mt-1 w-full rounded-xl bg-white customShadow">
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-item-3"
            className="max-h-60 rounded-xl py-1 text-base leading-6 ring-1 ring-black ring-opacity-10 overflow-auto focus:outline-none sm:text-sm sm:leading-5">
            {teacherList.length > 0 ? (
              teacherList.map(
                (
                  item: {name: string; id: any; value: string; avatar?: string},
                  key: number
                ) => (
                  <li
                    data-cy={`selector-item-${dataCy}-${key}`}
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
                        selectedItem?.id === item?.id ? 'font-semibold' : 'font-normal'
                      } pl-4 block truncate`}>
                      {item.name}
                    </span>
                    <span
                      className={`${selectedItem.id === item.id ? 'display' : 'hidden'} ${
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
                  </li>
                )
              )
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

export default SelectorWithAvatar;
