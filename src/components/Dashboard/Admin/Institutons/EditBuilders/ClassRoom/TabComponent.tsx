import React, {useContext} from 'react';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';

export interface ITabComponentProps {
  tabs: {name: string; section: string}[];
  activeTab: string;
  handleTabSwitch: (tab: string) => void;
}

const TabComponent = ({tabs, activeTab, handleTabSwitch}: ITabComponentProps) => {
  const {theme} = useContext(GlobalContext);
  return (
    <div className="w-full bg-gray-200 rounded-lg p-2">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          defaultValue={activeTab}>
          {tabs.map((tab: any) => (
            <option className="transition-all" key={tab.section}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex user__profile-tabs space-x-4" aria-label="Tabs">
          {tabs.map((tab: any) => (
            <div
              key={tab.name}
              onClick={() => {
                handleTabSwitch(tab.section);
              }}
              className={`px-3 ${
                theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
              } py-2 cursor-pointer font-medium tab text-sm rounded-md ${
                tab.section === activeTab ? 'active' : ''
              }`}>
              {tab.name}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabComponent;
