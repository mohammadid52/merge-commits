import ComponentLoading from '@components/Lesson/Loading/ComponentLoading';
import PublicRoute from 'components/Auth/PublicRoute';
import {lazy, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

const Login = lazy(() => import('components/Auth/Login'));
const Forgot = lazy(() => import('components/Auth/Forgot'));
const PrivacyPolicy = lazy(() => import('components/Auth/PrivacyPolicy'));

const UnauthRoutes = () => {
  return (
    <Suspense fallback={<ComponentLoading />}>
      <Switch>
        <PublicRoute path="/login" restricted={true}>
          <Login />
        </PublicRoute>

        <PublicRoute path="/forgot-password" restricted={true}>
          <Forgot />
        </PublicRoute>
        <PublicRoute path="/privacy-policy" restricted={true}>
          <PrivacyPolicy />
        </PublicRoute>

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
    </Suspense>
  );
};

export default UnauthRoutes;
