import {
  StudentPageInput,
  UniversalLesson,
  UniversalLessonPage,
  UniversalLessonStudentData,
} from '../interfaces/UniversalLessonInterfaces';

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
      type: 'SET_LESSON_DATA';
      payload: UniversalLesson;
    }
  | {
      type: 'SET_INITIAL_STUDENT_DATA';
      payload: UniversalLessonStudentData[];
    }
  | {
      type: 'LOAD_STUDENT_DATA';
      payload: {id: string; pageIdx: number; lessonPageID: string; update: boolean}[];
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
        universalStudentDataID: action.payload,
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
      console.log('complete student update');
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
