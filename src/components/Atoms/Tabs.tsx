import {Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid';
import {Dropdown, Space} from 'antd';
import {kebabCase} from 'lodash';
import {Fragment, useRef} from 'react';
import {BsChevronDown} from 'react-icons/bs';

export interface ITabElements {
  label: string;
  key: string;
  content?: JSX.Element;
}

interface ITabsProps {
  tabsData: ITabElements[];
  tabWithNumbers?: boolean;
  updateTab: (tab: any) => void;
  currentTab?: string;
}

const DropDownMenu = ({menu, onClick}: any) => {
  const buttonRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);
  const timeoutDuration = 100;
  let timeout: any;

  const openMenu = () => buttonRef?.current?.click?.();
  const closeMenu = () => {
    dropdownRef?.current?.dispatchEvent?.(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true
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
      {({open = true}) => (
        <>
          <div
            onClick={openMenu}
            onMouseEnter={() => onMouseEnter(!open)}
            data-cy={kebabCase(menu.label)}
            onMouseLeave={() => onMouseLeave(open)}>
            <Menu.Button
              ref={buttonRef}
              className={`${
                open || menu.children.filter((item: any) => item.active).length
                  ? 'theme-bg:200 theme-text:600'
                  : ''
              } hover:bg-gray-400 hover:text-gray-700 inline-flex justify-center w-full px-1 xl:px-2 2xl:px-4 py-2 text-xs 2xl:text-base   rounded-full bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition duration-150 ease-in-out transform  text-gray-700 font-bold`}>
              {menu.label}
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
              className="absolute left-0 w-60 my-2 mb-4 mt-4 origin-top-right bg-white divide-y divide-gray-100 rounded-xl customShadow focus:outline-none cursor-pointer z-100"
              static>
              <div
                className="p-2 rounded-xl customShadow"
                ref={dropdownRef}
                onMouseEnter={() => onMouseEnter()}
                onMouseLeave={() => onMouseLeave(open)}>
                {menu.children.map((item: any) => (
                  <Menu.Item
                    data-cy={kebabCase(`${item.label}-item`)}
                    key={`${item.label}`}
                    // @ts-ignore
                    onClick={() => onClick?.(item)}>
                    <div className="hover:iconoclast:bg-400 hover:curate:bg-400 hover:text-white rounded-full p-2 px-4 text-xs 2xl:text-base">
                      {item.label}
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

const Tabs = ({tabsData, updateTab, currentTab}: ITabsProps) => {
  const isGameChangers = window.location.href.includes('game-changers');

  return (
    <div className={`w-full ${isGameChangers ? 'bg-black' : 'bg-white'} rounded-lg p-2`}>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          value={currentTab}
          onChange={(e) => {
            const tab = tabsData.find((_d) => _d.label === e.target.value);
            updateTab(tab);
          }}
          className="block w-full text-xs md:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-full">
          {tabsData.map((tab: ITabElements) => (
            <option value={tab.label} className="transition-all" key={tab.label}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav
          className="flex user__profile-tabs gap-4 justify-between px-4"
          aria-label="Tabs">
          {tabsData.map((menu: any) =>
            menu.type === 'dropdown' ? (
              <Dropdown
                arrow={{pointAtCenter: false}}
                placement="top"
                menu={{items: menu.children}}>
                <a className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                  <Space>
                    {menu.label}
                    <BsChevronDown />
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <button
                key={menu.label}
                data-cy={kebabCase(`${menu.label}-item`)}
                onClick={() => {
                  updateTab(menu);
                  // }
                }}
                className={`${
                  menu.active ? 'theme-bg text-white' : 'theme-text:500'
                } theme-border:300 border-0 hover:theme-bg:500 bg-transparent  hover-text-white  inline-flex justify-center w-full px-1 xl:px-2 2xl:px-4 py-2 text-xs 2xl:text-base  rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition duration-150 ease-in-out transform font-medium`}>
                {menu.label}
              </button>
            )
          )}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
