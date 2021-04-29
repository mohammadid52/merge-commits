import {Link, Widget} from '../../../../interfaces/ClassroomComponentsInterfaces';
import React, {useContext} from 'react';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IoCallOutline} from 'react-icons/io5';
import {
  AiOutlineDropbox,
  AiOutlineFile,
  AiOutlineFileExcel,
  AiOutlineFileWord,
  AiOutlineFileZip,
} from 'react-icons/ai';
import {FaRegFilePowerpoint, ImOnedrive} from 'react-icons/all';

export const FileWidgetsSmall = (props: {classProp?: string; widgets?: Widget[]}) => {
  const {classProp, widgets} = props;
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
    <>
      {widgets.length > 0 ? (
        <div className={`grid grid-cols-3`}>
          {widgets.map((widgetObj: Widget, idx: number) => {
            return widgetObj.links.map((link: Link, idx1: number) => (
              <span
                key={`${widgetObj.id}_${idx}_${idx1}`}
                className={`w-full mr-0 mb-2 flex flex-col`}>
                <a
                  id={`links_${idx}_mini`}
                  className={`text-center text-gray-200 text-xs hover:underline`}
                  href={link.url}
                  target={`_blank`}>
                  {getFileInfo(link.url)?.icon === null ? (
                    <IconContext.Provider value={{className: 'mx-auto my-2'}}>
                      <AiOutlineFile size={24} />
                    </IconContext.Provider>
                  ) : (
                    <IconContext.Provider value={{className: 'mx-auto my-2'}}>
                      {getFileInfo(link.url)?.icon}
                    </IconContext.Provider>
                  )}
                  <p className={`text-center text-gray-200 text-xs`}>
                    {getFileInfo(link.url)?.downloadLabel}
                  </p>
                </a>
              </span>
            ));
          })}
        </div>
      ) : (
        <div className="truncate inline-flex items-center p-2 mb-2 border-0 border-dashed border-gray-600 text-gray-200 shadow-sm text-xs font-medium rounded">
          No file links
        </div>
      )}
    </>
  );
};