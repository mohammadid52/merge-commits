import React from 'react';
import {CookiesProvider} from 'react-cookie';
import {BrowserRouter as Router} from 'react-router-dom';
import {GlobalContextProvider} from 'contexts/GlobalContext';
import MainRouter from 'components/AppMainRouter';
import {OverlayContextProvider} from 'contexts/OverlayContext';
import {PageBuilderProvider} from 'contexts/PageBuilderContext';
import Notification from 'atoms/Notification';
import NotificationContextProvider from 'contexts/NotificationContext';

// This is the main component that wraps all other components
// It is the entry point for the application

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

// => Lesson Flow =>
// Button at the end of the lesson is clicked

// if student is *self paced* then
// Move writing exercises to notebook
// Archive rest of the pages
// Confirm copy of data
// Update completed lesson
// Delete record lessondata

// if student is not *self paced* then
// Move writing exercises to notebook
// Archive rest of the pages
// Confirm copy of data
// Update completed lesson in localhost

// Teacher closes lesson
// Loop through array of all students
// Move writing exercises to notebook (for students who have not clicked button)
// Archive rest of the pages (for students who have not clicked button)
// Confirm copy of data (for students who have not clicked button)
// Update completed lesson  (all students)
// Delete record lessondata (all students)
