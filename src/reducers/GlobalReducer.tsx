// import React from 'react';
import {globalStateType, globalState} from '../state/GlobalState';

type globalActions =
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
      type: 'SET_USER';
      payload: {
        location: any[];
        id: string;
        firstName: string;
        lastName: string;
        language: string;
        onBoardSurvey: boolean;
        role: string;
        image: string;
        lastLoggedOut?: string;
        lastLoggedIn?: string;
        associateInstitute?: any[];
        onDemand?: any;
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
      type: 'PREV_LOG_IN';
      payload: {
        [key: string]: any;
      };
    }
  | {
      type: 'CLEANUP';
    };

export const globalReducer = (state: globalStateType, action: globalActions) => {
  switch (action.type) {
    case 'UPDATE_SIDEBAR':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          [action.payload.section]: action.payload.data,
        },
      };
    case 'UPDATE_ROOM':
      return {
        ...state,
        roomData: {
          ...state.roomData,
          [action.payload.property]: action.payload.data,
        },
      };
    case 'UPDATE_CURRENTPAGE':
      return {
        ...state,
        currentPage: action.payload.data,
      };
    case 'UPDATE_ACTIVEROOM':
      return {
        ...state,
        activeRoom: action.payload.roomID,
        activeSyllabus: action.payload.syllabusID,
        roomData: {
          ...state.roomData,
          syllabus: [],
        },
      };
    case 'TOGGLE_LESSON':
      return {
        ...state,
        roomData: {
          ...state.roomData,
          [action.payload.property]: action.payload.data,
        },
      };
    case 'UPDATE_LESSON_PAGE_THEME':
      return {
        ...state,
        lessonPage: {
          theme: action.payload.theme,
          themeTextColor:
            action.payload.theme === 'light' ? 'text-dark-gray' : 'text-white',
          themeBackgroundColor:
            action.payload.theme === 'light' ? 'bg-white' : 'bg-dark-gray',
          themeSecBackgroundColor:
            action.payload.theme === 'light' ? 'bg-white' : 'bg-gray-700',
        },
      };
    case 'SET_USER':
      return {
        ...state,
        status: 'done',
        user: {
          ...state.user,
          id: action.payload.id,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          language: action.payload.language,
          role: action.payload.role,
          onBoardSurvey: action.payload.onBoardSurvey,
          image: action.payload.image,
          location: action.payload.location,
          lastLoggedIn: action.payload.lastLoggedIn,
          lastLoggedOut: action.payload.lastLoggedOut,
          associateInstitute: action.payload.associateInstitute,
          onDemand: action.payload?.onDemand,
        },
      };
    case 'LOG_IN':
      return {
        ...state,
        status: 'logged-in',
        isAuthenticated: true,
        user: {
          ...state.user,
          email: action.payload.email,
          authId: action.payload.authId,
        },
      };
    case 'PREV_LOG_IN':
      return {
        ...state,
        status: 'logged-in',
        isAuthenticated: true,
        user: {
          ...state.user,
          email: action.payload.email,
          authId: action.payload.authId,
        },
      };
    case 'CLEANUP':
      return globalState;
    default:
      return state;
  }
};
