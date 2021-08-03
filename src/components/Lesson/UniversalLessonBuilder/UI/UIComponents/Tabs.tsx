import React, {useContext} from 'react';
import {getAsset} from '../../../../../assets';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {classNames} from '../FormElements/UniversalInput';

const Tabs = ({
  tabs,
  curTab,
  setCurTab,
}: {
  tabs: {name: string; current: boolean}[];
  curTab: string;
  setCurTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
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
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setCurTab(tab.name)}
                className={classNames(
                  curTab === tab.name
                    ? `border-${
                        themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                      }-500 text-${
                        themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                      }-600`
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
