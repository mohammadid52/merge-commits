import React, {useContext} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import MainRouter from './AppMainRouter';
import {GlobalContextProvider} from '../contexts/GlobalContext';
import {CookiesProvider} from 'react-cookie';

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

// export default withAuthenticator(App);