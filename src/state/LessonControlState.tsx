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

export interface LessonControlStateType {
  status: string;
  currentPage: number;
  roster: Array<studentObject>;
  rosterActive: Array<studentObject>;
  rosterInactive: Array<studentObject>;
  rosterOnDemand: Array<studentObject>;
  studentDataUpdated: boolean;
  sharing: boolean;
  studentViewing: string;
}

export const lessonControlState: LessonControlStateType = {
  status: '',
  currentPage: 0,
  roster: [],
  rosterActive: [],
  rosterInactive: [],
  rosterOnDemand: [],
  studentDataUpdated: true,
  sharing: false,
  studentViewing: '' // student email
};
