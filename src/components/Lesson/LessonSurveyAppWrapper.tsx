import ErrorBoundary from "@components/Error/ErrorBoundary";
import LessonHeaderBar from "@components/Header/LessonHeaderBar";
import { useGlobalContext } from "@contexts/GlobalContext";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import Foot from "./Foot/Foot";
import { ILessonSurveyApp } from "./Lesson";
import LessonPageLoader from "./LessonPageLoader";
import CoreUniversalLesson from "./UniversalLesson/views/CoreUniversalLesson";

interface LessonSurveyAppWrapper extends ILessonSurveyApp {
  type: "survey" | "lesson";
  lessonDataLoaded: boolean;
  createJournalData: () => void;
}

const LessonSurveyAppWrapper = ({
  type = "lesson",
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
}: LessonSurveyAppWrapper) => {
  const {
    lessonState,
    theme,
    lessonDispatch,
    state: { user },
  } = useGlobalContext();

  const [showRequiredNotification, setShowRequiredNotification] =
    useState<boolean>(false);
  const [overlay, setOverlay] = useState<string>("");
  const [isAtEnd, setisAtEnd] = useState<boolean>(false);

  const topLessonRef = useRef<any>(null);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    handleMutationOnPageChange();
  }, [lessonState.currentPage]);

  useEffect(() => {
    if (!personLoading) {
      const pages = personLessonData?.pages || "{}";
      const lessonProgress = JSON.parse(pages).lessonProgress || 0;

      lessonDispatch({ type: "SET_CURRENT_PAGE", payload: lessonProgress });

      history.push(`${match.url}/${lessonProgress}`);
    }
  }, [personLoading]);

  const handleRequiredNotification = () => {
    if (!showRequiredNotification) {
      setShowRequiredNotification(true);
      setTimeout(() => {
        setShowRequiredNotification(false);
      }, 1250);
    }
  };

  const NAME = lessonState?.lessonData?.title;

  return (
    <div
      id={type === "survey" ? "survey-app-container" : "lesson-app-container"}
      className={`${theme.bg} w-full h-full flex flex-col items-start dark-scroll overflow-y-auto`}
      ref={topLessonRef}
    >
      <div
        className={`opacity-${
          showRequiredNotification
            ? "100 translate-x-0 transform z-100"
            : "0 translate-x-10 transform"
        } absolute bottom-5 right-5 w-96 py-4 px-6 rounded-md shadow bg-gray-800 duration-300 transition-all`}
      >
        <p className="text-white font-medium tracking-wide">
          <span className="text-red-500">*</span>Please fill all the required
          fields
        </p>
      </div>
      <div className={`absolute bottom-1 left-0 py-4 px-6 z-max  w-auto `}>
        <h6 className="text-xs text-shadow text-gray-500">{NAME}</h6>
      </div>

      <div className="fixed " style={{ zIndex: 5000 }}>
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
          validateRequired={validateRequired}
          handleRequiredNotification={() => {
            invokeRequiredField?.();
            handleRequiredNotification();
          }}
        />
      </div>
      <div className={`top-2 lg:top-6 relative lesson-body-container`}>
        {!lessonDataLoaded ? (
          <div className="mt-4 mb-8 lesson-page-container">
            <LessonPageLoader />
          </div>
        ) : (
          <ErrorBoundary
            authId={user.authId}
            email={user.email}
            componentName="CoreUniversalLesson"
            fallback={<h1>Error in the Lesson App</h1>}
          >
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

        {lessonDataLoaded && (
          <Foot
            isAtEnd={isAtEnd}
            setisAtEnd={setisAtEnd}
            handleRequiredNotification={handleRequiredNotification}
          />
        )}
      </div>
    </div>
  );
};

export default LessonSurveyAppWrapper;
