import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink, useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { useOutsideAlerter } from '../General/hooks/outsideAlerter';
import PositiveAlert from '../General/Popup';
import { FaRegSave, FaHome, FaBook, FaRegThumbsUp } from 'react-icons/fa';
import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { LessonContext } from '../../contexts/LessonContext';
import TopMenu from '../Lesson/Header/TopMenu';
import SideMenu from '../Lesson/Header/SideMenu';


const LessonHeaderBar = () => {
    const history = useHistory();
    const { theme, state, dispatch } = useContext(LessonContext);
    const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
    const { visible, setVisible, ref } = useOutsideAlerter(false);

  /**
   * 
   * 
   * AUTO-PUSH TO SPECIFIC LESSON
   * 
   * 
   */

    useEffect(() => {
        // history.push('/lesson/corelesson');
    }, [])


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



    const handlePopup = () => {
        setVisible((prevState: any) => !prevState)
        console.log('handlepopup: ')
        console.log('visible?: ', visible)
    }

    const handleSubmit = () => {
        history.push('/dashboard')
    }

    return (
        <div
            className={`z-40 relative center w-full h-.7/10 ${theme.toolbar.bg} text-gray-200 shadow-2xl`}>

            {/**
         * 
         * Potentially need to fix html below
         * 
        */}
            <div className={`${visible ? 'absolute z-100' : 'hidden'}`} onClick={handlePopup}>
                <PositiveAlert
                    alert={visible}
                    setAlert={setVisible}
                    header='Are you sure you want to leave the Lesson?'
                    button1='Go to the dashboard'
                    button2='Cancel'
                    svg='question'
                    handleButton1={handleSubmit}
                    handleButton2={() => handlePopup}
                    theme='dark'
                    fill='screen'
                />

            </div>

            <TopMenu />
            <SideMenu handlePopup={handlePopup} />

        </div>
    );
};

export default LessonHeaderBar;
