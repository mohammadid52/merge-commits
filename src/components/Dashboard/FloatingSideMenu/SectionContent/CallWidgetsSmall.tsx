import {Link, Widget} from '../../../../interfaces/ClassroomComponentsInterfaces';
import React, {useContext} from 'react';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IoCallOutline} from 'react-icons/io5';
import {responsiveClass} from '../../Noticebooard/Widgets';

export const CallWidgetsSmall = (props: {classProp?: string; widgets?: Widget[]}) => {
  const {classProp, widgets} = props;
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {noticeboardDict} = useDictionary(clientKey);

  const getCallInfo = (url: string) => {
    if (url.includes('web.zoom')) {
      return {
        iconLabel: 'Zoom',
        iconUrl: 'https://selready.s3.us-east-2.amazonaws.com/zoom_icon.svg',
        joinLabel: noticeboardDict[userLanguage].JOIN_CALL.ZOOM,
      };
    } else if (url.includes('meet.google')) {
      return {
        iconLabel: 'Meet',
        iconUrl: 'https://selready.s3.us-east-2.amazonaws.com/meet_icon.svg',
        joinLabel: noticeboardDict[userLanguage].JOIN_CALL.MEET,
      };
    } else if (url.includes('teams.microsoft')) {
      return {
        iconLabel: 'Teams',
        iconUrl: 'https://selready.s3.us-east-2.amazonaws.com/teams_icon.svg',
        joinLabel: noticeboardDict[userLanguage].JOIN_CALL.TEAMS,
      };
    } else {
      return {
        iconLabel: 'Call',
        iconUrl: null,
        joinLabel: noticeboardDict[userLanguage].JOIN_CALL.DEFAULT,
      };
    }
  };

  const getOG = async (url: string) => {
    // fetching here...
  };

  return (
    <>
      {widgets.length > 0 ? (
        widgets.map((widgetObj: Widget, idx: number) => {
          return widgetObj.links.map((link: Link, idx1: number) => (
            <div key={`${widgetObj.id}_${idx}_${idx1}`}>
              {/**
               * MOBILE VERSION WIDGET ICON
               */}
              <span className={`w-full mr-0 mb-2 flex flex-col`}>
                <a
                  id={`links_${idx}_mini`}
                  className={`text-center text-gray-200 text-xs hover:underline`}
                  href={link.url}
                  target={`_blank`}>
                  {getCallInfo(link.url)?.iconUrl === null ? (
                    <IconContext.Provider value={{className: 'mx-auto my-2'}}>
                      <IoCallOutline size={24} />
                    </IconContext.Provider>
                  ) : (
                    <div className={`w-8 h-8 mx-auto my-2`}>
                      <img
                        className={`pointer-events-none`}
                        src={getCallInfo(link.url)?.iconUrl}
                        alt={`call_link_icon`}
                      />
                    </div>
                  )}
                  <p className={`text-center text-gray-200 text-xs`}>
                    {getCallInfo(link.url)?.joinLabel}
                  </p>
                </a>
              </span>
            </div>
          ));
        })
      ) : (
        <div className="truncate inline-flex items-center p-2 mb-2 border-0 border-dashed border-gray-600 text-gray-200 shadow-sm text-xs font-medium rounded">
          No call links
        </div>
      )}
    </>
  );
};