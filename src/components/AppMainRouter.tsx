import React, { useState, useContext, useEffect, Suspense } from 'react';
import { Auth } from '@aws-amplify/auth';
import { useCookies } from 'react-cookie';

import { GlobalContext } from '../contexts/GlobalContext';
import useDeviceDetect from '../customHooks/deviceDetect';
import MobileOops from '../components/Error/MobileOops';
import ComponentLoading from './Lesson/Loading/ComponentLoading';

import AuthRoutes from './AppRoutes/AuthRoutes';
import UnauthRoutes from './AppRoutes/UnauthRoutes';

const MainRouter: React.FC = () => {
  const deviceDetected = useDeviceDetect();
  const { theme, dispatch } = useContext(GlobalContext);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [authState, setAuthState] = useState('loading')

  const checkUserAuthenticated = async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const user = await Auth.currentAuthenticatedUser()
        if (user) {
          const { email, sub } = user.attributes
          updateAuthState(true)
          dispatch({
            type: 'PREV_LOG_IN',
            payload: { email, authId: sub },
          });
        }
      } else {
        updateAuthState(false)
      }
    } catch (err) {
      updateAuthState(false)
    }
  };

  const checkForUserInactivity = () => {
    let idelTime = 0;
    let timer: any;

    window.addEventListener("visibilitychange", function () {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer);        //  Clear timer if user comes back to the app.
      } else {
        if (isUserLoggedIn()) {
          idelTime = 30 * 60 * 1000;  // Timer for 30 mins to count if user not using the app.
          timer = setTimeout(autoLogout, idelTime)
        }
      }
    });

  }
  const autoLogout = async () => {
    if (isUserLoggedIn()) {
      await Auth.signOut();
      removeCookie('auth', { path: '/' });
      dispatch({ type: 'CLEANUP' });
      sessionStorage.removeItem('accessToken');
      updateAuthState(false)
    }    
  }

  const isUserLoggedIn = () => {
    return authState === 'loggedIn'
  }

  const updateAuthState = (auth: boolean) => {
    if (auth) {
      setAuthState('loggedIn')
    } else {
      setAuthState('notLoggedIn')
    }
  }

  useEffect(() => {
    if (authState === 'loggedIn') {
      checkForUserInactivity()
    } else {
      removeCookie('auth', { path: '/' });
      dispatch({ type: 'CLEANUP' });
      sessionStorage.removeItem('accessToken');
    }
  }, [authState]);

  useEffect(() => {
    checkUserAuthenticated();
  }, []);

  if (authState === 'loading') {
    return <ComponentLoading />
  }
  {
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
              {
                authState === 'loggedIn' && <AuthRoutes updateAuthState={updateAuthState}/>
              }
              {
                authState === 'notLoggedIn' && <UnauthRoutes updateAuthState={updateAuthState}/>
              }
            </Suspense>
          )}
      </div>
    );
  }

};

export default MainRouter;
