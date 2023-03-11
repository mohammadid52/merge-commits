import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";
import { Link, Widget } from "interfaces/ClassroomComponentsInterfaces";
import {
  AiOutlineDropbox,
  AiOutlineFile,
  AiOutlineFileExcel,
  AiOutlineFileWord,
  AiOutlineFileZip,
} from "react-icons/ai";
import { FaRegFilePowerpoint, ImOnedrive } from "react-icons/all";
import { IconContext } from "react-icons/lib/esm/iconContext";
import { responsiveClass } from "../Widgets";

export const FileLinkWidget = (props: {
  title: string;
  links: Link;
  card?: boolean;
  classProp?: string;
  widgetObj?: Widget;
}) => {
  const { title, links, widgetObj } = props;
  const { userLanguage } = useGlobalContext();
  const { noticeboardDict } = useDictionary();

  const getFileInfo = (url: string) => {
    if (url.includes("document") || url.includes("word")) {
      return {
        iconLabel: "Document",
        icon: <AiOutlineFileWord size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes("spreadsheet") || url.includes("excel")) {
      return {
        iconLabel: "Spreadsheet",
        icon: <AiOutlineFileExcel size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes("powerpoint") || url.includes("presentation")) {
      return {
        iconLabel: "Spreadsheet",
        icon: <FaRegFilePowerpoint size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes(".zip")) {
      return {
        iconLabel: "Archive",
        icon: <AiOutlineFileZip size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes("1drv") || url.includes("onedrive")) {
      return {
        iconLabel: "Onedrive",
        icon: <ImOnedrive size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else if (url.includes("dropbox")) {
      return {
        iconLabel: "Dropbox",
        icon: <AiOutlineDropbox size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    } else {
      return {
        iconLabel: "File",
        icon: <AiOutlineFile size={24} />,
        downloadLabel: noticeboardDict[userLanguage].DOWNLOAD,
      };
    }
  };

  return (
    <div>
      <div className={`${responsiveClass} mb-2`}>
        <span className={`text-gray-400 w-full font-semibold text-sm`}>
          {title}
        </span>
      </div>
      <div className="p-3 bg-white shadow rounded-lg flex items-center justify-center">
        <div className={`${widgetObj?.placement === "sidebar" ? "" : "flex"}`}>
          {links &&
            links.length > 0 &&
            links.map((link: Link, idx: number) => (
              <div
                key={`${widgetObj?.id}_${idx}`}
                className={`
            ${
              idx < links.length - 1 && widgetObj?.placement === "sidebar"
                ? "border-b border-dark-gray border-opacity-10"
                : ""
            } 
              max-w-1/3
            `}
              >
                {/**
                 * MOBILE VERSION WIDGET ICON
                 */}
                <span className={`w-full mr-0 mb-2 flex flex-col`}>
                  <p className={`${responsiveClass} mt-2 text-center text-xs`}>
                    {link.text}
                  </p>
                  <a
                    id={`links_${links.id}_mini`}
                    className={`text-xs font-semibold text-blueberry hover:underline`}
                    href={link.url}
                    target={`_blank`}
                  >
                    {getFileInfo(link?.url || "")?.icon === null ? (
                      <IconContext.Provider
                        value={{ className: "mx-auto my-2" }}
                      >
                        <AiOutlineFile size={24} />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider
                        value={{ className: "mx-auto my-2" }}
                      >
                        {getFileInfo(link?.url || "")?.icon}
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
