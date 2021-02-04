import { internals } from "rx"

export type PagesType = Array<{
    disabled: boolean;
    displayMode: null | string;
    type: string;
    stage: string;
    open: boolean;
    active: boolean;
    // save: boolean;
}> | null

export interface LessonStateType  {
    status: string;
    error: string;
    syllabusLessonID: string,
    studentStatus: string;
    data?: {
        [key: string]: any;
    }
    studentDataID: string,
    studentUsername: string,
    studentAuthID: string,
    currentPage: number;
    lessonProgress: number;
    canContinue: boolean;
    pages: PagesType
    componentState: {
        [key: string]: any
    }
    viewing: boolean,
    displayData?: {
        [key: string]: any
    }
    questionData?: {
        [key: string]: string | null
    }
    new_words: Array<string>;
    word_bank?: Array<string>;
    lessonComplete: boolean;
    unsavedChanges: boolean;
    saveCount: number;
    subscription?: any;
    subcribeFunction?: () => any;
}

export const lessonState: LessonStateType = {
    status: '',
    error: '',
    syllabusLessonID: '',
    studentStatus: 'ACTIVE',
    studentDataID: '',
    studentUsername: '',
    studentAuthID: '',
    data: {},
    currentPage: 0,
    lessonProgress: 0,
    canContinue: false,
    componentState: {},
    questionData: {},
    viewing: false,
    displayData: {},
    pages: null,
    new_words: [],
    word_bank: null,
    lessonComplete: false,
    unsavedChanges: true,
    saveCount: 0,
}
