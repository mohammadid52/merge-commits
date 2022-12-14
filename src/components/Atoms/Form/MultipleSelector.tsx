import React, {useState, useRef, useContext, useEffect} from 'react';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import {getImageFromS3} from 'utilities/services';
import {getInitialsFromString, initials, stringToHslColor} from 'utilities/strings';
import {orderBy} from 'lodash';

interface MultipleSelectorProps {
  list?: {id: string; name: string; value?: string; avatar?: string}[];
  selectedItems?: {id?: string; name?: string; value?: string}[];
  btnClass?: string;
  arrowHidden?: boolean;
  noOptionMessage?: string;
  placeholder: string;
  onChange: (id: string, name: string, value: string) => void;
  disabled?: boolean;
  withAvatar?: boolean;
}

const MultipleSelector = (props: MultipleSelectorProps) => {
  const {
    list,
    disabled,
    withAvatar = false,
    selectedItems,
    btnClass,
    arrowHidden,
    placeholder,
    onChange,
    noOptionMessage
  } = props;
  const [showList, setShowList] = useState(false);
  const currentRef: any = useRef(null);
  const [modifiedList, setModifiedList] = useState([]);

  const {theme, clientKey} = useContext(GlobalContext);
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
      if (withAvatar) {
        const modifiedlist = getList(list);
        setModifiedList(modifiedlist);
      } else {
        setModifiedList(list);
      }
    } else {
      setModifiedList([]);
    }
  }, [list, withAvatar]);

  const sortedList = orderBy(modifiedList, ['name'], ['asc']);

  return (
    <div className="relative" ref={currentRef}>
      <span className="inline-block w-full h-full rounded-full shadow-sm">
        <button
          disabled={disabled}
          onClick={() => setShowList(!showList)}
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          className={`${
            disabled ? 'bg-gray-100' : ''
          } flex items-center cursor-pointer hover:theme-bg:200 hover:theme-border:400 hover:theme-text:400 relative w-full h-full rounded-full  border-0 border-gray-300 bg-white pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
            btnClass ? btnClass : ''
          }`}>
          <span className="block truncate text-gray-700">
            {selectedItems.length
              ? selectedItems.length < 3
                ? sortedList.map(
                    (item, index) =>
                      item.name +
                      `${selectedItems.length - 1 === index ? '.' : ',' + ' '}`
                  )
                : `${selectedItems.length} items Selected`
              : placeholder}
          </span>
          <span
            className={`relative justify-end inset-y-0 right-0 items-center pr-2 pointer-events-none ${
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
        </button>
      </span>
      {showList && (
        <div className="z-50 absolute mt-1 w-full rounded-xl bg-white shadow-lg">
          <ul
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant="listbox-item-3"
            className="max-h-60 focus:shadow-none rounded-xl py-1 text-base leading-6 overflow-auto focus:outline-none sm:text-sm sm:leading-5">
            {modifiedList.length > 0 ? (
              modifiedList.map(
                (
                  item: {id: string; name: string; value: string; avatar?: string},
                  key: number
                ) => {
                  return (
                    <li
                      key={key}
                      onClick={() => onChange(item.id, item.name, item.value)}
                      id={item.id}
                      role="option"
                      className={`hover:${theme.backGroundLight[themeColor]} hover:text-white flex cursor-pointer select-none relative py-2 px-4`}>
                      {withAvatar ? (
                        item.avatar ? (
                          <img
                            src={item.avatar}
                            alt=""
                            className="flex-shrink-0 mr-2 h-6 w-6 rounded-full"
                          />
                        ) : (
                          <div
                            className="h-6 w-6 rounded-full mr-2 flex flex-shrink-0 justify-center items-center text-white text-xs p-2 text-bold"
                            style={{
                              /* stylelint-disable */
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
                        )
                      ) : null}

                      <span
                        className={`${
                          selectedItems.find((i) => i.id === item.id)
                            ? 'font-semibold'
                            : 'font-normal'
                        } pl-4 block truncate`}>
                        {item.name}
                      </span>

                      <span
                        className={`${
                          selectedItems.find((i) => i.id === item.id)
                            ? 'display'
                            : 'hidden'
                        } ${
                          theme.textColor[themeColor]
                        } relative w-auto flex float-right items-center`}>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </li>
                  );
                }
              )
            ) : (
              <li className="flex justify-center relative py-2 px-4">
                <span className="font-normal"> {noOptionMessage || 'No Results'}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultipleSelector;
