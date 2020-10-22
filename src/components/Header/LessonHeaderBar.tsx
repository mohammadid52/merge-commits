import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink, useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaRegSave, FaHome, FaBook, FaRegThumbsUp } from 'react-icons/fa';
import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { LessonContext } from '../../contexts/LessonContext';
import TopMenu from '../Lesson/Header/TopMenu';
import SideMenu from '../Lesson/Header/SideMenu';


const LessonHeaderBar = () => {
  const [cookies, setCookie] = useCookies(['lesson']);
  const history = useHistory();
  const { theme, state, dispatch } = useContext(LessonContext);

  useEffect(()=>{
    // history.push('/lesson/corelesson');
  },[])

  useEffect(() => {
    if (!state.pages[0].active) {
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

  return (
    <div
      className={`z-40 relative center w-full h-.7/10 ${theme.toolbar.bg} text-gray-200 shadow-2xl`}>

      <TopMenu />
      <SideMenu />

    </div>
  );
};

export default LessonHeaderBar;
