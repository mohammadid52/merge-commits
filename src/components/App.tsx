import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import 'antd/dist/reset.css';
import MainRouter from 'components/AppMainRouter';
import {GlobalContextProvider} from 'contexts/GlobalContext';
import NotificationContextProvider from 'contexts/NotificationContext';
import {OverlayContextProvider} from 'contexts/OverlayContext';
import {PageBuilderProvider} from 'contexts/PageBuilderContext';
import React from 'react';
import {CookiesProvider} from 'react-cookie';
import {BrowserRouter as Router} from 'react-router-dom';
// This is the main component that wraps all other components
// It is the entry point for the application

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <CookiesProvider>
      <GlobalContextProvider>
        {/* <AudioProvider> */}
        <OverlayContextProvider>
          <PageBuilderProvider>
            <NotificationContextProvider>
              <QueryClientProvider client={queryClient}>
                <Router>
                  <MainRouter />
                </Router>
              </QueryClientProvider>
            </NotificationContextProvider>
          </PageBuilderProvider>
        </OverlayContextProvider>
        {/* </AudioProvider> */}
      </GlobalContextProvider>
    </CookiesProvider>
  );
};

export default App;

// 1
