import React from 'react';
import { Link, Widget } from '../../../interfaces/ClassroomComponentsInterfaces';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoCallOutline } from 'react-icons/all';

const responsiveClass = 'md:hidden lg:inline-block xl:inline-block';
const mobileShowClass = 'xs:inline-block md:inline-block lg:hidden xl:hidden';
const responsiveBarScalingAnimation = `transition-all duration-500 ease-in-out`;

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

  const getShortenedCallLabel = (url: string) => {
    if (url.includes('web.zoom')) {
      return {
        iconLabel: 'Zoom',
        joinLabel: 'Join Zoom Call',
      };
    }
    if (url.includes('meet.google')) {
      return {
        iconLabel: 'Meet',
        joinLabel: 'Join Meet Call',
      };
    }
    if (url.includes('teams.microsoft')) {
      return {
        iconLabel: 'Teams',
        joinLabel: 'Join Teams Call',
      };
    }
  };

  return (
    <div className={`p-2 mb-2 bg-white border border-dark-gray border-opacity-10`}>
      <div className={`${responsiveClass} `}>
        <div className={`flex flex-row p-2 text-sm font-semibold border-b border-dark-gray border-opacity-10`}>
          <span className={`w-full`}>{title}:</span>
          <span className={`w-auto mr-0`}>
            <IconContext.Provider value={{ className: 'w-auto ' }}>
              <IoCallOutline size={18} />
            </IconContext.Provider>
          </span>
        </div>
      </div>

      <div className={`${widgetObj.placement === 'sidebar' ? '' : 'flex'}`}>
        {links &&
          links.length > 0 &&
          links.map((link: Link, idx: number) => (
            <div className={`max-w-1/3`}>
              {/**
               * MOBILE VERSION WIDGET ICON
               */}
              <span className={`${mobileShowClass} w-full mr-0 mb-2 flex flex-col`}>
                <a
                  id={`links_${links.id}_mini`}
                  className={`text-xs font-semibold text-blueberry hover:underline`}
                  href={link.url}
                  target={`_blank`}>
                  <IconContext.Provider value={{ className: 'mx-auto' }}>
                    <IoCallOutline size={24} />
                  </IconContext.Provider>
                  <p className={`text-center`}>{getShortenedCallLabel(link.url).iconLabel}</p>
                </a>
              </span>

              {/**
               * WIDGET
               */}
              <div
                key={`links_${links.id}_idx`}
                className={`
              ${responsiveClass} 
              ${idx < links.length - 1 && widgetObj.placement === 'sidebar' ? 'border-b border-dark-gray border-opacity-10' : ''} 
              p-2 break-all`}>
                <p className={`text-sm font-semibold`}>{link.text}:</p>
                <a
                  id={`links_${links.id}_idx`}
                  className={`text-xs font-semibold text-blueberry hover:underline`}
                  href={link.url}
                  target={`_blank`}>
                  {link.url}
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
