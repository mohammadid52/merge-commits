import { LessonStateType, lessonState } from '../state/LessonState';

type LessonActions = 
|   {
    type: 'SET_INITIAL_STATE';
    payload: {
        data?: any;
        pages: any;
        word_bank?: any;
        displayData?: any;
        }
    }
|   {
    type: 'UPDATE_LESSON_PLAN';
    payload: {
        pages: any;
        displayData?: any;
        }
    }
|   {
        type: 'SET_CURRENT_PAGE';
        payload: number;
    } 
|   {
        type: 'SET_PROGRESS';
        payload: number;
    } 
|   {
        type: 'SET_INITIAL_COMPONENT_STATE';
        payload: {
            [key: string]: any,
        };
    } 
|   {
        type: 'SET_INITIAL_COMPONENT_STATE_FROM_DB';
        payload: {
            [key: string]: any,
        };
    } 
|   {
        type: 'UPDATE_COMPONENT_STATE';
        payload: {
            componentName: string,
            inputName: string
            content: any,
        };
    } 
|   {
        type: 'ERROR';
        payload: string;
    } 
|   {
        type: 'ADD_WORD';
        payload: string;
    } 
|   {
        type: 'OPEN_LESSON';
        payload: string;
    } 
|   {
        type: 'ACTIVATE_LESSON';
        payload: string;
    } 
|   {
        type: 'ACTIVATE_CHECKPOINT';
        payload: string;
    } 
|   {
        type: 'SET_PAGE';
        payload: number;
    } 
|   {
        type: 'SET_STUDENT_DATA_ID';
        payload: string;
    } 
|   {
        type: 'CLEANUP';
    } 
|   {
        type: 'TEST' | 'PAGE_FORWARD' |  'PAGE_BACK' | 'CAN_CONTINUE' | 'NO_CONTINUE' | 'FINISH' | 'SAVED_CHANGES' | 'SET_LOADING';
    } 

export const lessonReducer = (state: LessonStateType, action: LessonActions) => {
    switch(action.type) {
        case 'TEST':
            console.log('done')
            break
        case 'SET_INITIAL_STATE': 
            return {
                ...state,
                status: 'loaded',
                data: action.payload.data,
                pages: action.payload.pages,
                word_bank: action.payload.word_bank,
                displayData: action.payload.displayData,
            }
        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.payload,
                lessonProgress: action.payload, 
                pages: state.pages.map((page: {}, key: number) => {
                    if (key <= action.payload) {
                        return {
                            ...page,
                            active: true,
                        }
                    } else {
                        return page
                    }
                })
            }
        case 'SET_PROGRESS':
            return {
                ...state,
                lessonProgress: action.payload, 
                pages: state.pages.map((page: {}, key: number) => {
                    if (key <= action.payload) {
                        return {
                            ...page,
                            active: true,
                        }
                    } else {
                        return page
                    }
                })
            }
        case 'ERROR':
            return {
                ...state, 
                error: action.payload
            } 
        case 'SET_STUDENT_DATA_ID':
            return {
                ...state, 
                studentDataID: action.payload
            } 
        case 'SET_LOADING':
            return {
                ...state, 
                status: 'loading',
            } 
        case 'ADD_WORD':
            return {
                ...state,
                new_words: [...state.new_words, action.payload],
                word_bank: [...state.word_bank, action.payload]
            }
        case 'SET_INITIAL_COMPONENT_STATE_FROM_DB':
            return {
                ...state,
                firstSave: true,
                componentState: action.payload,
            };
        case 'SET_INITIAL_COMPONENT_STATE':
            return {
                ...state,
                componentState: {
                    ...state.componentState,
                    [action.payload.name]: action.payload.content,
                },
            };
        case 'UPDATE_COMPONENT_STATE':
            return {
                ...state,
                unsavedChanges: true,
                componentState: {
                    ...state.componentState,
                    [action.payload.componentName]: {
                        ...state.componentState[action.payload.componentName],
                        [action.payload.inputName]: action.payload.content
                    }
                },
            };
        case 'UPDATE_LESSON_PLAN':
            return {
                ...state,
                status: 'loaded',
                displayData: action.payload.displayData,
                pages: action.payload.pages,

            }
        case 'CAN_CONTINUE':
            return {
                ...state,
                canContinue: true,
            }
        case 'NO_CONTINUE':
            return {
                ...state,
                canContinue: false,
            }
        case 'FINISH':
            return {
                ...state,
                canContinue: false,
            }
        case 'SAVED_CHANGES':
            return {
                ...state,
                unsavedChanges: false,
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
            }
        case 'ACTIVATE_LESSON':
            return {
                ...state,
                pages: state.pages.map(page => {
                    if (action.payload !== page.stage) {
                        return page
                    } else {
                        return {
                            ...page,
                            active: true,
                        }
                    }
                })
            };
        case 'ACTIVATE_CHECKPOINT':
            return {
                ...state,
                pages: state.pages.map(page => {
                    if (page.stage !== 'checkpoint') {
                        return page
                    } else {
                        if ( action.payload !== page.type ) {
                            return page
                        } else {
                            return {
                                ...page,
                                active: true,
                            }
                        }
                    }
                })
            };
        case 'SET_PAGE':
            return {
                ...state,
                currentPage: action.payload,
            }
        case 'PAGE_FORWARD':
            return {
                ...state,
                lessonProgress: state.lessonProgress === state.currentPage ? state.currentPage + 1 : state.lessonProgress,
                currentPage: state.currentPage + 1,
            };
        case 'PAGE_BACK':
            return {
                ...state,
                currentPage: state.currentPage - 1,
            };
        case 'CLEANUP':
            return lessonState;
        default:
            return state;
    }
}