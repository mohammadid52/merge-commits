import React from 'react';
import {UniversalLesson} from '../../../../interfaces/UniversalLessonInterfaces';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import LessonRowComposer from './CoreUniversalLesson/LessonRowComposer';
import ErrorBoundary from '../../../Error/ErrorBoundary';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';

interface CoreUniversalLessonProps {
  universalLessonDetails?: UniversalLesson;
}

const CoreUniversalLesson = ({universalLessonDetails}: CoreUniversalLessonProps) => {
  const isInLesson = useInLessonCheck();
  return (
    <div className={`${!isInLesson ? 'h-full overflow-hidden overflow-y-scroll' : ''} bg-dark-gray`}>
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
