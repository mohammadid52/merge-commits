import React, {useContext} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';

export interface ITabElements {
  title: string;
  key: string;
  content?: JSX.Element;
}

interface ITabsProps {
  tabsData: ITabElements[];
  activeTab: string;
  updateTab: (tab: string) => void;
}

const Tabs = ({tabsData, activeTab, updateTab}: ITabsProps) => {
  const {theme} = useContext(GlobalContext);
  return (
    <div className="w-full bg-white rounded-lg p-2">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          defaultValue={activeTab}>
          {tabsData.map((tab: ITabElements) => (
            <option className="transition-all" key={tab.title}>
              {tab.title}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex user__profile-tabs space-x-3" aria-label="Tabs">
          {tabsData.map((tab: ITabElements) => (
            <button
              key={tab.title}
              onClick={() => {
                updateTab(tab.key);
              }}
              className={`px-3 relative ${
                theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
              } py-2 cursor-pointer font-medium tab text-sm rounded-md ${
                tab.key === activeTab ? 'active' : ''
              } transition duration-150 ease-in-out transform hover:scale-105`}>
              {tab.key === activeTab && (
                <span className="flex absolute h-4 w-4 top-0 right-0 -mt-1 -mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500"></span>
                </span>
              )}
              {tab.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
