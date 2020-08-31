import React from 'react';
import { lessonControlStateType, lessonControlState } from '../state/LessonControlState';

type lessonControlActions = 
|   {
        type: 'INITIAL_LESSON_SETUP';
        payload: any
    }
|   {
        type: 'OPEN_LESSON' | 'DISABLE_LESSON' | 'CLOSE_LESSON';
        payload: any
    }
|   {
        type: 'CLEANUP'
    }


export const lessonControlReducer = (state: lessonControlStateType, action: lessonControlActions ) => {
    switch(action.type) {
        case 'INITIAL_LESSON_SETUP':
            return {
                status: 'loaded',
                pages: action.payload.pages,
                data: action.payload.data,
                roster: action.payload.students
            }
            case 'OPEN_LESSON':
                return {
                    ...state,
                    pages: state.pages.map(page => {
                        if (action.payload !== page.stage) {
                            return page
                        } else {
                            return {
                                ...page,
                                open: true,
                            }
                        }
                    })
                };
            case 'CLOSE_LESSON':
                return {
                    ...state,
                    pages: state.pages.map(page => {
                        if (action.payload !== page.stage) {
                            return page
                        } else {
                            return {
                                ...page,
                                open: false,
                            }
                        }
                    })
                };
            case 'DISABLE_LESSON':
                return {
                    ...state,
                    pages: state.pages.map(page => {
                        if (action.payload !== page.stage) {
                            return page
                        } else {
                            return {
                                ...page,
                                disabled: true,
                            }
                        }
                    })
                };
        case 'CLEANUP': 
            return lessonControlState
        default:
            return state;
    }
}