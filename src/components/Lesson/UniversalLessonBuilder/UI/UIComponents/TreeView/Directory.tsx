import {Transition} from '@headlessui/react';
import React, {useState} from 'react';
import {FaBook, FaBookOpen, FaGraduationCap} from 'react-icons/fa';

import Buttons from 'atoms/Buttons';
import {RiPagesLine} from 'react-icons/ri';
import {Item} from './Item';
import {Tree} from './Tree';

export const Directory = ({
  item,
  onContextMenu,
  setShow,
  dark = false,
  customClick = false,
  onClick = () => {},
  selPageId
}: React.PropsWithChildren<{
  item: any;
  onContextMenu: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  setShow: (s: boolean) => void;
  onClick: (id: string, lessonId: string) => void;
  dark?: boolean;
  customClick?: boolean;
  selPageId?: string;
}>): JSX.Element => {
  const [toggle, setToggle] = useState<boolean>(false);
  const onItemClicked = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item?: any
  ) => {
    event.stopPropagation();

    onClick(item.id, item.lessonId);
  };

  const _toggle = (e: any) => {
    e.stopPropagation();
    console.log(item.type);
    if (item.type !== 'page') {
      setToggle((prevValue) => !prevValue);
      if (setShow) {
        setShow(false);
      }
    }
  };

  return (
    <Item onClick={_toggle} onContextMenu={onContextMenu}>
      <span
        className={`${
          dark ? 'text-darkest' : ''
        } hover:bg-lightest rounded-md transition-all p-3 truncate flex items-center justify-between`}>
        <div className="flex items-center">
          <span className="w-6 h-6 mx-1 inline-flex items-center">
            {item.type === 'course' ? (
              <FaGraduationCap />
            ) : item.type === 'lesson' ? (
              <FaBook />
            ) : item.type === 'page' ? (
              <RiPagesLine />
            ) : (
              <FaBookOpen />
            )}
          </span>
          <span>{item.title}</span>
        </div>

        {item.type === 'page' ? (
          <Buttons label="Select this" onClick={(e) => onItemClicked(e, item)} />
        ) : (
          <div className="w-auto" />
        )}
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
          customClick={customClick}
          selPageId={selPageId}
          onClick={onClick}
          root={item}
          dark={dark}
        />
      </Transition>
    </Item>
  );
};
