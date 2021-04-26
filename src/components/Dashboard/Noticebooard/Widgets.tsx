import React, { useContext } from 'react';
import { Link, Widget } from '../../../interfaces/ClassroomComponentsInterfaces';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoCallOutline } from 'react-icons/io5';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

export const responsiveClass = 'md:hidden lg:inline-block xl:inline-block';
export const mobileShowClass = 'xs:inline-block md:inline-block lg:hidden xl:hidden';
export const responsiveBarScalingAnimation = `transition-all duration-500 ease-in-out`;

export const LogoWidget = (props: {
  source: string;
  altdesc?: string;
  title?: string;
  card?: boolean;
  classProp?: string;
}) => {
  const { source, altdesc, title, card, classProp } = props;
  return (
    <div className={`p-2 mb-4 shadow bg-white rounded`}>
      {title && (
        <p className={`${responsiveClass} text-sm p-2 font-semibold border-b-0 border-dark-gray border-opacity-10`}>
          {title}:
        </p>
      )}
      <div className={`w-full h-16 bg-white rounded`}>
        <img className={`object-contain h-16`} src={source} alt={altdesc} />
      </div>
    </div>
  );
};

export const ImageWidget = (props: {
  source: string;
  altdesc?: string;
  title?: string;
  card?: boolean;
  classProp?: string;
}) => {
  const { source, altdesc, title, card, classProp } = props;
  return (
    <div className={`p-2 mb-4 bg-white  border-0 border-dark-gray border-opacity-10`}>
      {title && <p className={`text-sm p-2 font-semibold border-b-0 border-dark-gray border-opacity-10`}>{title}:</p>}
      <div className={`bg-white rounded`}>
        <img src={source} alt={altdesc} />
      </div>
    </div>
  );
};

export const DefaultTextWidget = (props: { title: string; content: string; card?: boolean; classProp?: string }) => {
  const { title, content, card, classProp } = props;
  return (
    <div className="p-2 bg-white shadow rounded-lg">
      <p className={`text-sm p-2 font-semibold border-b-0 text-gray-900 border-gray-200`}>{title}</p>
      <div key={`teacher_side_note`} className={`${responsiveClass} p-2`}>
        <p className={`text-xs text-gray-800`} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export const CallLinkWidget = (props: {
  title: string;
  links: Link;
  card?: boolean;
  classProp?: string;
  widgetObj?: Widget;
}) => {
  const { title, links, card, classProp, widgetObj } = props;
  const { clientKey, userLanguage } = useContext(GlobalContext);
  const { noticeboardDict } = useDictionary(clientKey);

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
    <div>
      <div className={`mb-2  ${responsiveClass}`}>
        <span className={`text-gray-400 w-full font-semibold text-sm`}>{title}</span>
      </div>
      <div style={{ minHeight: 90 }} className={`p-3 bg-white shadow rounded-lg flex items-center justify-center`}>
        <div className={`${widgetObj.placement === 'sidebar' ? '' : 'flex'}`}>
          {links &&
            links.length > 0 &&
            links.map((link: Link, idx: number) => {
              getOG(link.url);
              return (
                <div
                  key={`${widgetObj.id}_${idx}`}
                  className={` ${
                    idx < links.length - 1 && widgetObj.placement === 'sidebar'
                      ? 'border-b border-dark-gray border-opacity-10'
                      : ''
                  } 
                  max-w-1/3
                  `}>
                  {/**
                   * MOBILE VERSION WIDGET ICON
                   */}
                  <span className={`w-full mr-0 mb-2 flex flex-col`}>
                    <a
                      id={`links_${links.id}_mini`}
                      className={`text-xs font-semibold text-blueberry hover:underline`}
                      href={link.url}
                      target={`_blank`}>
                      {getCallInfo(link.url)?.iconUrl === null ? (
                        <IconContext.Provider value={{ className: 'mx-auto my-2' }}>
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
                      <p className={`${responsiveClass} text-center`}>{getCallInfo(link.url)?.joinLabel}</p>
                    </a>
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
