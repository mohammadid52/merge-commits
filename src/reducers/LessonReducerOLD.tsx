import {lessonState} from 'state/LessonState';
import {LessonStateType, PagesType} from 'state/LessonStateOLD';
// import { useStudentTimer } from 'customHooks/timer'

export type LessonActions =
  | {
      type: 'SET_INITIAL_STATE';
      payload: {
        syllabusLessonID: string;
        data?: any;
        pages: PagesType;
        displayData?: any;
        word_bank?: any;
        subscribeFunc: () => any;
      };
    }
  | {
      type: 'UPDATE_CHECKPOINT_DATA';
      payload: any[];
    }
  | {
      type: 'UPDATE_LESSON_PLAN';
      payload: {
        pages: PagesType;
        displayData?: any;
        viewing?: string;
      };
    }
  | {
      type: 'UPDATE_STUDENT_STATUS';
      payload: string;
    }
  | {
      type: 'SET_SAVE_FUNCTION';
      payload: Promise<void>;
    }
  | {
      type: 'SET_CURRENT_PAGE';
      payload: number;
    }
  | {
      type: 'SET_PROGRESS';
      payload: number;
    }
  | {
      type: 'SET_INITIAL_COMPONENT_STATE';
      payload: {
        [key: string]: any;
      };
    }
  | {
      type: 'SET_INITIAL_COMPONENT_STATE_FROM_DB';
      payload: {
        [key: string]: any;
      };
    }
  | {
      type: 'UPDATE_COMPONENT_STATE';
      payload: {
        componentName: string;
        inputName: string;
        content: any;
      };
    }
  | {
      type: 'CLEAR_QUESTION_DATA';
      payload: any;
    }
  | {
      type: 'SET_QUESTION_DATA';
      payload: {
        data: any;
      };
    }
  | {
      type: 'SET_QUESTION_DATA_UPDATE';
      payload: {
        data: any;
      };
    }
  | {
      type: 'ERROR';
      payload: string;
    }
  | {
      type: 'ADD_WORD';
      payload: string;
    }
  | {
      type: 'OPEN_LESSON';
      payload: string;
    }
  | {
      type: 'ACTIVATE_LESSON';
      payload: string;
    }
  | {
      type: 'ACTIVATE_CHECKPOINT';
      payload: string;
    }
  | {
      type: 'SET_PAGE';
      payload: number;
    }
  | {
      type: 'JUMP_PAGE';
      payload: number;
    }
  | {
      type: 'SET_SUBSCRIPTION';
      payload: {
        subscription: any;
      };
    }
  | {
      type: 'SET_STUDENT_INFO';
      payload: {
        studentDataID: string;
        studentUsername: string;
        studentAuthID: string;
      };
    }
  | {
      type: 'SET_LESSON_PROGRESS';
      payload: string;
    }
  | {
      type: 'CLEANUP';
    }
  | {
      type:
        | 'TEST'
        | 'PAGE_FORWARD'
        | 'PAGE_BACK'
        | 'CAN_CONTINUE'
        | 'NO_CONTINUE'
        | 'FINISH'
        | 'SAVED_CHANGES'
        | 'SET_LOADING'
        | 'INCREMENT_SAVE_COUNT';
    };

