import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {
  FORM_TYPES,
  GAME_CHANGERS
} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {Dicitionary, UniversalLessonPlan} from 'API';
import * as mutations from 'graphql/mutations';
import {isEmpty} from 'lodash';
import React, {useContext, useEffect, useReducer, useRef} from 'react';
import {globalReducer} from 'reducers/GlobalReducer';
import {lessonControlReducer} from 'reducers/LessonControlReducer';
import {lessonReducer} from 'reducers/LessonReducer';
import {globalState} from 'state/GlobalState';
import {lessonControlState} from 'state/LessonControlState';
import {lessonState as lessonStateObject} from 'state/LessonState';
import {getClientKey} from 'utilities/strings';
export const allowedAuthIds = [
  '6c4dd66f-77d5-4aba-bf5a-46566f8a836d',
  '22241431-5b44-434a-bba1-6dcb40e7c7fa'
];

export const standardTheme = {
  bg: 'bg-dark-gray',
  underline: 'border-b border-white border-opacity-10 pb-1 mb-1',
  gradient: {
    cardBase: 'bg-gradient-to-tl from-dark-blue to-med-dark-blue'
  },
  blockQuote: 'px-4 border-l-4 border-white border-opacity-50 bg-black bg-opacity-40',
  banner: '',
  section:
    'w-full md:max-w-none lg:max-w-192 2xl:max-w-256  mx-auto  flex flex-col justify-between items-center ',
  elem: {
    bg: 'bg-dark-block',
    title: 'text-lg font-semibold text-gray-200',
    text: 'text-sm text-gray-200',
    textDark: 'text-sm text-darker-gray',
    textInput: 'bg-darker-gray text-blue-100 py-2 px-4',
    shadow: 'shadow-elem-dark',
    card: 'rounded-lg bg-white bg-opacity-20'
  },
  toolbar: {
    bg: 'bg-black',
    text: 'text-gray-200'
  },
  dashboard: {
    sectionTitle: 'w-auto text-black pb-2 font-medium mt-4 mb-1 text-left',
    bg: 'bg-darker-gray',
    card:
      'p-2 relative bg-white rounded  border-0 border-dark-gray border-opacity-10 h-auto flex',
    cardNoBG: 'relative h-auto p-2 flex'
  },
  lessonCard: {
    title: 'flex items-center text-lg 2xl:text-2xl  text-black text-left',
    subtitle: 'text-sm text-gray-400',
    border: 'border-dark-gray border-opacity-20'
  },
  sidemenu: {
    bg: 'bg-darker-gray',
    primary: 'z-50 min-h-screen w-65 min-w-65 flex flex-col bg-darker-gray',
    secondary:
      'z-50 min-h-screen w-65 min-w-65 flex flex-col bg-medium-gray  border-r-0 border-white',
    darktone: 'bg-black bg-opacity-80'
  },
  block: {
    bg: 'bg-dark-blue',
    text: 'text-gray-200',
    shadow: 'shadow-elem-dark'
  },
  footer: {
    bg: 'bg-dark-blue',
    text: 'text-gray-200'
  },
  btn: {
    iconoclastIndigo:
      'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-600 focus:bg-indigo-600',
    curateBlue:
      'bg-theme-blue text-white hover:bg-blue-500 active:bg-blue-500 focus:bg-blue-500',
    delete: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-600 focus:bg-red-600',
    confirm:
      'bg-green-500 text-white hover:bg-green-600 active:bg-green-600 focus:bg-green-600',
    cancel: 'bg-white text-gray-600  border-0 border-gray-600 hover:bg-gray-200',
    lessonStart:
      'bg-green-500 text-white hover:bg-green-600 active:bg-green-600 focus:bg-green-600',
    surveyStart:
      'bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-500 focus:bg-orange-500'
  },
  btnTransparent: {
    iconoclastIndigo: 'text-indigo-600 border-indigo-600 hover:text-indigo-500',
    curateBlue: 'text-theme-blue border-theme-blue hover:text-blue-500'
  },
  text: {
    default: 'text-black80',
    secondary: 'text-gray-500',
    active: 'text-indigo-500'
  },
  formSelect: 'bg-white border-gray-400 text-gray-900 border-0',
  outlineNone: 'outline-none hover:outline-none active:outline-none focus:outline-none',
  verticalBorder: {
    iconoclastRed: 'border-red-600',
    iconoclastIndigo: 'border-indigo-700',
    curateBlue: 'border-theme-blue'
  },
  searchIcon: {
    iconoclastIndigo: '#667eea',
    curateBlue: '#0081CB'
  },
  iconColor: {
    iconoclastIndigo: '#667eea',
    curateBlue: '#0081CB'
  },
  textColor: {
    iconoclastRed: 'text-red-400',
    iconoclastIndigo: 'text-indigo-600',
    curateBlue: 'text-theme-blue'
  },
  borderColor: {
    iconoclastIndigo: 'border-indigo-600',
    curateBlue: 'border-theme-blue'
  },
  borderColorLight: {
    iconoclastIndigo: 'border-indigo-400',
    curateBlue: 'border-blue-400'
  },
  backGround: {
    iconoclastIndigo: 'bg-indigo-500',
    curateBlue: 'bg-blue-500'
  },
  backGroundLight: {
    iconoclastIndigo: 'bg-indigo-400',
    curateBlue: 'bg-blue-400'
  },
  modals: {
    header:
      'flex items-center justify-between p-4 border-solid rounded-t-xl bg-gray-100 text-gray-900 border-gray-200',
    footer:
      'flex items-center justify-end px-4 py-2 gap-x-4 border-t-0 border-solid rounded-b-xl bg-gray-200 text-gray-900 border-gray-200',
    content:
      'border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none bg-white text-gray-900',
    hideBg: `border-transparent  rounded-lg shadow-lg relative flex flex-col w-full outline-none bg-transparent text-gray-900`
  },
  notice: {
    bar: '',
    category: {
      error: '',
      alert: '',
      info: '',
      help: '',
      tip: ''
    }
  }
};

