import {StudentPageInput} from 'interfaces/UniversalLessonInterfaces';
import {useGlobalContext} from 'contexts/GlobalContext';
import useInLessonCheck from './checkIfInLesson';
import useAuth from './useAuth';

const useStudentDataValue = () => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const gContext = useGlobalContext();
  const user = gContext.state.user;
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;

  // ~~~~~~~~~~~~~~~~ PAGES ~~~~~~~~~~~~~~~~ //
  const PAGES = lessonState?.lessonData?.lessonPlan;
  const CURRENT_PAGE = lessonState?.currentPage;

  // ~~~~~~~~~~~~~~ USER ROLES ~~~~~~~~~~~~~ //
  const {isStudent, isTeacher, isFellow} = useAuth();

  const isInLesson = isStudent ? useInLessonCheck() : false;

  // ~~~~~~~~~~~ CHECK IF SURVEY ~~~~~~~~~~~ //
  const isSurvey = lessonState && lessonState.lessonData?.type === 'survey';

  // ~~~~~~~~~~~~~ DATA SOURCE ~~~~~~~~~~~~~ //
  /**********************************************
   * STUDENT'S LESSON INPUT DATA IS STORED LIKE *
   *    [[{}], [{}]] AKA.AN ARRAY OF ARRAYS     *
   * STUDENT'S SURVEY INPUT DATA IS STORED LIKE *
   *        [{},{},{}] AKA. MUCH FLATTER        *
   **********************************************/
  const originalStudentData = isSurvey
    ? lessonState.studentData
    : lessonState.studentData[lessonState.currentPage];
  const sharedData = lessonState.sharedData;

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
      } else if (isTeacher || isFellow || !isOtherStudent) {
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
      if (!isSurvey) {
        lessonDispatch({
          type: 'UPDATE_STUDENT_DATA',
          payload: {
            pageIdx: lessonState.currentPage,
            data: {
              domID: domID,
              input: input
            }
          }
        });
      } else {
        lessonDispatch({
          type: 'UPDATE_SURVEY_DATA',
          payload: {
            data: {
              domID: domID,
              input: input
            }
          }
        });
      }
    }
  };

  const setDataValue = (domID: string, input: string[]) => {
    if (!sharingActive || !sharedDataFromSamePage) {
      setStudentDataValue(domID, input);
    }
  };

  return {
    getDataValue: getDataValue,
    setDataValue: setDataValue
  };
};

export default useStudentDataValue;
