import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode
  wrapClass?: string
}

const PageWrapper: React.FC<PageWrapperProps> = (pageWrapperProps: PageWrapperProps) => {
  const { children, wrapClass } = pageWrapperProps
  return (
    <div className={`w-full p-8 white_back mb-8 ${wrapClass ? wrapClass : ''}`}>
      {children}
    </div>
  )
}

export default PageWrapper