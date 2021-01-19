// import React from 'react';
import { globalStateType, globalState } from '../state/GlobalState';

type globalActions =
  | {
      type: 'UPDATE_SIDEBAR';
      payload: {
        section: string;
        data: any;
      };
    }
  | {
      type: 'SET_USER';
      payload: {
        id: string;
        firstName: string;
        lastName: string;
        language: string;
        onBoardSurvey: boolean;
        role: string;
        image: string;
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
          [action.payload.section]:action.payload.data
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
