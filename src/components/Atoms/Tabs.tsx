import React, {Fragment, useContext, useRef} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import {Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid';

export interface ITabElements {
  title: string;
  key: string;
  content?: JSX.Element;
}

interface ITabsProps {
  tabsData: ITabElements[];
  tabWithNumbers?: boolean;
  updateTab: (tab: any) => void;
}

const DropDownMenu = ({index, menu, onClick}: any) => {
  const {theme} = useContext(GlobalContext);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const timeoutDuration = 100;
  let timeout: any;

  const openMenu = () => buttonRef?.current.click();
  const closeMenu = () => {
    dropdownRef?.current?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      })
    );
  };

  const onMouseEnter = (closed: boolean = false) => {
    clearTimeout(timeout);
    closed && openMenu();
  };

  const onMouseLeave = (open: boolean) => {
    open && (timeout = setTimeout(() => closeMenu(), timeoutDuration));
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({open}) => (
        <>
          <div
            onClick={openMenu}
            onMouseEnter={() => onMouseEnter(!open)}
            onMouseLeave={() => onMouseLeave(open)}>
            <Menu.Button
              ref={buttonRef}
              className={`${
                open || menu.children.filter((item: any) => item.active).length
                  ? 'bg-indigo-300 text-indigo-700'
                  : ''
              } hover:bg-gray-400 hover:text-gray-700 inline-flex justify-center w-full px-2 2xl:px-4 py-2 text-xs 2xl:text-base font-medium ${
                theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
              } rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition duration-150 ease-in-out transform hover:scale-105 text-gray-700 font-bold`}>
              {menu.title}
              {open ? (
                <ChevronUpIcon
                  className={`w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100`}
                  aria-hidden="true"
                />
              ) : (
                <ChevronDownIcon
                  className={`w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100`}
                  aria-hidden="true"
                />
              )}
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
            <Menu.Items
              className="absolute left-0 w-60 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none cursor-pointer z-100"
              static>
              <div
                className="px-1 py-1 shadow-lg"
                ref={dropdownRef}
                onMouseEnter={() => onMouseEnter()}
                onMouseLeave={() => onMouseLeave(open)}>
                {menu.children.map((item: any, menuIndex: number) => (
                  <Menu.Item key={`${index}_${menuIndex}`} onClick={() => onClick(item)}>
                    <div className="opacity-75 hover:bg-indigo-200 rounded-md px-2 py-2 text-xs 2xl:text-base">
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

const Tabs = ({tabsData, tabWithNumbers, updateTab}: ITabsProps) => {
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
          // defaultValue={activeTab}
        >
          {tabsData.map((tab: ITabElements, index: number) => (
            <option className="transition-all" key={index}>
              {tab.title}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex user__profile-tabs space-x-3" aria-label="Tabs">
          {tabsData.map((menu: any, index: number) =>
            menu.type === 'dropdown' ? (
              <DropDownMenu menu={menu} onClick={updateTab} index={index} key={index} />
            ) : (
              <button
                key={index}
                onClick={() => {
                  updateTab(menu);
                }}
                className={`px-3 relative ${
                  theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
                } ${
                  menu.active ? 'bg-indigo-300 text-indigo-700' : ''
                } py-2 cursor-pointer font-medium hover:bg-gray-400 hover:text-gray-700 bg-opacity-20 hover:bg-opacity-30 text-xs 2xl:text-base rounded-md transition duration-150 ease-in-out transform scale-95 hover:scale-100 text-gray-700 font-bold`}>
                {menu.title}
              </button>
            )
          )}
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
