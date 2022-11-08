import React from 'react';
import {CookiesProvider} from 'react-cookie';
import {BrowserRouter as Router} from 'react-router-dom';
import {GlobalContextProvider} from 'contexts/GlobalContext';
import MainRouter from 'components/AppMainRouter';
import {OverlayContextProvider} from 'contexts/OverlayContext';
import {PageBuilderProvider} from 'contexts/PageBuilderContext';
import Notification from 'atoms/Notification';
import NotificationContextProvider from 'contexts/NotificationContext';
import {QueryClient, QueryClientProvider} from 'react-query';

// This is the main component that wraps all other components
// It is the entry point for the application

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
// test push
// test push 30-08-2021
