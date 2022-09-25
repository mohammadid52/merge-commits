import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Auth from '@aws-amplify/auth';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLoading3Quarters
} from 'react-icons/ai';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory} from 'react-router-dom';
import {setLocalStorageData} from 'utilities/localStorage';
import {getAsset} from '../../assets';
import {GlobalContext} from '@contexts/GlobalContext';
import * as customMutations from '../../customGraphql/customMutations';
import * as customQueries from '../../customGraphql/customQueries';
import useDeviceDetect from '../../customHooks/deviceDetect';
import useDictionary from '../../customHooks/dictionary';
import * as queries from '../../graphql/queries';
import {createUserUrl} from '../../utilities/urls';

import AuthCard from './AuthCard';
import RememberMe from './RememberMe';
import FormInput from '@components/Atoms/Form/FormInput';
import Buttons from '@components/Atoms/Buttons';

interface LoginProps {
  updateAuthState: Function;
}

const Login = ({updateAuthState}: LoginProps) => {
  const {browser: detectedBrowser} = useDeviceDetect();
  const [openAlertBrowser, setOpenAlertBrowser] = useState<boolean>(
    detectedBrowser === 'Safari'
  );
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const history = useHistory();
  const {userLanguage, clientKey, dispatch} = useContext(GlobalContext);
  const {AuthDict} = useDictionary(clientKey);

  let [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [input, setInput] = useState({
    email: '',
    password: ''
  });
  const [passToggle, setPassToggle] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [createPassword, setCreatePassword] = useState(false);
  const toggleLoading = (state: boolean) => {
    setIsToggled(state);
  };

  async function SignIn() {
    let username = input.email;
    let password = input.password;
    if (showPasswordField) {
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
        sessionStorage.setItem(
          'accessToken',
          user.signInUserSession.accessToken.jwtToken
        );
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
            associateInstitute:
              instInfo?.data?.listStaff?.items.filter((item: any) => item.institution) ||
              [],
            onDemand: userInfo?.onDemand,
            lessons: userInfo.lessons
          }
        });
        const input = {
          id: userInfo.id,
          authId: user.username,
          email: username,
          lastLoggedIn: new Date().toISOString()
        };
        const update: any = await API.graphql(
          graphqlOperation(customMutations.updatePersonLoginTime, {input})
        );

        updateAuthState(true);
      } catch (error) {
        console.log('error', error);
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
    } else {
      try {
        const user = await Auth.signIn(username, 'xIconoclast.5x');
        console.log('user', user);
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
        console.log('error', error);
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
              console.log('Error temporary password could not be reset');
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
            console.log('Error in resetting unconfirmed user.');
          }
        } else {
          manageSignInError(error, true);
        }
        toggleLoading(false);
      }
    }
  }

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
      dispatch({
        type: 'SET_USER',
        payload: {
          id: userInfo.id,
          firstName: userInfo.preferredName || userInfo.firstName,
          lastName: userInfo.lastName,
          language: userInfo.language,
          onBoardSurvey: userInfo.onBoardSurvey ? userInfo.onBoardSurvey : false,
          role: userInfo.role,
          image: userInfo.image
        }
      });
      const input = {
        id: userInfo.id,
        authId: user.username,
        email: username,
        lastLoggedIn: new Date().toISOString()
      };
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePersonLoginTime, {input})
      );
      updateAuthState(true);
      toggleLoading(false);
    } catch (error) {
      setMessage(() => {
        switch (error.code) {
          default:
            return {
              show: true,
              type: 'error',
              message: error.message
            };
        }
      });
      toggleLoading(false);
    }
  };

  const handleSubmit = () => {
    toggleLoading(true);
    SignIn();
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
    <AuthCard message={message} title="Login">
      {!createPassword ? (
        <>
          <div className="h-auto flex-grow flex flex-col justify-center">
            <FormInput
              label="Email"
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
                  label="Password"
                  placeHolder="Enter your password"
                  type="password"
                  id="password"
                  value={input.password}
                  onChange={handleChange}
                  onKeyDown={handleEnter}
                />

                <div className="my-4">
                  <RememberMe isChecked={isChecked} toggleCheckBox={toggleCheckBox} />
                </div>
              </>
            )}
            <div className="relative flex flex-col justify-center items-center">
              <Buttons
                disabled={isToggled}
                onClick={handleSubmit}
                btnClass="w-full py-3"
                loading={isToggled}
                label={showPasswordField ? 'Login' : 'Enter'}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={`text-center mb-4 leading-5 text-lg font-semibold text-gray-800`}>
            <p> Create your password </p>
          </div>
          <div className="h-3.5/10 flex-grow flex flex-col justify-center">
            <div className="w-full mb-2 flex flex-col justify-around items-center">
              {message.show ? (
                <p
                  className={`text-xs text-center ${
                    message.type === 'success'
                      ? 'text-green-500'
                      : message.type === 'error'
                      ? 'text-red-500'
                      : null
                  }`}>
                  {message.message}
                </p>
              ) : null}
            </div>
            <div className="input relative w-full mb-4">
              <div className="absolute w-6 right-0 transform -translate-x-1">
                <div
                  onClick={() => setPassToggle((prevToggle) => !prevToggle)}
                  className="mr-2 text-gray-500 cursor-pointer hover:text-grayscale transform translate-y-1/2">
                  {passToggle ? (
                    <IconContext.Provider value={{className: 'w-auto '}}>
                      <AiOutlineEye size={24} />
                    </IconContext.Provider>
                  ) : (
                    <IconContext.Provider value={{className: 'w-auto'}}>
                      <AiOutlineEyeInvisible size={24} />
                    </IconContext.Provider>
                  )}
                </div>
              </div>
              <label className="hidden" htmlFor="password">
                Password
              </label>
              <input
                className="w-full p-3  border-0 border-medium-gray border-opacity-20 rounded-lg bg-light-gray bg-opacity-10"
                placeholder="Password"
                type={passToggle ? 'text' : 'password'}
                id="password"
                name="password"
                value={input.password}
                onChange={handleChange}
                onKeyDown={handleEnterSetPassword}
              />
            </div>
            <div className="relative h-4.5/10 flex flex-col justify-center items-center">
              <button
                disabled={isToggled}
                className={`p-3 mb-4 ${getAsset(
                  clientKey,
                  'authButtonColor'
                )} text-gray-200 rounded-xl font-semibold`}
                onKeyPress={handleEnterSetPassword}
                onClick={handleSetPassword}>
                {isToggled ? (
                  <IconContext.Provider
                    value={{
                      size: '1.5rem',
                      color: '#ffffff',
                      className: 'relative animate-spin'
                    }}>
                    <AiOutlineLoading3Quarters />
                  </IconContext.Provider>
                ) : (
                  'Set Password'
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </AuthCard>
  );
};

export default Login;
