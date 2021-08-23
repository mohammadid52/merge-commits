import React, {useCallback, useState} from 'react';
import {Transition} from '@headlessui/react';
import {FaBook, FaGraduationCap, FaBookOpen} from 'react-icons/fa';

import {Item} from './Item';
import {Tree} from './Tree';

export const Directory = ({
  item,
  onContextMenu,
  setShow,
}: React.PropsWithChildren<{
  item: any;
  onContextMenu: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  setShow: (s: boolean) => void;
}>): JSX.Element => {
  const [toggle, setToggle] = useState<boolean>(false);
  const onItemClicked = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
      console.log('onItemClicked');
      event.stopPropagation();
      console.log('after onItemClicked');
      setToggle(prevValue => !prevValue);
      setShow(false);
    },
    []
  );
  console.log(item, 'item.type', toggle);

  return (
    <Item onClick={onItemClicked} onContextMenu={onContextMenu}>
      <span className="hover:bg-gray-400 transition block pl-0 p-2 truncate flex">
        <span className="w-6 h-6 mx-1 inline-flex items-center">
          {item.type === 'course' ? (
            <FaGraduationCap />
          ) : item.type === 'syllabus' ? (
            <FaBook />
          ) : (
            <FaBookOpen />
          )}
        </span>
        <span>{item.title}</span>
      </span>
      <Transition
        show={toggle}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0">
        <Tree root={item} />
      </Transition>
    </Item>
  );
};
