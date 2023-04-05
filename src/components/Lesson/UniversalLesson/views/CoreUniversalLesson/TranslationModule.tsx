import Buttons from '@components/Atoms/Buttons';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import useAuth from '@customHooks/useAuth';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {addNewDictionary, logError} from 'graphql-functions/functions';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {AiOutlineBook} from 'react-icons/ai';
import {v4 as uuidV4} from 'uuid';
import {listDicitionaries} from '@customGraphql/customQueries';

export const TranslationInsideComponent = ({
  setActive,
  setLoading = false,
  finalSearchResult,
  loading,
  setContentHeight,
  setFinalSearchResult,
  inClassroom = false
}: any) => {
  const {email, authId} = useAuth();

  const onCancel = () => {
    setActive(false);
    setLoading && setLoading(false);
    setContentHeight && setContentHeight(0);
    setFinalSearchResult && setFinalSearchResult(null);
    setSpanishResult(null);
    setIsSimilar(null);
  };

  const {refetch} = useGraphqlQuery(
    'listDicitionaries',
    listDicitionaries,
    {},
    {
      custom: true,
      enabled: false
    }
  );

  const [searchInput, setSearchInput] = useState({
    isActive: false,
    value: '',
    isTyping: false
  });

  const searchFromTable = async () => {
    try {
      const data = await refetch({
        filter: {
          englishPhrase: {
            contains: searchInput.value
          }
        }
      });

      return Boolean(data) ? data : [];
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'TranslationModule @searchFromTable');
    }
  };

  const [spanishResult, setSpanishResult] = useState<any | null>(null);

  const searchFromApi = async () => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchInput.value}`
      );

      let spanishResult: any;
      if (isSpanish) {
        const response = await axios.get(
          `https://api.mymemory.translated.net/get?q=${searchInput.value}&langpair=en|es`
        );

        if (response.data.responseStatus === 404) {
          spanishResult = null;
          setSpanishResult(null);
        }

        if (response.data.responseStatus === 200) {
          const translation = response.data.responseData.translatedText;
          spanishResult = translation;
          setSpanishResult(translation);
        } else {
          spanishResult = null;
          setSpanishResult(null);
        }
      }

      const data = response.data[0];
      const definition = data.meanings[0]?.definitions[0]?.definition || '';

      const audio =
        data?.phonetics?.length > 0
          ? data.phonetics.find((d: {audio: any}) => Boolean(d.audio))?.audio
          : '';

      return {definition, audio, spanishResult};
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'TranslationModule @searchFromApi');
      return null;
    }
  };

  const onSearchInputChange = (e: any) => {
    setSearchInput({isActive: true, isTyping: true, value: e.target.value});
  };

  const _addNewDictionary = async (
    definition: string,
    audioUrl?: string,
    languageTranslation?: string
  ) => {
    try {
      await addNewDictionary({
        authID: authId,
        email,
        englishPhrase: searchInput.value,
        englishDefinition: definition,
        englishAudio: audioUrl,
        translation: [
          {
            id: uuidV4(),
            translateLanguage: 'Spanish',
            languageTranslation: languageTranslation || '',
            languageDefinition: ''
          }
        ]
      });
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'TranslationModule @_addNewDictionary');
    }
  };

  /**
   * How does this work?
   * First search from our own dictionary table
   if there is result.. show it
   if not.. search from api..
   if result found. add it to dictionary table
   if there is no result found, show message.. "no result found"
   */
  const onSearch = async () => {
    try {
      setLoading && setLoading(true);
      const fromTable = await searchFromTable();

      if (fromTable.length > 0 && fromTable[0]?.englishDefinition) {
        fromTable[0]?.englishPhrase !== searchInput.value &&
          setIsSimilar(fromTable[0]?.englishPhrase);
        setFinalSearchResult &&
          setFinalSearchResult(fromTable[0]?.englishDefinition || 'No results found');
        setSpanishResult(fromTable[0]?.translation[0]?.languageTranslation);
      } else {
        const response = await searchFromApi();
        if (Boolean(response)) {
          setFinalSearchResult &&
            setFinalSearchResult(response?.definition || 'No results found');
          await _addNewDictionary(
            response?.definition,
            response?.audio,
            response?.spanishResult
          );
        } else {
          setFinalSearchResult && setFinalSearchResult('No results found');
        }
      }
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'TranslationModule @onSearch');
    } finally {
      setSearchInput({...searchInput, isActive: true, isTyping: false});
      setLoading && setLoading(false);
    }
  };

  const BUFFER_HEIGHT = 20;

  useEffect(() => {
    if (Boolean(finalSearchResult && !loading && searchInput.isActive)) {
      const el = document.querySelector('.search-results');
      setContentHeight((el?.clientHeight || 0) + BUFFER_HEIGHT);
    }
  }, [finalSearchResult, loading, searchInput.isActive]);

  const [isSimilar, setIsSimilar] = useState<any | null>(null);

  const {language} = useAuth();

  const isSpanish = language === 'ES';

  return (
    <>
      {
        <div className="card-body-header theme-bg text-white rounded-t-xl px-4 py-2">
          <h1 className="text-lg text-center tracking-wider font-medium uppercase text-white">
            Glossary
          </h1>
        </div>
      }
      <div className={`p-4 flex space-y-4 flex-col items-center`}>
        <input
          onChange={onSearchInputChange}
          onKeyDown={(e) => e.keyCode === 13 && onSearch()}
          placeholder="Search meaning..."
          className={`text-base ${loading ? 'cursor-disabled pointer-events-none' : ''} ${
            inClassroom
              ? ' bg-light  border-0 theme-border  text-darkest   '
              : 'border-none bg-dark   text-white'
          }  outline-none rounded-full px-4 py-2`}
        />

        <div className="translationr-module__search_results">
          {loading ? (
            <ThreeDotsLoading />
          ) : searchInput.isActive ? (
            <div
              className={`search-results ${
                inClassroom && finalSearchResult?.length > 0
                  ? 'bg-white rounded-xl p-4'
                  : ''
              }`}>
              {isSimilar && <h5>Similar: {isSimilar}</h5>}
              {Boolean(finalSearchResult) && (
                <div className="flex flex-col">
                  <span className="italic theme-text">Definition: </span>
                  <p
                    className={`${
                      inClassroom ? 'text-dark   text-sm' : 'text-white text-base'
                    } `}>
                    {finalSearchResult}
                  </p>
                </div>
              )}
              {Boolean(spanishResult && isSpanish) && (
                <div
                  className={`${
                    inClassroom ? 'border-light' : ' border-dark  '
                  } flex flex-col mt-2 pt-2 border-t-0`}>
                  <span className="italic theme-text">Translation: </span>
                  <p>{spanishResult}</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
        <div
          className={`bottom-0.5 right-1 absolute  translation-module__actions flex items-center justify-end space-x-4`}>
          <Buttons size="small" label={'Cancel'} onClick={onCancel} transparent />
          <Buttons size="small" label={'Search'} onClick={onSearch} />
        </div>
      </div>
    </>
  );
};

const ThreeDotsLoading = () => {
  const [current, setCurrent] = useState(0);
  let interval: any;
  useEffect(() => {
    interval = setInterval(() => {
      setCurrent(current === 2 ? 0 : current + 1);
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, [current]);

  return (
    <div className="flex items-center w-auto justify-center gap-x-1">
      {[0, 1, 2].map((idx) => (
        <div
          key={idx}
          className={`w-1.5 h-1.5 rounded-full ${
            current === idx ? 'bg-dark   ' : 'bg-medium  '
          }`}></div>
      ))}
    </div>
  );
};

const TranslationModule = () => {
  const [active, setActive] = useState(false);

  const onModuleOpen = () => {
    if (!active) {
      setActive(true);
    }
  };

  const [contentHeight, setContentHeight] = useState(0);

  const [loading, setLoading] = useState(false);

  const [finalSearchResult, setFinalSearchResult] = useState<string | null>(null);

  return (
    // <ClickAwayListener onClickAway={() => setActive(false)}>
    <div className="translation-module__wrapper fixed bottom-2 w-auto right-8">
      <div
        onClick={onModuleOpen}
        style={{
          minHeight: loading
            ? '170px'
            : active && finalSearchResult
            ? `${150 + contentHeight}px`
            : active && !finalSearchResult
            ? '150px'
            : 'unset'
        }}
        className={`${
          active ? 'active' : ' '
        } translation-module__main relative transition-all duration-300 bg-darkest    border-0 border-dark   w-auto`}>
        <AnimatedContainer
          className={active ? '' : 'h-full flex justify-center items-center'}
          show={!active}>
          {!active && <AiOutlineBook title="Search meaning" className="text-white" />}
        </AnimatedContainer>

        <AnimatedContainer
          show={active}
          animationType="translateY"
          duration="500"
          className="h-full"
          delay={'500ms'}>
          {active && (
            <TranslationInsideComponent
              setLoading={setLoading}
              finalSearchResult={finalSearchResult}
              loading={loading}
              setFinalSearchResult={setFinalSearchResult}
              setContentHeight={setContentHeight}
              setActive={setActive}
            />
          )}
        </AnimatedContainer>
      </div>
    </div>
    // </ClickAwayListener>
  );
};

export default TranslationModule;
