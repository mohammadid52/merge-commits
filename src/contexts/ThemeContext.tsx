import React, { useState } from 'react';

const pageThemes = {
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

interface ThemeProps {
    children: React.ReactNode;
}

export const ThemeContext = React.createContext(null);

export const ThemeContextProvider = ({ children }: ThemeProps) => {
    const [ lightOn, setLightOn ] = useState(true);

    const lightSwitch = () => {
        setLightOn(prev => {
            return !prev
        })
    }

    const theme = lightOn ? pageThemes.light : pageThemes.dark;

    return (
        <ThemeContext.Provider value={{theme, lightSwitch}}>
            { children }
        </ThemeContext.Provider>
    )
}

