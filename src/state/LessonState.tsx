import React from 'react';



export interface LessonStateType  {
    status: string;
    error: string;
    data: {
        [key: string]: any;
    }
    currentPage: number;
    canContinue: boolean;
    pages: Array<{
        type: string;
        stage: string;
        open: boolean;
        active: boolean;
        save: boolean;
        breakdown: boolean;
        data: {
            [key: string]: any;
        };
    }>
    new_words: Array<string>;
    word_bank: Array<string>;
    lesson_complete: boolean;
}

export const lessonState: LessonStateType = {
    status: '',
    error: '',
    data: {},
    currentPage: 0,
    canContinue: false,
    pages: null,
    new_words: [],
    word_bank: null,
    lesson_complete: false,
}
