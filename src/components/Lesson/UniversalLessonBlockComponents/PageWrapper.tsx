import React from 'react';
import { UniversalLessonPage } from '../../../interfaces/UniversalLessonInterfaces';

interface PageWrapperProps {
  children?: React.ReactNode;
  selectedPageDetails?: UniversalLessonPage;
}

export const PageWrapper = (props: PageWrapperProps) => {
  const { children, selectedPageDetails } = props;

  return (
    <div className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-50`}>
      <div className={`text-white`}>
        <p>ID: {selectedPageDetails?.id}</p>
        <p>TITLE: {selectedPageDetails?.title}</p>
        <p>DESC: {selectedPageDetails?.description}</p>
        <p>CLASS: {selectedPageDetails?.class}</p>
        {children}
      </div>
    </div>
  );
};
