import React, {useContext, useEffect, useState} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getAsset} from '../../assets';
import Tooltip from './Tooltip';

export interface ITabElementProps {
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
}

const UnderlinedTabs = (props: TabsProps) => {
  const {tabs, activeTab, hideTooltip} = props;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [openTab, setOpenTab] = useState<number>(0);

  const changeActiveTab = (tab: number, e: React.MouseEvent<Element>) => {
    setOpenTab(tab);
    if ('updateTab' in props) {
      props.updateTab(tab, e);
    }
  };

  useEffect(() => {
    setOpenTab(activeTab);
  }, [activeTab]);
  const renderButtonText = (tab: any) => {
    return (
      <div id={tab.id} className="flex items-center w-auto">
        {tab.icon && (
          <span className="w-8 h-8 flex items-center mr-4">
            <IconContext.Provider
              value={{size: '1.5rem', color: theme.iconColor[themeColor]}}>
              {tab.icon}
            </IconContext.Provider>
          </span>
        )}
        <span>{tab.title}</span>
      </div>
    );
  };
  return (
    <div className="flex flex-wrap flex-col w-full ">
      <div className="flex flex-nowrap overflow-hidden sm:overflow-x-auto flex-row mr-2 bg-white">
        {tabs.map((tab, key) => (
          <div key={key} className="relative">
            <button
              onClick={(e) => {
                changeActiveTab(tab.index, e);
              }}
              id={tab.id}
              className={`font-bold uppercase bg-white text-xs p-3 px-8 sm:px-4 border-b-2 flex items-center h-full justify-center ${
                tab.disabled
                  ? 'cursor-not-allowed opacity-50 bg-gray-500 text-gray-200 border'
                  : `hover:${theme.borderColor[themeColor]} ${theme.outlineNone} ${
                      openTab === tab.index
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
                    <span className="w-8 h-8 flex items-center mr-4">
                      <IconContext.Provider
                        value={{size: '1.5rem', color: theme.iconColor[themeColor]}}>
                        {tab.icon}
                      </IconContext.Provider>
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
        <div key={key} className={`w-full ${openTab !== tab.index ? 'hidden' : 'block'}`}>
          {openTab === tab.index ? <>{tab.content}</> : null}
        </div>
      ))}
    </div>
  );
};

export default UnderlinedTabs;
