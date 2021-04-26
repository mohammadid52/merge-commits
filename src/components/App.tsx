import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from './AppMainRouter';
import { GlobalContextProvider } from '../contexts/GlobalContext';
import { CookiesProvider } from 'react-cookie';
import { SessionContextProvider } from '../contexts/SessionContext';

const App: React.FC = () => {
  return (
    <CookiesProvider>
      <SessionContextProvider>
        <GlobalContextProvider>
          <Router>
            <MainRouter />
          </Router>
        </GlobalContextProvider>
      </SessionContextProvider>
    </CookiesProvider>
  );
};

export default App;

// export default withAuthenticator(App);
