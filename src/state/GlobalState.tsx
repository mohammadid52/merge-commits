import {UserPageState} from 'API';

export interface globalStateType {
  sidebar: {
    upcomingLessons: any[];
  };
  roomData: {
    curriculum: any;
    rooms: any[];
    syllabus: any[];
    activeSyllabus: string;
    lessons: any[];
  };
  currentPage: string;
  activeRoom: string;
  activeSyllabus: string;
  status: string;
  error: string;
  isAuthenticated: boolean;
  lessonPage: {
    theme: 'light' | 'dark';
    themeTextColor: string;
    themeBackgroundColor: string;
    themeSecBackgroundColor: string;
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
    lastLoggedOut?: string;
    lastLoggedIn?: string;
    pageState?: UserPageState;
  };
  lessonsPayload: {
    lessonsData: any[];
  };
  temp: any;
}

// test comment

export const globalState: globalStateType = {
  sidebar: {
    upcomingLessons: []
  },
  roomData: {
    curriculum: {},
    rooms: [],
    syllabus: [],
    activeSyllabus: '',
    lessons: []
  },
  currentPage: '',
  activeRoom: '',
  activeSyllabus: '',
  status: '',
  error: '',
  isAuthenticated: false,
  lessonPage: {
    theme: 'dark',
    themeTextColor: 'text-white',
    themeBackgroundColor: 'bg-dark-gray',
    themeSecBackgroundColor: 'bg-gray-700'
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
    lastLoggedIn: '',
    lastLoggedOut: '',
    pageState: UserPageState.NOT_LOGGED_IN
  },

  temp: {},

  lessonsPayload: {
    lessonsData: []
  }
};
