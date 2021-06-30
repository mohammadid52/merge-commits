import {lessonState} from '../state/LessonState';
import {
  UniversalLesson,
  UniversalLessonPage,
  UniversalLessonStudentData,
} from '../interfaces/UniversalLessonInterfaces';
// import { useStudentTimer } from '../customHooks/timer'

export type LessonActions =
  | {
      type: 'TEST';
      payload: '';
    }
  | {
      type: 'SET_LESSON_DATA';
      payload: UniversalLesson;
    }
  | {
      type: 'SET_INITIAL_STATE';
      payload: UniversalLessonStudentData;
    }
  | {
      type: 'SET_INITIAL_STUDENT_DATA';
      payload: UniversalLessonStudentData[];
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
      payload: '';
    };

export const lessonReducer = (state: any, action: LessonActions) => {
  switch (action.type) {
    case 'TEST':
      console.log('lessonReducer test...');
      break;
    case 'SET_LESSON_DATA':
      return {
        ...state,
        lessonData: action.payload,
      };
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        studentData: action.payload,
      };
    case 'SET_INITIAL_STUDENT_DATA':
      return {
        ...state,
        studentData: action.payload
      }
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
      return lessonState;
    default:
      return state;
  }
};
