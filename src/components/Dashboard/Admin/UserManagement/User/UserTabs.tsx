import React from 'react';

interface IUserTabsProps {
  tabs: any[];
  currentTab?: any;
  viewedUser?: any;
  setCurrentTab?: any;
  isTeacher?: boolean;
  isAdmin?: boolean;
  theme?: any;
}

const UserTabs = ({
  tabs,
  currentTab,
  viewedUser,
  setCurrentTab,
  isTeacher,
  isAdmin,
  theme,
}: IUserTabsProps) => {
  const getTabsData = () => {
    if (viewedUser?.role === 'TR' || viewedUser?.role === 'FLW') {
      return tabs.filter((tabObj: any) => tabObj.name !== 'Notebook');
    } else if (viewedUser?.role === 'ADM' || viewedUser?.role === 'SUP') {
      return tabs.filter((tabObj: any) => tabObj.name === 'User Information');
    } else {
      return tabs;
    }
  };
  // const tabsData = !isTeacher && !isAdmin ? tabs : tabs;

  return (
    <div className="w-8/10 bg-white rounded-lg p-2">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          defaultValue={currentTab}>
          {getTabsData().map((tab: any) => (
            <option className="transition-all" key={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex user__profile-tabs space-x-4" aria-label="Tabs">
          {getTabsData().map((tab: any) => (
            <div
              key={tab.name}
              onClick={() => {
                setCurrentTab(tab.name);
              }}
              className={`px-3 ${
                theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
              } py-2 cursor-pointer font-medium tab text-sm rounded-md ${
                tab.name === currentTab ? 'active' : ''
              }`}>
              {tab.name}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default UserTabs;
