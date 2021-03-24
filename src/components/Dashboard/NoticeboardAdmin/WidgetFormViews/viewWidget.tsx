import React, { useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import {Widget as NoticeboardWidgetMapItem} from '../../../../interfaces/ClassroomComponentsInterfaces';

// Standard widget card view
export const ViewModeView = (props: {widgetObj: NoticeboardWidgetMapItem}) => {
  const {widgetObj} = props;
  const { theme } = useContext(GlobalContext);
  return (
    <>
      {/**
       *  section: TOP INFO
       */}
      <div className={`flex pb-2 mb-2 border-b ${theme.lessonCard.border}`}>
        <span className={`text-left ${theme.lessonCard.subtitle}`}>
          Widget Status:
          {widgetObj.active ? (
            <span className="ml-2 text-xs font-semibold text-green-400">Active</span>
          ) : (
            <span className="ml-2 text-xs font-semibold text-gray-400">Inactive</span>
          )}
        </span>
        <span className={`text-right ${theme.lessonCard.subtitle}`}>Placement: {widgetObj.placement}</span>
      </div>
      {/**
       *  section: TITLE
       */}
      <div className={``}>
        <h4 className={`w-auto ${theme.lessonCard.title}`}>{widgetObj.title ? widgetObj.title : `Untitled widget`}</h4>
      </div>
      {/**
       *  section: DESCRIPTION
       */}
      {/*<div className={`overflow-ellipsis overflow-hidden ellipsis`}>
        {widgetObj.description ? widgetObj.description : `No description`}
      </div>*/}
    </>
  );
};
