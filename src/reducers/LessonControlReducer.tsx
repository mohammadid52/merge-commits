import {lessonControlStateType} from '../state/LessonControlState';

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
    default:
      return state;
  }
};