import React from 'react';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import ErrorBoundary from '../../../Error/ErrorBoundary';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import LessonRowComposer from './CoreUniversalLesson/LessonRowComposer';

const CoreUniversalLesson = () => {
  const isInLesson = useInLessonCheck();
  return (
    <div
      className={`${
        !isInLesson ? 'h-full overflow-hidden overflow-y-scroll' : ''
      } bg-dark-gray relative`}>
      <div className={`w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <ErrorBoundary fallback={<h1>Error in the LessonRowComposer</h1>}>
            <LessonRowComposer />
          </ErrorBoundary>
        </LessonPageWrapper>
      </div>
    </div>
  );
};

export default CoreUniversalLesson;
