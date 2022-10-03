import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Auth from '@aws-amplify/auth';
import {useGlobalContext} from '@contexts/GlobalContext';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {setLocalStorageData} from 'utilities/localStorage';
import * as customMutations from '../../customGraphql/customMutations';
import * as customQueries from '../../customGraphql/customQueries';
import * as queries from '../../graphql/queries';
import {createUserUrl} from '../../utilities/urls';

import Buttons from '@components/Atoms/Buttons';
import FormInput from '@components/Atoms/Form/FormInput';
import AuthCard from './AuthCard';
import RememberMe from './RememberMe';

interface LoginProps {
  updateAuthState: Function;
}

const Login = ({updateAuthState}: LoginProps) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  const {dispatch} = useGlobalContext();

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
    <AuthCard message={message} title={createPassword ? 'Create your password' : 'Login'}>
      {!createPassword ? (
        <>
          <div className="h-auto flex-grow flex flex-col justify-center">
            <FormInput
              dataCy="email"
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
                  dataCy="password"
                  label="Password"
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
          <div className="">
            <FormInput
              dataCy="password"
              label="Password"
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
                disabled={isToggled}
                onClick={handleSetPassword}
                btnClass="w-full py-3"
                loading={isToggled}
                label={isToggled ? 'Loading' : 'Set Password'}
              />
            </div>
          </div>
        </>
      )}
    </AuthCard>
  );
};

export default Login;
