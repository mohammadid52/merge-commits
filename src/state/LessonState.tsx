import {
  StudentExerciseData,
  StudentPageInput,
  UniversalLessonStudentData,
} from '../interfaces/UniversalLessonInterfaces';

export interface lessonStateType {
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
  saveCount?: number;
  firstSave?: boolean;
  subscription?: any;
  subscribeFunc?: any;
  studentViewing?: string;
}

export const lessonState: lessonStateType = {
  loaded: false,
  universalLessonID: '',
  universalLessonPageID: '',
  universalStudentDataID: [],
  studentAuthID: '',
  studentUsername: '',
  lessonData: {},
  currentPage: 0,
  lessonProgress: 0,
  canContinue: '',
  updated: false,
  requiredInputs: [[]],
  studentData: [[]],
  exerciseData: [[]],
  viewing: false,
  displayData: [{studentAuthID: '', lessonPageID: ''}],
  saveCount: 0,
  firstSave: true,
  subscription: {},
  subscribeFunc: () => {},
  studentViewing: '',
};
