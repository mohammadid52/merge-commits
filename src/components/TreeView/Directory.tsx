import React, {useCallback, useState} from 'react';
import {useHistory} from 'react-router';
import {FaBook, FaGraduationCap, FaBookOpen} from 'react-icons/fa';
import {BsCircleFill, BsFillCaretDownFill, BsFillCaretRightFill} from 'react-icons/bs';
import {Transition} from '@headlessui/react';

import {Item} from './Item';
import {Tree} from './Tree';

export const Directory = ({
  activeSectionId,
  headingPrefix,
  hoverClassName,
  isOpen,
  item,
  onContextMenu,
  onItemClick,
  setShow,
  textClassName,
}: React.PropsWithChildren<{
  activeSectionId?: string;
  headingPrefix?: string;
  hoverClassName?: string;
  isOpen?: boolean;
  item: any;
  onContextMenu: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onItemClick?: (section: {id: string; title: string}) => void;
  setShow: (s: boolean) => void;
  textClassName?: string;
}>): JSX.Element => {
  const history = useHistory();
  const [toggle, setToggle] = useState<boolean>(isOpen || false);
  const onItemClicked = useCallback(
    (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      section: {id: string; title: string}
    ) => {
      console.log('onItemClicked');
      event.stopPropagation();
      console.log('after onItemClicked');
      setToggle((prevValue) => !prevValue);
      setShow(false);
      if (onItemClick) {
        onItemClick(section);
      }
      if (item.redirectionUrl) {
        history.push(item.redirectionUrl);
      }
    },
    []
  );

  return (
    <Item
      onClick={(e) => onItemClicked(e, {id: item.id, title: item.title})}
      onContextMenu={onContextMenu}>
      <span
        className={`hover:${hoverClassName || 'bg-gray-400'} ${
          activeSectionId === item.id ? hoverClassName || 'bg-gray-400' : ''
        } transition block pl-0 px-2 py-1 truncate flex`}>
        <span className="w-6 h-6 mx-1 inline-flex justify-center items-center">
          {item.type === 'list' ? (
            <BsCircleFill className="w-2 h-2" />
          ) : item.type === 'menu' ? (
            !toggle ? (
              <BsFillCaretRightFill />
            ) : (
              <BsFillCaretDownFill />
            )
          ) : item.type === 'course' ? (
            <FaGraduationCap />
          ) : item.type === 'syllabus' ? (
            <FaBook />
          ) : (
            <FaBookOpen />
          )}
        </span>
        <span>
          {headingPrefix} {item.title}
        </span>
      </span>
      <Transition
        show={toggle}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0">
        <Tree
          activeSectionId={activeSectionId}
          headingPrefix={headingPrefix}
          hoverClassName={hoverClassName}
          root={item}
          onItemClick={onItemClick}
          textClassName={textClassName}
        />
      </Transition>
    </Item>
  );
};
