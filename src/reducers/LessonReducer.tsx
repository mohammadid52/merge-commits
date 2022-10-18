import {
  StudentExerciseData,
  StudentPageInput,
  UniversalLesson,
  UniversalLessonPage
} from '../interfaces/UniversalLessonInterfaces';
import {lessonState as initialLessonState} from 'state/LessonState';

const LESSON_REDUCER_TYPES = {
  TEST: 'TEST',
  SET_INITIAL_STATE: 'SET_INITIAL_STATE',
  SET_UPDATE_STATE: 'SET_UPDATE_STATE',
  SET_SUBSCRIBE_FUNCTION: 'SET_SUBSCRIBE_FUNCTION',
  SET_SUBSCRIPTION: 'SET_SUBSCRIPTION',
  SET_ROOM_SUBSCRIPTION_DATA: 'SET_ROOM_SUBSCRIPTION_DATA',
  SET_LESSON_DATA: 'SET_LESSON_DATA',
  SET_INITIAL_STUDENT_DATA: 'SET_INITIAL_STUDENT_DATA',
  LOAD_STUDENT_DATA: 'LOAD_STUDENT_DATA',
  LOAD_SURVEY_DATA: 'LOAD_SURVEY_DATA',
  LOAD_STUDENT_SUBSCRIPTION_DATA: 'LOAD_STUDENT_SUBSCRIPTION_DATA',
  LOAD_STUDENT_SHARE_DATA: 'LOAD_STUDENT_SHARE_DATA',
  UPDATE_PERSON_LOCATION: 'UPDATE_PERSON_LOCATION',
  UNLOAD_STUDENT_DATA: 'UNLOAD_STUDENT_DATA',
  LESSON_LOADED: 'LESSON_LOADED',
  UNLOAD_STUDENT_SHARE_DATA: 'UNLOAD_STUDENT_SHARE_DATA',
  SET_UPDATE_STATUS: 'SET_UPDATE_STATUS',
  UPDATE_STUDENT_DATA: 'UPDATE_STUDENT_DATA',
  UPDATE_SURVEY_DATA: 'UPDATE_SURVEY_DATA',
  COMPLETE_STUDENT_UPDATE: 'COMPLETE_STUDENT_UPDATE',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_CLOSED_PAGES: 'SET_CLOSED_PAGES',
  TOGGLE_OPEN_PAGE: 'TOGGLE_OPEN_PAGE',
  TOGGLE_CLOSE_PAGE: 'TOGGLE_CLOSE_PAGE',
  INCREMENT_SAVE_COUNT: 'INCREMENT_SAVE_COUNT',
  SET_LAST_PAGE: 'SET_LAST_PAGE',
  CLEANUP: 'CLEANUP',
  ADD_NEW_INPUT: 'ADD_NEW_INPUT',
  SET_LESSON_PAYLOAD: 'SET_LESSON_PAYLOAD',
  SET_PERSON_LESSON_DATA: 'SET_PERSON_LESSON_DATA'
};

