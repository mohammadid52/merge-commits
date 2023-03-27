import React from 'react';

interface PageWrapperProps {
  children?: React.ReactNode;
  // selectedPageDetails?: UniversalLessonPage;
}

export const LessonPageWrapper = (props: PageWrapperProps) => {
  const {children} = props;

  return (
    <div className={`w-full  mt-4 flex flex-col justify-between items-center`}>
      <div className={`text-white w-full`}>{children}</div>
    </div>
  );
};
