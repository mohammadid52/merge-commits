type pageObject = {
  type: string;
  stage: string;
  open: boolean;
  disabled: boolean;
  active: boolean;
  displayMode: null | string;
};

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
  doFirstData?: {
    [key: string]: any;
  };
  warmUpData?: {
    [key: string]: any;
  };
  corelessonData: {
    [key: string]: any;
  };
  activityData: {
    [key: string]: any;
  };
};

export interface lessonControlStateTypeOLD {
  status: string;
  error: string;
  pages: Array<pageObject>;
  currentPage: number;
  roster: Array<studentObject>;
  studentDataUpdated: boolean;
  done: Array<string>;
  data?: {
    [key: string]: any;
  };
  sharing: boolean;
  unsavedChanges: boolean;
  displayData: {
    breakdownComponent: string;
    studentInfo?: {
      id: string;
      firstName: string;
      preferredName?: string;
      lastName: string;
    };
    doFirstData?: {[key: string]: any};
    warmUpData?: {[key: string]: any};
    corelessonData?: {[key: string]: any};
    activityData?: {[key: string]: any};
  };
  studentViewing: {
    live: boolean;
    studentInfo?: studentObject;
  };
  open?: boolean;
  syllabusLessonID: string;
}

export const lessonControlStateOLD: lessonControlStateTypeOLD = {
  status: '',
  error: '',
  pages: [],
  currentPage: 0,
  roster: [],
  studentDataUpdated: true,
  done: [],
  data: {},
  sharing: false,
  unsavedChanges: false,
  displayData: {
    breakdownComponent: '',
  },
  studentViewing: {
    live: false,
  },
  open: null,
  syllabusLessonID: '',
};