import {AudioProvider} from '@contexts/AudioContext';
import MainRouter from 'components/AppMainRouter';
import {GlobalContextProvider} from 'contexts/GlobalContext';
import NotificationContextProvider from 'contexts/NotificationContext';
import {OverlayContextProvider} from 'contexts/OverlayContext';
import {PageBuilderProvider} from 'contexts/PageBuilderContext';
import React from 'react';
import {CookiesProvider} from 'react-cookie';
import {QueryClient, QueryClientProvider} from 'react-query';
import {BrowserRouter as Router} from 'react-router-dom';

// This is the main component that wraps all other components
// It is the entry point for the application

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <GlobalContextProvider>
          <AudioProvider>
            <OverlayContextProvider>
              <PageBuilderProvider>
                <NotificationContextProvider>
                  <Router>
                    <MainRouter />
                  </Router>
                </NotificationContextProvider>
              </PageBuilderProvider>
            </OverlayContextProvider>
          </AudioProvider>
        </GlobalContextProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
// test push
// test push 30-08-2021
