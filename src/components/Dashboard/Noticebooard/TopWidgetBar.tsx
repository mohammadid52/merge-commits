import React, { useContext } from 'react';
import { QuoteWidget } from './TopWidgets';
import { Widget } from '../../../interfaces/ClassroomComponentsInterfaces';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { CallLinkWidget, DefaultTextWidget } from './Widgets';
import { FileLinkWidget } from './Widgets/FilesWidget';
import ContentCard from '../../Atoms/ContentCard';

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
        return <QuoteWidget placement={widgetObj.placement} key={`topbar_widget_${idx}`} quotes={widgetObj.quotes} />;
      case 'call':
        return (
          <CallLinkWidget
            key={`topbar_widget_${idx}`}
            title={widgetObj.title}
            links={widgetObj.links}
            widgetObj={widgetObj}
          />
        );
      case 'file':
        return (
          <FileLinkWidget
            key={`topbar_widget_${idx}`}
            title={widgetObj.title}
            links={widgetObj.links}
            widgetObj={widgetObj}
          />
        );
      default:
        return null;
    }
  };

  return getTopWidgets().length > 0 ? (
    <ContentCard hasBackground={false}>
      <div className={`w-full h-auto min-h-16 flex`}>
        {getTopWidgets().map((widgetObj: Widget, idx: number) => {
          return (
            <div key={`topbar_widget_${idx}_parent`} className={`my-4 w-48 mr-4`}>
              {switchWidgets(widgetObj, idx)}
            </div>
          );
        })}
      </div>
    </ContentCard>
  ) : null;
};

export default TopWidgetBar;
