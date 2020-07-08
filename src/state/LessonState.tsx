import { turquoise } from "color-name";

export interface LessonStateType  {
    status: string;
    error: string;
    data?: {
        [key: string]: any;
    }
    currentPage: number;
    lessonProgress: number;
    canContinue: boolean;
    pages: Array<{
        type: string;
        stage: string;
        open: boolean;
        active: boolean;
        save: boolean;
        breakdown: boolean;
    }>
    componentState: {
        [key: string]: any
    }
    new_words: Array<string>;
    word_bank?: Array<string>;
    lessonComplete: boolean;
    firstSave: boolean;
    unsavedChanges: boolean;
}

export const lessonState: LessonStateType = {
    status: '',
    error: '',
    data: {},
    currentPage: 0,
    lessonProgress: 0,
    canContinue: false,
    componentState: {},
    pages: null,
    new_words: [],
    word_bank: null,
    lessonComplete: false,
    firstSave: false,
    unsavedChanges: true,
}
