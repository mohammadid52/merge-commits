import React from 'react';
import {CookiesProvider} from 'react-cookie';
import {BrowserRouter as Router} from 'react-router-dom';
import {GlobalContextProvider} from '@contexts/GlobalContext';
import MainRouter from './AppMainRouter';
import {OverlayContextProvider} from '@contexts/OverlayContext';
import {EditStateContextProvider} from '@contexts/EditStateContext';

const App: React.FC = () => {
  return (
    <CookiesProvider>
      <GlobalContextProvider>
        <OverlayContextProvider>
          <EditStateContextProvider>
            <Router>
              <MainRouter />
            </Router>
          </EditStateContextProvider>
        </OverlayContextProvider>
      </GlobalContextProvider>
    </CookiesProvider>
  );
};

export default App;
// test push
// test push 30-08-2021
