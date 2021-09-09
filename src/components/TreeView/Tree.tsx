import React, {useCallback, useMemo} from 'react';
import {FaTasks} from 'react-icons/fa';
import {useHistory} from 'react-router';
import {Directory} from './Directory';
import {Item} from './Item';
import {useContextMenu} from '../../contexts/TreeContext';

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
  onItemClick?: (section: {id: string; title: string}) => void;
  root: any;
  textClassName?: string;
}>): JSX.Element => {
  const history = useHistory();
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
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>, section: any) => {
      event.stopPropagation();
      setShow(false);
      if (!section.children?.length && onItemClick) {
        onItemClick({id: section.id, title: section.title});
      }
      if (section.redirectionUrl) {
        history.push(section.redirectionUrl);
      }
    },
    []
  );

  return (
    <ul
      // style={{borderLeftColor: `#${color_gen}`, borderLeftWidth: 2}}
      className={`p-2 pt-0 ml-2 mb-0 mt-0 pb-0 menu bg-default text-content-700 text-white ${
        textClassName || 'text-white'
      }`}>
      {root.children &&
        root.children.map((item: any, index: number) => {
          if (item.type !== 'pages')
            return (
              <Directory
                activeSectionId={activeSectionId}
                headingPrefix={[headingPrefix, index + 1].filter(Boolean).join('.')}
                hoverClassName={hoverClassName}
                key={item.title}
                item={item}
                setShow={setShow}
                onContextMenu={onContextMenu}
                onItemClick={onItemClick}
                textClassName={textClassName}
              />
            );
          return (
            <Item
              key={item.title}
              onClick={(e) => onItemClicked(e, item)}
              onContextMenu={onContextMenu}>
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
