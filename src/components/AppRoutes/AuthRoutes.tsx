import React, {lazy} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import PrivateRoute from '../Auth/PrivateRoute';
import EmojiFeedback from '../General/EmojiFeedback';

const Dashboard = lazy(() => import('../Dashboard/Dashboard'));
const Lesson = lazy(() => import('../Lesson/Lesson'));
const TeacherView = lazy(() => import('../TeacherView/TeacherView'));
const Chat = lazy(() => import('../RoomChat/Chat'));
const Csv = lazy(() => import('../Dashboard/Csv/Csv'));
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
                state: {from: location},
              }}
            />
          )}
        />
        <PrivateRoute path="/chat">
          <Chat />
        </PrivateRoute>
        <PrivateRoute path="/csv">
          <Csv />
        </PrivateRoute>
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </>
  );
};

export default AuthRoutes;
