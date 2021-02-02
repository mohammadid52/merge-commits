import React, { useState, useContext, useEffect } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoCaretDownCircleOutline, IoCaretUpCircleOutline } from 'react-icons/io5';

import { GlobalContext } from '../../contexts/GlobalContext';

const Accordion = () => {
  const { theme } = useContext(GlobalContext);

  const [selectedItem, setSelectedItem] = useState('');

  const changeView = (step: string) => {
    if (selectedItem !== step) {
      setSelectedItem(step);
    } else {
      setSelectedItem('');
    }
  }

  const dummyData = [
    { id: '1', title: 'General Information', content: <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. one</p> },
    { id: '2', title: 'Accordian Two', content: <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.  woHello there</p> },
    { id: '3', title: 'Accordian Three', content: <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. three</p> },
    { id: '4', title: 'Accordian Four', content: <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. four</p> },
    { id: '5', title: 'Accordian Five', content: <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. file</p> },
  ]

  useEffect(() => {
    if (dummyData?.length) {
      setSelectedItem(dummyData[0]?.id);
    }
  }, []);

  return (
    <div className="bg-white mx-auto border border-gray-200 rounded-xl">
      <ul className="rounded-xl">
        {dummyData.map((item: { id: string, title: string, content: React.ReactNode }) => (

          <li className={`relative border-b border-gray-200 ${selectedItem === item.id ? 'rounded-lg' : ''}`}>
            <button type="button" className={`w-full px-8 py-6 text-left ${theme.outlineNone} ${selectedItem === item.id ? 'border border-indigo-400 rounded-lg' : ''}`} onClick={() => changeView(item.id)}>
              <div className="flex items-center justify-between">
                <span className={`text-xs md:text-base font-medium ${selectedItem === item.id && 'text-indigo-600'}`}> {item.title}	</span>
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
