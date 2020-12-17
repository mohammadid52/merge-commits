import React, { useContext, useEffect, Suspense, lazy } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { Auth } from '@aws-amplify/auth';
import { useCookies } from 'react-cookie';

import { GlobalContext } from '../contexts/GlobalContext';
import Login from './Auth/Login';
import Forgot from './Auth/Forgot';
import Dashboard from './Dashboard/Dashboard';
import useDeviceDetect from '../customHooks/deviceDetect';
import MobileOops from '../components/Error/MobileOops';
import PrivateRoute from './Auth/PrivateRoute';
import PublicRoute from './Auth/PublicRoute';
import ComponentLoading from './Lesson/Loading/ComponentLoading';

const ConfirmCode = lazy(() => import('./Auth/ConfirmCode'));
const PrivacyPolicy = lazy(() => import('./Auth/PrivacyPolicy'));
const Registration = lazy(() => import('./Auth/Register'));
const Lesson = lazy(() => import('./Lesson/Lesson'));
const TeacherView = lazy(() => import('./TeacherView/TeacherView'));

const MainRouter: React.FC = () => {
  const deviceDetected = useDeviceDetect();
  const { theme, dispatch } = useContext(GlobalContext);
  const [, , removeCookie] = useCookies();
  const history = useHistory();

  const checkUserAuthenticated = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        dispatch({
          type: 'PREV_LOG_IN',
          payload: {
            email: user.attributes.email,
            authId: user.attributes.sub,
          },
        });
      })
      .catch((err) => console.error(err));
  };

  const checkForUserInactivity = () => {
    let idelTime = 0;
    let timer: any;

    window.addEventListener("visibilitychange", function () {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer);        //  Clear timer if user comes back to the app.
      } else {
        idelTime = 30 * 60 * 1000;  // Timer for 30 mins to count if user not using the app.

        const autoLogout = async () => {
          try {
            await Auth.signOut();
            removeCookie('auth', { path: '/' });
            dispatch({ type: 'CLEANUP' });
            sessionStorage.removeItem('accessToken');
            history.push('/login');
          } catch (error) {
            console.log('error signing out: ', error);
          }
        }

        timer = setTimeout(autoLogout, idelTime)
      }
    });

  }
  useEffect(() => {
    checkForUserInactivity();
    checkUserAuthenticated();
  }, []);

  return (
    <div
      className={`background-test h-screen md:max-w-full md:h-screen w-full overflow-x-hidden ${theme.bg} flex flex-col`}>

      {deviceDetected.mobile ? (
        <MobileOops userAgent={deviceDetected.device} />
      ) : (
          <Suspense
            fallback={
              <div className='min-h-screen w-full flex flex-col justify-center items-center'>
                <ComponentLoading />
              </div>
            }>
            <Switch>
              <PublicRoute path='/login' restricted={true} >
                <Login />
              </PublicRoute>
              <PublicRoute path='/register' restricted={true} >
                <Registration />
              </PublicRoute>
              <PublicRoute path='/confirm-code' restricted={true} >
                <ConfirmCode />
              </PublicRoute>
              <PublicRoute path='/forgot-password' restricted={true}>
                <Forgot />
              </PublicRoute>
              <PublicRoute path='/privacy-policy' restricted={true}>
                <PrivacyPolicy />
              </PublicRoute>
              <Route
                path='/confirm'
                render={({ location }) => (
                  <Redirect
                    to={{
                      pathname: '/confirm-code',
                      state: { from: location },
                    }}
                  />
                )}
              />
              <Route path='/new-password' render={({ location }) => (
                <Redirect
                  to={{
                    pathname: '/confirm-code',
                    state: { from: location },
                  }}
                />
              )}
              />
              <Route
                path='/reset-password'
                render={({ location }) => (
                  <Redirect
                    to={{
                      pathname: '/confirm-code',
                      state: { from: location },
                    }}
                  />
                )}
              />
              <PrivateRoute path='/dashboard'>
                <Dashboard />
              </PrivateRoute>
              <PrivateRoute path='/lesson'>
                <Lesson />
              </PrivateRoute>
              <PrivateRoute path='/lesson-control'>
                <TeacherView />
              </PrivateRoute>
              <Route
                exact
                path='/'
                render={({ location }) => (
                  <Redirect
                    to={{
                      pathname: '/dashboard',
                      state: { from: location },
                    }}
                  />
                )}
              />
            </Switch>
          </Suspense>
        )}
    </div>
  );
};

export default MainRouter;
