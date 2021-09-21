import React, {Fragment, useContext} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import {Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';

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

const DropDownMenu = ({activeTab, menu, onClick}: any) => {
  const {theme} = useContext(GlobalContext);
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({open}) => (
        <>
          <div>
            <Menu.Button
              className={`${
                open || menu.children.filter((item: any) => item.key === activeTab).length
                  ? 'bg-indigo-300 text-indigo-700'
                  : ''
              } hover:bg-indigo-300 hover:text-indigo-700 inline-flex justify-center w-full px-4 py-2 text-sm font-medium ${
                theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
              } rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition duration-150 ease-in-out transform hover:scale-105 text-gray-500`}>
              {menu.title}
              <ChevronDownIcon
                className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="absolute left-0 w-60 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none cursor-pointer">
              <div className="px-1 py-1 shadow-lg">
                {menu.children.map((item: any, index: number) => (
                  <Menu.Item key={index} onClick={() => onClick(item.key)}>
                    <div className="opacity-75 hover:bg-indigo-200 rounded-md px-2 py-2 text-sm">
                      {item.title}
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

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
          <DropDownMenu
            menu={{
              title: 'Institution Manager',
              key: 'institution',
              children: [
                {
                  title: 'General Information',
                  key: 'general_information',
                },
                {
                  title: 'Staff',
                  key: 'staff',
                },
              ],
            }}
            activeTab={activeTab}
            onClick={updateTab}
          />
          <DropDownMenu
            menu={{
              title: 'Course Manager',
              key: 'course',
              children: [
                {
                  title: 'Courses',
                  key: 'curricular',
                },
                {
                  title: 'Units',
                },
                {
                  title: 'Lessons',
                  key: 'lessons',
                },
                {
                  title: 'Game Changers ',
                },
              ],
            }}
            activeTab={activeTab}
            onClick={updateTab}
          />
          <DropDownMenu
            menu={{
              title: 'Class Manager',
              key: 'class',
              children: [
                {
                  title: 'Classes',
                  key: 'class',
                },
                {
                  title: 'Classrooms',
                  key: 'class_room',
                },
              ],
            }}
            activeTab={activeTab}
            onClick={updateTab}
          />
          <DropDownMenu
            menu={{
              title: 'Community Manager',
              key: 'community',
              children: [
                {
                  title: 'New Person Spotlight',
                },
                {
                  title: 'Announcements & Events',
                },
                {
                  title: 'Front Page',
                },
              ],
            }}
            activeTab={activeTab}
            onClick={updateTab}
          />
          <button
            // onClick={() => {
            //   updateTab(tab.key);
            // }}
            className={`px-3 relative ${
              theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
            } py-2 cursor-pointer font-medium hover:bg-indigo-300 hover:text-indigo-700 bg-opacity-20 hover:bg-opacity-30 text-sm rounded-md transition duration-150 ease-in-out transform hover:scale-105 text-gray-500`}>
            Research & Analytics
          </button>
          {/* {tabsData.map((tab: ITabElements) => (
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
          ))} */}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
