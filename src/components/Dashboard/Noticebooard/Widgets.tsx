import React from 'react';
import { Link, Widget } from '../../../interfaces/ClassroomComponentsInterfaces';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import {
  AiOutlineDropbox,
  AiOutlineFile,
  AiOutlineFileExcel,
  AiOutlineFileWord,
  AiOutlineFileZip,
} from 'react-icons/ai';
import { IoCallOutline } from 'react-icons/io5';
import { FaRegFilePowerpoint, GrDocumentWord, ImOnedrive } from 'react-icons/all';

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
    <div className={`p-2 mb-2 bg-white border border-dark-gray border-opacity-10`}>
      {title && (
        <p className={`${responsiveClass} text-sm p-2 font-semibold border-b border-dark-gray border-opacity-10`}>
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
    <div className={`p-2 mb-2 bg-white border border-dark-gray border-opacity-10`}>
      {title && <p className={`text-sm p-2 font-semibold border-b border-dark-gray border-opacity-10`}>{title}:</p>}
      <div className={`bg-white rounded`}>
        <img src={source} alt={altdesc} />
      </div>
    </div>
  );
};

export const DefaultTextWidget = (props: { title: string; content: string; card?: boolean; classProp?: string }) => {
  const { title, content, card, classProp } = props;
  return (
    <div className={`p-2 mb-2 bg-white border border-dark-gray border-opacity-10`}>
      <p className={`text-sm p-2 font-semibold border-b border-dark-gray border-opacity-10`}>{title}:</p>
      <div key={`teacher_side_note`} className={`${responsiveClass} p-2`}>
        <p className={`text-xs text-dark-gray`} dangerouslySetInnerHTML={{ __html: content }} />
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

  const getCallInfo = (url: string) => {
    if (url.includes('web.zoom')) {
      return {
        iconLabel: 'Zoom',
        iconUrl: 'https://selready.s3.us-east-2.amazonaws.com/zoom_icon.svg',
        joinLabel: 'Join Zoom Call',
      };
    } else if (url.includes('meet.google')) {
      return {
        iconLabel: 'Meet',
        iconUrl: 'https://selready.s3.us-east-2.amazonaws.com/meet_icon.svg',
        joinLabel: 'Join Meet Call',
      };
    } else if (url.includes('teams.microsoft')) {
      return {
        iconLabel: 'Teams',
        iconUrl: 'https://selready.s3.us-east-2.amazonaws.com/teams_icon.svg',
        joinLabel: 'Join Teams Call',
      };
    } else {
      return {
        iconLabel: 'Call',
        iconUrl: null,
        joinLabel: 'Join Call',
      };
    }
  };

  return (
    <div>
      <div className={`${responsiveClass} bg-medium-gray bg-opacity-80`}>
        <div className={`flex flex-row p-2 text-sm font-semibold border-b border-dark-gray border-opacity-10`}>
          <span className={`w-full text-white`}>{title}:</span>
        </div>
      </div>
      <div className={`p-2 mb-2 bg-white border border-dark-gray border-opacity-10`}>
        <div className={`${widgetObj.placement === 'sidebar' ? '' : 'flex'}`}>
          {links &&
            links.length > 0 &&
            links.map((link: Link, idx: number) => (
              <div
                className={`
            ${
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
            ))}
        </div>
      </div>
    </div>
  );
};

