import {lessonControlState, lessonControlStateType} from '../state/LessonControlState';

type lessonControlActions =
  | {
      type: 'UPDATE_LESSON_DATA';
      payload: any;
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
      return lessonControlState;
    default:
      return state;
  }
};