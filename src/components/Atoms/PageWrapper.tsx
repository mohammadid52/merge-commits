import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  wrapClass?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = (pageWrapperProps: PageWrapperProps) => {
  const { children, wrapClass } = pageWrapperProps;
  return <div className={`w-full py-8 px-4 white_back mb-0 ${wrapClass ? wrapClass : ''}`}>{children}</div>;
};

export default PageWrapper;
