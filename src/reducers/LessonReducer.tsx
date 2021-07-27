import {
  StudentPageInput,
  UniversalLesson,
  UniversalLessonPage,
  UniversalLessonStudentData,
} from '../interfaces/UniversalLessonInterfaces';
import {lessonStateType} from '../state/LessonState';

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
      type: 'SET_SUBSCRIPTION_DATA';
      payload: {
        ClosedPages?: string[] | any;
        activeLessonId?: string | null;
        createdAt?: string;
        currentPage?: number | null;
        disabledPages?: string[] | any;
        displayData?: UniversalLessonStudentData[] | null;
        id: string;
        studentViewing?: string | null;
        updatedAt?: string;
      };
    }
  | {
      type: 'SET_LESSON_DATA';
      payload: UniversalLesson;
    }
  | {
      type: 'SET_INITIAL_STUDENT_DATA';
      payload: UniversalLessonStudentData[];
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
        filteredStudentData?: StudentPageInput[];
      };
    }
  | {
      type: 'LOAD_STUDENT_DATA_SUBSCRIPTION';
      payload: {
        stDataIdx: number;
        subData: StudentPageInput[];
      };
    }
  | {
      type: 'UNLOAD_STUDENT_DATA';
      payload: any;
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
      type: 'COMPLETE_STUDENT_UPDATE';
      payload: any;
    }
  | {
      type: 'SET_DISPLAY_DATA';
      payload: UniversalLessonStudentData;
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
      type: 'INCREMENT_SAVE_COUNT';
      payload: any;
    }
  | {
      type: 'CLEANUP';
      payload: any;
    };

export const lessonReducer = (state: any, action: LessonActions) => {
  switch (action.type) {
    case 'TEST':
      console.log('lessonReducer test...');
      break;
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        universalLessonID: action.payload.universalLessonID,
      };
    case 'SET_UPDATE_STATE':
      return {
        ...state,
        updated: action.payload,
      };
    case 'SET_SUBSCRIBE_FUNCTION':
      return {
        ...state,
        subscribeFunc: action.payload.subscribeFunc,
      };
    case 'SET_SUBSCRIPTION':
      return {
        ...state,
        subscription: action.payload.subscription,
      };
    case 'SET_SUBSCRIPTION_DATA':
      const havePagesChanged = Object.keys(action.payload).includes('ClosedPages');
      const mappedClosedPages = havePagesChanged
        ? state.lessonData.lessonPlan.map((page: UniversalLessonPage, idx: number) => {
            if (action.payload.ClosedPages.includes(page.id)) {
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
          lessonPlan: mappedClosedPages,
        },
        displayData: action.payload.displayData
          ? action.payload.displayData
          : state.displayData,
        studentViewing:
          action.payload.studentViewing === ''
            ? ''
            : action.payload.studentViewing
            ? action.payload.studentViewing
            : state.studentViewing,
      };
    case 'SET_LESSON_DATA':
      return {
        ...state,
        lessonData: action.payload,
      };
    case 'SET_INITIAL_STUDENT_DATA':
      return {
        ...state,
        studentData: action.payload,
      };
    case 'LOAD_STUDENT_DATA':
      return {
        ...state,
        loaded: true,
        universalStudentDataID: action.payload.dataIdReferences,
        studentData: action.payload.filteredStudentData
          ? action.payload.filteredStudentData
          : state.studentData,
      };
    case 'LOAD_STUDENT_DATA_SUBSCRIPTION':
      const stDataIdx = action.payload.stDataIdx;
      const subData = action.payload.subData;
      const newStudentData = state.studentData.map(
        (inputArr: StudentPageInput[], inputArrIdx: number) => {
          if (inputArrIdx === stDataIdx) {
            return subData;
          } else {
            return inputArr;
          }
        }
      );
      console.log('state.studentData [IDX] - ', state.studentData[stDataIdx]);
      console.log('newStudentData [IDX] - ', newStudentData[stDataIdx]);
      return {
        ...state,
        studentData: newStudentData,
      };
    case 'UNLOAD_STUDENT_DATA':
      return {
        ...state,
        loaded: false,
        universalStudentDataID: [],
        studentData: [],
      };
    case 'UPDATE_STUDENT_DATA':
      const pageIdx = action.payload.pageIdx;
      const domID = action.payload.data.domID;
      const newInput = action.payload.data.input;

      const updatedStudentDataIdArray = state?.universalStudentDataID.map(
        (dataIdObj: any, idObjIdx: number) => {
          if (dataIdObj.pageIdx == pageIdx) {
            return {
              ...dataIdObj,
              update: true,
            };
          } else {
            return dataIdObj;
          }
        }
      );

      // update single object
      const updatedTargetStudentData =
        state?.studentData[pageIdx].map((studentPageInput: StudentPageInput) => {
          return {
            domID: studentPageInput.domID,
            input: studentPageInput.domID === domID ? newInput : studentPageInput.input,
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

      return {
        ...state,
        updated: true,
        universalStudentDataID: [...updatedStudentDataIdArray],
        studentData: mappedStudentData,
      };
    case 'COMPLETE_STUDENT_UPDATE':
      const resetDataIdArray = state.universalStudentDataID.map((obj: any) => {
        return {...obj, update: false};
      });
      return {
        ...state,
        universalStudentDataID: resetDataIdArray,
        updated: false,
      };
    case 'SET_DISPLAY_DATA':
      return {...state, displayData: [action.payload]};
    case 'SET_CURRENT_PAGE':
      return {...state, currentPage: action.payload};
    case 'TOGGLE_OPEN_PAGE':
      const mappedPages = state.lessonData.lessonPlan.map(
        (page: UniversalLessonPage, idx: number) => {
          if (idx !== action.payload) {
            return page;
          } else {
            return {...page, open: page.open === false ? true : false};
          }
        }
      );
      return {...state, lessonData: {...state.lessonData, lessonPlan: mappedPages}};
    case 'INCREMENT_SAVE_COUNT':
      return {...state, saveCount: state.saveCount + 1};
    case 'CLEANUP':
      console.log('cleanup...');
      return state;
    default:
      return state;
  }
};
