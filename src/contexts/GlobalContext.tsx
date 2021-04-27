import React, {useEffect, useReducer} from 'react';
import {globalReducer} from '../reducers/GlobalReducer';
import {globalState} from '../state/GlobalState';
import {getClientKey} from '../utilities/strings';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as mutations from '../graphql/mutations';

export const standardTheme = {
  bg: 'bg-dark-gray',
  underline: 'border-b border-white border-opacity-10 pb-1 mb-1',
  gradient: {
    cardBase: 'bg-gradient-to-tl from-dark-blue to-med-dark-blue',
  },
  blockQuote: 'px-4 border-l-4 border-white border-opacity-50 bg-black bg-opacity-40',
  banner:
    'w-auto pb-2 mb-2 relative font-open font-medium text-left flex flex-row items-center text-gray-100 mt-4',
  section: 'w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-50',
  elem: {
    bg: 'bg-dark-block',
    title: 'text-lg font-semibold text-gray-200',
    text: 'text-sm text-gray-200',
    textDark: 'text-sm text-darker-gray',
    textInput: 'bg-darker-gray text-blue-100 py-2 px-4',
    shadow: 'shadow-elem-dark',
    card: 'rounded-lg bg-white bg-opacity-20',
  },
  toolbar: {
    bg: 'bg-black',
    text: 'text-gray-200',
  },
  dashboard: {
    sectionTitle: 'w-auto text-black pb-2 font-medium mt-4 mb-1 text-left',
    bg: 'bg-darker-gray',
    card:
      'p-2 relative bg-white rounded  border-0 border-dark-gray border-opacity-10 h-auto flex',
    cardNoBG: 'relative h-auto p-2 flex',
  },
  lessonCard: {
    title: 'flex items-center text-2xl text-black font-open text-left',
    subtitle: 'text-sm text-gray-400',
    border: 'border-dark-gray border-opacity-20',
  },
  sidemenu: {
    bg: 'bg-darker-gray',
    primary: 'z-50 min-h-screen w-65 min-w-65 flex flex-col bg-darker-gray',
    secondary:
      'z-50 min-h-screen w-65 min-w-65 flex flex-col bg-medium-gray  border-r-0 border-white',
    darktone: 'bg-black bg-opacity-80',
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
    iconoclastIndigo:
      'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-600 focus:bg-indigo-600',
    curateBlue:
      'bg-theme-blue text-white hover:bg-blue-500 active:bg-blue-500 focus:bg-blue-500',
    cancel: 'bg-white text-gray-600  border-0 border-gray-600 hover:bg-gray-200',
    lessonStart:
      'bg-green-500 text-white hover:bg-green-600 active:bg-green-600 focus:bg-green-600',
    surveyStart:
      'bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-500 focus:bg-orange-500',
  },
  btnTransparent: {
    iconoclastIndigo: 'text-indigo-600 border-indigo-600 hover:text-indigo-500',
    curateBlue: 'text-theme-blue border-theme-blue hover:text-blue-500',
  },
  text: {
    default: 'text-black80',
    secondary: 'text-gray-500',
    active: 'text-indigo-500',
  },
  formSelect: 'bg-white border-gray-400 text-gray-900 border-0',
  outlineNone: 'outline-none hover:outline-none active:outline-none focus:outline-none',
  verticalBorder: {
    iconoclastIndigo: 'border-indigo-700',
    curateBlue: 'border-theme-blue',
  },
  searchIcon: {
    iconoclastIndigo: '#667eea',
    curateBlue: '#0081CB',
  },
  iconColor: {
    iconoclastIndigo: '#667eea',
    curateBlue: '#0081CB',
  },
  textColor: {
    iconoclastIndigo: 'text-indigo-600',
    curateBlue: 'text-theme-blue',
  },
  borderColor: {
    iconoclastIndigo: 'border-indigo-600',
    curateBlue: 'border-theme-blue',
  },
  borderColorLight: {
    iconoclastIndigo: 'border-indigo-400',
    curateBlue: 'border-blue-400',
  },
  backGround: {
    iconoclastIndigo: 'bg-indigo-500',
    curateBlue: 'bg-blue-500',
  },
  backGroundLight: {
    iconoclastIndigo: 'bg-indigo-400',
    curateBlue: 'bg-blue-400',
  },
  modals: {
    header:
      'flex items-center justify-between p-4 border-solid rounded-t bg-white text-gray-900 border-gray-200',
    footer:
      'flex items-center justify-end p-4  border-t-0 border-solid rounded-b bg-white text-gray-900 border-gray-200',
    content:
      ' border-0  rounded-lg shadow-lg relative flex flex-col w-full outline-none bg-white text-gray-900',
  },
  notice: {
    bar: '',
    category: {
      error: '',
      alert: '',
      info: '',
      help: '',
      tip: '',
    },
  },
};

interface GlobalProps {
  children: React.ReactNode;
}

export const GlobalContext = React.createContext(null);

export const GlobalContextProvider = ({children}: GlobalProps) => {
  const [state, dispatch] = useReducer(globalReducer, globalState);

  const theme = standardTheme;
  const globalStateAccess = state;
  const userLanguage = state.user.language || 'EN';
  const uLang = userLanguage;
  const clientKey = getClientKey();

  useEffect(() => {}, []);

  useEffect(() => {
    if (state.user && state.user.location && state.user.location.length > 0) {
      updatePersonLocation();
    }
  }, [state.user]);

  async function updatePersonLocation() {
    const updatedLocation = {
      id: state.user.location.length > 0 ? state.user.location[0].id : '',
      personAuthID:
        state.user.location.length > 0 ? state.user.location[0].personAuthID : '',
      personEmail:
        state.user.location.length > 0 ? state.user.location[0].personEmail : '',
      syllabusLessonID: 'dashboard',
      roomID: '0',
      currentLocation: '',
      lessonProgress: '',
    };
    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, {input: updatedLocation})
      );
    } catch (e) {
      console.error('update PersonLocation : ', e);
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        theme,
        state,
        dispatch,
        globalStateAccess,
        userLanguage,
        uLang,
        clientKey,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};