import {Dicitionary, PersonStatus, UserPageState} from 'API';
import {globalState} from 'state/GlobalState';

export type GlobalActions =
  | {
      type: 'UPDATE_SIDEBAR';
      payload: {
        section: string;
        data: any;
      };
    }
  | {
      type: 'UPDATE_ROOM';
      payload: {
        property: string;
        data: any;
      };
    }
  | {
      type: 'UPDATE_ROOM_MULTI';
      payload: {
        rooms?: any[];
        activeSyllabus?: any;
        curriculum?: any;
        syllabus?: any[];
        lessons?: any[];
      };
    }
  | {
      type: 'RESET_ROOMDATA';
      payload: any;
    }
  | {
      type: 'UPDATE_CURRENTPAGE';
      payload: {
        data: string;
      };
    }
  | {
      type: 'UPDATE_ACTIVEROOM';
      payload: {
        roomID: string;
        syllabusID: string;
        name: string;
      };
    }
  | {
      type: 'TOGGLE_LESSON';
      payload: {
        property: string;
        data: any;
      };
    }
  | {
      type: 'UPDATE_LESSON_PAGE_THEME';
      payload: {
        theme: 'light' | 'dark';
      };
    }
  | {
      type: 'UPDATE_PAGE_STATE';
      payload: {
        pageState: UserPageState;
        lastPageStateUpdate: string;
      };
    }
  | {
      type: 'SET_USER';
      payload: {
        location: any[];
        removedFrom?: any[];
        email: string;
        authId: string;
        id: string;
        firstName: string;
        lastName: string;
        language: string;
        onBoardSurvey: boolean;
        role: string;
        isSuperAdmin: boolean;
        isAdmin: boolean;
        lastEmotionSubmission?: boolean;
        isBuilder: boolean;
        isTeacher: boolean;
        isStudent: boolean;
        image: string;
        lastLoggedOut?: string;
        lastLoggedIn?: string;
        associateInstitute?: any[];
        onDemand?: any;
        lessons?: any[];
        pageState: UserPageState;
        status: PersonStatus;
      };
    }
  | {
      type: 'LOG_IN';
      payload: {
        email: string;
        authId: string;
      };
    }
  | {
      type: 'LESSON_PAYLOAD';
      payload: {
        lessonsData: any[];
      };
    }
  | {
      type: 'PREV_LOG_IN';
      payload: {
        [key: string]: any;
      };
    }
  | {
      type: 'AUTHENTICATE';
      payload: {
        [key: string]: any;
      };
    }
  | {
      type: 'CLEANUP';
    }
  | {
      type: 'UPDATE_TEMP';
      payload: {
        [key: string]: any;
      };
    }
  | {
      type: 'UPDATE_TEMP_USER';
      payload: {
        [key: string]: any;
      };
    }
  | {
      type: 'SET_DICTIONARIES';
      payload: Dicitionary[];
    };

