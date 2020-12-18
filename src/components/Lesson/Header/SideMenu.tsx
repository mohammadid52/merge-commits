import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaRegSave, FaHome, FaBook, FaRegThumbsUp } from 'react-icons/fa';
import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { FiClock } from 'react-icons/fi';
import { LessonContext } from '../../../contexts/LessonContext';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../customGraphql/customMutations';
import useStudentTimer from '../../../customHooks/timer';

const SideMenu = (props: { handlePopup: () => void }) => {
  const [cookies, setCookie] = useCookies(['lesson']);
  const { theme, state, dispatch } = useContext(LessonContext);
  const [isToggled, setIsToggled] = useState<string[]>(['']);

  const updateStudentData = async (saveType?: string) => {
    let lessonProgress =
      state.pages[state.lessonProgress].stage === '' ? 'intro' : state.pages[state.lessonProgress].stage;

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
      const dataObject: any = await API.graphql(graphqlOperation(customMutations.updateStudentData, { input: data }));
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
  }, [state.studentStatus, state.viewing, state.saveCount, state.subscription]);

  return (
    <>
      <div className={`absolute top-5 right-0 w-auto h-auto flex flex-col justify-end items-center px-6 pt-1`}>
        {!state.viewing ? (
          <div
            id="lesson-done"
            className={`hidden cursor-pointer flex flex-col justify-center items-center mb-4`}
            onClick={handleDone}>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
              <FaRegThumbsUp className={`${isToggled.includes('lesson-done') && 'animate-jiggle'}`} />
            </IconContext.Provider>
            <p className={`text-xs text-gray-200 text-center`}>Done</p>
          </div>
        ) : (
          <div className={`cursor-default flex flex-col justify-center items-center mb-4`}>
            <div className="relative flex items-center justify-center h-4 w-4 m-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600"></span>
            </div>
            <p className={`self-end text-xs text-gray-200 text-center`}>AutoSave</p>
          </div>
        )}
        <div className={`cursor-pointer flex flex-col justify-center items-center mb-4`} onClick={props.handlePopup}>
          {/* <NavLink to='/dashboard'> */}
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <AiOutlineHome />
          </IconContext.Provider>
          {/* </NavLink> */}
          <p className="text-xs text-gray-200 text-center">Home</p>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
