import {Transition} from '@headlessui/react';
import React from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {children, setState} from 'interfaces';

interface IPopOver {
  show: boolean;
  setShow: setState['boolean'];
  children: children;
  className?: string;
  content: children;
  containerClass?: string;
  padding?: number;
  /**
   * Tailwind classes
   * 1 = 1rem
   */
  right?: number;
  /**
   * Tailwind classes
   */
  minHeight?: number | string;
  /**
   * Tailwind classes
   */
  minWidth?: number | string;
  bottom?: number;
  dir?: 'top' | 'bottom';
  rounded?: string;
}

const Popover = ({
  show,
  containerClass = 'bg-white border-gray-200',
  padding = 4,
  minHeight = 32,
  minWidth = 140,
  setShow,
  children,
  right = 1,
  bottom = 1.5,
  dir = 'bottom',
  className,
  content,
  rounded = 'xl'
}: IPopOver) => {
  const dynamicDir = {
    [dir]: `${bottom}rem`
  };

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        className={`relative ${className}`}>
        {children}
        <div onClick={(e: any) => e.stopPropagation()}>
          <Transition
            enter="transform transition ease-in-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            style={{...dynamicDir}}
            className={`${containerClass} z-100 w-auto  select-none ${
              rounded ? `rounded-${rounded}` : 'rounded'
            } customShadow absolute right-${right} border-0  min-h-${minHeight} min-w-${minWidth} p-${padding}`}
            show={show}>
            {content}
          </Transition>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default Popover;
