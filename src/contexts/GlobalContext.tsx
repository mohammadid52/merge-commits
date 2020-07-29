import React, { useState, useReducer } from 'react';
import { globalReducer } from '../reducers/GlobalReducer';
import { globalState } from '../state/GlobalState';

export const pageThemes = {
    light: {
        bg: 'bg-gray-200',
        elem: {
            bg: 'bg-gray-200',
            text: 'text-dark',
            shadow: 'shadow-elem-light'
        },
        toolbar: {
            bg: 'bg-dark',
            text: 'text-gray-200'
        },
        block: {
            bg: 'bg-gray-200',
            text: 'text-dark',
            shadow: 'shadow-elem-light'
        },
        footer: {
            bg: 'bg-dark',
            text: 'text-gray-200'
        },
    },
    dark: {
        bg: 'bg-dark',
        elem: {
            bg: 'bg-dark-blue',
            text: 'text-gray-200',
            shadow: 'shadow-elem-dark'
        },
        toolbar: {
            bg: 'bg-dark-blue',
            text: 'text-gray-200'
        },
        block: {
            bg: 'bg-dark-blue',
            text: 'text-gray-200',
            shadow: 'shadow-elem-dark'
        },
        footer: {
            bg: 'bg-dark-blue',
            text: 'text-gray-200'
        }
    }
}

const standardThemes = {
    
}

interface GlobalProps {
    children: React.ReactNode;
}

export const GlobalContext = React.createContext(null);

export const GlobalContextProvider = ({ children }: GlobalProps) => {
    const [ state, dispatch ] = useReducer(globalReducer, globalState);
    const [ lightOn, setLightOn ] = useState(true);

    const lightSwitch = () => {
        setLightOn(prev => {
            return !prev
        })
    }

    const forceTheme = (bool: boolean) => {
        setLightOn(bool)
    }

    const theme = lightOn ? pageThemes.light : pageThemes.dark;

    return (
        <GlobalContext.Provider value={{theme, lightSwitch, forceTheme, state, dispatch}}>
            { children }
        </GlobalContext.Provider>
    )
}

