import {classNames} from '@UlbUI/FormElements/TextInput';
import React from 'react';

const PageBuilderLayout = ({
  children,
  open,
  width = '28rem',
  style,
  className = '',
  overflowHidden = true,
  dark = true,
  rounded = 'rounded-lg',
}: {
  children: React.ReactNode;
  open: boolean;
  style?: any;
  width?: string;
  className?: string;
  overflowHidden?: boolean;
  rounded?: string;

  dark?: boolean;
}) => {
  return (
    <div
      style={{
        zIndex: 9990,

        ...style,
      }}
      id="scrollingDiv"
      className={classNames(
        rounded,
        overflowHidden ? '' : `overflow-y-scroll ${dark ? 'dark-scroll' : ''}`,
        open ? 'translate-x-0 ' : 'translate-x-full',
        'transform max-w-80 min-w-80 lg:max-w-112 lg:min-w-112   transition-all duration-300 absolute right-0 inset-y-0 break-normal  overlfow-y-hidden bg-gray-100 dark:bg-gray-800 w-96 border-l-0 border-gray-200 dark:border-gray-700 shadow-lg'
      )}>
      {children}
    </div>
  );
};

export default PageBuilderLayout;
