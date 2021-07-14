import {UniversalLessonStudentData} from '../interfaces/UniversalLessonInterfaces';

export interface lessonStateType {
  status?: string;
  universalLessonID?: string;
  universalLessonPageID?: string;
  universalStudentDataID?: string;
  studentAuthID?: string;
  studentUsername?: string;
  lessonData?: any;
  currentPage?: number;
  lessonProgress?: number;
  canContinue?: string;
  studentData?: UniversalLessonStudentData[];
  viewing?: boolean;
  displayData?: UniversalLessonStudentData[];
  saveCount?: number;
  firstSave?: boolean;
  subscription?: any;
  subscribeFunc?: any;
}

export const lessonState: lessonStateType = {
  status: '',
  universalLessonID: '',
  universalLessonPageID: '',
  universalStudentDataID: '',
  studentAuthID: '',
  studentUsername: '',
  lessonData: {},
  currentPage: 0,
  lessonProgress: 0,
  canContinue: '',
  studentData: [],
  viewing: false,
  displayData: [],
  saveCount: 0,
  firstSave: true,
  subscription: {},
  subscribeFunc: () => {},
};