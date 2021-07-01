import React from 'react';
import {useULBContext} from '../../../contexts/UniversalLessonBuilderContext';
import {UniversalLessonPage} from '../../../interfaces/UniversalLessonInterfaces';

interface PageWrapperProps {
  children?: React.ReactNode;
  // selectedPageDetails?: UniversalLessonPage;
}

export const LessonPageWrapper = (props: PageWrapperProps) => {
  const {children} = props;
  const {themeTextColor} = useULBContext();

  return (
    <div
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-30`}>
      <div className={`${themeTextColor}`}>{children}</div>
    </div>
  );
};
