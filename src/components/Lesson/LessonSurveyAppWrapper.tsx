import ErrorBoundary from '@components/Error/ErrorBoundary';
import LessonHeaderBar from '@components/Header/LessonHeaderBar';
import {useGlobalContext} from '@contexts/GlobalContext';
import {notification} from 'antd';
import {useEffect, useRef, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import Foot from './Foot/Foot';
import {ILessonSurveyApp} from './Lesson';
import LessonPageLoader from './LessonPageLoader';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';

interface LessonSurveyAppWrapper extends ILessonSurveyApp {
  type: 'survey' | 'lesson';
  lessonDataLoaded: boolean;
  createJournalData: () => void;
}

const LessonSurveyAppWrapper = ({
  type = 'lesson',
  pageStateUpdated,

  handleMutationOnPageChange,
  validateRequired,
  invokeRequiredField,
  personLoading,
  canContinue,
  createJournalData,
  personLessonData,
  setPersonLessonData,
  updatePageInLocalStorage,
  lessonDataLoaded,
  getValidatedPages
}: LessonSurveyAppWrapper) => {
  const {
    lessonState,

    lessonDispatch,
    state: {user}
  } = useGlobalContext();

  const [overlay, setOverlay] = useState<string>('');
  const [isAtEnd, setisAtEnd] = useState<boolean>(false);

  const topLessonRef = useRef<any>(null);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    handleMutationOnPageChange();
  }, [lessonState.currentPage]);

  useEffect(() => {
    if (!personLoading) {
      const pages = personLessonData?.pages || '{}';
      const lessonProgress = JSON.parse(pages).lessonProgress || 0;

      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: lessonProgress});

      history.push(`${match.url}/${lessonProgress}`);
    }
  }, [personLoading]);

  const [notificationApi, contextHolder] = notification.useNotification();

  const handleRequiredNotification = () => {
    notificationApi.error({
      message: 'Please complete all required fields before continuing.',
      placement: 'bottomRight'
    });
  };

  const NAME = lessonState?.lessonData?.title;

  const NOTES = lessonState?.lessonData?.notes;

  return (
    <div
      id={type === 'survey' ? 'survey-app-container' : 'lesson-app-container'}
      className={`bg-dark-blue w-full h-full flex flex-col items-start dark-scroll overflow-y-auto`}
      ref={topLessonRef}>
      {contextHolder}
      <div className={`absolute bottom-1 left-0 py-4 px-6 z-100  w-auto `}>
        <h6 className="text-xs text-shadow text-medium ">{NAME}</h6>
        {/* {(user.role === 'TR' || user.role === 'FLW') && NOTES !== '<p></p>' && (
            <Popover
              trigger={'click'}
              zIndex={10000}
              content={
                <span
                  dangerouslySetInnerHTML={{
                    __html: NOTES
                  }}></span>
              }>
              <Buttons
                className="mt-2"
                Icon={GrNotes}
                label={'notes'}
                variant="dashed"
                size="small"
              />
            </Popover>
          )} */}
      </div>

      <div className="fixed w-full" style={{zIndex: 5000}}>
        <LessonHeaderBar
          lessonDataLoaded={lessonDataLoaded}
          overlay={overlay}
          pageStateUpdated={pageStateUpdated}
          createJournalData={createJournalData}
          setOverlay={setOverlay}
          canContinue={canContinue}
          updatePageInLocalStorage={updatePageInLocalStorage}
          personLessonData={personLessonData}
          isAtEnd={isAtEnd}
          setPersonLessonData={setPersonLessonData}
          setisAtEnd={setisAtEnd}
          getValidatedPages={getValidatedPages}
          validateRequired={validateRequired}
          handleRequiredNotification={() => {
            invokeRequiredField?.();
            handleRequiredNotification();
          }}
        />
      </div>
      <div className={`top-2 lg:top-6 relative lesson-body-container w-full`}>
        {!lessonDataLoaded ? (
          <div className="mt-4 mb-8 lesson-page-container">
            <LessonPageLoader />
          </div>
        ) : (
          <ErrorBoundary
            authId={user.authId}
            email={user.email}
            componentName="CoreUniversalLesson"
            fallback={<h1>Error in the Lesson App</h1>}>
            {/* ADD LESSONWRAPPER HERE */}
            <div className="mt-4 mb-8 lesson-page-container ">
              <CoreUniversalLesson
                validateRequired={validateRequired}
                invokeRequiredField={() => {
                  invokeRequiredField?.();
                  handleRequiredNotification();
                }}
                canContinue={canContinue}
              />
            </div>
          </ErrorBoundary>
        )}

        {lessonDataLoaded && <Foot />}
      </div>
    </div>
  );
};

export default LessonSurveyAppWrapper;
