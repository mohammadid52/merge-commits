import React, {lazy} from 'react';
import {Switch, Route, Redirect, useHistory} from 'react-router-dom';
import PublicRoute from '../Auth/PublicRoute';

const Login = lazy(() => import('../Auth/Login'));
const Forgot = lazy(() => import('../Auth/Forgot'));
const PrivacyPolicy = lazy(() => import('../Auth/PrivacyPolicy'));
const Registration = lazy(() => import('../Auth/Register'));
const ConfirmCode = lazy(() => import('../Auth/ConfirmCode'));

interface UnauthRoutesProps {
  updateAuthState: Function;
}

const UnauthRoutes = ({updateAuthState}: UnauthRoutesProps) => {
  return (
    <Switch>
      <PublicRoute path="/login" restricted={true}>
        <Login updateAuthState={updateAuthState} />
      </PublicRoute>
      <PublicRoute path="/register" restricted={true}>
        <Registration />
      </PublicRoute>
      <PublicRoute path="/confirm-code" restricted={true}>
        <ConfirmCode />
      </PublicRoute>
      <PublicRoute path="/forgot-password" restricted={true}>
        <Forgot />
      </PublicRoute>
      <PublicRoute path="/privacy-policy" restricted={true}>
        <PrivacyPolicy />
      </PublicRoute>
      <Route
        path="/new-password"
        render={({location}) => (
          <Redirect
            to={{
              pathname: '/confirm-code',
              state: {from: location},
            }}
          />
        )}
      />
      <Route
        path="/confirm"
        render={({location}) => (
          <Redirect
            to={{
              pathname: '/confirm-code',
              state: {from: location},
            }}
          />
        )}
      />
      <Route
        path="/reset-password"
        render={({location}) => (
          <Redirect
            to={{
              pathname: '/confirm-code',
              state: {from: location},
            }}
          />
        )}
      />
      <Route
        exact
        path="/"
        render={({location}) => (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location},
            }}
          />
        )}
      />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
};

export default UnauthRoutes;
