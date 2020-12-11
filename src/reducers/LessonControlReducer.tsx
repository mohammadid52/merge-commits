import { lessonControlStateType, lessonControlState } from '../state/LessonControlState';

type lessonControlActions =
  | {
      type: 'INITIAL_LESSON_SETUP';
      payload: any;
    }
  | {
      type:
        | 'OPEN_LESSON'
        | 'DISABLE_LESSON'
        | 'CLOSE_LESSON'
        | 'DELETE_DISPLAY_DATA'
        | 'SET_DISPLAY_DATA'
        | 'SET_STUDENT_VIEWING'
        | 'SET_SHARE_MODE'
        | 'QUIT_SHARE_MODE'
        | 'SAVED_CHANGES'
        | 'UPDATE_STUDENT_DATA'
        | 'QUIT_STUDENT_VIEWING'
        | 'RESET_DONE'
        | 'START_CLASSROOM'
        | 'COMPLETE_CLASSROOM';
      payload: any;
    }
  | {
      type: 'CLEANUP';
    };

export const lessonControlReducer = (state: lessonControlStateType, action: lessonControlActions) => {
  switch (action.type) {
    case 'INITIAL_LESSON_SETUP':
      return {
        ...state,
        classroomID: action.payload.classroomID,
        status: 'loaded',
        pages: action.payload.pages,
        data: action.payload.data,
        roster: action.payload.students,
        open: action.payload.open,
        complete: action.payload.complete,
        expectedStartDate: action.payload.expectedStartDate,
        expectedEndDate: action.payload.expectedEndDate,
      };
    case 'OPEN_LESSON':
      return {
        ...state,
        unsavedChanges: true,
        pages: state.pages.map((page, pageID: number) => {
          if (pageID <= action.payload.pageIndex) {
            return {
              ...page,
              open: true,
            };
          } else {
            return page;
          }
        }),
      };
    case 'CLOSE_LESSON':
      return {
        ...state,
        unsavedChanges: true,
        pages: state.pages.map((page, pageID: number) => {
          if (pageID !== 0 && pageID >= action.payload.pageIndex) {
            return {
              ...page,
              open: false,
            };
          } else {
            return page;
          }
        }),
      };
    case 'DISABLE_LESSON':
      return {
        ...state,
        unsavedChanges: true,
        pages: state.pages.map((page, pageID: number) => {
          if (
            action.payload.stage === page.stage ||
            (page.type === 'breakdown' && page.stage.includes(action.payload.stage))
          ) {
            return { ...page, disabled: !page.disabled };
          } else {
            return page;
          }
        }),
      };
    case 'SET_SHARE_MODE':
      return {
        ...state,
        sharing: true,
        unsavedChanges: true,
        pages: state.pages.map((page) => {
          if (action.payload !== page.stage) {
            return page;
          } else {
            return {
              ...page,
              displayMode: 'COOP',
            };
          }
        }),
      };
    case 'UPDATE_STUDENT_DATA':
      let foundInRoster = state.roster.some((student: any) => {
        return student.id === action.payload.id;
      });

      let doneArray = state.done;

      let saveType = action.payload.saveType;

      if (saveType === 'done') {
        let foundInDoneArray = doneArray.some((item: string) => {
          return item === action.payload.student.email;
        });

        if (!foundInDoneArray) {
          doneArray.push(action.payload.student.email);
          console.log('added', doneArray);
        }
      }

      // let viewing = state.studentViewing.studentInfo && state.studentViewing.studentInfo.id ? state.studentViewing.studentInfo.id === action.payload.id : null;

      let viewing = state.studentViewing.studentInfo?.id === action.payload.id;

      if (foundInRoster) {
        if (viewing) {
          return {
            ...state,
            studentDataUpdated: true,
            done: doneArray,
            roster: state.roster.map((student: any) => {
              if (student.id === action.payload.id) {
                return action.payload;
              }
              return student;
            }),
            studentViewing: {
              ...state.studentViewing,
              studentInfo: action.payload,
            },
          };
        }

        return {
          ...state,
          done: doneArray,
          studentDataUpdated: true,
          roster: state.roster.map((student: any) => {
            if (student.id === action.payload.id) {
              return action.payload;
            }
            return student;
          }),
        };
      }

      let updatedArray = state.roster;
      updatedArray.push(action.payload);

      return {
        ...state,
        studentDataUpdated: true,
        done: doneArray,
        roster: updatedArray,
      };

    case 'RESET_DONE':
      return {
        ...state,
        done: [],
      };
    case 'QUIT_SHARE_MODE':
      return {
        ...state,
        sharing: false,
        unsavedChanges: true,
        displayData: {},
        pages: state.pages.map((page) => {
          return {
            ...page,
            displayMode: 'SELF',
          };
        }),
      };
    case 'SAVED_CHANGES':
      return {
        ...state,
        unsavedChanges: false,
      };
    case 'SET_DISPLAY_DATA':
      return {
        ...state,
        unsavedChanges: true,
        displayData: action.payload,
      };
    case 'DELETE_DISPLAY_DATA':
      return {
        ...state,
        unsavedChanges: true,
        displayData: {
          ...state.displayData,
          breakdownComponent: '',
        },
      };
    case 'SET_STUDENT_VIEWING':
      // console.log('SET_STUDENT_VIEWING', action.payload);

      if (state.studentViewing.studentInfo && state.studentViewing.studentInfo.id === action.payload.id) {
        // console.log('firstIf');

        return {
          ...state,
          studentDataUpdated: true,
          unsavedChanges: true,
          studentViewing: {
            live: false,
            studentInfo: {},
          },
        };
      }

      return {
        ...state,
        studentDataUpdated: false,
        unsavedChanges: true,
        studentViewing: {
          live: true,
          studentInfo: action.payload,
        },
      };

    case 'QUIT_STUDENT_VIEWING':
      return {
        ...state,
        unsavedChanges: true,
        studentDataUpdated: true,
        studentViewing: {
          live: false,
          studentInfo: {},
        },
      };
    case 'START_CLASSROOM':
      return {
        ...state,
        open: true,
        unsavedChanges: true,
      };
    case 'COMPLETE_CLASSROOM':
      return {
        ...state,
        complete: true,
        unsavedChanges: true,
      };
    case 'CLEANUP':
      return lessonControlState;
    default:
      return state;
  }
};