export type LessonActions =
  | {
      type: 'TEST';
      payload: '';
    }
  | {
      type: 'SET_INITIAL_STATE';
      payload: {universalLessonID: string};
    }
  | {
      type: 'SET_UPDATE_STATE';
      payload: boolean;
    }
  | {
      type: 'SET_SUBSCRIBE_FUNCTION';
      payload: {subscribeFunc: Function};
    }
  | {
      type: 'SET_SUBSCRIPTION';
      payload: {subscription: any};
    }
  | {
      type: 'SET_ROOM_SUBSCRIPTION_DATA';
      payload: {
        ClosedPages?: string[] | any;
        activeLessonId?: string | null;
        createdAt?: string;
        currentPage?: number | null;
        disabledPages?: string[] | any;
        displayData?: {
          isTeacher?: boolean;
          studentAuthID?: string;
          lessonPageID?: string;
        }[];
        id: string;
        studentViewing?: string | '';
        updatedAt?: string;
      };
    }
  | {
      type: 'SET_LESSON_DATA';
      payload: UniversalLesson;
    }
  | {
      type: 'SET_INITIAL_STUDENT_DATA';
      payload: {
        requiredInputs: [string[]];
        studentData: [StudentPageInput[]];
        exerciseData: [StudentExerciseData[]];
      };
    }
  | {
      type: 'LOAD_STUDENT_DATA';
      payload: {
        dataIdReferences: {
          id: string;
          pageIdx: number;
          lessonPageID: string;
          update: boolean;
        }[];
        filteredStudentData?: [StudentPageInput[]];
        filteredExerciseData?: [StudentExerciseData[]];
      };
    }
  | {
      type: 'LOAD_SURVEY_DATA';
      payload: {
        dataIdReferences: {
          id: string;
          pageIdx: number;
          lessonPageID: string;
          update: boolean;
        }[];
        surveyData?: [StudentPageInput[]];
      };
    }
  | {
      type: 'LOAD_STUDENT_SUBSCRIPTION_DATA';
      payload: {
        stDataIdx: number;
        subData: StudentPageInput[];
      };
    }
  | {
      type: 'LOAD_STUDENT_SHARE_DATA';
      payload: any;
    }
  | {
      type: 'UPDATE_PERSON_LOCATION';
      payload: any;
    }
  | {
      type: 'UNLOAD_STUDENT_DATA';
      payload: any;
    }
  | {
      type: 'UNLOAD_STUDENT_SHARE_DATA';
      payload?: any;
    }
  | {
      type: 'SET_UPDATE_STATUS';
      payload: {pageIdx: number};
    }
  | {
      type: 'UPDATE_STUDENT_DATA';
      payload: {pageIdx: number; data: StudentPageInput};
    }
  | {
      type: 'UPDATE_SURVEY_DATA';
      payload: {data: StudentPageInput};
    }
  | {
      type: 'COMPLETE_STUDENT_UPDATE';
      payload: any;
    }
  | {
      type: 'SET_CURRENT_PAGE';
      payload: number;
    }
  | {
      type: 'SET_CLOSED_PAGES';
      payload: string[];
    }
  | {
      type: 'TOGGLE_OPEN_PAGE';
      payload: number;
    }
  | {
      type: 'TOGGLE_CLOSE_PAGE';
      payload: number;
    }
  | {
      type: 'INCREMENT_SAVE_COUNT';
      payload: any;
    }
  | {
      type: 'SET_LAST_PAGE';
      payload: boolean;
    }
  | {
      type: 'CLEANUP';
      payload?: any;
    }
  | {
      type: 'ADD_NEW_INPUT';
      payload?: any;
    }
  | {
      type: 'SET_COMPLETED_LESSONS';
      payload?: any;
    }
  | {
      type: 'SET_LESSON_PAYLOAD';
      payload?: {
        lessonPayload?: any;
      };
    };

