import React, {useCallback, useMemo} from 'react';
import {Directory} from './Directory';
import {FaTasks} from 'react-icons/fa';
import {Item} from './Item';
import {useContextMenu} from '../../contexts/TreeContext';

export const Tree = ({root}: React.PropsWithChildren<{root: any}>): JSX.Element => {
  const {setShow, setPosition}: any = useContextMenu();
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
      setShow(false);
    },
    []
  );

  return (
    <ul
      style={{borderLeftColor: `#${color_gen}`, borderLeftWidth: 2}}
      className="p-2 pt-0 ml-2 mb-0 mt-0 pb-0 menu bg-default text-content-700 text-white">
      {root.children &&
        root.children.map((item: any, index: number) => {
          if (item.type !== 'pages')
            return (
              <Directory
                key={item.title}
                item={item}
                setShow={setShow}
                onContextMenu={onContextMenu}
              />
            );
          return (
            <Item key={item.title} onClick={onItemClicked} onContextMenu={onContextMenu}>
              <span className="hover:bg-gray-400 transition block pl-0 p-2 truncate flex">
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
