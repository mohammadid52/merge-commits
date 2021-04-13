import React, { useContext } from 'react';
import { DashboardProps } from '../Dashboard';

import { CallLinkWidget, DefaultTextWidget, LogoWidget } from './Widgets';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { getAsset } from '../../../assets';
import { Widget } from '../../../interfaces/ClassroomComponentsInterfaces';
import { QuoteWidget } from './TopWidgets';
import { FileLinkWidget } from './Widgets/FilesWidget';

const SideWidgetBar = (props: DashboardProps) => {
  const { state, clientKey } = useContext(GlobalContext);

  const getSideWidgets = () => {
    const thereAreWidgets = state.roomData.widgets.length > 0;
    if (thereAreWidgets) {
      return state.roomData.widgets.filter((widgetObj: Widget) => {
        return widgetObj.placement === 'sidebar' && widgetObj.active;
      });
    } else {
      return [];
    }
  };

  const switchWidgets = (widgetObj: Widget, idx: number) => {
    const widgetType = widgetObj.type;
    switch (widgetType) {
      case 'default':
        return (
          <DefaultTextWidget key={`sidebar_widget_${idx}`} title={widgetObj.title} content={widgetObj.content.text} />
        );
      case 'quote':
        return <QuoteWidget placement="sidebar" key={`sidebar_widget_${idx}`} card={true} quotes={widgetObj.quotes} />;
      case 'call':
        return (
          <CallLinkWidget
            key={`sidebar_widget_${idx}`}
            card={true}
            title={widgetObj.title}
            links={widgetObj.links}
            widgetObj={widgetObj}
          />
        );
      case 'file':
        return (
          <FileLinkWidget
            key={`sidebar_widget_${idx}`}
            card={true}
            title={widgetObj.title}
            links={widgetObj.links}
            widgetObj={widgetObj}
          />
        );
      default:
        return null;
    }
  };

  const barClass = `md:bg-white md:bg-opacity-100 lg:bg-opacity-0`;
  const responsiveBarClass = `md:w-16 lg:w-56 xl:w-80`;
  const responsiveBarScalingAnimation = `transition-all duration-500 ease-in-out`;

  return (
    <>
      {/**
       * FULL SIZE
       */}
      <div id={`sideWidgetBar`} className={`${barClass} ${responsiveBarClass} ${responsiveBarScalingAnimation}`}>
        {/**
         * STATIC INSTITUTE LOGO
         */}
        <LogoWidget source={getAsset(clientKey, 'logo_symbol')} altdesc={`school-logo`} card={false} />

        {/**
         * DYNAMIC MAP
         */}
        {state.roomData &&
          state.roomData.widgets.length > 0 &&
          getSideWidgets().length > 0 &&
          getSideWidgets().map((widgetObj: Widget, idx: number) => {
            return (
              <div key={`sidebar_widget_${idx}_parent`} className={`mb-4`}>
                {switchWidgets(widgetObj, idx)}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default SideWidgetBar;
