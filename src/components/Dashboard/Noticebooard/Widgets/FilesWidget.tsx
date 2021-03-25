import { Link, Widget } from '../../../../interfaces/ClassroomComponentsInterfaces';
import {
  AiOutlineDropbox,
  AiOutlineFile,
  AiOutlineFileExcel,
  AiOutlineFileWord,
  AiOutlineFileZip,
} from 'react-icons/ai';
import { FaRegFilePowerpoint, ImOnedrive } from 'react-icons/all';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import React, { useContext } from 'react';
import { responsiveClass } from '../Widgets';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';

export const FileLinkWidget = (props: {
  title: string;
  links: Link;
  card?: boolean;
  classProp?: string;
  widgetObj?: Widget;
}) => {
  const { title, links, classProp, widgetObj } = props;
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {noticeboardDict} = useDictionary(clientKey);

  const getFileInfo = (url: string) => {
    if (url.includes('document') || url.includes('word')) {
      return {
        iconLabel: 'Document',
        icon: <AiOutlineFileWord size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes('spreadsheet') || url.includes('excel')) {
      return {
        iconLabel: 'Spreadsheet',
        icon: <AiOutlineFileExcel size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes('powerpoint') || url.includes('presentation')) {
      return {
        iconLabel: 'Spreadsheet',
        icon: <FaRegFilePowerpoint size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes('.zip')) {
      return {
        iconLabel: 'Archive',
        icon: <AiOutlineFileZip size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes('1drv') || url.includes('onedrive')) {
      return {
        iconLabel: 'Onedrive',
        icon: <ImOnedrive size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes('dropbox')) {
      return {
        iconLabel: 'Dropbox',
        icon: <AiOutlineDropbox size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else {
      return {
        iconLabel: 'File',
        icon: <AiOutlineFile size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
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
                  <p className={`${responsiveClass} mt-2 text-center text-xs`}>{link.text}</p>
                  <a
                    id={`links_${links.id}_mini`}
                    className={`text-xs font-semibold text-blueberry hover:underline`}
                    href={link.url}
                    target={`_blank`}>
                    {getFileInfo(link.url)?.icon === null ? (
                      <IconContext.Provider value={{ className: 'mx-auto my-2' }}>
                        <AiOutlineFile size={24} />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider value={{ className: 'mx-auto my-2' }}>
                        {getFileInfo(link.url)?.icon}
                      </IconContext.Provider>
                    )}
                  </a>
                </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
