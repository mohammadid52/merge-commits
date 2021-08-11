import React, {useCallback, useState} from 'react';
import {Transition} from '@headlessui/react';
import {FaBook, FaGraduationCap, FaBookOpen} from 'react-icons/fa';

import {Item} from './Item';
import {Tree} from './Tree';
import {RiPagesLine} from 'react-icons/ri';
import {CheckCircleIcon} from '@heroicons/react/outline';
import {AiFillCopy} from 'react-icons/ai';

export const Directory = ({
  item,
  onContextMenu,
  setShow,
  dark = false,
  customClick = false,
  onClick = () => {},
  selPageId,
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
  const onItemClicked = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>, item?: any) => {
      event.stopPropagation();
      if (item.type === 'page') {
        onClick(item.id, item.lessonId);
      }
      setToggle((prevValue) => !prevValue);
      if (setShow) {
        setShow(false);
      }
    },
    []
  );

  return (
    <Item onClick={(e) => onItemClicked(e, item)} onContextMenu={onContextMenu}>
      <span
        className={`${
          dark ? 'text-gray-900' : ''
        } hover:bg-gray-200 rounded-md transition-all p-3 truncate flex items-center justify-between`}>
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
          <span className="w-auto">
            {item.id === selPageId && (
              <AiFillCopy className="h-5 w-5 text-green-400" aria-hidden="true" />
            )}
          </span>
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
