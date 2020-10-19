import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaRegSave, FaHome, FaBook, FaRegThumbsUp } from 'react-icons/fa';
import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { LessonContext } from '../../contexts/LessonContext';
import TopMenu from '../Lesson/Header/TopMenu';


import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../customGraphql/customMutations';

import useStudentTimer from '../../customHooks/timer';

const LessonHeaderBar = () => {
  const [cookies, setCookie] = useCookies(['lesson']);
  const { theme, state, dispatch } = useContext(LessonContext);
  const [isToggled, setIsToggled] = useState<string[]>(['']);

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

  const updateStudentData = async (saveType?: string) => {
    let lessonProgress =
      state.pages[state.lessonProgress].stage === ''
        ? 'intro'
        : state.pages[state.lessonProgress].stage;

    // console.log('thisone', state )

    let data = {
      id: state.studentDataID,
      lessonProgress: lessonProgress,
      status: state.studentStatus,
      saveType: saveType,
      classroomID: 1,
      studentID: state.studentUsername,
      studentAuthID: state.studentAuthID,
      warmupData: state.componentState.story ? state.componentState.story : null,
      corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
      activityData: state.componentState.poem ? state.componentState.poem : null,
    };

    console.log('update', data);

    try {
      const dataObject: any = await API.graphql(
        graphqlOperation(customMutations.updateStudentData, { input: data })
      );
      console.log(dataObject);
      dispatch({ type: 'SAVED_CHANGES' });
      console.log('state', state);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDone = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    const targetWordID = t.id || '';

    updateStudentData('done');

    /**
     * Animation
     */
    setIsToggled([...isToggled, targetWordID]);

    setTimeout(() => {
      setIsToggled(isToggled.filter((targetString: string) => targetString !== targetWordID));
    }, 300);
  };

  const { startTimer, changeParams } = useStudentTimer({
    dispatch: dispatch,
    subscription: state.subscription,
    subscribeFunc: state.subscribeFunc,
    callback: updateStudentData,
    state: state,
  });

  useEffect(() => {
    changeParams('state', state);
    // console.log('state', state);
    // console.log('subInfo', subscription, subscribeFunc );

    // startTimer()
  }, [state.studentStatus, state.viewing, state.saveCount, state.subscription]);

  return (
    <div
      className={`z-40 center w-full h-.7/10 ${theme.toolbar.bg} text-gray-200 shadow-2xl`}>

      <TopMenu />

    </div>
  );
};

export default LessonHeaderBar;
