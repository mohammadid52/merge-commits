import SaveQuit from 'components/Lesson/Foot/SaveQuit';
import {useGlobalContext} from 'contexts/GlobalContext';
import {getLocalStorageData} from 'utilities/localStorage';
import React from 'react';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import ErrorBoundary from '../../../Error/ErrorBoundary';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import LessonRowComposer from './CoreUniversalLesson/LessonRowComposer';
import useAuth from '@customHooks/useAuth';

const CoreUniversalLesson = ({
  invokeRequiredField,
  canContinue
}: {
  canContinue: boolean;
  invokeRequiredField?: () => void;
}) => {
  const isInLesson = useInLessonCheck();
  const gContext = useGlobalContext();
  const lessonState = gContext.lessonState;

  const userAtEnd = () => {
    return lessonState.currentPage === lessonState.lessonData?.lessonPlan?.length - 1;
  };

  const {isStudent} = useAuth();
  const getRoomData = getLocalStorageData('room_info');

  return (
    <div
      className={`${
        !isInLesson ? 'h-full overflow-hidden overflow-y-scroll' : ''
      } bg-dark-gray relative sm:max-w-132 max-w-80 xs:max-w-96  md:max-w-200 2xl:max-w-256 mx-auto`}>
      <div className={`w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <ErrorBoundary fallback={<h1>Error in the LessonRowComposer</h1>}>
            <LessonRowComposer />
            {userAtEnd() && isStudent ? (
              <SaveQuit
                invokeRequiredField={invokeRequiredField}
                canContinue={canContinue}
                roomID={getRoomData?.id}
              />
            ) : null}
          </ErrorBoundary>
        </LessonPageWrapper>
      </div>
    </div>
  );
};

export default CoreUniversalLesson;
