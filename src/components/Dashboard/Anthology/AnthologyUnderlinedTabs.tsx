import {renderButtonText} from '@components/Atoms/UnderlinedTabs';
import {getAsset} from 'assets';
import Tooltip from 'atoms/Tooltip';
import {useGlobalContext} from 'contexts/GlobalContext';
import React from 'react';

interface ITabElementProps {
  id?: string;
  index: number;
  content: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltipText?: string;
  tooltipPlacement?: 'bottom' | 'top' | 'left' | 'right' | 'bottomleft';
}

interface TabsProps {
  activeTab?: number;
  updateTab?: Function;
  tabs: ITabElementProps[];
  hideTooltip?: boolean;
  handleTabSelect?: (index: number, tabSubSection: string) => void;
  mainSection?: string;
}

const UnderlinedTabs = (props: TabsProps) => {
  const {tabs, activeTab, hideTooltip, handleTabSelect} = props;
  const {theme, clientKey} = useGlobalContext();
  const themeColor = getAsset(clientKey, 'themeClassName');

  const changeActiveTab = (tab: number) => {
    handleTabSelect?.(tab, tabs[tab]?.id || '');
  };

  return (
    <div className="flex flex-wrap flex-col w-full h-full">
      <div className="flex flex-nowrap overflow-hidden sm:overflow-x-auto flex-row mr-2 bg-white">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative">
            <button
              onClick={(_) => {
                changeActiveTab(tab.index);
              }}
              id={tab.id}
              className={`font-bold uppercase bg-white text-xs p-3 px-8 sm:px-4 border-b-2 flex items-center h-full justify-center ${
                tab.disabled
                  ? 'cursor-not-allowed opacity-50 bg-gray-500 text-gray-200 border'
                  : `hover:${theme.borderColor[themeColor]} ${theme.outlineNone} ${
                      activeTab === tab.index
                        ? `bg-gray-100 ${theme.borderColor[themeColor]}`
                        : ''
                    }`
              }`}
              disabled={tab.disabled}
              type="button">
              {!hideTooltip ? (
                tab.tooltipText ? (
                  <Tooltip
                    id={tab.id}
                    key={tab.id}
                    text={tab.tooltipText}
                    placement={tab.tooltipPlacement}>
                    {renderButtonText(tab)}
                  </Tooltip>
                ) : (
                  renderButtonText(tab)
                )
              ) : (
                <>
                  {tab.icon && (
                    <span className="w-8 h-8 flex items-center mr-4 theme-text">
                      {tab.icon}
                    </span>
                  )}
                  {tab.title}
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      {tabs.map((tab, key) => (
        <div
          key={key}
          className={`w-full p-4 ${activeTab !== tab.index ? 'hidden' : 'block'}`}>
          {activeTab === tab.index ? <>{tab.content}</> : null}
        </div>
      ))}
    </div>
  );
};

export default React.memo(UnderlinedTabs);
