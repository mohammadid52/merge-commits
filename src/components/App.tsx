import React from 'react';
import {CookiesProvider} from 'react-cookie';
import {BrowserRouter as Router} from 'react-router-dom';
import {GlobalContextProvider} from '@contexts/GlobalContext';
import MainRouter from './AppMainRouter';
import {OverlayContextProvider} from '@contexts/OverlayContext';
import {PageBuilderProvider} from '@contexts/PageBuilderContext';
import Notification from '@atoms/Notification';
import NotificationContextProvider from '@contexts/NotificationContext';

const App: React.FC = () => {
  return (
    <CookiesProvider>
      <GlobalContextProvider>
        <OverlayContextProvider>
          <PageBuilderProvider>
            <NotificationContextProvider>
              <Router>
                <MainRouter />
                <Notification />
              </Router>
            </NotificationContextProvider>
          </PageBuilderProvider>
        </OverlayContextProvider>
      </GlobalContextProvider>
    </CookiesProvider>
  );
};

export default App;
// test push
// test push 30-08-2021
// another test push 8-10-2021