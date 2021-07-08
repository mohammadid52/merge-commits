import {UniversalLessonStudentData} from '../interfaces/UniversalLessonInterfaces';

export type studentObject = {
  personAuthID: string;
  id: string;
  lessonProgress: string;
  currentLocation?: string;
  status: string;
  live: boolean;
  studentID: string;
  studentAuthID: string;
  student: {
    id: string;
    authId: string;
    email: string;
    firstName: string;
    language: string;
    lastName: string;
    preferredName: string;
  };
};

export interface lessonControlStateType {
  status: string;
  universalLessonID: string;
  currentPage: number;
  roster: Array<studentObject>;
  studentDataUpdated: boolean;
  sharing: boolean;
  displayData: UniversalLessonStudentData[];
  studentViewing: string;
}

export const lessonControlState: lessonControlStateType = {
  status: '',
  universalLessonID: '',
  currentPage: 0,
  roster: [],
  studentDataUpdated: true,
  sharing: false,
  displayData: [],
  studentViewing: '', // student email
};