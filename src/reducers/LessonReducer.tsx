import {
  StudentExerciseData,
  StudentPageInput,
  UniversalLesson,
  UniversalLessonPage,
  UniversalLessonStudentData,
} from '../interfaces/UniversalLessonInterfaces';
import {lessonStateType, lessonState as initialLessonState} from '../state/LessonState';

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
        displayData?: {studentAuthID?: string; lessonPageID?: string}[];
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
      payload?: any;
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
    case 'SET_ROOM_SUBSCRIPTION_DATA':
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
      const requiredInputs = action.payload.requiredInputs;
      const studentData = action.payload.studentData;
      const exerciseData = action.payload.exerciseData;
      return {
        ...state,
        requiredInputs: requiredInputs,
        studentData: studentData,
        exerciseData: exerciseData,
      };
    case 'LOAD_STUDENT_DATA':
      return {
        ...state,
        loaded: true,
        universalStudentDataID: action.payload.dataIdReferences,
        studentData: action.payload.filteredStudentData
          ? action.payload.filteredStudentData
          : state.studentData,
        exerciseData: action.payload.filteredExerciseData
          ? action.payload.filteredExerciseData
          : state.exerciseData,
      };
    case 'LOAD_STUDENT_SUBSCRIPTION_DATA':
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
          studentData: newStudentData,
        };
      } else {
        return state;
      }
    case 'LOAD_STUDENT_SHARE_DATA':
      return {
        ...state,
        sharedData: action.payload,
      };
    case 'UPDATE_PERSON_LOCATION':
      return {
        ...state,
        personLocationObj: action.payload,
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

      // ~~~~~ TOGGLE DB DATA-ID TO UPDATED ~~~~ //
      const updatedStudentDataIdArray = state?.universalStudentDataID.map(
        (dataIdObj: any) => {
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

      // ~~~~~~ UPDATE STUDENT DATA ARRAY ~~~~~~ //
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

      // ~~~~~~ UPDATE EXERCISE DATA ARRAY ~~~~~ //
      const updatedExerciseData =
        state?.exerciseData[pageIdx].map((exercise: any) => {
          return {
            ...exercise,
            entryData: exercise.entryData.map((entry: any) => {
              if (entry.domID === domID) {
                return {
                  ...entry,
                  input: newInput[0],
                };
              } else {
                return entry;
              }
            }),
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
        exerciseData: mappedExerciseData,
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
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
        lessonProgress:
          action.payload > state.lessonProgress ? action.payload : state.lessonProgress,
      };
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
      return initialLessonState;
    default:
      return state;
  }
};
