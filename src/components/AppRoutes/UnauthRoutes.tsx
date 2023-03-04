import React, {lazy} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import PublicRoute from 'components/Auth/PublicRoute';

const Login = lazy(() => import('components/Auth/Login'));
const Forgot = lazy(() => import('components/Auth/Forgot'));
const PrivacyPolicy = lazy(() => import('components/Auth/PrivacyPolicy'));
// const Registration = lazy(() => import('components/Auth/Register'));
const ConfirmCode = lazy(() => import('components/Auth/ConfirmCode'));

const UnauthRoutes = () => {
  return (
    <Switch>
      <PublicRoute path="/login" restricted={true}>
        <Login />
      </PublicRoute>
      {/* <PublicRoute path="/register" restricted={true}>
        <Registration />
      </PublicRoute> */}
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
              state: {from: location}
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
              state: {from: location}
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
              state: {from: location}
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
              state: {from: location}
            }}
          />
        )}
      />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
};

export default UnauthRoutes;
