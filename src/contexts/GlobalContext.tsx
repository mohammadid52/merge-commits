import {API, graphqlOperation} from 'aws-amplify';
import {UniversalLessonPlan} from 'API';
import * as mutations from 'graphql/mutations';
import React, {useContext, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {GlobalActions, globalReducer} from 'reducers/GlobalReducer';
import {LessonControlActions, lessonControlReducer} from 'reducers/LessonControlReducer';
import {LessonActions, lessonReducer} from 'reducers/LessonReducer';
import {globalState, GlobalStateType, standardTheme} from 'state/GlobalState';
import {lessonControlState, LessonControlStateType} from 'state/LessonControlState';
import {lessonState as lessonStateObject, LessonStateType} from 'state/LessonState';
import {getClientKey} from 'utilities/strings';

export const allowedAuthIds = [
  '6c4dd66f-77d5-4aba-bf5a-46566f8a836d',
  '22241431-5b44-434a-bba1-6dcb40e7c7fa'
];

type ClientKey = 'iconoclast' | 'curate' | 'demo';
type AuthState = 'loggedIn' | 'notLoggedIn' | 'loading';

interface GlobalProps {
  children: React.ReactNode;
}

interface GlobalContextTypes {
  theme: {[key: string]: any};
  state: GlobalStateType;
  authState: AuthState;
  dispatch: React.Dispatch<GlobalActions>;
  lessonState: LessonStateType;
  checkIfAdmin: () => boolean;
  userLanguage: 'ES' | 'EN';
  clientKey: ClientKey;

  updateAuthState: (auth: boolean) => void;
  saveJournalData?: React.MutableRefObject<any>;
  zoiqFilter:
    | {
        isZoiq: {
          ne: boolean;
        };
      }[]
    | {}[];
  lessonDispatch: React.Dispatch<LessonActions>;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  controlState: LessonControlStateType;
  controlDispatch: React.Dispatch<LessonControlActions>;
  scanLessonAndFindComplicatedWord: (
    lessonPlan: UniversalLessonPlan[]
  ) => UniversalLessonPlan[];
}

const theme = standardTheme;

export const GlobalContext = React.createContext<GlobalContextTypes>({
  theme,
  state: globalState,
  authState: 'notLoggedIn',
  dispatch: () => {},
  controlDispatch: () => {},
  lessonDispatch: () => {},
  updateAuthState: () => {},
  setAuthState: () => {},
  lessonState: lessonStateObject,
  checkIfAdmin: () => false,
  clientKey: 'iconoclast',
  controlState: lessonControlState,
  userLanguage: 'EN',
  scanLessonAndFindComplicatedWord: () => [],
  zoiqFilter: [{}]
});

export const GlobalContextProvider = ({children}: GlobalProps) => {
  /**
   * state,dispatch --> Used in dashboard etc.
   * lessonState, lessonStateDispatch --> Used in lesson state
   */

  const [authState, setAuthState] = useState<AuthState>('loading');

  const [state, dispatch] = useReducer(globalReducer, globalState) as [
    GlobalStateType,
    React.Dispatch<GlobalActions>
  ];

  const [lessonState, lessonDispatch] = useReducer(lessonReducer, lessonStateObject) as [
    LessonStateType,
    React.Dispatch<LessonActions>
  ];

  const [controlState, controlDispatch] = useReducer(
    lessonControlReducer,
    lessonControlState
  ) as [LessonControlStateType, React.Dispatch<LessonControlActions>];

  const user = state.user;
  const {location, language, authId, role} = user;

  const userLanguage = language || 'EN';

  const clientKey: ClientKey = getClientKey();

  const saveJournalData = useRef();

  useEffect(() => {
    if (location?.length > 0) {
      updatePersonLocation();
    }
  }, [user]);

  const scanLessonAndFindComplicatedWord = (lessonPlan: UniversalLessonPlan[]) => {
    return lessonPlan;
  };

  async function updatePersonLocation() {
    const updatedLocation = {
      id: location.length > 0 ? location?.[0].id : '',
      personAuthID: location.length > 0 ? location?.[0].personAuthID : '',
      personEmail: location.length > 0 ? location?.[0].personEmail : '',
      syllabusLessonID: 'dashboard',
      roomID: '0',
      currentLocation: '',
      lessonProgress: ''
    };
    try {
      await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, {
          input: updatedLocation
        })
      );
    } catch (e) {
      console.error('update PersonLocation : ', e);
    }
  }

  const checkIfAdmin = () => allowedAuthIds.includes(authId) || role === 'SUP';

  const updateAuthState = (auth: boolean) => {
    if (auth) {
      setAuthState('loggedIn');
    } else {
      setAuthState('notLoggedIn');
    }
  };

  const zoiqFilter = checkIfAdmin() ? [{}] : [{isZoiq: {ne: true}}];

  const value = useMemo(
    () => ({
      theme,
      state,
      authState,
      dispatch,
      lessonState,
      zoiqFilter,
      lessonDispatch,
      updateAuthState,
      saveJournalData,
      controlState,
      controlDispatch,
      checkIfAdmin,
      userLanguage,
      setAuthState,
      clientKey,
      scanLessonAndFindComplicatedWord
    }),
    [
      theme,
      state,
      authState,
      dispatch,
      lessonState,
      zoiqFilter,
      lessonDispatch,
      updateAuthState,
      saveJournalData,
      controlState,
      controlDispatch,
      checkIfAdmin,
      userLanguage,
      setAuthState,
      clientKey,
      scanLessonAndFindComplicatedWord
    ]
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => useContext(GlobalContext);
