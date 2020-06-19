import React from 'react';
import { globalStateType, globalState } from '../state/GlobalState';

type globalActions = 
|   {
        type: 'SET_USER';
        payload: {
            user: {
                [key: string]: any;
            };
        }
    }


export const globalReducer = (state: globalStateType, action: globalActions) => {
    switch(action.type) {
        case 'SET_USER': 
            return {
                ...state,
                status: 'loaded',
                user: action.payload.user,
            }
        default:
            return state;
    }
}