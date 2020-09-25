import { lessonControlStateType, lessonControlState } from '../state/LessonControlState';

type lessonControlActions = 
|   {
        type: 'INITIAL_LESSON_SETUP';
        payload: any
    }
|   {
        type: 'OPEN_LESSON' | 'DISABLE_LESSON' | 'CLOSE_LESSON' | 'DELETE_DISPLAY_DATA' | 'SET_DISPLAY_DATA' | 'SET_STUDENT_VIEWING' | 'SET_SHARE_MODE' | 'QUIT_SHARE_MODE' | 'SAVED_CHANGES' | 'UPDATE_STUDENT_DATA';
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
        case 'UPDATE_STUDENT_DATA':
            let found = state.roster.some((student: any) => {
                return student.id === action.payload.id
            })

            let viewing = state.studentViewing.studentInfo && state.studentViewing.studentInfo.id ? state.studentViewing.studentInfo.id === action.payload.id : null;

            if ( found ) {

                if ( viewing ) {
                    return {
                        ...state,
                        roster: state.roster.map((student: any) => {
                            if ( student.id === action.payload.id ) {
                                return action.payload
                            } return student
                        }),
                        studentViewing: {
                            ...state.studentViewing,
                            studentInfo: action.payload
                        }
                    }
                }

                return {
                    ...state,
                    roster: state.roster.map((student: any) => {
                        if ( student.id === action.payload.id ) {
                            return action.payload
                        } return student
                    })
                }
            } 

            let updatedArray = state.roster
            updatedArray.push(action.payload)

            return {
                ...state,
                roster: updatedArray,
            }


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
                unsavedChanges: true,
                displayData: action.payload,
            };
        case 'DELETE_DISPLAY_DATA':
            return {
                ...state,
                unsavedChanges: true,
                displayData: {
                    ...state.displayData,
                    breakdownComponent: '',
                }
            };
        case 'SET_STUDENT_VIEWING':
            console.log(action.payload);
            if ( state.studentViewing.studentInfo && state.studentViewing.studentInfo.id === action.payload.id ) {
                return { 
                    ...state,
                    unsavedChanges: true,
                    studentViewing: {
                        live: false,
                        studentInfo: {}
                    }
                }
            }
            
            return {
                ...state,
                unsavedChanges: true,
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