interface GlobalProps {
  children: React.ReactNode;
}

export const GlobalContext = React.createContext(null);

export const GlobalContextProvider = ({children}: GlobalProps) => {
  /**
   * state,dispatch --> Used in dashboard etc.
   * lessonState, lessonStateDispatch --> Used in lesson state
   */

  const [state, dispatch] = useReducer(globalReducer, globalState);
  const [lessonState, lessonDispatch] = useReducer(lessonReducer, lessonStateObject);
  const [controlState, controlDispatch] = useReducer(
    lessonControlReducer,
    lessonControlState
  );
  const theme = standardTheme;
  const globalStateAccess = state;
  const userLanguage = state.user.language || 'EN';
  const uLang = userLanguage;
  const clientKey = getClientKey();

  const saveJournalData = useRef();

  useEffect(() => {
    if (state.user && state.user.location && state.user.location.length > 0) {
      updatePersonLocation();
    }
  }, [state.user]);

  const preferredLang = userLanguage;

  const replaceStr = (word: any) => `<span class="dictionary-popup">
  <div class="dictionary-popup__container" data-dictionaryId="${word.id}">
  <span class="dictionary-popup__title"><span class="border-b-2 border-green-500 italic font-medium">Definition:</span> ${
    word.englishDefinition
  }</span>
  ${
    word?.translation?.length > 0 && preferredLang === 'ES'
      ? `
        ${word.translation.map(
          (translation: any) => `<div class="dictionary-popup__languages">
          ${
            translation.languageTranslation && (
              <h5>
                In {translation.translateLanguage}:{' '}
                <span>{translation.languageTranslation}</span>
              </h5>
            )
          }
          </div>`
        )}`
      : ``
  }</div>${word.englishPhrase}</span>`;

  const ignoreComponents = [
    'paragraph',
    'notes-form',
    FORM_TYPES.DOWNLOAD,
    FORM_TYPES.DOCS,
    'square',
    'keyword',
    GAME_CHANGERS,
    'video',
    'custom_video',
    'image',
    'links',
    'highlighter',
    FORM_TYPES.WRITING_EXERCISE,
    `${FORM_TYPES.WRITING_EXERCISE}-content`,
    `${FORM_TYPES.POEM}-content`,
    FORM_TYPES.POEM
  ];

  const scanLessonAndFindComplicatedWord = (
    lessonPlan: UniversalLessonPlan[],
    dictionaries: Dicitionary[]
  ) => {
    if (lessonPlan && lessonPlan.length > 0) {
      try {
        const updated = lessonPlan.map((plan: any) => ({
          ...plan,
          pageContent:
            plan?.pageContent?.map((pgContent: any) => {
              return {
                ...pgContent,
                partContent:
                  pgContent?.partContent?.map((ptContent: any) => {
                    if (ignoreComponents.includes(ptContent.type)) {
                      return {...ptContent};
                    }

                    return {
                      ...ptContent,
                      value: ptContent.value.map((value: any) => {
                        dictionaries.forEach((word) => {
                          if (!isEmpty(value.value)) {
                            if (word.englishDefinition) {
                              value.value = value.value.replace(
                                word.englishPhrase,
                                replaceStr(word)
                              );
                            }
                          }

                          if (!isEmpty(value.label)) {
                            if (word.englishDefinition) {
                              value.label = value.label.replace(
                                word.englishPhrase,
                                replaceStr(word)
                              );
                            }
                          }
                        });

                        // fixed wierd screen sliding issue
                        // add translation input for students
                        return {
                          ...value
                        };
                      })
                    };
                  }) || []
              };
            }) || []
        }));
        return updated;
      } catch (error) {
        console.error(error);

        return lessonPlan;
      }
    } else {
      return lessonPlan;
    }
  };

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
      lessonProgress: ''
    };
    try {
      const newPersonLocationMutation: any = await API.graphql(
        graphqlOperation(mutations.updatePersonLocation, {input: updatedLocation})
      );
    } catch (e) {
      console.error('update PersonLocation : ', e);
    }
  }

  const checkIfAdmin = () => allowedAuthIds.includes(state.user.authId);

  const zoiqFilter = checkIfAdmin()
    ? []
    : [{isZoiq: {eq: false}}, {isZoiq: {attributeExists: false}}];

  return (
    <GlobalContext.Provider
      value={{
        theme,
        state,
        dispatch,
        lessonState,
        zoiqFilter,
        lessonDispatch,
        saveJournalData,
        controlState,
        controlDispatch,
        globalStateAccess,
        checkIfAdmin,
        userLanguage,
        uLang,
        clientKey,
        scanLessonAndFindComplicatedWord
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
