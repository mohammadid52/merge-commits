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
  currentPage: number;
  roster: Array<studentObject>;
  studentDataUpdated: boolean;
  sharing: boolean;
  studentViewing: string;
}

export const lessonControlState: lessonControlStateType = {
  status: '',
  currentPage: 0,
  roster: [],
  studentDataUpdated: true,
  sharing: false,
  studentViewing: '', // student email
};