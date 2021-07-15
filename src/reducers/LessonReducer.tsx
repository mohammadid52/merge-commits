import {lessonState, lessonStateType} from '../state/LessonState';
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
      type: 'SET_LESSON_DATA';
      payload: UniversalLesson;
    }
  | {
      type: 'SET_INITIAL_STUDENT_DATA';
      payload: UniversalLessonStudentData[];
    }
  | {
      type: 'UPDATE_STUDENT_DATA';
      payload: {pageIdx: number; data: StudentPageInput};
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
import {
  StudentPageInput,
  UniversalLesson,
  UniversalLessonPage,
  UniversalLessonStudentData,
} from '../interfaces/UniversalLessonInterfaces';

// import { useStudentTimer } from '../customHooks/timer'

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
    case 'UPDATE_STUDENT_DATA':
      const pageIdx = action.payload.pageIdx;
      const domID = action.payload.data.domID;
      const newInput = action.payload.data.input;
      // update single object
      const updatedTargetStudentData = state.studentData[pageIdx].map(
        (studentPageInput: StudentPageInput) => {
          return {
            domID: studentPageInput.domID,
            input: studentPageInput.domID === domID ? newInput : studentPageInput.input,
          };
        }
      );
      // merge updated object into original array
      const mappedStudentData = state.studentData.map(
        (pageData: StudentPageInput[], idx: number) => {
          if (idx === pageIdx) {
            return updatedTargetStudentData;
          } else {
            return pageData;
          }
        }
      );
      return {...state, studentData: mappedStudentData};
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
            return {...page, open: !page.open};
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