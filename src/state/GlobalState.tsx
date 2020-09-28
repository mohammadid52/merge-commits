export interface globalStateType  {
    status: string
    error: string
    isAuthenticated: boolean
    user: {
        authId: string,
        email: string,
        firstName: string,
        lastName: string,
        language: string,
        role: string,
        onBoardSurvey?: boolean,
    }
}

export const globalState: globalStateType = {
    status: '',
    error: '',
    isAuthenticated: false,
    user: {
        authId: '',
        email: '',
        firstName: '',
        lastName: '',
        language: '',
        role: '',
    },
}
