type pageObject = {
    type: string
    stage: string
    open: boolean
    disable: boolean
    active: boolean
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
}

export const lessonControlState: lessonControlStateType = {
    status: '',
    error: '',
    pages: [],
    roster: []
}
