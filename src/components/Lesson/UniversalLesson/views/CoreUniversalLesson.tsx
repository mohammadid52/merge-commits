import SaveQuit from '@components/Lesson/Foot/SaveQuit';
import {useGlobalContext} from '@contexts/GlobalContext';
import {getLocalStorageData} from '@utilities/localStorage';
import React from 'react';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import ErrorBoundary from '../../../Error/ErrorBoundary';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import LessonRowComposer from './CoreUniversalLesson/LessonRowComposer';

const CoreUniversalLesson = () => {
  const isInLesson = useInLessonCheck();
  const gContext = useGlobalContext();
  const lessonState = gContext.lessonState;

  const userAtEnd = () => {
    return lessonState.currentPage === lessonState.lessonData?.lessonPlan?.length - 1;
  };

  const getRoomData = getLocalStorageData('room_info');

  return (
    <div
      className={`${
        !isInLesson ? 'h-full overflow-hidden overflow-y-scroll' : ''
      } bg-dark-gray relative  sm:max-w-132 max-w-80   md:max-w-164 mx-auto`}>
      <div className={`w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <ErrorBoundary fallback={<h1>Error in the LessonRowComposer</h1>}>
            <LessonRowComposer />
            {userAtEnd() ? <SaveQuit roomID={getRoomData?.id} /> : null}
          </ErrorBoundary>
        </LessonPageWrapper>
      </div>
    </div>
  );
};

export default CoreUniversalLesson;
