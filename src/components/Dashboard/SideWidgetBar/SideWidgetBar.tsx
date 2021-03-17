import React, { useContext } from 'react';
import { DashboardProps } from '../Dashboard';

import { CallLinkWidget, DefaultTextWidget, ImageWidget } from './Widgets';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { getAsset } from '../../../assets';
import { Widget } from '../../../interfaces/ClassroomComponentsInterfaces';
import { QuoteWidget } from '../TopWidgetBar/TopWidgets';

const SideWidgetBar = (props: DashboardProps) => {
  const { currentPage, setVisibleLessonGroup } = props;
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
        return <QuoteWidget key={`sidebar_widget_${idx}`} quotes={widgetObj.quotes} />;
      case 'call':
        return <CallLinkWidget key={`sidebar_widget_${idx}`} title={widgetObj.title} links={widgetObj.links}/>
      default:
        return null;
    }
  };

  return (
    <div id={`sideWidgetBar`} className={`w-2/10 max-w-80 min-w-48`}>
      {/**
       * STATIC INSTITUTE LOGO
       */}
      <ImageWidget
        source={getAsset(clientKey, 'logo_symbol')}
        altdesc={`school-logo`}
        card={false}
        classProp={`w-16 h-auto mx-auto`}
      />

      {/**
       * DYNAMIC MAP
       */}
      {getSideWidgets().length > 0 &&
        getSideWidgets().map((widgetObj: Widget, idx: number) => {
          return switchWidgets(widgetObj, idx);
        })}

      {/**
       * FURTHER DEVELOPMENT
       */}
      <ImageWidget
        source={`https://iconoclastimages141704-uat.s3.amazonaws.com/public/CurateImage.jpg`}
        altdesc={`fun-meme`}
        title={`Reflection`}
        card={true}
        classProp={`w-auto h-auto`}
      />
    </div>
  );
};

export default SideWidgetBar;
