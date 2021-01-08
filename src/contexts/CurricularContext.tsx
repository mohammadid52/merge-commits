import React, { useReducer, useEffect, useState, } from 'react';
import { curricularState } from '../state/CurricularState'
import { curricularReducer } from '../reducers/CurricularReducer'

interface CurricularProps {
    children: React.ReactNode;
}
export const CurricularContext = React.createContext(null);

export const CurricularContextProvider: React.FC = ({ children }: CurricularProps) => {
    const [state, dispatch] = useReducer(curricularReducer, curricularState);
    return (
        <CurricularContext.Provider value={{
            state,
            dispatch
        }}>
            { children}
        </CurricularContext.Provider>
    )
}