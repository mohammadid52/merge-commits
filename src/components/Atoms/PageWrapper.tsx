import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  wrapClass?: string;
  defaultClass?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = (pageWrapperProps: PageWrapperProps) => {
  const { children, wrapClass, defaultClass = 'px-4 white_back' } = pageWrapperProps;
  return <div className={`w-full py-8 ${defaultClass} mb-0 ${wrapClass ? wrapClass : ''}`}>{children}</div>;
};

export default PageWrapper;
