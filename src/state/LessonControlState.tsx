type pageObject = {
    type: string
    stage: string
    open: boolean
    disabled: boolean
    active: boolean
    displayMode: null | string
}

export type studentObject = {
    id: string
    lessonProgress: string
    status: string
    live: boolean
    studentID: string
    studentAuthID: string
    student: {
        id: string
        authId: string
        email: string
        firstName: string
        language: string
        lastName: string
        preferredName: string
    }
    doFirstData?: {
         [key: string]: any 
    }
    warmUpData?: {
        [key: string]: any
    }
    corelessonData: {
        [key: string]: any
    }
    activityData: {
        [key: string]: any
    }
}

export interface lessonControlStateType  {
    status: string
    error: string
    pages: Array<pageObject>
    roster: Array<studentObject>
    data?: {
        [key: string]: any;
    }
    displayData: {
        breakdownComponent: string,
        studentInfo?: {
            id: string
            firstName: string
            preferredName?: string
            lastName: string
        }
        doFirstData?: { [key: string]: any }
        warmUpData?: { [key: string]: any }
        corelessonData?: { [key: string]: any }
        activityData?: { [key: string]: any }
    },
    studentViewing: {
        live: boolean,
        studentInfo?: studentObject
    }
}

export const lessonControlState: lessonControlStateType = {
    status: '',
    error: '',
    pages: [],
    roster: [],
    data: {},
    displayData: {
        breakdownComponent: '',
    },
    studentViewing: {
        live: false,
    }
}
