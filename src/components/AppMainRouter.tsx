// import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
// import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Auth} from '@aws-amplify/auth';
import {getPerson} from '@graphql/functions';
import {getAsset} from 'assets';
import AuthRoutes from 'components/AppRoutes/AuthRoutes';
import UnauthRoutes from 'components/AppRoutes/UnauthRoutes';
import MobileOops from 'components/Error/MobileOops';
import ComponentLoading from 'components/Lesson/Loading/ComponentLoading';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDeviceDetect from 'customHooks/deviceDetect';
import React, {Suspense, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';

const MainRouter: React.FC = () => {
  const deviceDetected = useDeviceDetect();
  const {
    theme,
    authState,
    updateAuthState,
    clientKey,
    dispatch,
    signOut
  } = useGlobalContext();
  const [cookies, setCookie, removeCookie] = useCookies();

  const [readyState, setReadyState] = useState('loading');

  useEffect(() => {
    if (authState === 'loggedIn') {
      checkForUserInactivity();
    } else {
      if (authState !== 'loading') {
        console.log('Removing cookies since not logged in');
        removeCookie('auth', {path: '/'});
        dispatch({type: 'CLEANUP'});
        sessionStorage.removeItem('accessToken');
      }
    }
  }, [authState]);

  useEffect(() => {
    document.addEventListener('readystatechange', function (ev) {
      setReadyState(document.readyState);
    });
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

    document
      .querySelector('html')
      .classList.add(clientKey === 'demo' ? 'curate' : clientKey);
  };

  const checkUserAuthenticated = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        const {email, sub} = user.attributes;

        const userInfo = await getPerson(email, sub);

        let instInfo: any = {};
        if (userInfo.role !== 'ST') {
          instInfo = await API.graphql(
            graphqlOperation(customQueries.getAssignedInstitutionToStaff, {
              filter: {staffAuthID: {eq: sub}}
            })
          );
        }
        updateAuthState(true);

        // SETUP USER
        dispatch({
          type: 'SET_USER',
          payload: {
            email,
            authId: sub,
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
            associateInstitute:
              instInfo?.data?.listStaff?.items.filter((item: any) => item.institution) ||
              [],
            onDemand: userInfo?.onDemand,
            lessons: userInfo.lessons,
            lastEmotionSubmission: userInfo?.lastEmotionSubmission,
            removedFrom: userInfo?.removedFrom,
            status: userInfo?.status
          }
        });
      } else {
        updateAuthState(false);
      }
    } catch (err) {
      // logError(
      //   err,
      //   {authId: state.user.authId, email: state.user.email},
      //   'AppMainRouter @checkUserAuthenticated'
      // );
      updateAuthState(false);
    }
  };

  const checkForUserInactivity = () => {
    let idelTime = 0;
    let timer: any;

    document.addEventListener('visibilitychange', function () {
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
      signOut();
    }
  };

  const isUserLoggedIn = () => {
    return authState === 'loggedIn';
  };

  if (readyState !== 'complete') {
    return (
      <div className="min-h-screen   w-full flex flex-col justify-center items-center">
        <ComponentLoading />
      </div>
    );
  } else {
    return (
      <div
        className={`iconoclast:bg-50 curate:bg-50 h-screen md:max-w-full md:h-screen w-full overflow-x-hidden ${theme.bg} flex flex-col`}>
        {false && deviceDetected.mobile ? (
          <MobileOops userAgent={deviceDetected.device} />
        ) : (
          <Suspense
            fallback={
              <div className="min-h-screen __polka-pattern w-full flex flex-col justify-center items-center">
                <ComponentLoading />
              </div>
            }>
            {authState === 'loggedIn' && <AuthRoutes />}
            {authState === 'notLoggedIn' && <UnauthRoutes />}
          </Suspense>
        )}
      </div>
    );
  }
};

export default MainRouter;
