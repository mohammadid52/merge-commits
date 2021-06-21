import React, { useContext, useEffect, useState } from 'react';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import { useParams } from 'react-router-dom';
import NotesForm from './LessonComponents/Notes/NotesForm';
import FloatingSideMenu from '../Dashboard/FloatingSideMenu/FloatingSideMenu';
import ErrorBoundary from '../Error/ErrorBoundary';
import { GlobalContext } from '../../contexts/GlobalContext';
import { exampleUniversalLesson } from './UniversalLessonBuilder/example_data/exampleUniversalLessonData';

const LessonApp = () => {
  const {state, dispatch, lState, lDispatch, theme} = useContext(GlobalContext);
  const urlParams: any = useParams();

  const [lessonDataLoaded, setLessonDataLoaded] = useState<boolean>(false);

  const [overlay, setOverlay] = useState<string>('');

  /**
   *
   *  TODO: UPDATE THIS FOR THE UNIVERSALLESSONDATA STRUCTURE
   * HELP SECTION:
   *
   *  On mount ->
   *  1. setLessonDataLoaded -> true;
   *  2. setCheckpointIdList()
   *
   *  Then ->
   *  3. getAllCheckpoints()
   *
   *  Then ->
   *  4. getOrCreateQuestionData()
   *
   */
  useEffect(()=>{
    setTimeout(()=>{
      lDispatch({ type: 'SET_LESSON_DATA', payload: exampleUniversalLesson });
    },2000)
  },[])

  useEffect(() => {
    if (lState.lessonData) {
      setLessonDataLoaded(true);
    }
  }, [lState.lessonData]);

  return (
    <>
      <FloatingSideMenu />
      <div className={`${theme.bg} w-full md:h-screen flex flex-col items-start`}>
        {/*<LessonHeaderBar lessonDataLoaded={lessonDataLoaded} overlay={overlay} setOverlay={setOverlay} />*/}
        {/*<NotificationBar />*/}

        <div className={`fixed w-1/2 right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 ${ overlay === '' ? 'z-0' : 'z-50' }`}>
          {/*<NotesForm overlay={overlay} setOverlay={setOverlay} />*/}
        </div>

        <ErrorBoundary fallback={<h1>Error in the Lesson App</h1>}>
          {/*{lessonDataLoaded && <Body />}*/}
        {/* ADD LESSONWRAPPER HERE */}
          <h2>Lesson Wrapper goes hErE</h2>
        </ErrorBoundary>

        {/*{lessonDataLoaded && <Foot />}*/}
      </div>
    </>
  );
};

export default LessonApp;
