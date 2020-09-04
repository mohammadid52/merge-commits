import React from 'react';
import { lessonControlStateType, lessonControlState } from '../state/LessonControlState';

type lessonControlActions = 
|   {
        type: 'INITIAL_LESSON_SETUP';
        payload: any
    }
|   {
        type: 'OPEN_LESSON' | 'DISABLE_LESSON' | 'CLOSE_LESSON' | 'DELETE_DISPLAY_DATA' | 'SET_DISPLAY_DATA' | 'SET_STUDENT_VIEWING';
        payload: any
    }
|   {
        type: 'CLEANUP'
    }


export const lessonControlReducer = (state: lessonControlStateType, action: lessonControlActions ) => {
    switch(action.type) {
        case 'INITIAL_LESSON_SETUP':
            return {
                ...state,
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
                                disabled: !page.disabled,
                            }
                        }
                    })
                };
        case 'SET_DISPLAY_DATA':
            return {
                ...state,
                displayData: {
                    ...state.displayData,
                    breakdownComponent: action.payload.name,
                    [action.payload.name]: action.payload.content
                },
            };
        case 'DELETE_DISPLAY_DATA':
            return {
                ...state,
                displayData: {
                    ...state.displayData,
                    breakdownComponent: '',
                }
            };
        case 'SET_STUDENT_VIEWING':
            if ( state.studentViewing.studentInfo && state.studentViewing.studentInfo.id === action.payload.id ) {
                return { 
                    ...state,
                    studentViewing: {
                        live: false,
                    }
                }
            }
            return {
                ...state,
                studentViewing: {
                    live: true,
                    studentInfo: action.payload
                }
            };
        case 'CLEANUP': 
            return lessonControlState
        default:
            return state;
    }
}