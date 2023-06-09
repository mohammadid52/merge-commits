import Buttons from '@components/Atoms/Buttons';
import useAuth from '@customHooks/useAuth';
import SaveQuit from 'components/Lesson/Foot/SaveQuit';
import {useGlobalContext} from 'contexts/GlobalContext';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import React from 'react';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai';
import {useHistory, useRouteMatch} from 'react-router';
import {getLocalStorageData} from 'utilities/localStorage';
import ErrorBoundary from '../../../Error/ErrorBoundary';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import LessonRowComposer from './CoreUniversalLesson/LessonRowComposer';
import {scrollUp} from '@utilities/functions';
const CoreUniversalLesson = ({
  invokeRequiredField,
  canContinue,
  validateRequired,
  isTeacher
}: {
  canContinue?: boolean;
  isTeacher?: boolean;
  validateRequired?: (currentPage: number) => boolean;
  invokeRequiredField?: () => void;
}) => {
  const isInLesson = useInLessonCheck();
  const gContext = useGlobalContext();
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const lessonPlan = lessonState.lessonData?.lessonPlan;
  const currentPage = lessonState.currentPage;

  const userAtEnd = () => currentPage === lessonPlan?.length - 1;
  const userAtFirst = () => currentPage === 0;

  const getPageName = (dir = 'next'): string =>
    lessonPlan
      ? `Go to ${
          lessonPlan[dir === 'next' ? currentPage + 1 : currentPage - 1]?.title || ''
        }`
      : `${dir === 'next' ? 'Next' : 'Prev'}`;

  const {isStudent} = useAuth();
  const getRoomData = getLocalStorageData('room_info');

  // ~~~~~~~~~~~~ ARROW BUTTONS ~~~~~~~~~~~~ //
  const history = useHistory();
  const match = useRouteMatch();

  const lessonType = lessonState.lessonData?.type;

  const goNext = () => {
    history.push(`${match.url}/${currentPage + 1}`);
    lessonDispatch({
      type: 'SET_CURRENT_PAGE',
      payload: currentPage + 1
    });

    scrollUp(lessonType);
  };

  const handleForward = (forward = true) => {
    if (!isTeacher) {
      if (!forward) {
        goBack();
      } else {
        if (!userAtEnd()) {
          if (canContinue) {
            goNext();
          } else {
            invokeRequiredField && invokeRequiredField();
          }
        } else if (userAtEnd()) {
          if (validateRequired && validateRequired(currentPage)) {
            return;
          } else {
            invokeRequiredField && invokeRequiredField();
          }
        }
      }
    } else {
      if (!forward) goBack();
      else goNext();
    }
  };

  const goBack = () => {
    history.push(`${match.url}/${currentPage - 1}`);

    lessonDispatch({
      type: 'SET_CURRENT_PAGE',
      payload: currentPage - 1
    });

    scrollUp(lessonType);
  };

  return (
    <div
      className={`${
        !isInLesson ? 'h-full overflow-hidden overflow-y-scroll' : ''
      } px-4 pb-4 relative mx-auto max-w-100 sm:max-w-[35rem] lg:max-w-[55rem] 2xl:max-w-[60rem] `}>
      <div className={`w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <ErrorBoundary
            componentName="LessonRowComposer"
            fallback={<h1>Error in the LessonRowComposer</h1>}>
            <LessonRowComposer />

            <div
              className={`${
                userAtFirst() ? 'justify-end' : 'justify-between'
              } flex items-center mt-4  gap-x-4`}>
              {!userAtFirst() && (
                <>
                  <Buttons
                    label="Go Back"
                    tooltip={getPageName('prev')}
                    size="middle"
                    Icon={AiOutlineArrowLeft}
                    onClick={() => handleForward(false)}
                  />
                  {userAtEnd() && isStudent ? (
                    <SaveQuit
                      invokeRequiredField={invokeRequiredField}
                      canContinue={Boolean(canContinue)}
                      roomID={getRoomData?.id}
                    />
                  ) : null}
                </>
              )}
              {!userAtEnd() && (
                <Buttons
                  label="Next page"
                  size="middle"
                  tooltip={getPageName('next')}
                  onClick={handleForward}
                  Icon={AiOutlineArrowRight}
                />
              )}
            </div>
          </ErrorBoundary>
        </LessonPageWrapper>
      </div>
    </div>
  );
};

export default CoreUniversalLesson;
