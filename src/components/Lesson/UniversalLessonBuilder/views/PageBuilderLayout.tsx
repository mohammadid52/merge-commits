import {classNames} from '@UlbUI/FormElements/TextInput';
import React from 'react';

const PageBuilderLayout = ({
  children,
  open,
  width = '28rem',
  style,
  className = '',
  overflowHidden = true,
}: {
  children: React.ReactNode;
  open: boolean;
  style?: any;
  width?: string;
  className?: string;
  overflowHidden?: boolean;
}) => {
  return (
    <div
      style={{
        zIndex: 9990,
        maxWidth: open ? width : '0rem',
        minWidth: open ? width : '0rem',
        ...style,
      }}
      className={classNames(
        overflowHidden ? '' : 'overflow-y-scroll dark-scroll',
        open ? 'translate-x-0 ' : 'translate-x-full',
        'p-8 transform  transition-all duration-300 rounded-lg absolute right-0 inset-y-0 break-normal h-full bg-gray-100 dark:bg-gray-800 w-96 border-l-0 border-gray-200 dark:border-gray-700 shadow-lg'
      )}>
      {children}
    </div>
  );
};

export default PageBuilderLayout;
