import React from 'react';
import { lessonControlStateType, lessonControlState } from '../state/LessonControlState';
import { turquoise } from 'color-name';

type lessonControlActions = 
|   {
        type: 'INITIAL_LESSON_SETUP';
        payload: any
    }
|   {
        type: 'OPEN_LESSON' | 'DISABLE_LESSON' | 'CLOSE_LESSON' | 'DELETE_DISPLAY_DATA' | 'SET_DISPLAY_DATA' | 'SET_STUDENT_VIEWING' | 'SET_SHARE_MODE' | 'QUIT_SHARE_MODE' | 'SAVED_CHANGES';
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
                unsavedChanges: true,
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
                unsavedChanges: true,
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
                unsavedChanges: true,
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
        case 'SET_SHARE_MODE':
                return {
                    ...state,
                    sharing: true,
                    unsavedChanges: true,
                    pages: state.pages.map(page => {
                        if (action.payload !== page.stage) {
                            return page
                        } else {
                            return { 
                                ...page,
                                displayMode: 'COOP',
                            }}
                        })
                };
        case 'QUIT_SHARE_MODE':
                return {
                    ...state,
                    sharing: false,
                    unsavedChanges: true,
                    pages: state.pages.map(page => {
                        return { 
                            ...page,
                            displayMode: 'SELF',
                        }})
                };
        case 'SAVED_CHANGES':
            return {
                ...state,
                unsavedChanges: false,
            };
        case 'SET_DISPLAY_DATA':
            return {
                ...state,
                displayData: action.payload,
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
                        studentInfo: {}
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