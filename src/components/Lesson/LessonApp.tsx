import React, {useContext, useEffect, useState} from 'react';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import NotesForm from './LessonComponents/Notes/NotesForm';
import FloatingSideMenu from '../Dashboard/FloatingSideMenu/FloatingSideMenu';
import ErrorBoundary from '../Error/ErrorBoundary';
import {GlobalContext} from '../../contexts/GlobalContext';
import {exampleUniversalLesson} from './UniversalLessonBuilder/example_data/exampleUniversalLessonData';
import Foot from './Foot/Foot';
import CoreUniversalLesson from './UniversalLesson/views/CoreUniversalLesson';
import {
  PagePart,
  PartContent,
  UniversalLessonPage,
} from '../../interfaces/UniversalLessonInterfaces';

const LessonApp = () => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const history = useHistory();
  const match = useRouteMatch();

  const [overlay, setOverlay] = useState<string>('');

  //  NAVIGATION CONSTANTS
  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  /**
   * HELP SECTION:
   *  On mount ->
   *  1. setLessonDataLoaded -> true;
   *  2. set current page
   */
  useEffect(() => {
    setTimeout(() => {
      lessonDispatch({type: 'SET_LESSON_DATA', payload: exampleUniversalLesson});
    }, 1000);
  }, []);

  //  RESPONSE TO LOADING LESSON DATA FETCH
  //  RESPONSE TO LOADING LESSON DATA FETCH
  //  RESPONSE TO LOADING LESSON DATA FETCH
  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (lessonState.lessonData) {
      setLessonDataLoaded(true);
    }
    if (CURRENT_PAGE !== '' && CURRENT_PAGE !== undefined) {
      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: CURRENT_PAGE});
      history.push(`${match.url}/${CURRENT_PAGE}`);
    } else {
      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: 0});
      history.push(`${match.url}/${0}`);
    }
  }, [lessonState.lessonData]);

  //  INITIALIZE STUDENTDATA
  //  INITIALIZE STUDENTDATA
  //  INITIALIZE STUDENTDATA
  useEffect(() => {
    if (PAGES) {
      const mappedPages = PAGES.map((page: UniversalLessonPage) => {
        const allPageParts = page.pageContent;

        const initialPageData = allPageParts.map((pagePart: PagePart) => {
          const pagePartContent = pagePart.partContent.map((partContent: PartContent) => {
            return {
              domID: partContent.id,
              input: [''],
            };
          });
          return {
            pagePartID: `${pagePart.id}`,
            pagePartInput: pagePartContent,
          };
        });
        return initialPageData;
      });

      lessonDispatch({type: 'SET_INITIAL_STUDENT_DATA', payload: mappedPages});
    }
  }, [lessonState.lessonData.lessonPlan]);

  /**
   *
   * COPY NAMES OF ALL REMAINING FUNCTIONS/PROCESSES
   * FROM LESSONCONTEXT.tsx
   *
   */

  return (
    <>
      <FloatingSideMenu />
      <div className={`${theme.bg} w-full flex flex-col items-start`}>
        <LessonHeaderBar
          lessonDataLoaded={lessonDataLoaded}
          overlay={overlay}
          setOverlay={setOverlay}
        />
        {/*<NotificationBar />*/}

        <ErrorBoundary fallback={<h1>Error in the Lesson App</h1>}>
          {/*{lessonDataLoaded && <Body />}*/}
          {/* ADD LESSONWRAPPER HERE */}
          <CoreUniversalLesson />
        </ErrorBoundary>

        {lessonDataLoaded && <Foot />}
      </div>
    </>
  );
};

export default LessonApp;
