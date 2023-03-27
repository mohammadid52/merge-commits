import {User} from '@customHooks/useAuth';
import {Widget} from '@interfaces/ClassroomComponentsInterfaces';
import {Dicitionary, PersonStatus, Role, TeachingStyle, UserPageState} from 'API';

export interface GlobalStateType {
  sidebar: {
    upcomingLessons: any[];
  };
  roomData: {
    id: string;
    name: string;
    teachingStyle?: TeachingStyle;
    curriculum: any;
    rooms: any[];
    syllabus: any[];
    activeSyllabus: {
      id: string;
      name: string;

      [key: string]: any;
    };
    completedLessons?: any[];
    lessons: any[];
    widgets: Widget[];
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
  user: User;
  lessonsPayload: {
    lessonsData: any[];
  };
  dictionaries?: Dicitionary[] | null;
  temp: any;
}

// test comment

export const globalState: GlobalStateType = {
  sidebar: {
    upcomingLessons: []
  },
  roomData: {
    id: '',
    name: '',
    teachingStyle: TeachingStyle.ACADEMIC,
    widgets: [],
    curriculum: {},
    rooms: [],
    syllabus: [],
    activeSyllabus: {
      id: '',
      name: ''
    },
    lessons: []
  },
  dictionaries: [],
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
    language: 'EN',
    role: Role.ST,
    image: '',
    preferredName: '',
    location: [],
    lastLoggedIn: '',
    lastLoggedOut: '',
    lastEmotionSubmission: '',
    associateInstitute: [],
    pageState: UserPageState.NOT_LOGGED_IN,
    removedFrom: [],
    status: PersonStatus.INACTIVE,
    lastPageStateUpdate: new Date().toISOString()
  },

  temp: {},

  lessonsPayload: {
    lessonsData: []
  }
};

export const standardTheme = {
  iconoclast: '#667eea',
  curate: '#0081cb',
  bg: 'bg-dark-blue',
  underline: 'border-b border-white border-opacity-10 pb-1 mb-1',
  gradient: {
    cardBase: 'bg-gradient-to-tl from-dark-blue to-med-dark-blue'
  },
  blockQuote: 'px-4 border-l-4 border-white border-opacity-50 bg-black bg-opacity-40',
  banner: '',
  section:
    'w-full md:max-w-none lg:max-w-192 2xl:max-w-256  mx-auto  flex flex-col justify-between items-center ',
  elem: {
    bg: 'bg-dark-block',
    title: 'text-lg font-semibold text-gray-200',
    text: 'text-sm text-gray-200',
    textDark: 'text-sm text-darker-gray',
    textInput: 'bg-darker-gray text-blue-100 py-2 px-4',
    shadow: 'shadow-elem-dark',
    card: 'rounded-lg bg-white bg-opacity-20'
  },
  toolbar: {
    bg: 'bg-black',
    text: 'text-gray-200'
  },
  dashboard: {
    sectionTitle: 'w-auto text-black pb-2 font-medium mt-4 mb-1 text-left',
    bg: 'bg-darker-gray',
    card: 'p-2 relative bg-white rounded  border-0 border-dark-gray border-opacity-10 h-auto flex',
    cardNoBG: 'relative h-auto p-2 flex'
  },
  lessonCard: {
    title: 'flex items-center text-lg 2xl:text-2xl  text-black text-left',
    subtitle: 'text-sm text-gray-400',
    border: 'border-dark-gray border-opacity-20'
  },
  sidemenu: {
    bg: 'bg-darker-gray',
    primary: 'z-50 min-h-screen w-65 min-w-65 flex flex-col bg-darker-gray',
    secondary:
      'z-50 min-h-screen w-65 min-w-65 flex flex-col bg-medium-gray  border-r-0 border-white',
    darktone: 'bg-black bg-opacity-80'
  },
  block: {
    bg: 'bg-dark-blue',
    text: 'text-gray-200',
    shadow: 'shadow-elem-dark'
  },
  footer: {
    bg: 'bg-dark-blue',
    text: 'text-gray-200'
  },
  btn: {
    iconoclastIndigo:
      'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-600 focus:bg-indigo-600',
    curateBlue:
      'bg-theme-blue text-white hover:bg-blue-500 active:bg-blue-500 focus:bg-blue-500',
    delete: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-600 focus:bg-red-600',
    confirm:
      'bg-green-500 text-white hover:bg-green-600 active:bg-green-600 focus:bg-green-600',
    cancel: 'bg-white text-gray-600  border-0 border-gray-600 hover:bg-gray-200',
    lessonStart:
      'bg-green-500 text-white hover:bg-green-600 active:bg-green-600 focus:bg-green-600',
    surveyStart:
      'bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-500 focus:bg-orange-500'
  },
  btnTransparent: {
    iconoclastIndigo: 'text-indigo-600 border-indigo-600 hover:text-indigo-500',
    curateBlue: 'text-theme-blue border-theme-blue hover:text-blue-500'
  },
  text: {
    default: 'text-black80',
    secondary: 'text-gray-500',
    active: 'text-indigo-500'
  },
  formSelect: 'bg-white border-gray-400 text-gray-900 border-0',
  outlineNone: 'outline-none hover:outline-none active:outline-none focus:outline-none',
  verticalBorder: {
    iconoclastRed: 'border-red-600',
    iconoclastIndigo: 'border-indigo-700',
    curateBlue: 'border-theme-blue'
  },
  searchIcon: {
    iconoclastIndigo: '#667eea',
    curateBlue: '#0081CB'
  },
  iconColor: {
    iconoclastIndigo: '#667eea',
    curateBlue: '#0081CB'
  },
  textColor: {
    iconoclastRed: 'text-red-400',
    iconoclastIndigo: 'text-indigo-600',
    curateBlue: 'text-theme-blue'
  },
  borderColor: {
    iconoclastIndigo: 'border-indigo-600',
    curateBlue: 'border-theme-blue'
  },
  borderColorLight: {
    iconoclastIndigo: 'border-indigo-400',
    curateBlue: 'border-blue-400'
  },
  backGround: {
    iconoclastIndigo: 'bg-indigo-500',
    curateBlue: 'bg-blue-500'
  },
  backGroundLight: {
    iconoclastIndigo: 'bg-indigo-400',
    curateBlue: 'bg-blue-400'
  },
  modals: {
    header:
      'flex items-center justify-between p-4 border-solid rounded-t-xl bg-gray-100 text-gray-900 border-gray-200',
    footer:
      'flex items-center justify-end px-4 py-2 gap-x-4 border-t-0 border-solid rounded-b-xl bg-gray-200 text-gray-900 border-gray-200',
    content:
      'border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none bg-white text-gray-900',
    hideBg: `border-transparent  rounded-lg shadow-lg relative flex flex-col w-full outline-none bg-transparent text-gray-900`
  },
  notice: {
    bar: '',
    category: {
      error: '',
      alert: '',
      info: '',
      help: '',
      tip: ''
    }
  }
};

export const allowedAuthIds = [
  '6c4dd66f-77d5-4aba-bf5a-46566f8a836d',
  '22241431-5b44-434a-bba1-6dcb40e7c7fa'
];
