import LogoutAfterInactivity from '@components/Auth/LogoutAfterInactivity';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import ComponentLoading from '@components/Lesson/Loading/ComponentLoading';
import useAuth from '@customHooks/useAuth';
import PrivateRoute from 'components/Auth/PrivateRoute';
import {lazy, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

const Dashboard = lazy(() => import('components/Dashboard/Dashboard'));
const Lesson = lazy(() => import('components/Lesson/Lesson'));
const TeacherView = lazy(() => import('components/TeacherView/TeacherView'));
const Csv = lazy(() => import('components/Dashboard/Csv/Csv'));
const AuthRoutes = () => {
  const {signOut} = useAuth();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
          <ComponentLoading />
        </div>
      }>
      <LogoutAfterInactivity
        logout={() => {
          signOut();
        }}
      />
      <Switch>
        <PrivateRoute path="/dashboard">
          <Dashboard />
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

        <PrivateRoute path="/csv">
          <ErrorBoundary componentName="Csv">
            <Csv />
          </ErrorBoundary>
        </PrivateRoute>
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Suspense>
  );
};

export default AuthRoutes;
