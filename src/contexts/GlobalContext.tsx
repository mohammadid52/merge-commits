import React, { useState, useReducer } from 'react';
import { globalReducer } from '../reducers/GlobalReducer';
import { globalState } from '../state/GlobalState';

export const pageThemes = {
  light: {
    bg: 'bg-opacity-10',
    underline: 'border-b border-white border-opacity-10 pb-1 mb-1',
    gradient: {
      cardBase: 'bg-gradient-to-tl from-dark-blue to-med-dark-blue',
    },
    blockQuote: 'px-4 border-l-4 border-white border-opacity-50 bg-black bg-opacity-40',
    banner:
      'relative flex flex-row justify-center items-center text-center font-open font-light text-base text-gray-200 mt-4',
    section: 'sm:w-full md:w-full xl:w-256 mx-auto h-full flex flex-col justify-between items-center z-50',
    elem: {
      bg: 'bg-gray-200',
      title: 'text-lg font-semibold text-gray-200',
      text: 'text-dark',
      textInput: 'bg-gray-300 py-2 px-4',
      shadow: 'shadow-elem-light',
      card: 'rounded-lg p-2 bg-white bg-opacity-20',
      cardIn: 'rounded-lg p-2 bg-black bg-opacity-20'
    },
    toolbar: {
      bg: 'bg-dark',
      text: 'text-gray-200',
    },
    dashboard: {
      sectionTitle: 'w-auto text-black pb-2 font-medium mt-4 mb-1 text-left',
      bg: 'bg-darker-gray',
    },
    sidemenu: {
      bg: 'bg-darker-gray',
    },
    block: {
      bg: 'bg-gray-200',
      text: 'text-dark',
      shadow: 'shadow-elem-light',
    },
    footer: {
      bg: 'bg-dark',
      text: 'text-gray-200',
    },
    btn: {
      indigo: 'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-600 focus:bg-indigo-600',
    },
    text: {
      default: 'text-black80',
      secondary: 'text-gray-500',
      active: 'text-indigo-500'
    },
    formSelect: 'bg-white border-gray-400 text-gray-900 border',
    outlineNone: 'outline-none hover:outline-none active:outline-none focus:outline-none',
    verticalBorder: 'border-l-6 border-indigo-700 pl-4',
    modals: {
      header: 'flex items-center justify-between p-4 border-solid rounded-t bg-white text-gray-900 border-gray-200',
      footer: 'flex items-center justify-end p-4 border-t border-solid rounded-b bg-white text-gray-900 border-gray-200',
      content: 'border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none bg-white text-gray-900'
    }
  },
  dark: {
    bg: 'bg-dark-gray',
    underline: 'border-b border-white border-opacity-10 pb-1 mb-1',
    gradient: {
      cardBase: 'bg-gradient-to-tl from-dark-blue to-med-dark-blue',
    },
    blockQuote: 'px-4 border-l-4 border-white border-opacity-50 bg-black bg-opacity-40',
    banner:
      'w-auto pb-2 mb-2 relative font-open font-light text-left flex flex-row items-center text-gray-200 mt-4',
    section: 'w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-50',
    elem: {
      bg: 'bg-dark-block',
      title: 'text-lg font-semibold text-gray-200',
      text: 'text-sm text-gray-200 mb-2',
      textInput: 'bg-darker-gray text-blue-100 py-2 px-4',
      shadow: 'shadow-elem-dark',
      card: 'rounded-lg bg-white bg-opacity-20',
      cardIn: 'rounded-lg p-2 bg-black bg-opacity-20'
    },
    toolbar: {
      bg: 'bg-black',
      text: 'text-gray-200',
    },
    dashboard: {
      sectionTitle: 'w-auto text-black pb-2 font-medium mt-4 mb-1 text-left',
      bg: 'bg-darker-gray',
    },
    sidemenu: {
      bg: 'bg-darker-gray',
    },
    block: {
      bg: 'bg-dark-blue',
      text: 'text-gray-200',
      shadow: 'shadow-elem-dark',
    },
    footer: {
      bg: 'bg-dark-blue',
      text: 'text-gray-200',
    },
    btn: {
      indigo: 'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-600 focus:bg-indigo-600',
    },
    text: {
      default: 'text-black80',
      secondary: 'text-gray-500',
      active: 'text-indigo-500'
    },
    formSelect: 'bg-white border-gray-400 text-gray-900 border',
    outlineNone: 'outline-none hover:outline-none active:outline-none focus:outline-none',
    verticalBorder: 'border-l-6 border-indigo-700 pl-4',
    modals: {
      header: 'flex items-center justify-between p-4 border-solid rounded-t bg-white text-gray-900 border-gray-200',
      footer: 'flex items-center justify-end p-4 border-t border-solid rounded-b bg-white text-gray-900 border-gray-200',
      content: 'border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none bg-white text-gray-900'
    }
  },
};

export const main_container = {
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem',
  // @media screen and (max-width: 767px) {
  //     padding: '1rem';
  // }
};

export const white_back = {
  backgroundColor: 'white',
  borderRadius: '1rem',
  boxShadow: '1px 1px 10px 1px #e0e0e0',
  // @media screen and (max-width: 767px) {
  //     padding: 1rem;
  //     overflow: scroll;
  // }
};

const standardThemes = {};

interface GlobalProps {
  children: React.ReactNode;
}

export const GlobalContext = React.createContext(null);

export const GlobalContextProvider = ({ children }: GlobalProps) => {
  const [state, dispatch] = useReducer(globalReducer, globalState);
  const [lightOn, setLightOn] = useState(true);

  const lightSwitch = () => {
    setLightOn((prev) => {
      return !prev;
    });
  };

  const forceTheme = (bool: boolean) => {
    setLightOn(bool);
  };

  const theme = lightOn ? pageThemes.light : pageThemes.dark;
  const globalStateAccess = state;

  return (
    <GlobalContext.Provider
      value={{
        theme,
        lightSwitch,
        forceTheme,
        state,
        dispatch,
        main_container,
        white_back,
        globalStateAccess,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
