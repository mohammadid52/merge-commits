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
  StudentPageInput,
  PartContent,
  PartContentSub,
  UniversalLessonPage,
} from '../../interfaces/UniversalLessonInterfaces';

const LessonApp = () => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const history = useHistory();
  const match = useRouteMatch();

  // Subscription for student->teacher interaction
  let subscription: any;

  const [overlay, setOverlay] = useState<string>('');
  const [studentDataInitialized, setStudentDataInitialized] = useState<boolean>(false);

  //  NAVIGATION CONSTANTS
  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  //  LESSON FETCH AND UNMOUNT
  useEffect(() => {
    setTimeout(() => {
      lessonDispatch({type: 'SET_LESSON_DATA', payload: exampleUniversalLesson});
    }, 1000);
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      lessonDispatch({type: 'CLEANUP'});
    };
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
    if (studentDataInitialized === false && PAGES) {
      const mappedPages = PAGES.map((page: UniversalLessonPage) => {
        const allPageParts = page.pageContent;
        const initialPageData = allPageParts.reduce(
          (pageData: StudentPageInput[], pagePart: PagePart) => {
            const pagePartContent = pagePart.partContent.reduce(
              (pagePartAcc: any[], partContent: PartContent) => {
                const isForm = /form/g.test(partContent.type);
                if (isForm) {
                  // map through partContent sub array
                  return [
                    ...pagePartAcc,
                    ...partContent.value.map((partContentSub: PartContentSub) => {
                      return {
                        domID: partContentSub.id,
                        input: [''],
                      };
                    }),
                  ];
                } else {
                  return pagePartAcc;
                }
              },
              []
            );
            return [...pageData, ...pagePartContent];
          },
          []
        );
        return initialPageData;
      });
      // console.log('initialPageData - ', mappedPages)
      lessonDispatch({type: 'SET_INITIAL_STUDENT_DATA', payload: mappedPages});
      setStudentDataInitialized(true);
    }
  }, [lessonState.lessonData.lessonPlan]);

  /**
   *
   * COPY NAMES OF ALL REMAINING FUNCTIONS/PROCESSES
   * FROM LESSONCONTEXT.tsx
   *
   */

  //GET liveClassroomLesson --> Replace temporary function above
  //CRUD personLocation
  //CRUD studentData
  // initialize if not present
  // get studentData
  // set studentDataID to context

  //SUBSCRIBE to liveClassroomLesson
  //UPDATE to liveClassroomLEsson
  //UNSUBSCRIBE from liveClassroomLesson
  //CLEANUP context on unmount classroom

  // set initial componentState --> Maybe not necessary with new structure

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