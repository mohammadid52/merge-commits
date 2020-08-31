type pageObject = {
    type: string
    stage: string
    open: boolean
    disabled: boolean
    active: boolean
    displayMode: null | string
}

type studentObject = {
    status: string
    progress: string
    data: {
        dofirst: string
    },
    info: {
        id: string
        authId: string
        email: string
        firstName: string
        language: string
        lastName: string
        phone: string
        preferredName: string
        role: string
        status: string
    },
}

export interface lessonControlStateType  {
    status: string
    error: string
    pages: Array<pageObject>
    roster: Array<studentObject>
    data?: {
        [key: string]: any;
    }
}

export const lessonControlState: lessonControlStateType = {
    status: '',
    error: '',
    pages: [],
    roster: [],
    data: {},
}
