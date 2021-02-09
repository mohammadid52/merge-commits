export interface globalStateType {
  sidebar: {
    upcomingLessons: any[];
  };
  roomData: {
    rooms: any[];
    syllabus: any[];
    lessons: any[];
  };
  status: string;
  error: string;
  isAuthenticated: boolean;
  user: {
    id: string;
    authId: string;
    email: string;
    firstName: string;
    lastName: string;
    language: string;
    role: string;
    onBoardSurvey?: boolean;
    location: any[]
  };
}

export const globalState: globalStateType = {
  sidebar: {
    upcomingLessons: [],
  },
  roomData: {
    rooms: [],
    syllabus: [],
    lessons: [],
  },
  status: '',
  error: '',
  isAuthenticated: false,
  user: {
    id: '',
    authId: '',
    email: '',
    firstName: '',
    lastName: '',
    language: '',
    role: '',
    location: []
  },
};