export const lessonReducer = (state: any, action: LessonActions) => {
  switch (action.type) {
    case LESSON_REDUCER_TYPES.TEST:
      console.log('lessonReducer test...');
      break;
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        universalLessonID: action.payload.universalLessonID
      };

    case LESSON_REDUCER_TYPES.SET_LAST_PAGE:
      return {
        ...state,
        isLastPage: action.payload
      };
    case LESSON_REDUCER_TYPES.SET_UPDATE_STATE:
      return {
        ...state,
        updated: action.payload
      };
    case LESSON_REDUCER_TYPES.SET_SUBSCRIBE_FUNCTION:
      return {
        ...state,
        subscribeFunc: action.payload.subscribeFunc
      };
    case LESSON_REDUCER_TYPES.SET_SUBSCRIPTION:
      return {
        ...state,
        subscription: action.payload.subscription
      };
    case LESSON_REDUCER_TYPES.SET_ROOM_SUBSCRIPTION_DATA:
      console.log('SET_ROOM_SUBSCRIPTION_DATA - ', action.payload);
      const havePagesChanged = Object.keys(action.payload).includes('ClosedPages');
      const mappedClosedPages = havePagesChanged
        ? state.lessonData.lessonPlan.map((page: UniversalLessonPage, idx: number) => {
            if (action.payload.ClosedPages?.includes(page.id)) {
              return {...page, open: false};
            } else {
              return {...page, open: true};
            }
          })
        : state.lessonData.lessonPlan;

      return {
        ...state,
        lessonData: {
          ...state.lessonData,
          lessonPlan: mappedClosedPages
        },
        currentPage: state.currentPage,
        displayData: action.payload.displayData
          ? action.payload.displayData
          : state.displayData,
        studentViewing:
          action.payload.studentViewing === ''
            ? ''
            : action.payload.studentViewing
            ? action.payload.studentViewing
            : state.studentViewing
      };
    case LESSON_REDUCER_TYPES.SET_LESSON_DATA:
      return {
        ...state,
        lessonData: action.payload
      };
    case LESSON_REDUCER_TYPES.SET_INITIAL_STUDENT_DATA:
      const requiredInputs = action.payload.requiredInputs;
      const studentData = action.payload.studentData;
      const exerciseData = action.payload.exerciseData;

      return {
        ...state,
        requiredInputs: requiredInputs,
        studentData: studentData,
        exerciseData: exerciseData
      };
    case LESSON_REDUCER_TYPES.ADD_NEW_INPUT:
      let oldStudentData = [...state.studentData];
      const _newInput = {domID: action.payload.domID, input: action.payload.input};
      const currentPageStudentData = [...oldStudentData[state.currentPage], _newInput];

      oldStudentData[state.currentPage] = currentPageStudentData;
      return {
        ...state,
        studentData: oldStudentData
      };
    case LESSON_REDUCER_TYPES.LOAD_STUDENT_DATA:
      console.log('LOAD_STUDENT_DATA', {payload: action.payload});
      return {
        ...state,
        loaded: true,
        universalStudentDataID: action.payload.dataIdReferences,
        studentData: action.payload.filteredStudentData
          ? action.payload.filteredStudentData
          : state.studentData,
        exerciseData: action.payload.filteredExerciseData
          ? action.payload.filteredExerciseData
          : state.exerciseData
      };
    case LESSON_REDUCER_TYPES.LOAD_SURVEY_DATA:
      return {
        ...state,
        loaded: true,
        universalStudentDataID: action.payload.dataIdReferences,
        studentData: action.payload.surveyData
          ? action.payload.surveyData
          : state.studentData
      };
    case LESSON_REDUCER_TYPES.LOAD_STUDENT_SUBSCRIPTION_DATA:
      const stDataIdx = action.payload.stDataIdx;
      const subData = action.payload.subData;
      const newStudentData =
        state.studentData.length > 0
          ? state.studentData.map((inputArr: StudentPageInput[], inputArrIdx: number) => {
              if (inputArrIdx === stDataIdx) {
                return subData;
              } else {
                return inputArr;
              }
            })
          : [];
      if (newStudentData.length > 0) {
        return {
          ...state,
          studentData: newStudentData
        };
      } else {
        return state;
      }
    case LESSON_REDUCER_TYPES.LOAD_STUDENT_SHARE_DATA:
      return {
        ...state,
        sharedData: action.payload
      };
    case LESSON_REDUCER_TYPES.UPDATE_PERSON_LOCATION:
      return {
        ...state,
        personLocationObj: action.payload
      };
    case LESSON_REDUCER_TYPES.UNLOAD_STUDENT_DATA:
      console.log('unloading student data');
      return {
        ...state,
        loaded: false,
        universalStudentDataID: [],
        studentData: []
      };
    case LESSON_REDUCER_TYPES.UNLOAD_STUDENT_SHARE_DATA:
      return {
        ...state,
        sharedData: []
      };
    case LESSON_REDUCER_TYPES.LESSON_LOADED:
      return {
        ...state,
        loaded: action.payload
      };
    case LESSON_REDUCER_TYPES.UPDATE_STUDENT_DATA:
      console.log('UPDATE_STUDENT_DATA');
      const pageIdx = action.payload.pageIdx;
      const domID = action.payload.data.domID;
      const newInput = action.payload.data.input;

      // ~~~~~ TOGGLE DB DATA-ID TO UPDATED ~~~~ //
      const updatedStudentDataIdArray = state?.universalStudentDataID.map(
        (dataIdObj: any) => {
          if (dataIdObj.pageIdx == pageIdx) {
            return {
              ...dataIdObj,
              update: true
            };
          } else {
            return dataIdObj;
          }
        }
      );

      // ~~~~~~ UPDATE STUDENT DATA ARRAY ~~~~~~ //
      const updatedTargetStudentData =
        state?.studentData[pageIdx].map((studentPageInput: StudentPageInput) => {
          return {
            domID: studentPageInput.domID,
            input: studentPageInput.domID === domID ? newInput : studentPageInput.input
          };
        }) || [];
      // merge updated object into original array
      const mappedStudentData = state?.studentData.map(
        (pageData: StudentPageInput[], idx: number) => {
          if (idx === pageIdx) {
            return updatedTargetStudentData;
          } else {
            return pageData;
          }
        }
      );

      // ~~~~~~ UPDATE EXERCISE DATA ARRAY ~~~~~ //
      const updatedExerciseData =
        state?.exerciseData[pageIdx].map((exercise: any) => {
          return {
            ...exercise,
            entryData: exercise.entryData.map((entry: any) => {
              if (entry.domID === domID) {
                return {
                  ...entry,
                  input: newInput[0]
                };
              } else {
                return entry;
              }
            })
          };
        }) || [];
      const mappedExerciseData = state?.exerciseData.map(
        (pageExerciseArray: any[], exerciseIdx: number) => {
          if (exerciseIdx === pageIdx) {
            return updatedExerciseData;
          } else {
            return pageExerciseArray;
          }
        }
      );

      // console.log('this page exercise data - ', state?.exerciseData[pageIdx]);?

      return {
        ...state,
        updated: true,
        universalStudentDataID: [...updatedStudentDataIdArray],
        studentData: mappedStudentData,
        exerciseData: mappedExerciseData
      };
    case LESSON_REDUCER_TYPES.UPDATE_SURVEY_DATA:
      const surveyDomID = action.payload.data.domID;
      const newSurveyInput = action.payload.data.input;

      const updatedSurveyStudentData = state.studentData.map((obj: any) =>
        obj.domID === surveyDomID ? {...obj, input: newSurveyInput} : obj
      );

      return {
        ...state,
        updated: true,
        universalStudentDataID: [{...state.universalStudentDataID[0], update: true}],
        studentData: updatedSurveyStudentData
      };

    case LESSON_REDUCER_TYPES.COMPLETE_STUDENT_UPDATE:
      console.log('COMPLETE_STUDENT_UPDATE', state.universalStudentDataID);
      const resetDataIdArray = state.universalStudentDataID.map((obj: any) => {
        return {...obj, update: false};
      });
      return {
        ...state,
        universalStudentDataID: resetDataIdArray,
        updated: false
      };
    case LESSON_REDUCER_TYPES.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
        lessonProgress:
          action.payload > state.lessonProgress ? action.payload : state.lessonProgress
      };
    case LESSON_REDUCER_TYPES.TOGGLE_OPEN_PAGE:
      const mappedOpenPages = state.lessonData.lessonPlan.map(
        (page: UniversalLessonPage, idx: number) => {
          if (idx <= action.payload) {
            return {...page, open: true};
          } else {
            return page;
          }
        }
      );
      return {...state, lessonData: {...state.lessonData, lessonPlan: mappedOpenPages}};
    case LESSON_REDUCER_TYPES.TOGGLE_CLOSE_PAGE:
      const mappedClosePages = state.lessonData.lessonPlan.map(
        (page: UniversalLessonPage, idx: number) => {
          if (idx >= action.payload) {
            return {...page, open: false};
          } else {
            return page;
          }
        }
      );
      return {...state, lessonData: {...state.lessonData, lessonPlan: mappedClosePages}};
    case LESSON_REDUCER_TYPES.INCREMENT_SAVE_COUNT:
      return {...state, saveCount: state.saveCount + 1};
    case LESSON_REDUCER_TYPES.CLEANUP:
      console.log('cleanup...');
      return initialLessonState;
    case LESSON_REDUCER_TYPES.SET_LESSON_PAYLOAD:
      return {
        ...state,
        lessonPayload: action.payload
      };
    case LESSON_REDUCER_TYPES.SET_PERSON_LESSON_DATA:
      return {
        ...state,
        misc: {
          ...state.misc,
          personLessonData: action.payload
        }
      };
    default:
      return state;
  }
};
