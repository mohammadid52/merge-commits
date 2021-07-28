import React, {useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import useStudentTimer from '../../../customHooks/timer';
import {LessonHeaderBarProps} from '../../../interfaces/LessonComponentsInterfaces';
import HomeWidget from './SideMenu/HomeWidget';
import {GlobalContext} from '../../../contexts/GlobalContext';

const SideMenu = ({handlePopup}: LessonHeaderBarProps) => {
  const {state, lessonState, lessonDispatch} = useContext(GlobalContext);

  /**
   * FUNCTION TO SAVE STUDENT DATA ON COMMAND
   * @param saveType
   */
  const updateStudentData = async () => {
    //
  };

  const {changeParams, resetParams} = useStudentTimer({
    dispatch: lessonDispatch,
    subscription: lessonState.subscription,
    subscribeFunc: lessonState.subscribeFunc,
    callback: updateStudentData,
    state: state,
    lessonState: lessonState,
    lessonDispatch: lessonDispatch,
  });

  useEffect((): any => {
    if (lessonState) {
      changeParams('lessonState', lessonState);
    }
    return () => resetParams();
  }, [
    lessonState.studentStatus,
    lessonState.currentPage,
    lessonState.currentLocation,
    lessonState.viewing,
    lessonState.saveCount,
    lessonState.subscription,
  ]);

  // @ts-ignore
  return (
    <>
      <div className={`absolute w-16 content-end`}>
        {/**
         * AUTOSAVE
         */}
        {lessonState.viewing ? (
          <div
            className={`cursor-default flex flex-col justify-center items-center mb-4`}>
            <div className="relative flex items-center justify-center h-4 w-4 m-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600" />
            </div>
            <p className={`self-end text-xs text-gray-200 text-center`}>AutoSave</p>
          </div>
        ) : null}

        {/**
         * HOME
         */}
        <HomeWidget handlePopup={handlePopup} />

        {/**
         * NOTES
         */}
        {/* <NotesWidget overlay={overlay} setOverlay={setOverlay} /> */}
      </div>
    </>
  );
};

export default SideMenu;
