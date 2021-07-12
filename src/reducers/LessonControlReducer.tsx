import {lessonControlState, lessonControlStateType} from '../state/LessonControlState';
import {StudentData} from '../API';
import {UniversalLessonStudentData} from '../interfaces/UniversalLessonInterfaces';

type lessonControlActions =
  | {
      type: 'SET_INITIAL_CONTROL_STATE';
      payload: any;
    }
  | {
      type: 'UPDATE_LESSON_DATA';
      payload: any;
    }
  | {
      type: 'UPDATE_STUDENT_ROSTER';
      payload: {students: any[]};
    }
  | {
      type: 'SET_STUDENT_VIEWING';
      payload: string;
    }
  | {
      type: 'UPDATE_STUDENT_DATA';
      payload: UniversalLessonStudentData;
    }
  | {
      type: 'CLEANUP';
      payload: any;
    };

export const lessonControlReducer = (
  state: lessonControlStateType,
  action: lessonControlActions
) => {
  switch (action.type) {
    case 'CLEANUP':
      return state;
    case 'UPDATE_STUDENT_ROSTER':
      return {...state, roster: action.payload.students};
    case 'SET_STUDENT_VIEWING':
      return {...state, studentViewing: action.payload};
    case 'UPDATE_STUDENT_DATA':
      return {...state, studentData: action.payload};
    default:
      return state;
  }
};