import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Auth} from '@aws-amplify/auth';
import axios from 'axios';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as queries from 'graphql/queries';
import React, {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {setLocalStorageData} from 'utilities/localStorage';
import {createUserUrl} from 'utilities/urls';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import AuthCard from 'components/Auth/AuthCard';
import RememberMe from 'components/Auth/RememberMe';
import {AiOutlineLock, AiOutlineUser} from 'react-icons/ai';
import {UserPageState} from 'API';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import QuickTiles from './QuickTiles';

interface LoginProps {
  updateAuthState: Function;
}

const Login = ({updateAuthState}: LoginProps) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  const {dispatch} = useGlobalContext();
  console.log('test');

  let [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [input, setInput] = useState({
    email: '',
    password: ''
  });

  const [isChecked, setIsChecked] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [createPassword, setCreatePassword] = useState(false);
  const toggleLoading = (state: boolean) => {
    setIsToggled(state);
  };

  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const onShowPassword = async (username: string, password: string) => {
    try {
      const user = await Auth.signIn(username, password);
      dispatch({type: 'LOG_IN', payload: {email: username, authId: user.username}});
      if (isChecked) {
        setCookie('cred', {email: username, isChecked, password}, {path: '/'});
      } else {
        removeCookie('cred');
      }
      setCookie(
        'auth',
        {email: username, authId: user.username},
        {secure: false, path: '/'}
      );
      sessionStorage.setItem('accessToken', user.signInUserSession.accessToken.jwtToken);
      if (user) {
        let userInfo: any = await API.graphql(
          graphqlOperation(queries.getPerson, {email: username, authId: user.username})
        );
        userInfo = userInfo.data.getPerson;

        let instInfo: any = {};
        if (userInfo.role !== 'ST') {
          instInfo = await API.graphql(
            graphqlOperation(customQueries.getAssignedInstitutionToStaff, {
              filter: {staffAuthID: {eq: user.username}}
            })
          );
        }

        const userData = {
          id: userInfo.id,
          firstName: userInfo.preferredName || userInfo.firstName,
          lastName: userInfo.lastName,
          language: userInfo.language,
          onBoardSurvey: userInfo.onBoardSurvey ? userInfo.onBoardSurvey : false,
          role: userInfo.role,
          image: userInfo.image,
          lastEmotionSubmission: userInfo?.lastEmotionSubmission,
          removedFrom: userInfo?.removedFrom,
          status: userInfo?.status,
          associateInstitute:
            instInfo?.data?.listStaff?.items.filter((item: any) => item.institution) || []
        };

        setUser({role: userData.role, associateInstitute: userData.associateInstitute});
        setIsLoginSuccess(true);
        setMessage({show: false, message: '', type: ''});

        dispatch({
          type: 'SET_USER',
          payload: {
            ...userData
          }
        });

        const time = new Date().toISOString();
        const input = {
          id: userInfo.id,
          authId: user.username,
          email: username,
          lastLoggedIn: time,
          lastPageStateUpdate: time,
          pageState: UserPageState.LOGGED_IN
        };
        await API.graphql(
          graphqlOperation(customMutations.updatePersonLoginTime, {input})
        );

        // updateAuthState(true);
      }
    } catch (error) {
      console.error('error', error);
      const errMsg = {show: true, type: 'error'};
      if (!username) {
        setMessage({...errMsg, message: 'Please enter your email'});
      } else if (!username.includes('@')) {
        setMessage({
          ...errMsg,
          message: 'Your email is not in the expected email address format'
        });
      } else if (!password) {
        setMessage({...errMsg, message: 'Please enter your password'});
      } else {
        manageSignInError(error, false);
      }
      toggleLoading(false);
    }
  };

  const onDefaultView = async (username: string) => {
    try {
      const user = await Auth.signIn(username, 'xIconoclast.5x');

      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setNewUser(user);
        setCreatePassword(true);
        setMessage({
          show: false,
          type: '',
          message: ''
        });
        toggleLoading(false);
      }
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        if (error.message === 'Incorrect username or password.') {
          setShowPasswordField(true);
        } else if (
          error.message ===
          'Temporary password has expired and must be reset by an administrator.'
        ) {
          try {
            await axios.post(createUserUrl, {email: username, status: 'temporary'});
            setMessage({
              show: true,
              type: 'success',
              message:
                'Your account has been activated by the admin. Please click on enter or login and create you password to continue.'
            });
          } catch (err) {
            console.error('Error temporary password could not be reset');
          }
        }
      } else if (error.code === 'UserNotConfirmedException') {
        try {
          await axios.post(createUserUrl, {email: username, status: 'unconfirmed'});
          setMessage({
            show: true,
            type: 'success',
            message:
              'Your account has been activated by the admin. Please click on enter or login and create you password to continue.'
          });
          // confirm user, set password, and sign in which should ask them to create a new password.
        } catch (err) {
          console.error('Error in resetting unconfirmed user.');
        }
      } else {
        manageSignInError(error, true);
      }
      toggleLoading(false);
    }
  };

  const signIn = async () => {
    let username = input.email;
    let password = input.password;
    if (showPasswordField) {
      await onShowPassword(username, password);
    } else {
      await onDefaultView(username);
    }
  };

  const manageSignInError = (error: any, onlyEmail: any) => {
    setMessage(() => {
      switch (error.code) {
        case 'UserNotFoundException':
          return {
            show: true,
            type: 'error',
            message: 'The email you entered was not found'
          };
        case 'NotAuthorizedException':
          if (!onlyEmail) {
            return {
              show: true,
              type: 'error',
              message: 'The email or password you entered was not correct'
            };
          }
          return;
        case 'UserNotConfirmedException':
          return {
            show: true,
            type: 'error',
            message: 'You need to confirm registered email id, Please check your email.'
          };
        // shows valid error message for confirmation error instead of redirecting to confirm-code rout.

        default:
          return {
            show: true,
            type: 'error',
            message: error.message
          };
      }
    });
  };

  const handleChange = (e: {target: {id: any; value: any}}) => {
    const {id, value} = e.target;
    setInput((input) => {
      if (id === 'email') {
        return {
          ...input,
          [id]: value.toLowerCase()
        };
      } else {
        return {
          ...input,
          [id]: value
        };
      }
    });
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit();
      toggleLoading(true);
    }
  };

  const handleEnterSetPassword = (e: any) => {
    if (e.key === 'Enter') {
      handleSetPassword();
      toggleLoading(true);
    }
  };

  const [user, setUser] = useState(null);

  const handleSetPassword = async () => {
    toggleLoading(true);
    let username = input.email;
    let password = input.password;
    try {
      await Auth.completeNewPassword(newUser, password);
      const user = await Auth.signIn(username, password);
      dispatch({type: 'LOG_IN', payload: {email: username, authId: user.username}});
      setCookie(
        'auth',
        {email: username, authId: user.username},
        {secure: false, path: '/'}
      );
      sessionStorage.setItem('accessToken', user.signInUserSession.accessToken.jwtToken);
      let userInfo: any = await API.graphql(
        graphqlOperation(queries.getPerson, {email: username, authId: user.username})
      );
      userInfo = userInfo.data.getPerson;

      const userData = {
        id: userInfo.id,
        firstName: userInfo.preferredName || userInfo.firstName,
        lastName: userInfo.lastName,
        language: userInfo.language,
        onBoardSurvey: userInfo.onBoardSurvey ? userInfo.onBoardSurvey : false,
        role: userInfo.role,
        image: userInfo.image,
        lastEmotionSubmission: userInfo?.lastEmotionSubmission,

        status: userInfo?.status
      };

      setUser({role: userInfo.role});
      setMessage({show: false, message: '', type: ''});
      setIsLoginSuccess(true);

      dispatch({
        type: 'SET_USER',
        payload: {...userData}
      });

      const time = new Date().toISOString();

      const input = {
        id: userInfo.id,
        authId: user.username,
        email: username,
        lastLoggedIn: time,
        pageState: UserPageState.LOGGED_IN,
        lastPageStateUpdate: time
      };
      await API.graphql(graphqlOperation(customMutations.updatePersonLoginTime, {input}));
      // updateAuthState(true);
      toggleLoading(false);
    } catch (error) {
      setMessage({
        show: true,
        type: 'error',
        message: error.message
      });
      toggleLoading(false);
    }
  };

  const handleSubmit = () => {
    toggleLoading(true);
    signIn();
  };
  const checkLoginCred = () => {
    const auth = cookies.cred;
    if (auth?.isChecked) {
      setIsChecked(auth.isChecked);
      setInput({
        ...input,
        email: auth.email,
        password: auth.password
      });
    }
  };

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    setLocalStorageData('lessonPayload', []);
    checkLoginCred();
  }, []);

  return (
    <AuthCard
      showFooter={!isLoginSuccess}
      message={message}
      // title={createPassword ? 'Create your password' : 'Login'}
      subtitle={
        isLoginSuccess
          ? 'Where do you want to go?'
          : createPassword
          ? ''
          : 'Welcome back!'
      }>
      <AnimatedContainer delay="1s" duration="500" show={Boolean(isLoginSuccess)}>
        {Boolean(isLoginSuccess) && (
          <QuickTiles updateAuthState={() => updateAuthState(true)} user={user} />
        )}
      </AnimatedContainer>

      <AnimatedContainer show={!isLoginSuccess}>
        {!isLoginSuccess &&
          (!createPassword ? (
            <>
              <div className="h-auto flex-grow flex flex-col justify-center">
                <FormInput
                  dataCy="email"
                  Icon={AiOutlineUser}
                  // label="Email"
                  className="mb-4"
                  placeHolder="Enter your email"
                  type="email"
                  value={input.email}
                  id="email"
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                />

                {showPasswordField && (
                  <>
                    <FormInput
                      dataCy="password"
                      // label="Password"
                      Icon={AiOutlineLock}
                      placeHolder="Enter your password"
                      type="password"
                      id="password"
                      value={input.password}
                      onChange={handleChange}
                      onKeyDown={handleEnter}
                    />

                    <div className="my-4">
                      <RememberMe
                        dataCy="remember"
                        isChecked={isChecked}
                        toggleCheckBox={toggleCheckBox}
                      />
                    </div>
                  </>
                )}
                <div className="relative flex flex-col justify-center items-center">
                  <Buttons
                    dataCy="login-button"
                    disabled={isToggled}
                    onClick={handleSubmit}
                    btnClass="w-full py-3"
                    loading={isToggled}
                    label={'Login'}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="">
                <FormInput
                  dataCy="password"
                  Icon={AiOutlineLock}
                  className="mb-4"
                  placeHolder="Enter new password"
                  type="password"
                  value={input.password}
                  id="password"
                  onChange={handleChange}
                  onKeyDown={handleEnterSetPassword}
                />

                <div className="relative flex flex-col justify-center items-center">
                  <Buttons
                    dataCy="set-password"
                    disabled={isToggled}
                    onClick={handleSetPassword}
                    btnClass="w-full py-3"
                    loading={isToggled}
                    label={isToggled ? 'Loading' : 'Set Password'}
                  />
                </div>
              </div>
            </>
          ))}
      </AnimatedContainer>
    </AuthCard>
  );
};

export default Login;
