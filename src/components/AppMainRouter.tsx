import React, {useState, useContext, useEffect, Suspense} from 'react';
import {Auth} from '@aws-amplify/auth';
import {useCookies} from 'react-cookie';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import {GlobalContext} from '../contexts/GlobalContext';
import useDeviceDetect from '../customHooks/deviceDetect';
import MobileOops from '../components/Error/MobileOops';
import ComponentLoading from './Lesson/Loading/ComponentLoading';

import AuthRoutes from './AppRoutes/AuthRoutes';
import UnauthRoutes from './AppRoutes/UnauthRoutes';
import {getAsset} from '../assets';

import * as customMutations from '../customGraphql/customMutations';
import * as customQueries from '../customGraphql/customQueries';

const MainRouter: React.FC = () => {
  const deviceDetected = useDeviceDetect();
  const {state, theme, clientKey, dispatch} = useContext(GlobalContext);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [authState, setAuthState] = useState('loading');

  useEffect(() => {
    if (authState === 'loggedIn') {
      checkForUserInactivity();
    } else {
      removeCookie('auth', {path: '/'});
      dispatch({type: 'CLEANUP'});
      sessionStorage.removeItem('accessToken');
    }
  }, [authState]);

  useEffect(() => {
    setupAppHeaders();
    checkUserAuthenticated();
  }, []);

  const setupAppHeaders = async () => {
    document.title = getAsset(clientKey, 'appTitle');
    const favicon: any = document.getElementById('faviconDefault');
    const favicon32x32: any = document.getElementById('favicon32x32');
    const favicon16x16: any = document.getElementById('favicon16x16');
    const manifest: any = document.getElementById('manifest');
    const maskIcon: any = document.getElementById('maskIcon');
    favicon.href = getAsset(clientKey, 'faviconDefault');
    favicon32x32.href = getAsset(clientKey, 'favicon32x32');
    favicon16x16.href = getAsset(clientKey, 'favicon16x16');
    manifest.href = getAsset(clientKey, 'manifest');
    maskIcon.href = getAsset(clientKey, 'maskIcon');
    document
      .querySelector('meta[name="apple-mobile-web-app-title"]')
      .setAttribute('content', getAsset(clientKey, 'webAppTitle'));
    document
      .querySelector('meta[name="application-name"]')
      .setAttribute('content', getAsset(clientKey, 'appName'));
    document
      .querySelector('meta[name="msapplication-TileImage"]')
      .setAttribute('content', getAsset(clientKey, 'tileImage'));
    document
      .querySelector('meta[name="msapplication-config"]')
      .setAttribute('content', getAsset(clientKey, 'msapplicationConfig'));
    document.querySelector('html').classList.add(clientKey);
  };

  const checkUserAuthenticated = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        const {email, sub} = user.attributes;
        let userInfo: any = await API.graphql(
          graphqlOperation(queries.getPerson, {email: email, authId: sub})
        );
        userInfo = userInfo.data.getPerson;
        updateAuthState(true);
        dispatch({
          type: 'PREV_LOG_IN',
          payload: {email, authId: sub},
        });
        // SETUP USER
        dispatch({
          type: 'SET_USER',
          payload: {
            id: userInfo.id,
            firstName: userInfo.preferredName || userInfo.firstName,
            lastName: userInfo.lastName,
            language: userInfo.language,
            onBoardSurvey: userInfo.onBoardSurvey ? userInfo.onBoardSurvey : false,
            role: userInfo.role,
            image: userInfo.image,
            location: userInfo?.location?.items,
            lastLoggedIn: userInfo.lastLoggedIn,
            lastLoggedOut: userInfo.lastLoggedOut,
          },
        });
      } else {
        updateAuthState(false);
      }
    } catch (err) {
      updateAuthState(false);
    }
  };

  const checkForUserInactivity = () => {
    let idelTime = 0;
    let timer: any;

    window.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer); //  Clear timer if user comes back to the app.
      } else {
        if (isUserLoggedIn()) {
          idelTime = 30 * 60 * 1000; // Timer for 30 mins to count if user not using the app.
          timer = setTimeout(autoLogout, idelTime);
        }
      }
    });
  };

  const autoLogout = async () => {
    if (isUserLoggedIn()) {
      const input = {
        id: state.user.id,
        authId: state.user.authId,
        email: state.user.email,
        lastLoggedOut: new Date().toISOString(),
      };
      API.graphql(graphqlOperation(customMutations.updatePersonLogoutTime, {input}));
      await Auth.signOut();
      updateAuthState(false);
    }
  };

  const isUserLoggedIn = () => {
    return authState === 'loggedIn';
  };

  const updateAuthState = (auth: boolean) => {
    if (auth) {
      setAuthState('loggedIn');
    } else {
      setAuthState('notLoggedIn');
    }
  };

  const [justLoggedIn, setJustLoggedIn] = useState(false);

  {
    return (
      <div
        className={`background-test h-screen md:max-w-full md:h-screen w-full overflow-x-hidden ${theme.bg} flex flex-col`}>
        {false && deviceDetected.mobile ? (
          <MobileOops userAgent={deviceDetected.device} />
        ) : (
          <Suspense
            fallback={
              <div className="min-h-screen w-full flex flex-col justify-center items-center">
                <ComponentLoading />
              </div>
            }>
            {authState === 'loggedIn' && (
              <AuthRoutes justLoggedIn={justLoggedIn} updateAuthState={updateAuthState} />
            )}
            {authState === 'notLoggedIn' && (
              <UnauthRoutes
                setJustLoggedIn={setJustLoggedIn}
                updateAuthState={updateAuthState}
              />
            )}
          </Suspense>
        )}
      </div>
    );
  }
};

export default MainRouter;
