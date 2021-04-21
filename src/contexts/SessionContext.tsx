import React, { useState, useReducer, useEffect } from 'react';
import { globalReducer } from '../reducers/GlobalReducer';
import { globalState, globalStateType } from '../state/GlobalState';
import { getClientKey } from '../utilities/strings';
import { useCookies } from 'react-cookie';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as mutations from '../graphql/mutations';
import { lessonControlStateType } from '../state/LessonControlState';
import { LessonStateType } from '../state/LessonState';

interface SessionContextProps {
  children?: React.ReactNode;
}

export const SessionContext = React.createContext(null);

export const SessionContextProvider = (props: SessionContextProps) => {
  const { children } = props;

  const sss = window.sessionStorage;
  const keyList = ['globalCTX', 'lessonControlCTX', 'lessonCTX'];

  // const [globalCTXSession, setGlobalCTXSession] = useState<any>(sss.getItem('globalCTX'));
  // const [lessonControlCTXSession, setLessonControlCTXSession] = useState<any>(sss.getItem('lessonControlCTX'));
  // const [lessonCTXSession, setLessonCTXSession] = useState<any>(sss.getItem('lessonCTX'));

  // useEffect(() => {
  //   sss.setItem('globalCTX', JSON.stringify({ test: 'test' }));
  //   return () => {
  //     sss.clear();
  //   };
  // }, []);

  const getSessionStorage = (key: string) => {
    try {
      return sss.getItem(key);
    } catch (e) {
      console.error('getSessionStorage -> ', e);
    }
  };
  const setSessionStorage = (key: string, obj: any) => {
    try {
      sss.setItem(key, JSON.stringify(obj));
    } catch (e) {
      console.error('setSessionStorage -> ', e);
    }
  };

  const removeSessionStorage = () => {
    //
  };

  const clearSessionStorage = () => {};

  return (
    <SessionContext.Provider
      value={{
        keyList,
        getSessionStorage,
        setSessionStorage,
      }}>
      {children}
    </SessionContext.Provider>
  );
};
