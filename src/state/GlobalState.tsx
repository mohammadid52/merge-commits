export interface globalStateType  {
    status: string;
    error: string;
    isAuthenticated: boolean
    user: {
        [key: string]: any;
    }
}

export const globalState: globalStateType = {
    status: '',
    error: '',
    isAuthenticated: true,
    user: {},
}
