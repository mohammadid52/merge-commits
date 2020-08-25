import React from 'react';
import { lessonControlStateType, lessonControlState } from '../state/LessonControlState';

type lessonControlActions = 
|   {
        type: 'SET_PAGES';
        payload: any
    }
|   {
        type: 'SET_STUDENTS';
        payload: any
    }
|   {
        type: 'CLEANUP'
    }


export const lessonControlReducer = (state: lessonControlStateType, action: lessonControlActions ) => {
    switch(action.type) {
        case 'SET_PAGES': 
            return {
                ...state,
                pages: action.payload,
                status: 'loaded',
            }
        case 'SET_STUDENTS': 
            return {
                ...state,
                roster: action.payload,
            }
        case 'CLEANUP': 
            return lessonControlState
        default:
            return state;
    }
}