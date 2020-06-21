import React from 'react';
import { globalStateType, globalState } from '../state/GlobalState';

type globalActions = 
|   {
        type: 'SET_USER';
        payload: {
            userId: string,
            firstName: string,
            lastName: string,
            language: string,
            role: string,
        }
    }
|   {
        type: 'LOG_IN'
        payload: {
            email: string,
            authId: string,
        }
    }
|   {
        type: 'PREV_LOG_IN'
        payload: {
            [key: string]: any
        }
    }
|   {
        type: 'CLEANUP'
    }


export const globalReducer = (state: globalStateType, action: globalActions) => {
    switch(action.type) {
        case 'SET_USER': 
            return {
                ...state,
                status: 'done',
                user: {
                    ...state.user,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    language: action.payload.language,
                    role: action.payload.role,
                }
            }
        case 'LOG_IN': 
            return {
                ...state,
                status: 'logged-in',
                isAuthenticated: true,
                user: {
                    ...state.user,
                    email: action.payload.email,
                    authId: action.payload.authId,
                }
            }
        case 'PREV_LOG_IN': 
            console.log(action.payload);
            
            return {
                ...state,
                status: 'logged-in',
                isAuthenticated: true,
                user: {
                    ...state.user,
                    email: action.payload.email,
                    authId: action.payload.authId,
                }
            }
        case 'CLEANUP': 
            return globalState
        default:
            return state;
    }
}