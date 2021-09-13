import React, {useState} from 'react';
import {setState} from '../../../../../../interfaces';
import {classNames} from '../../FormElements/UniversalInput';
const _tabs = [
  {name: 'Component Details', current: true},
  {name: 'Preview', current: false},
];
interface ITab {
  name: string;
  current: boolean;
}

export const useTabs = (tabs: ITab[] = _tabs) => {
  const [curTab, setCurTab] = useState(tabs[0].name);

  const helpers = [...tabs.map((tab) => curTab === tab.name)];
  const goTo = [...tabs.map((tab) => tab.name)];
  return {curTab, setCurTab, helpers, goTo};
};

/**
 *
 * The one with underline tabs
 */
export const Tabs2 = ({
  tabs = _tabs,
  curTab,
  setCurTab,
}: {
  tabs: {name: string; current: boolean}[];
  curTab: string;
  setCurTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:iconoclast:border-500 focus:curate:border-500 sm:text-sm rounded-md"
          defaultValue={tabs.find((tab) => tab.current).name}>
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b-0 border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setCurTab(tab.name)}
                className={classNames(
                  tab.name === curTab
                    ? 'iconoclast:border-600 curate:border-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 w-auto border-b-2 font-medium text-sm'
                )}
                aria-current={tab.current ? 'page' : undefined}>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

/**
 *
 * The one with full-width underline tabs
 */

const Tabs = ({
  tabs = _tabs,
  curTab,
  setCurTab,
}: {
  tabs?: {name: string; current: boolean}[];
  curTab: string;

  setCurTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          defaultValue={tabs.find((tab) => tab.current).name}>
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b-0 mb-4 border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => {
                  setCurTab(tab.name);
                }}
                className={classNames(
                  curTab === tab.name
                    ? `iconoclast:text-main curate:text-main 
                      iconoclast:border-main curate:border-main `
                    : 'border-transparent focus:outline-none text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'py-4 cursor-pointer px-1 text-center border-b-3 font-medium text-sm'
                )}
                aria-current={curTab === tab.name ? 'page' : undefined}>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tabs;

/**
 *
 * The one with Pill tabs with brand color
 *
 */
export const Tabs3 = ({
  tabs = _tabs,
  curTab,
  setCurTab,
  config = {fullColor: false},
  numbered = false,
}: {
  tabs: ITab[];
  curTab: string;
  config?: {fullColor?: boolean};
  setCurTab: setState['string'];
  numbered?: boolean;
}) => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-0 border-gray-300 rounded-md"
          defaultValue={tabs.find((tab) => tab.current).name}>
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="transition-all flex space-x-4" aria-label="Tabs">
          {tabs.map((tab, idx: number) => (
            <div
              onClick={() => setCurTab(tab.name)}
              key={tab.name}
              role="button"
              className={classNames(
                tab.name === curTab
                  ? config.fullColor
                    ? 'iconoclast:bg-main text-white curate:bg-main '
                    : 'iconoclast:bg-100 iconoclast:text-700 curate:bg-100 curate:text-700 '
                  : 'text-gray-500 hover:text-gray-600',
                'px-3 transition-all py-2 font-medium text-sm rounded-md'
              )}
              aria-current={tab.current ? 'page' : undefined}>
              {numbered ? `${idx + 1}. ` : ''}
              {tab.name}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};
