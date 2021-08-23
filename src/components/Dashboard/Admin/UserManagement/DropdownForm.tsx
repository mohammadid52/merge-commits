import React, {useState} from 'react';

interface DropdownProps {
  label: string;
  items: any;
  userInfo: string;
  id: string;
  handleChange: (item: {code: string | boolean; name: string}) => void;
  style: boolean;
  value: string;
  noOptionMessage?: string;
}

// TODO: Need to make this component
// to use selector component in atom > froms > selector.

const DropdownForm = (props: DropdownProps) => {
  const {label, items, userInfo, handleChange, id, style, noOptionMessage} = props;

  const options = () => {
    if (userInfo === 'ACTIVE') {
      return 'Active';
    } else if (userInfo === 'SUSPENDED') {
      return 'Suspended';
    } else if (userInfo === 'INACTIVE') {
      return 'Inactive';
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

  let [selectedItem, setSelectItem] = useState(options());
  const [showItems, setShowItems] = useState(false);

  let [selectItem, setItem] = useState(userInfo);

  const selection = (item: any) => {
    setItem(item.name);
    setShowItems(!showItems);
    handleChange(item);
  };

  return (
    <div className="space-y-1">
      <label
        id="listbox-label"
        className={`${
          style ? 'text-m' : 'text-sm'
        } block leading-5 font-medium text-gray-700`}>
        <span className={`${style ? 'text-red-500' : 'hidden'}`}>* </span>
        {label}
      </label>
      <div className="relative">
        <span className="inline-block w-full rounded-md shadow-sm">
          <button
            onClick={() => setShowItems(!showItems)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded="true"
            aria-labelledby="listbox-label"
            className="flex cursor-pointer relative w-full rounded-md  border-0 border-gray-300 bg-white pl-3 py-2 text-left focus:outline-none focus:ring-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5">
            <span className="block truncate">{options()}</span>
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
              className="max-h-60 rounded-md py-1 text-base leading-6 ring-1 ring-black ring-opacity-10 overflow-auto focus:outline-none sm:text-sm sm:leading-5">
              {items.length ? (
                items.map((item: {code: string; name: string}, key: number) => (
                  <li
                    key={key}
                    onClick={() => selection(item)}
                    id={id}
                    role="option"
                    className={`hover:bg-indigo-400 hover:text-white flex cursor-pointer select-none relative py-2 pl-8 pr-4`}>
                    <span
                      className={`${
                        options() === item.name ? 'font-semibold' : 'font-normal'
                      } block truncate"`}>
                      {item.name}
                    </span>
                    <span
                      className={`${
                        options() === item.name ? 'display' : 'hidden'
                      } text-indigo-600 relative justify-end inset-y-0 right-0 flex items-center pr-4`}>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
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