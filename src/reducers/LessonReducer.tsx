import {lessonState} from '../state/LessonState';
import {
  UniversalLesson,
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
    case 'CLEANUP':
      return lessonState;
    default:
      return state;
  }
};
