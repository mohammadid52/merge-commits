import React, {useState} from 'react';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import ErrorBoundary from '../../../Error/ErrorBoundary';
// import ThemeModal from '@molecules/ThemeModal';

import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import LessonRowComposer from './CoreUniversalLesson/LessonRowComposer';

const CoreUniversalLesson = () => {
  const isInLesson = useInLessonCheck();
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`${
        !isInLesson ? 'h-full overflow-hidden overflow-y-scroll' : ''
      } bg-dark-gray`}>
      <div className={`w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <ErrorBoundary fallback={<h1>Error in the LessonRowComposer</h1>}>
            <LessonRowComposer />
          </ErrorBoundary>
        </LessonPageWrapper>
      </div>
      {/* <ThemeModal open={open} setOpen={setOpen} /> */}
    </div>
  );
};

export default CoreUniversalLesson;
