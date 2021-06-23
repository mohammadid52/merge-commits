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
      state.pages[state.lessonProgress].stage === ''
        ? 'intro'
        : state.pages[state.lessonProgress].stage;

    let data = {
      id: state.studentDataID,
      lessonProgress: lessonProgress,
      status: state.studentStatus,
      saveType: saveType,
      syllabusLessonID: state.syllabusLessonID,
      studentID: state.studentUsername,
      studentAuthID: state.studentAuthID,
      warmupData: state.componentState.story ? state.componentState.story : null,
      corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
      activityData: state.componentState.poem ? state.componentState.poem : null,
    };

    try {
      const dataObject: any = await API.graphql(
        graphqlOperation(customMutations.updateStudentData, {input: data})
      );
      console.log(dataObject);
      dispatch({type: 'SAVED_CHANGES'});
      console.log('state', state);
    } catch (error) {
      console.error(error);
    }
  };

  const {changeParams, resetParams} = useStudentTimer({
    dispatch: dispatch,
    subscription: state.subscription,
    subscribeFunc: state.subscribeFunc,
    callback: updateStudentData,
    state: state,
  });

  useEffect((): any => {
    if (state) {
      changeParams('state', state);
    }

    return () => resetParams();
  }, [
    state.studentStatus,
    state.currentPage,
    state.currentLocation,
    state.viewing,
    state.saveCount,
    state.subscription,
  ]);

  // @ts-ignore
  return (
    <>
      <div
        className={`absolute w-16 content-end`}>
        {/**
         * AUTOSAVE
         */}
        {state.viewing ? (
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
