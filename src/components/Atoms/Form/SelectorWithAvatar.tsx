import React, { useState } from 'react'
import { getImageFromS3 } from '../../../utilities/services';
import { initials, getInitialsFromString, stringToHslColor } from '../../../utilities/strings';

interface selectorProps {
  list?: { id: number, name: string, avatar?: string }[]
  selectedItem?: { value?: string, id?: string }
  btnClass?: string
  arrowHidden?: boolean
  placeholder: string
  onChange: (c: string, n: string, id: string, avatar: string) => void
}

const SelectorWithAvatar = (props: selectorProps) => {
  const { list, selectedItem, btnClass, arrowHidden, placeholder, onChange } = props;
  const [showList, setShowList] = useState(false);

  const updateSelectedItem = (str: string, name: string, id: string, avatar: string) => {
    setShowList(!showList);
    onChange(str, name, id, avatar);
  }
  return (
    <div className="relative">
      <span className="inline-block w-full h-full rounded-md shadow-sm">
        <button onClick={() => setShowList(!showList)} type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label"
          className={`flex items-center cursor-pointer relative w-full h-full rounded-md border border-gray-400 bg-white pl-3 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${btnClass ? btnClass : ''}`}
        >
          <span className="block truncate text-gray-700" >
            {selectedItem?.value ? selectedItem.value : placeholder}
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
            <ul role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">

              {list.length > 0 ? (list.map((item: { name: string, id: any, value: string, avatar?: string }, key: number) => (
                <li
                  key={key}
                  onClick={() => updateSelectedItem(item.value, item.name, item.id, item.avatar)}
                  id={item.id}
                  role="option" className={`hover:bg-indigo-400 hover:text-white flex cursor-pointer select-none relative py-2 px-4`}>
                  {item.avatar ? <img src={item.avatar} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                    :
                    <div className="h-6 w-6 rounded-full flex flex-shrink-0 justify-center items-center text-white text-xs p-2 text-bold" style={{ background: `${stringToHslColor(getInitialsFromString(item.name)[0] + ' ' + getInitialsFromString(item.name)[1])}`, textShadow: '0.1rem 0.1rem 2px #423939b3' }} >
                      {item.name ? initials(getInitialsFromString(item.name)[0], getInitialsFromString(item.name)[1]) : initials('N', 'A')}
                    </div>}
                  <span className={`${selectedItem.id === item.id ? 'font-semibold' : 'font-normal'} pl-4 block truncate`}>
                    {item.name}
                  </span>
                  <span className={`${selectedItem.id === item.id ? 'display' : 'hidden'} text-indigo-600 relative w-auto flex items-center`}>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </li>
              ))) : (
                  <li className="flex justify-center relative py-2 px-4">
                    <span className="font-normal"> No Results</span>
                  </li>
                )}
            </ul>
          </div>
        )
      }
    </div>
  )
}

export default SelectorWithAvatar
