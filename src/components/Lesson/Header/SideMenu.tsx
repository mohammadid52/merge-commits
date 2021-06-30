import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../customGraphql/customMutations';
import useStudentTimer from '../../../customHooks/timer';
import NotesWidget from './SideMenu/NotesWidget';
import { LessonHeaderBarProps } from '../../../interfaces/LessonComponentsInterfaces';
import HomeWidget from './SideMenu/HomeWidget';
import { GlobalContext } from '../../../contexts/GlobalContext';

const SideMenu = (props: LessonHeaderBarProps) => {
  const {overlay, setOverlay} = props;
  const [cookies, setCookie] = useCookies(['lesson']);
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const [isToggled, setIsToggled] = useState<string[]>(['']);

  /**
   * FUNCTION TO SAVE STUDENT DATA ON COMMAND
   * @param saveType
   */
  const updateStudentData = async (saveType?: string) => {
    let lessonProgress =
      lessonState.currentPage > lessonState.lessonProgress ? lessonState.currentPage : lessonState.lessonProgress;

    let data = {
      id: lessonState.studentDataID,
      lessonProgress: lessonProgress,
      status: lessonState.studentStatus,
      saveType: saveType,
      syllabusLessonID: lessonState.syllabusLessonID,
      studentID: lessonState.studentUsername,
      studentAuthID: lessonState.studentAuthID,
      // warmupData: lessonState.componentlessonState.story ? state.componentState.story : null,
      // corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
      // activityData: state.componentState.poem ? state.componentState.poem : null,
    };

    try {
      const dataObject: any = await API.graphql(
        graphqlOperation(customMutations.updateStudentData, {input: data})
      );
      console.log(dataObject);
      lessonDispatch({type: 'SAVED_CHANGES'});
      console.log('lessonState', lessonState);
    } catch (error) {
      console.error(error);
    }
  };

  const {changeParams, resetParams} = useStudentTimer({
    dispatch: lessonDispatch,
    subscription: lessonState.subscription,
    subscribeFunc: lessonState.subscribeFunc,
    callback: updateStudentData,
    state: state,
    lessonState: lessonState,
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
      <div
        className={`absolute w-16 content-end`}>
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
        <HomeWidget
          overlay={overlay}
          setOverlay={setOverlay}
          handlePopup={props.handlePopup}
        />

        {/**
         * NOTES
         */}
        <NotesWidget overlay={overlay} setOverlay={setOverlay} />
      </div>
    </>
  );
};

export default SideMenu;
