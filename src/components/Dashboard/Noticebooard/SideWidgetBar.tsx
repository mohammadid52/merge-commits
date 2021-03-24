import React, { useContext, useEffect } from 'react';
import { DashboardProps } from '../Dashboard';

import { CallLinkWidget, DefaultTextWidget, ImageWidget, LogoWidget } from './Widgets';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { getAsset } from '../../../assets';
import { Widget } from '../../../interfaces/ClassroomComponentsInterfaces';
import { QuoteWidget } from './TopWidgets';
import { useWindowSize } from '../../../customHooks/windowSize';
import { FileLinkWidget } from './Widgets/FilesWidget';

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
        return <QuoteWidget key={`sidebar_widget_${idx}`} card={true} quotes={widgetObj.quotes} />;
      case 'call':
        return (
          <CallLinkWidget key={`sidebar_widget_${idx}`} card={true} title={widgetObj.title} links={widgetObj.links} widgetObj={widgetObj}/>
        );
      case 'file':
        return (
          <FileLinkWidget key={`sidebar_widget_${idx}`} card={true} title={widgetObj.title} links={widgetObj.links} widgetObj={widgetObj}/>
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
        <LogoWidget
          source={getAsset(clientKey, 'logo_symbol')}
          altdesc={`school-logo`}
          card={false}
          classProp={`w-16 h-auto mx-auto p-2 mb-2 bg-white`}
        />

        {/**
         * DYNAMIC MAP
         */}
        {
          state.roomData && state.roomData.widgets.length > 0 &&
          getSideWidgets().length > 0 &&
          getSideWidgets().map((widgetObj: Widget, idx: number) => {
            return switchWidgets(widgetObj, idx);
          })}

        {/**
         * FURTHER DEVELOPMENT
         *  TODO: This meme widget should be built
         *    out in the future
         */}
        {/*<ImageWidget
          source={`https://iconoclastimages141704-uat.s3.amazonaws.com/public/CurateImage.jpg`}
          altdesc={`fun-meme`}
          title={`Reflection`}
          card={true}
          classProp={`w-auto h-auto sm:hidden lg:visible`}
        />*/}
      </div>
    </>
  );
};

export default SideWidgetBar;
