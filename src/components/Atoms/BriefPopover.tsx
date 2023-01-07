import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {Transition} from '@headlessui/react';
import React, {useRef} from 'react';
import ClickAwayListener from 'react-click-away-listener';

interface IBriefPopover {
  show: boolean;
  clear: () => void;
  isLast: boolean;
  header?: string;
  children: React.ReactNode;
}

const BriefPopover = ({show, clear, isLast, header, children}: IBriefPopover) => {
  const ref = useRef();
  return (
    <AnimatedContainer
      className="z-max relative bg-white"
      animationType="scale"
      zIndex={99999999}
      show={Boolean(show)}>
      {Boolean(show) && (
        <ClickAwayListener onClickAway={() => clear()}>
          <div
            style={{
              top: isLast ? '-5rem' : '0rem',
              bottom: isLast ? 'unset' : '1.5rem',
              right: '-90%',
              zIndex: 99999999
            }}
            className="absolute z-max hidden md:block cursor-pointer select-none text-black">
            <div
              style={{zIndex: 9999}}
              className="bg-white relative flex flex-col border-gray-200 rounded-xl  customShadow border-0 p-4  min-w-96 max-w-96 w-auto">
              {header && (
                <>
                  <h1 className="text-base text-gray-700 mb-2">{header}</h1>
                  <hr />
                </>
              )}

              {children}
            </div>
          </div>
        </ClickAwayListener>
      )}
    </AnimatedContainer>
  );
};

export default BriefPopover;
