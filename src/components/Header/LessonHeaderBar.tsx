import React, { SetStateAction, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { useOutsideAlerter } from '../General/hooks/outsideAlerter';
import PositiveAlert from '../General/Popup';
import { LessonContext } from '../../contexts/LessonContext';
import LessonTopMenu from '../Lesson/Header/LessonTopMenu';
import SideMenu from '../Lesson/Header/SideMenu';
import SurveyTopMenu from '../Lesson/Header/SurveyTopMenu';
import { LessonHeaderBarProps } from '../../interfaces/LessonComponentsInterfaces';


const LessonHeaderBar = (props: LessonHeaderBarProps) => {
  const {overlay, setOverlay} = props;
  const history = useHistory();
  const { theme, state, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const { visible, setVisible, ref } = useOutsideAlerter(false);

  useEffect(() => {
    const shouldDispatch = state.pages.length > 0 ;
      if (shouldDispatch && !state.pages[0].active) {
        dispatch({ type: 'SET_PROGRESS', payload: state.lessonProgress });
      }
  }, [state.pages, state.currentPage]);

  useEffect(() => {
    if (cookies.lesson) {
      setCookie('lesson', { ...cookies.lesson, lessonProgress: state.lessonProgress });
    }

    if (!cookies.lesson) {
      setCookie('lesson', { lessonProgress: 0 });
    }
  }, [state.lessonProgress]);

  const handlePopup = () => {
    setVisible((prevState: any) => !prevState);
  };

  const handleSubmit = () => {
    history.push('/dashboard');
  };

  return (
    <div className={`z-40 relative center w-full ${state.data.lesson.type === 'lesson' ? 'h-.7/10' : ''} ${theme.toolbar.bg} text-gray-200 shadow-2xl`}>
      {/**
       *
       * Potentially need to fix html below
       *
       */}
      <div className={`${visible ? 'absolute z-100' : 'hidden'}`} onClick={handlePopup}>
        <PositiveAlert
          alert={visible}
          setAlert={setVisible}
          header="Are you sure you want to leave the Lesson?"
          button1="Go to the dashboard"
          button2="Cancel"
          svg="question"
          handleButton1={handleSubmit}
          handleButton2={() => handlePopup}
          theme="dark"
          fill="screen"
        />
      </div>

      {
        state.data.lesson.type === 'lesson' && (
          <LessonTopMenu handlePopup={handlePopup} />
        )
      }
      {
        state.data.lesson.type === 'survey' && (
          <SurveyTopMenu />
        )
      }


      {/*<NotificationBar />*/}

      {/**
       *
       *
       * SIDE MENU UNDER PROGRESS BAR HIDDEN UNTIL FURTHER NOTICE
       *
       *
       */}

      <SideMenu handlePopup={handlePopup} overlay={overlay} setOverlay={setOverlay}/>
    </div>
  );
};

export default LessonHeaderBar;
