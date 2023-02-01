import Buttons from '@components/Atoms/Buttons';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import useAuth from '@customHooks/useAuth';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {addNewDictionary, logError} from '@graphql/functions';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {AiOutlineBook} from 'react-icons/ai';
import {v4 as uuidV4} from 'uuid';

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
    setIsSimilar(null);
  };

  const {refetch} = useGraphqlQuery(
    'listDicitionaries',
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
  const searchFromApi = async () => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchInput.value}`
      );
      const data = response.data[0];
      const definition = data.meanings[0]?.definitions[0]?.definition || '';

      const audio =
        data?.phonetics?.length > 0
          ? data.phonetics.find((d: {audio: any}) => Boolean(d.audio))?.audio
          : '';

      return {definition, audio};
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'TranslationModule @searchFromApi');
    }
  };

  const onSearchInputChange = (e: any) => {
    setSearchInput({isActive: true, isTyping: true, value: e.target.value});
  };

  const _addNewDictionary = async (definition: string, audioUrl?: string) => {
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
            languageTranslation: '',
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
      } else {
        const response = await searchFromApi();
        if (Boolean(response)) {
          setFinalSearchResult &&
            setFinalSearchResult(response.definition || 'No results found');
          await _addNewDictionary(response.definition, response.audio);
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
      setContentHeight(el.clientHeight + BUFFER_HEIGHT);
    }
  }, [finalSearchResult, loading, searchInput.isActive]);

  const [isSimilar, setIsSimilar] = useState(null);

  return (
    <>
      {inClassroom && (
        <div className="card-body-header theme-bg text-white rounded-t-xl px-4 py-2">
          <h1 className="text-lg text-center tracking-wider font-medium uppercase text-white">
            Translation
          </h1>
        </div>
      )}
      <div className={`${inClassroom ? 'p-4' : ''} flex space-y-4 flex-col items-center`}>
        <input
          onChange={onSearchInputChange}
          placeholder="Search meaning..."
          className={`text-base ${loading ? 'cursor-disabled pointer-events-none' : ''} ${
            inClassroom
              ? ' bg-gray-400 border-0 theme-border  text-gray-800'
              : 'border-none bg-gray-700 text-white'
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
              <p
                className={`${
                  inClassroom ? 'text-gray-700 text-sm' : 'text-white text-base'
                } `}>
                {finalSearchResult}
              </p>
            </div>
          ) : null}
        </div>
        <div
          className={`${
            inClassroom ? 'bottom-0.5 right-1' : 'bottom-0 right-0'
          } absolute  translation-module__actions flex items-center justify-end space-x-4`}>
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
            current === idx ? 'bg-gray-700 ' : 'bg-gray-600 '
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
            ? '140px'
            : active && finalSearchResult
            ? `${120 + contentHeight}px`
            : active && !finalSearchResult
            ? '120px'
            : 'unset'
        }}
        className={`${
          active ? 'active' : ' '
        } translation-module__main  p-4 relative transition-all duration-300 bg-gray-800 border-0 border-gray-700 w-auto`}>
        <AnimatedContainer show={!active}>
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
