import React from 'react';
import {CookiesProvider} from 'react-cookie';
import {BrowserRouter as Router} from 'react-router-dom';
import {GlobalContextProvider} from '@contexts/GlobalContext';
import MainRouter from './AppMainRouter';

const App: React.FC = () => {
  return (
    <CookiesProvider>
      <GlobalContextProvider>
        <Router>
          <MainRouter />
        </Router>
      </GlobalContextProvider>
    </CookiesProvider>
  );
};

export default App;
// test push
// test push 30-08-2021
