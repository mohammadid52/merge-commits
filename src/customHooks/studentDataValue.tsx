import {useContext} from 'react';
import {GlobalContext} from '../contexts/GlobalContext';
import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
import useInLessonCheck from './checkIfInLesson';

const useStudentDataValue = () => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;

  // ~~~~~~~~~~~~~~~~ PAGES ~~~~~~~~~~~~~~~~ //
  const PAGES = lessonState?.lessonData?.lessonPlan;
  const CURRENT_PAGE = lessonState?.currentPage;

  // ~~~~~~~~~~~~~ DATA SOURCE ~~~~~~~~~~~~~ //
  const originalStudentData = lessonState.studentData[lessonState.currentPage];
  const sharedData = lessonState.sharedData;

  // ~~~~~~~~~~~~~~ USER ROLES ~~~~~~~~~~~~~ //
  const isStudent = user.role === 'ST';
  const isTeacher = user.role === 'TR' || user.role === 'FLW';
  const isInLesson = useInLessonCheck();

  // ~~~~~~~~~~~~ SHARING STATUS ~~~~~~~~~~~ //
  const isOtherStudent = lessonState.displayData[0]?.studentAuthID !== user.authId;
  const sharingActive = lessonState.displayData[0]?.studentAuthID !== '';
  const sharedDataFromSamePage =
    PAGES &&
    PAGES.length > 0 &&
    lessonState.displayData[0]?.lessonPageID === PAGES[CURRENT_PAGE]?.id;

  // ##################################################################### //
  // ############################## GETTERS ############################## //
  // ##################################################################### //
  const getStudentDataValue = (domID: string) => {
    const getInput = originalStudentData
      ? originalStudentData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput !== undefined) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDisplayDataStudentValue = (domID: string) => {
    const getInput = sharedData
      ? sharedData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput !== undefined) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDataValue = (domID: string): string[] => {
    if (sharedDataFromSamePage /** */) {
      if (isStudent && isOtherStudent) {
        return getDisplayDataStudentValue(domID);
      } else if (isTeacher || !isOtherStudent) {
        return getStudentDataValue(domID);
      }
    } else {
      return getStudentDataValue(domID);
    }
  };

  // ##################################################################### //
  // ############################## SETTERS ############################## //
  // ##################################################################### //
  const setStudentDataValue = (domID: string, input: string[]) => {
    if (isStudent && isInLesson) {
      lessonDispatch({
        type: 'UPDATE_STUDENT_DATA',
        payload: {
          pageIdx: lessonState.currentPage,
          data: {
            domID: domID,
            input: input,
          },
        },
      });
    }
  };

  const setDataValue = (domID: string, input: string[]) => {
    if (!sharingActive || !sharedDataFromSamePage) {
      setStudentDataValue(domID, input);
    }
  };

  return {
    getDataValue: getDataValue,
    setDataValue: setDataValue,
  };
};

export default useStudentDataValue;
