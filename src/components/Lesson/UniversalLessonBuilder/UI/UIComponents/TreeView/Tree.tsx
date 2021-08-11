import React, {useCallback, useMemo, useState} from 'react';
import {Directory} from './Directory';
import {FaTasks} from 'react-icons/fa';
import {Item} from './Item';

import {RiPagesLine} from 'react-icons/ri';

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
  const [show, setShow] = useState<boolean>(false);
  const [position, setPosition] = useState<{x: number; y: number}>({x: 0, y: 0});

  const color_gen = useMemo(() => Math.floor(Math.random() * 16777215).toString(16), []);
  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
      event.stopPropagation();
      event.preventDefault();
      const {currentTarget} = event;
      setShow(true);
      setPosition({
        x: currentTarget.offsetTop,
        y: currentTarget.offsetLeft + 40,
      });
    },
    [setShow, setPosition]
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
      className={`border-l-2 space-y-3 border-green-500 p-2 pt-0 ml-2 mb-0 mt-0 pb-0 menu bg-default text-content-700 text-white`}>
      {root.children &&
        root.children.map((item: any, index: number) => {
          if (item.type !== 'pages')
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
              onContextMenu={onContextMenu}>
              <span
                className={`${
                  dark ? 'text-gray-900' : ''
                }  hover:bg-gray-200 transition-all p-2  truncate flex`}>
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
