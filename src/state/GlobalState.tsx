export interface globalStateType {
  sidebar: {
    upcomingLessons: any[];
  };
  roomData: {
    rooms: any[];
    syllabus: any[];
    lessons: any[];
    widgets: any[];
  };
  currentPage: string;
  activeRoom: string;
  status: string;
  error: string;
  isAuthenticated: boolean;
  lessonPage: {
    theme: 'light' | 'dark';
    themeTextColor: string;
    themeBackgroundColor: string;
  };
  user: {
    id: string;
    authId: string;
    email: string;
    firstName: string;
    lastName: string;
    language: string;
    role: string;
    onBoardSurvey?: boolean;
    location: any[];
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
    widgets: [],
  },
  currentPage: '',
  activeRoom: '',
  status: '',
  error: '',
  isAuthenticated: false,
  lessonPage: {
    theme: 'dark',
    themeTextColor: 'text-white',
    themeBackgroundColor: 'bg-dark-gray',
  },
  user: {
    id: '',
    authId: '',
    email: '',
    firstName: '',
    lastName: '',
    language: '',
    role: '',
    location: [],
  },
};
