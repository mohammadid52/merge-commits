import React, { useContext } from 'react';
import { QuoteWidget } from './TopWidgets';
import { Widget } from '../../../interfaces/ClassroomComponentsInterfaces';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { CallLinkWidget, DefaultTextWidget } from '../SideWidgetBar/Widgets';

const TopWidgetBar = () => {
  const { state } = useContext(GlobalContext);

  const getTopWidgets = (): any[] => {
    const thereAreWidgets = state.roomData.widgets.length > 0;
    if (thereAreWidgets) {
      return state.roomData.widgets.filter((widgetObj: Widget) => {
        return widgetObj.placement === 'topbar' && widgetObj.active;
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
          <DefaultTextWidget key={`topbar_widget_${idx}`} title={widgetObj.title} content={widgetObj.content.text} />
        );
      case 'quote':
        return <QuoteWidget key={`topbar_widget_${idx}`} quotes={widgetObj.quotes} />;
      case 'call':
        return <CallLinkWidget key={`sidebar_widget_${idx}`} title={widgetObj.title} links={widgetObj.links} />;
      default:
        return null;
    }
  };

  return (
    <div className={`h-16 w-full`}>
      {getTopWidgets().length > 0 &&
        getTopWidgets().map((widgetObj: Widget, idx: number) => {
          return switchWidgets(widgetObj, idx);
        })}
    </div>
  );
};

export default TopWidgetBar;
