import {useContext} from 'react';
import {GlobalContext} from '../contexts/GlobalContext';
import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';

const useStudentDataValue = () => {
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;

  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;

  const getStudentDataValue = (domID: string) => {
    const pageData = lessonState.studentData[lessonState.currentPage];
    const getInput = pageData
      ? pageData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput !== undefined) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDisplayDataStudentValue = (domID: string) => {
    const pageData = lessonState.sharedData;
    const getInput = pageData
      ? pageData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput !== undefined) {
      return getInput.input;
    } else {
      return [''];
    }
  };

  const getDataValue = (domID: string) => {
    const sharingActive = lessonState.displayData[0]?.studentAuthID !== '';
    const sharedDataFromSamePage =
      lessonState.displayData[0]?.lessonPageID === PAGES[CURRENT_PAGE]?.id;
    if (sharingActive && sharedDataFromSamePage) {
      return getDisplayDataStudentValue(domID);
    } else {
      return getStudentDataValue(domID);
    }
  };

  return {
    getDataValue: getDataValue,
  };
};

export default useStudentDataValue;
