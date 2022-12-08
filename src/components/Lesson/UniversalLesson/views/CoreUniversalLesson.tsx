import SaveQuit from 'components/Lesson/Foot/SaveQuit';
import {useGlobalContext} from 'contexts/GlobalContext';
import {getLocalStorageData} from 'utilities/localStorage';
import React from 'react';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import ErrorBoundary from '../../../Error/ErrorBoundary';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import LessonRowComposer from './CoreUniversalLesson/LessonRowComposer';
import useAuth from '@customHooks/useAuth';
import Buttons from '@components/Atoms/Buttons';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai';
import {useHistory, useRouteMatch} from 'react-router';

const CoreUniversalLesson = ({
  invokeRequiredField,
  canContinue,
  validateRequired
}: {
  canContinue?: boolean;
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
    `Go to ${lessonPlan[dir === 'next' ? currentPage + 1 : currentPage - 1].title}`;

  const {isStudent, authId, email} = useAuth();
  const getRoomData = getLocalStorageData('room_info');

  // ~~~~~~~~~~~~ ARROW BUTTONS ~~~~~~~~~~~~ //
  const history = useHistory();
  const match = useRouteMatch();

  const handleForward = (forward = true) => {
    if (!forward) {
      handleBack();
    } else {
      if (!userAtEnd()) {
        if (canContinue) {
          history.push(`${match.url}/${currentPage + 1}`);
          lessonDispatch({
            type: 'SET_CURRENT_PAGE',
            payload: currentPage + 1
          });
        } else {
          invokeRequiredField();
        }
      } else if (userAtEnd()) {
        if (validateRequired && validateRequired(currentPage)) {
          return;
        } else {
          invokeRequiredField();
        }
      }
    }
  };

  const handleBack = () => {
    if (currentPage === 0) {
    } else {
      if (userAtEnd()) {
        history.push(`${match.url}/${currentPage - 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: currentPage - 1
        });
      } else if (!userAtEnd() && currentPage > 0) {
        history.push(`${match.url}/${currentPage - 1}`);
        lessonDispatch({
          type: 'SET_CURRENT_PAGE',
          payload: currentPage - 1
        });
      }
    }
  };

  return (
    <div
      className={`${
        !isInLesson ? 'h-full overflow-hidden overflow-y-scroll' : ''
      } bg-dark-gray relative sm:max-w-132 max-w-80 xs:max-w-96  md:max-w-200 2xl:max-w-256 mx-auto`}>
      <div className={`w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <ErrorBoundary
            authId={authId}
            email={email}
            componentName="LessonRowComposer"
            fallback={<h1>Error in the LessonRowComposer</h1>}>
            <LessonRowComposer />

            <div className="flex items-center justify-center gap-x-4">
              {!userAtFirst() && (
                <Buttons
                  label="Last page"
                  title={getPageName('prev')}
                  Icon={AiOutlineArrowLeft}
                  iconBeforeLabel
                  onClick={() => handleForward(false)}
                  size="small"
                  transparent
                  btnClass={userAtEnd() ? 'mb-4' : ''}
                />
              )}
              {!userAtEnd() && (
                <Buttons
                  size="small"
                  label="Next page"
                  title={getPageName('next')}
                  onClick={handleForward}
                  Icon={AiOutlineArrowRight}
                  transparent
                />
              )}
            </div>

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
