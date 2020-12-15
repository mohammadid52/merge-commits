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
import ComponentLoading from './Lesson/Loading/ComponentLoading';

const ConfirmCode = lazy(() => import('./Auth/ConfirmCode'));
const PrivacyPolicy = lazy(() => import('./Auth/PrivacyPolicy'));
const Registration = lazy(() => import('./Auth/Register'));
const Lesson = lazy(() => import('./Lesson/Lesson'));
const TeacherView = lazy(() => import('./TeacherView/TeacherView'));


const MainRouter: React.FC = () => {
  const deviceDetected = useDeviceDetect();
  const { theme, state, dispatch } = useContext(GlobalContext);
  const history = useHistory();
  const [cookies] = useCookies(['auth']);

  const checkUserAuthenticated = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user);
        dispatch({
          type: 'PREV_LOG_IN',
          payload: {
            email: user.attributes.email,
            authId: user.attributes.sub,
          },
        });
        history.push('/dashboard');
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
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
              <Route path='/login' render={() => <Login />} />
              <Route path='/register' render={() => <Registration />} />
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
              <Route path='/confirm-code' render={() => <ConfirmCode />} />
              <Route
                path='/new-password'
                render={({ location }) => (
                  <Redirect
                    to={{
                      pathname: '/confirm-code',
                      state: { from: location },
                    }}
                  />
                )}
              />
              <Route path='/forgot-password' render={() => <Forgot />} />
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
              <Route path='/privacy-policy' render={() => <PrivacyPolicy />} />
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
