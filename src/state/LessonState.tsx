import {UniversalLessonStudentData} from '../interfaces/UniversalLessonInterfaces';

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
  studentData?: UniversalLessonStudentData[];
  viewing?: boolean;
  displayData?: any;
  saveCount?: number;
  firstSave?: boolean;
  subscription?: any;
  subscribeFunc?: any;
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
  studentData: [],
  viewing: false,
  displayData: [],
  saveCount: 0,
  firstSave: true,
  subscription: {},
  subscribeFunc: () => {},
};
