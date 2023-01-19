import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React, {useRef} from 'react';
import ClickAwayListener from 'react-click-away-listener';

interface IBriefPopover {
  show: boolean;
  clear: () => void;
  isLast: boolean;
  header?: string;
  children: React.ReactNode;
  idx?: number;
}

const BriefPopover = ({
  show,
  clear,
  idx = 0,
  isLast,
  header,
  children
}: IBriefPopover) => {
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
              top: isLast ? '-18rem' : '0rem',
              bottom: isLast ? 'unset' : '1.5rem',
              right: '-90%',
              zIndex: 99999999
            }}
            className="absolute z-max hidden md:block cursor-pointer select-none text-black">
            <div
              style={{zIndex: 9999}}
              className="bg-gray-200  relative flex flex-col border-white border-4 rounded-xl  customShadow  min-w-104 max-w-104 w-auto">
              {header && (
                <div className="theme-bg text-white rounded-t-xl px-4 py-2">
                  <h1 className="text-lg text-center tracking-wider font-medium uppercase text-white">
                    {header}
                  </h1>
                </div>
              )}
              <div className="p-4 z-max">{children}</div>
            </div>
          </div>
        </ClickAwayListener>
      )}
    </AnimatedContainer>
  );
};

export default BriefPopover;
