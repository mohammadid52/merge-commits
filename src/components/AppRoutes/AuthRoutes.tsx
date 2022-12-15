import ErrorBoundary from '@components/Error/ErrorBoundary';
import PrivateRoute from 'components/Auth/PrivateRoute';
import React, {lazy} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

const Dashboard = lazy(() => import('components/Dashboard/Dashboard'));
const Lesson = lazy(() => import('components/Lesson/Lesson'));
const TeacherView = lazy(() => import('components/TeacherView/TeacherView'));
const Chat = lazy(() => import('components/RoomChat/Chat'));
const Csv = lazy(() => import('components/Dashboard/Csv/Csv'));
interface AuthRoutesProps {
  updateAuthState: Function;
}

const AuthRoutes = ({updateAuthState}: AuthRoutesProps) => {
  return (
    <>
      <Switch>
        <PrivateRoute path="/dashboard">
          <Dashboard updateAuthState={updateAuthState} />
        </PrivateRoute>
        <PrivateRoute path="/lesson/:lessonID">
          <Lesson />
        </PrivateRoute>
        <PrivateRoute path="/lesson-control/:lessonID">
          <TeacherView />
        </PrivateRoute>
        <Route
          exact
          path="/"
          render={({location}) => (
            <Redirect
              to={{
                pathname: '/dashboard',
                state: {from: location}
              }}
            />
          )}
        />
        <PrivateRoute path="/chat">
          <Chat />
        </PrivateRoute>
        <PrivateRoute path="/csv">
          <ErrorBoundary  componentName='Csv'>
          <Csv />
          </ErrorBoundary>
        </PrivateRoute>
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </>
  );
};

export default AuthRoutes;
