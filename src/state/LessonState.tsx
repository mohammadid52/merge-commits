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
    studentStatus: string;
    data?: {
        [key: string]: any;
    }
    studentDataID: string,
    currentPage: number;
    lessonProgress: number;
    canContinue: boolean;
    pages: PagesType
    componentState: {
        [key: string]: any
    }
    displayData?: {
        [key: string]: any
    }
    new_words: Array<string>;
    word_bank?: Array<string>;
    lessonComplete: boolean;
    unsavedChanges: boolean;
    saveFunction?: Promise<void>
}

export const lessonState: LessonStateType = {
    status: '',
    error: '',
    studentStatus: 'ACTIVE',
    data: {},
    studentDataID: '',
    currentPage: 0,
    lessonProgress: 0,
    canContinue: false,
    componentState: {},
    displayData: {},
    pages: null,
    new_words: [],
    word_bank: null,
    lessonComplete: false,
    unsavedChanges: true,
    saveFunction: null,
}
