import {
  StudentExerciseData,
  StudentPageInput
} from 'interfaces/UniversalLessonInterfaces';

export interface LessonStateType {
  loaded?: boolean;
  universalLessonID?: string;
  universalLessonPageID?: string;
  universalStudentDataID?: any[];
  studentAuthID?: string;
  studentUsername?: string;
  lessonData?: any;
  currentPage?: number;
  lessonProgress?: number;
  canContinue?: string;
  updated?: boolean;
  requiredInputs?: [string[]];
  studentData?: [StudentPageInput[]];
  exerciseData?: [StudentExerciseData[]];
  viewing?: boolean;
  displayData?: {studentAuthID?: string; lessonPageID?: string}[];
  sharedData?: any[];
  saveCount?: number;
  firstSave?: boolean;
  subscription?: any;
  subscribeFunc?: any;
  studentViewing?: string;
  isLastPage?: boolean;
  isValid?: boolean;
  pageTimers: [];
  misc?: {
    leaveModalVisible?: boolean;
    personLessonData?: {
      lessonID: string;
      data: any[];
    };
  };
}

export const lessonState: LessonStateType = {
  loaded: false,
  universalLessonID: '',
  universalLessonPageID: '',
  pageTimers: [],
  universalStudentDataID: [],
  studentAuthID: '',
  studentUsername: '',
  lessonData: {},
  currentPage: 0,
  lessonProgress: 0,
  canContinue: '',
  isValid: true,
  updated: false,
  isLastPage: false,
  requiredInputs: [[]],
  studentData: [[]],
  exerciseData: [[]],
  viewing: false,
  displayData: [{studentAuthID: '', lessonPageID: ''}],
  sharedData: [],
  saveCount: 0,
  firstSave: true,
  subscription: {},
  subscribeFunc: () => {},
  studentViewing: '',
  misc: {
    leaveModalVisible: false,
    personLessonData: {
      lessonID: '',
      data: []
    }
  }
};
