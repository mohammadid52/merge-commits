import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { GlobalContext } from '../../contexts/GlobalContext';

interface TabsProps {
  tabs: {
    index: number,
    content: React.ReactNode,
    title: string,
    icon: React.ReactNode
  }[];

}

const UnderlinedTabs = (props: TabsProps) => {
  const { tabs } = props;
  const { theme } = useContext(GlobalContext);

  const [openTab, setOpenTab] = React.useState(0)
  return (
    <div className="flex flex-wrap flex-col w-full ">
      <div className="flex flex-no-wrap flex-row mr-2 bg-white">
        {tabs.map((tab, key) => (
          <div key={key} className="">
            <button
              onClick={() => {
                setOpenTab(tab.index)
              }}
              className={`font-bold uppercase bg-white text-xs p-3 px-8 border-b-2 flex items-center justify-center hover:border-indigo-600 ${theme.outlineNone} ${
                openTab === tab.index
                  ? 'bg-gray-100 border-indigo-600 '
                  : ''
                }`}
              type="button">
              <span className="w-8 h-8 flex items-center mr-4">
                <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                  {tab.icon}
                </IconContext.Provider>
              </span>
              {tab.title}
            </button>
          </div>
        ))}
      </div>
      {tabs.map((tab, key) => (
        <div
          key={key}
          className={`w-full p-4 ${
            openTab !== tab.index ? 'hidden' : 'block'
            }`}>
          {tab.content}
        </div>
      ))}
    </div>
  )
}

export default UnderlinedTabs