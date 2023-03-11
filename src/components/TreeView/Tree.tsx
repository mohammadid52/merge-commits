import { useContextMenu } from "contexts/TreeContext";
import React, { useCallback } from "react";
import { FaTasks } from "react-icons/fa";
import { Directory } from "./Directory";
import { Item } from "./Item";

export const Tree = ({
  activeSectionId,
  headingPrefix,
  hoverClassName,
  onItemClick,
  root,
  textClassName,
}: React.PropsWithChildren<{
  activeSectionId?: string;
  headingPrefix?: string;
  hoverClassName?: string;
  onItemClick?: (section: {
    id: string;
    title: string;
    redirectionUrl: string;
  }) => void;
  root: any;
  textClassName?: string;
}>): JSX.Element => {
  const { setShow, setPosition }: any = useContextMenu();

  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
      event.stopPropagation();
      event.preventDefault();
      const { currentTarget } = event;
      setShow(true);
      setPosition({
        x: currentTarget.offsetTop,
        y: currentTarget.offsetLeft + 40,
      });
    },
    [setShow, setPosition]
  );

  const onItemClicked = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    section: any
  ) => {
    event.stopPropagation();
    setShow(false);
    if (onItemClick) {
      onItemClick({
        id: section.id,
        title: section.title,
        redirectionUrl: section.redirectionUrl,
      });
    }
  };

  return (
    <ul
      // style={{borderLeftColor: `#${color_gen}`, borderLeftWidth: 2}}
      className={`p-2 pt-0 ml-2 mb-0 mt-0 pb-0 menu bg-default text-content-700 text-white ${
        textClassName || "text-white"
      }`}
    >
      {root.children &&
        root.children.map((item: any, index: number) => {
          if (item.type !== "pages")
            return (
              <Directory
                activeSectionId={activeSectionId}
                headingPrefix={[headingPrefix, index + 1]
                  .filter(Boolean)
                  .join(".")}
                hoverClassName={hoverClassName}
                key={item.title}
                item={item}
                setShow={setShow}
                onContextMenu={onContextMenu}
                onItemClick={onItemClick}
                textClassName={textClassName}
                isOpen={index === 0 ? true : false}
              />
            );
          return (
            <Item
              key={item.title}
              onClick={(e) => onItemClicked(e, item)}
              onContextMenu={onContextMenu}
            >
              <span className="hover:bg-gray-400 transition  pl-0 p-2 truncate flex">
                <span className="w-6 h-6 mx-1 inline-flex items-center">
                  <FaTasks />
                </span>
                <span>{item.title}</span>
              </span>
            </Item>
          );
        })}
    </ul>
  );
};