export const globalReducer = (state: any, action: GlobalActions) => {
  switch (action.type) {
    case 'UPDATE_SIDEBAR':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          [action.payload.section]: action.payload.data
        }
      };
    case 'SET_DICTIONARIES':
      return {
        ...state,
        dictionaries: action.payload
      };
    case 'UPDATE_ROOM':
    case 'TOGGLE_LESSON':
      return {
        ...state,
        roomData: {
          ...state.roomData,
          [action.payload.property]: action.payload.data
        }
      };
    case 'UPDATE_ROOM_MULTI':
      return {
        ...state,
        roomData: {
          activeSyllabus: action.payload.activeSyllabus
            ? action.payload.activeSyllabus
            : state.roomData.activeSyllabus,
          curriculum: action.payload.curriculum
            ? action.payload.curriculum
            : state.roomData.curriculum,
          rooms: action.payload.rooms ? action.payload.rooms : state.roomData.rooms,
          lessons: action.payload.lessons
            ? action.payload.lessons
            : state.roomData.lessons,
          syllabus: action.payload.syllabus
            ? action.payload.syllabus
            : state.roomData.syllabus
        }
      };
    case 'RESET_ROOMDATA':
      return {
        ...state,
        currentPage: '',
        activeRoom: 'asdsad',
        activeSyllabus: '',
        roomData: {
          rooms: state.roomData.rooms ? state.roomData.rooms : [],
          activeSyllabus: '',
          curriculum: {},
          syllabus: [],
          lessons: []
        }
      };
    case 'UPDATE_CURRENTPAGE':
      return {
        ...state,
        currentPage: action.payload.data
      };
    case 'UPDATE_ACTIVEROOM':
      return {
        ...state,
        activeRoom: action.payload.roomID,
        activeSyllabus: action.payload.syllabusID,
        activeRoomName: action.payload.name,
        roomData: {
          ...state.roomData,
          syllabus: []
        }
      };

    case 'UPDATE_TEMP':
      return {
        ...state,
        temp: {
          ...state.temp,
          authId: action.payload.authId,
          redirectUrlToUserSurveysTab: action.payload.redirectUrlToUserSurveysTab,
          roomData: action?.payload?.roomData || state.temp.roomData
        }
      };
    case 'UPDATE_TEMP_USER':
      return {
        ...state,
        temp: {
          ...state.temp,
          user: action.payload.user
        }
      };
    case 'UPDATE_LESSON_PAGE_THEME':
      return {
        ...state,
        lessonPage: {
          theme: action.payload.theme,
          themeTextColor: action.payload.theme === 'light' ? 'text-dark' : 'text-white',
          themeBackgroundColor: action.payload.theme === 'light' ? 'bg-white' : 'bg-dark',
          themeSecBackgroundColor:
            action.payload.theme === 'light' ? 'bg-white' : 'bg-dark  '
        }
      };

    case 'UPDATE_PAGE_STATE':
      return {
        ...state,
        user: {
          ...state.user,
          lastPageStateUpdate:
            action?.payload?.lastPageStateUpdate || state.user.lastPageStateUpdate,
          pageState: action?.payload?.pageState || state.user.pageState
        }
      };
    case 'SET_USER':
      return {
        ...state,
        status: 'done',
        user: {
          ...state.user,
          id: action.payload.id,
          authId: action.payload.authId,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          language: action.payload.language,
          role: action.payload.role,
          isSuperAdmin: action.payload.role === 'SUP',
          isAdmin: action.payload.role === 'ADM',
          isBuilder: action.payload.role === 'BLD',
          isTeacher: action.payload.role === 'TR',
          isStudent: action.payload.role === 'ST',
          onBoardSurvey: action.payload.onBoardSurvey,
          image: action.payload.image,
          location: action.payload.location,
          lastLoggedIn: action.payload.lastLoggedIn,
          lastLoggedOut: action.payload.lastLoggedOut,
          associateInstitute: action.payload.associateInstitute,
          onDemand: action.payload?.onDemand,
          lessons: action.payload?.lessons,
          lastEmotionSubmission: action.payload?.lastEmotionSubmission,
          pageState: action.payload.pageState,

          status: action.payload?.status,
          removedFrom: action.payload?.removedFrom || []
        }
      };
    case 'LOG_IN':
    case 'PREV_LOG_IN':
      return {
        ...state,
        status: 'logged-in',
        isAuthenticated: true,
        user: {
          ...state.user,
          email: action.payload.email,
          authId: action.payload.authId
        }
      };
    case 'LESSON_PAYLOAD':
      return {
        ...state,
        lessonsPayload: {
          lessonsData: action.payload.lessonsData
        }
      };

    case 'AUTHENTICATE':
      return {
        ...state,
        status: 'logged-in',
        isAuthenticated: true
      };
    case 'CLEANUP':
      return globalState;
    default:
      return state;
  }
};
