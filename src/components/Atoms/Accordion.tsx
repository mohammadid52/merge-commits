import React, { useState, useContext, useEffect } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoCaretDownCircleOutline, IoCaretUpCircleOutline } from 'react-icons/io5';

import { GlobalContext } from '../../contexts/GlobalContext';

interface AccordionProps {
  titleList: { id: string, title: string, subtitle?: string, content: React.ReactNode }[]
}

const Accordion = (props: AccordionProps) => {
  const { theme } = useContext(GlobalContext);
  const { titleList } = props;
  const [selectedItem, setSelectedItem] = useState('');

  const changeView = (step: string) => {
    if (selectedItem !== step) {
      setSelectedItem(step);
    } else {
      setSelectedItem('');
    }
  }


  useEffect(() => {
    if (titleList?.length) {
      setSelectedItem(titleList[0]?.id);
    }
  }, []);

  return (
    <div className="bg-white mx-auto border border-gray-200 rounded-xl">
      <ul className="rounded-xl">
        {titleList.map((item: { id: string, title: string, subtitle?: string, content: React.ReactNode }) => (

          <li className={`relative border-b border-gray-200 ${selectedItem === item.id ? 'rounded-lg' : ''}`}>
            <button type="button" className={`w-full px-8 py-6 text-left ${theme.outlineNone} ${selectedItem === item.id ? 'border border-indigo-400 rounded-lg' : ''}`} onClick={() => changeView(item.id)}>
              <div className="flex items-center justify-between">
                <span className={`text-xs md:text-base font-medium ${selectedItem === item.id && 'text-indigo-600'}`}>
                  <span>{item.title}</span><br />
                  <span className="text-sm leading-6 text-gray-500">{item.subtitle ? item.subtitle : ''}</span>
                </span>
                <span className="w-8 h-8 flex items-center">
                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                    {(selectedItem === item.id) ? <IoCaretUpCircleOutline /> : <IoCaretDownCircleOutline />}
                  </IconContext.Provider>
                </span>
              </div>
            </button>
            {(selectedItem === item.id) && (
              <div className="px-8 py-6 max-h-140 overflow-auto">
                {item.content}
              </div>
            )}
          </li>

        ))}
      </ul >
    </div >
  )
}

export default Accordion
