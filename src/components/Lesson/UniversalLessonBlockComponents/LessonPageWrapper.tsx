import React, {useContext} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';

interface PageWrapperProps {
  children?: React.ReactNode;
  // selectedPageDetails?: UniversalLessonPage;
}

export const LessonPageWrapper = (props: PageWrapperProps) => {
  const {children} = props;
  const {
    state: {lessonPage: {themeTextColor = ''} = {}}
  } = useContext(GlobalContext);

  return (
    <div className={`w-full  mt-4 flex flex-col justify-between items-center`}>
      <div className={`text-white`}>{children}</div>
    </div>
  );
};
