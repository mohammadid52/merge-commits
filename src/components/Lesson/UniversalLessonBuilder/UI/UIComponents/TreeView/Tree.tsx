import React, { useCallback, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { Directory } from "./Directory";
import { Item } from "./Item";

export const Tree = ({
  root,
  dark = false,
  onClick = () => {},
  customClick = false,
  selPageId,
}: React.PropsWithChildren<{
  root: any;
  dark?: boolean;
  onClick?: any;
  selPageId?: string;
  customClick?: boolean;
}>): JSX.Element => {
  const [_, setShow] = useState<boolean>(false);

  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
      event.stopPropagation();
      event.preventDefault();
    },
    []
  );

  const onItemClicked = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      event.stopPropagation();

      if (setShow) {
        setShow(false);
      }
    },
    []
  );

  return (
    <ul
      className={`border-l-2 space-y-3 border-green-500 p-2 pt-0 ml-2 mb-0 mt-0 pb-0 menu bg-default text-content-700 text-white`}
    >
      {root.children &&
        root.children.map((item: any) => {
          if (item.type !== "pages")
            return (
              <Directory
                key={item.id || item.title}
                item={item}
                onClick={onClick}
                selPageId={selPageId}
                setShow={setShow}
                onContextMenu={onContextMenu}
                dark={dark}
                customClick={customClick}
              />
            );
          return (
            <Item
              // @ts-ignore
              dark={dark}
              key={item.id || item.title}
              onClick={onItemClicked}
              onContextMenu={onContextMenu}
            >
              <span
                className={`${
                  dark ? "text-gray-900" : ""
                }  hover:bg-gray-200 transition-all p-2  truncate flex`}
              >
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