export const lessonReducerOLD = (state: LessonStateType, action: LessonActions) => {
  switch (action.type) {
    case 'TEST':
      // console.log('done')
      break;
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        status: 'loaded',
        syllabusLessonID: action.payload.syllabusLessonID,
        data: action.payload.data,
        pages: action.payload.pages,
        word_bank: action.payload.word_bank,
        displayData: action.payload.displayData,
        subscribeFunc: action.payload.subscribeFunc
      };
    case 'UPDATE_CHECKPOINT_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          lesson: {
            ...state.data.lesson,
            checkpoints: {...state.data.lesson.checkpoints, items: action.payload}
          }
        }
      };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
        lessonProgress: action.payload,
        pages: state.pages.map((page: {}, key: number) => {
          if (key <= action.payload) {
            return {
              ...page,
              active: true
            };
          } else {
            return page;
          }
        })
      };
    case 'SET_PROGRESS':
      return {
        ...state,
        pages: state.pages.map((page: {}, key: number) => {
          if (key <= action.payload) {
            return {
              ...page,
              active: true
            };
          } else {
            return page;
          }
        })
      };
    case 'SET_SUBSCRIPTION':
      return {
        ...state,
        subscription: action.payload.subscription
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'UPDATE_STUDENT_STATUS':
      // console.log('status', action.payload);
      return {
        ...state,
        studentStatus: action.payload
      };
    case 'SET_SAVE_FUNCTION':
      return {
        ...state,
        saveFunction: action.payload
      };
    case 'SET_STUDENT_INFO':
      return {
        ...state,
        studentDataID: action.payload.studentDataID,
        studentUsername: action.payload.studentUsername,
        studentAuthID: action.payload.studentAuthID
      };
    case 'SET_LOADING':
      return {
        ...state,
        status: 'loading'
      };
    case 'ADD_WORD':
      return {
        ...state,
        new_words: [...state.new_words, action.payload],
        word_bank: [...state.word_bank, action.payload]
      };
    case 'SET_INITIAL_COMPONENT_STATE_FROM_DB':
      return {
        ...state,
        firstSave: true,
        componentState: action.payload
      };
    case 'SET_INITIAL_COMPONENT_STATE':
      // console.log('set initial component state -->', { [action.payload.name]: action.payload.content });
      return {
        ...state,
        componentState: {
          ...state.componentState,
          [action.payload.name]: action.payload.content
        }
      };
    case 'UPDATE_COMPONENT_STATE':
      // console.log('update component state -->', { [action.payload.inputName]: action.payload.content });

      return {
        ...state,
        unsavedChanges: true,
        studentStatus: 'ACTIVE',
        componentState: {
          ...state.componentState,
          [action.payload.componentName]: {
            ...state.componentState[action.payload.componentName],
            [action.payload.inputName]: action.payload.content
          }
        }
      };
    case 'UPDATE_LESSON_PLAN':
      //console.log('UPDATE_LESSON_PLAN: pages >> ', action.payload.pages)
      return {
        ...state,
        status: 'loaded',
        displayData: action.payload.displayData,
        pages: action.payload.pages,
        viewing: action.payload.viewing === state.studentAuthID
      };
    case 'INCREMENT_SAVE_COUNT':
      return {
        ...state,
        saveCount: state.saveCount + 1
      };
    case 'CAN_CONTINUE':
      return {
        ...state,
        canContinue: true
      };
    case 'NO_CONTINUE':
      return {
        ...state,
        canContinue: false
      };
    case 'FINISH':
      return {
        ...state,
        canContinue: false
      };
    case 'SAVED_CHANGES':
      return {
        ...state,
        unsavedChanges: false
      };
    case 'OPEN_LESSON':
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (action.payload !== page.stage) {
            return page;
          } else {
            return {
              ...page,
              open: true
            };
          }
        })
      };
    case 'CLEAR_QUESTION_DATA':
      let clearQuestions = {};
      return {...state, questionData: clearQuestions};
    case 'SET_QUESTION_DATA':
      // let payloadKeys = Object.keys(action.payload.data);
      // let updatedQuestionData: any = state.questionData;
      //
      // if (!updatedQuestionData[action.payload.key]) {
      //   updatedQuestionData = action.payload.data;
      //   return {
      //     ...state,
      //     questionData: updatedQuestionData,
      //   };
      // }
      //
      // let updatedQuestionDataObject = updatedQuestionData[action.payload.key];
      //
      // payloadKeys.forEach((key: string) => {
      //   if (
      //     action.payload.data[key] !== '' &&
      //     action.payload.data[key] !== null &&
      //     action.payload.data[key] !== undefined
      //   ) {
      //     updatedQuestionDataObject[key] = action.payload.data[key];
      //   }
      // });

      // console.log('reducer payload -> ', action.payload.data);

      return {
        ...state,
        studentStatus: 'ACTIVE',
        questionData: action.payload.data
      };
    case 'SET_QUESTION_DATA_UPDATE':
      return {
        ...state,
        questionDataUpdate: action.payload.data
      };
    case 'ACTIVATE_LESSON':
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (action.payload !== page.stage) {
            return page;
          } else {
            return {
              ...page,
              active: true
            };
          }
        })
      };
    case 'ACTIVATE_CHECKPOINT':
      return {
        ...state,
        pages: state.pages.map((page) => {
          if (page.stage !== 'checkpoint') {
            return page;
          } else {
            if (action.payload !== page.type) {
              return page;
            } else {
              return {
                ...page,
                active: true
              };
            }
          }
        })
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };
    case 'JUMP_PAGE':
      return {
        ...state,
        pages: state.pages.map((page: {}, key: number) => {
          if (key <= action.payload) {
            return {
              ...page,
              active: true
            };
          } else {
            return page;
          }
        }),
        studentStatus: 'ACTIVE',
        lessonProgress:
          state.lessonProgress >= action.payload ? state.lessonProgress : action.payload,
        currentPage: action.payload
      };
    case 'PAGE_FORWARD':
      return {
        ...state,
        studentStatus: 'ACTIVE',
        lessonProgress:
          state.lessonProgress === state.currentPage
            ? state.currentPage + 1
            : state.lessonProgress,
        currentPage: state.currentPage + 1
      };
    case 'PAGE_BACK':
      return {
        ...state,
        studentStatus: 'ACTIVE',
        currentPage: state.currentPage - 1
      };
    case 'CLEANUP':
      return lessonState;
    default:
      return state;
  }
};
