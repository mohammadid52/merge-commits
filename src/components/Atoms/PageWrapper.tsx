import {setPageTitle} from '@utilities/functions';
import React, {useEffect} from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  wrapClass?: string;
  defaultClass?: string;
  pageName?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = (pageWrapperProps: PageWrapperProps) => {
  const {
    children,
    wrapClass,
    defaultClass = 'px-4 white_back  overflow-hidden',
    pageName
  } = pageWrapperProps;

  useEffect(() => {
    pageName && setPageTitle(pageName);

    return () => {
      setPageTitle('');
    };
  }, [pageName]);

  return (
    <div className="px-2 py-8 md:px-4 lg:p-8">
      <div
        className={`w-full py-8 ${defaultClass} relative mb-0 ${
          wrapClass ? wrapClass : ''
        }`}>
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
