import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {UniversalLessonPlan} from 'API';
import * as mutations from 'graphql/mutations';
import React, {useContext, useEffect, useReducer, useRef, useState} from 'react';
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

interface GlobalProps {
  children: React.ReactNode;
}

interface GlobalContextTypes {
  theme: {[key: string]: any};
  state: GlobalStateType;
  authState: string;
  dispatch: React.Dispatch<GlobalActions>;
  lessonState: LessonStateType;
  checkIfAdmin: () => boolean;
  userLanguage: string;
  clientKey: 'iconoclast' | 'demo' | 'curate';

  updateAuthState: (auth: boolean) => void;
  saveJournalData?: React.MutableRefObject<any>;
  zoiqFilter:
    | {
        isZoiq: {
          ne: boolean;
        };
      }[]
    | [];
  lessonDispatch: React.Dispatch<LessonActions>;
  controlState: LessonControlStateType;
  controlDispatch: React.Dispatch<LessonControlActions>;
  scanLessonAndFindComplicatedWord: (
    lessonPlan: UniversalLessonPlan[]
  ) => UniversalLessonPlan[];
}

const theme = standardTheme;

export const GlobalContext = React.createContext<any>({
  theme,
  state: globalState,
  authState: 'loading',
  dispatch: () => {},
  controlDispatch: () => {},
  lessonDispatch: () => {},
  updateAuthState: () => {},
  lessonState: lessonStateObject,
  checkIfAdmin: () => false,
  clientKey: 'iconoclast',
  controlState: lessonControlState,
  userLanguage: 'EN',
  scanLessonAndFindComplicatedWord: () => [],
  zoiqFilter: []
});

export const GlobalContextProvider = ({children}: GlobalProps) => {
  /**
   * state,dispatch --> Used in dashboard etc.
   * lessonState, lessonStateDispatch --> Used in lesson state
   */

  const [authState, setAuthState] = useState('loading');
  const [state, dispatch] = useReducer(globalReducer, globalState);
  const [lessonState, lessonDispatch] = useReducer(lessonReducer, lessonStateObject);
  const [controlState, controlDispatch] = useReducer(
    lessonControlReducer,
    lessonControlState
  );

  const user = state.user;
  const {location, language, authId, role} = user;

  const userLanguage = language || 'EN';

  const clientKey = getClientKey();

  const saveJournalData = useRef();

  useEffect(() => {
    if (location?.length > 0) {
      updatePersonLocation();
    }
  }, [user]);

  // const preferredLang = userLanguage;

  // const replaceStr = (word: any) => `<span class="dictionary-popup">
  // <div class="dictionary-popup__container" data-dictionaryId="${word.id}">
  // <span class="dictionary-popup__title"><span class="border-b-2 border-green-500 italic font-medium">Definition:</span> ${
  //   word.englishDefinition
  // }</span>
  // ${
  //   word?.translation?.length > 0 && preferredLang === 'ES'
  //     ? `
  //       ${word.translation.map(
  //         (translation: any) => `<div class="dictionary-popup__languages">
  //         ${
  //           translation.languageTranslation && (
  //             <h5>
  //               In {translation.translateLanguage}:{' '}
  //               <span>{translation.languageTranslation}</span>
  //             </h5>
  //           )
  //         }
  //         </div>`
  //       )}`
  //     : ``
  // }</div>${word.englishPhrase}</span>`;

  // const ignoreComponents = [
  //   'paragraph',
  //   'notes-form',
  //   FORM_TYPES.DOWNLOAD,
  //   FORM_TYPES.DOCS,
  //   'square',
  //   'keyword',
  //   GAME_CHANGERS,
  //   'video',
  //   'custom_video',
  //   'image',
  //   'links',
  //   'highlighter',
  //   FORM_TYPES.WRITING_EXERCISE,
  //   `${FORM_TYPES.WRITING_EXERCISE}-content`,
  //   `${FORM_TYPES.POEM}-content`,
  //   FORM_TYPES.POEM
  // ];

  const scanLessonAndFindComplicatedWord = (
    lessonPlan: UniversalLessonPlan[]
    // dictionaries: Dicitionary[]
  ) => {
    return lessonPlan;
    // if (lessonPlan && lessonPlan.length > 0) {
    //   try {
    //     const updated = lessonPlan.map((plan: any) => ({
    //       ...plan,
    //       pageContent:
    //         plan?.pageContent?.map((pgContent: any) => {
    //           return {
    //             ...pgContent,
    //             partContent:
    //               pgContent?.partContent?.map((ptContent: any) => {
    //                 if (
    //                   ignoreComponents.includes(ptContent.type) ||
    //                   (ptContent.type === 'header' && ptContent?.value?.length == 2) // <== this line means header and paragraph are tied together. and we don't want to run the below logic to paragraph
    //                 ) {
    //                   return {...ptContent};
    //                 }

    //                 return {
    //                   ...ptContent,
    //                   value: ptContent.value.map((value: any) => {
    //                     dictionaries.forEach((word) => {
    //                       if (!isEmpty(value.value)) {
    //                         if (word.englishDefinition) {
    //                           value.value = value.value.replace(
    //                             word.englishPhrase,
    //                             replaceStr(word)
    //                           );
    //                         }
    //                       }

    //                       if (!isEmpty(value.label)) {
    //                         if (word.englishDefinition) {
    //                           value.label = value.label.replace(
    //                             word.englishPhrase,
    //                             replaceStr(word)
    //                           );
    //                         }
    //                       }
    //                     });

    //                     // fixed wierd screen sliding issue
    //                     // add translation input for students
    //                     return {
    //                       ...value
    //                     };
    //                   })
    //                 };
    //               }) || []
    //           };
    //         }) || []
    //     }));
    //     return updated;
    //   } catch (error) {
    //     console.error(error);

    //     return lessonPlan;
    //   }
    // } else {
    //   return lessonPlan;
    // }
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
        graphqlOperation(mutations.updatePersonLocation, {input: updatedLocation})
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

  const zoiqFilter = checkIfAdmin() ? [] : [{isZoiq: {ne: true}}];

  return (
    <GlobalContext.Provider
      value={{
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

        clientKey,
        scanLessonAndFindComplicatedWord
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): any => useContext(GlobalContext);
