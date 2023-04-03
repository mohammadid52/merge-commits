import {Dropdown, Space} from 'antd';
import {kebabCase} from 'lodash';
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
          className="block w-full text-xs md:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-lightest  rounded-full">
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
                key={menu.label}
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
