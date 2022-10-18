import {Auth} from '@aws-amplify/auth';
import {getAsset} from 'assets';
import FormInput from 'components/Atoms/Form/FormInput';
import AuthCard from 'components/Auth/AuthCard';
import RememberMe from 'components/Auth/RememberMe';
import {GlobalContext} from 'contexts/GlobalContext';
import React, {useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {AiOutlineLoading3Quarters} from 'react-icons/ai';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory, useLocation} from 'react-router-dom';

const ConfirmCode = () => {
  const history = useHistory();
  const location = useLocation();

  const {dispatch, clientKey} = useContext(GlobalContext);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [confirmInput, setConfirmInput] = useState({
    email: '',
    code: ''
  });
  const [passwordInput, setPasswordInput] = useState({
    password: '',
    match: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newPassToggle, setNewPassToggle] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [expiredLink, setExpiredLink] = useState(false);

  const checkLoginCred = () => {
    const auth = cookies.cred;
    if (auth?.isChecked) {
      setIsChecked(auth.isChecked);
    }
  };

  useEffect(() => {
    populateCodeAndEmail();
    checkLoginCred();
  }, []);

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const populateCodeAndEmail = () => {
    const params = useQuery();
    const confirmCode = params.get('code'); // Find a code from params.
    const emailId = params.get('email'); // Find an email from params.
    const isValidCode = confirmCode && /^\d{6}$/gm.test(confirmCode); // validate element to have 6 digit number. e.g. 234567
    const isValidEmail =
      emailId && /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi.test(emailId); // validate email id.

    if (isValidCode && isValidEmail) {
      setConfirmInput({
        ...confirmInput,
        code: confirmCode,
        email: emailId
      });
    } else {
      setMessage({
        show: true,
        type: 'error',
        message: 'Invalid account confirmation URL. Please check your email'
      });
    }
  };

  const resetPassword = async () => {
    let username = confirmInput.email;
    let password = passwordInput.password;
    let code = confirmInput.code;
    toggleLoading(true);

    try {
      const forgot = await Auth.forgotPasswordSubmit(username, code, password);
      console.log(forgot);
      history.push('/login');
    } catch (error) {
      console.error('error signing in', error);
      setMessage(() => {
        switch (error.code) {
          case 'InvalidPasswordException':
            return {
              show: true,
              type: 'error',
              message:
                'Password must be at least 8 characters, include uppercase, lowercase and numbers'
            };
          case 'InvalidParameterException':
            return {
              show: true,
              type: 'error',
              message:
                'Password must be at least 8 characters, include uppercase, lowercase and numbers'
            };
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message:
                'Invalid account confirmation URL. Please check your email or Register first'
            };
          case 'CodeMismatchException':
            return {
              show: true,
              type: 'error',
              message: 'Invalid account confirmation URL. Please check your email'
            };
          case 'ExpiredCodeException': {
            setExpiredLink(true);
            sendNewCode(username);
            return {
              show: true,
              type: 'error',
              message: 'The link has expired. A new link is sent to your email.'
            };
          }
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

  const sendNewCode = async (username: string, isSignupError?: boolean) => {
    try {
      if (isSignupError) {
        await Auth.resendSignUp(username);
      } else {
        await Auth.forgotPassword(username);
      }
    } catch (error) {
      setMessage(() => {
        return {
          show: true,
          type: 'error',
          message: error.message
        };
      });
    }
  };

  const confirmAndLogin = async () => {
    let username = confirmInput.email;
    let tempPassword = 'xIconoclast.5x';
    let password = passwordInput.password;
    let code = confirmInput.code;
    toggleLoading(true);
    try {
      const confirmRes = await Auth.confirmSignUp(username, code);
      console.log(confirmRes);

      const user = await Auth.signIn(username, tempPassword);
      const changePasswordRes = await Auth.changePassword(user, tempPassword, password);
      console.log(changePasswordRes);
      sessionStorage.setItem('accessToken', user.signInUserSession.accessToken.jwtToken);
      dispatch({type: 'LOG_IN', payload: {email: username, authId: user.username}});
      if (isChecked) {
        setCookie('cred', {
          email: username,
          isChecked: isChecked,
          password: password
        });
      } else {
        removeCookie('cred');
      }
      setCookie('auth', {email: username, authId: user.username}, {path: '/'});
      history.push('/dashboard');
    } catch (error) {
      // Handle code mismatch and code expiration errors.

      if (error.code === 'NotAuthorizedException') {
        resetPassword();
      } else {
        setMessage(() => {
          switch (error.code) {
            case 'CodeMismatchException':
              return {
                show: true,
                type: 'error',
                message:
                  'Invalid account confirmation URL. Please check your email or try again.'
              };
            case 'UserNotFoundException':
              return {
                show: true,
                type: 'error',
                message:
                  'Invalid account confirmation URL. Please check your email or Register first'
              };
            case 'ExpiredCodeException':
              setExpiredLink(true);
              sendNewCode(username, true);
              return {
                show: true,
                type: 'error',
                message: 'The link has expired. A new link is sent to your email.'
              };
          }
        });
        toggleLoading(false);
      }
    }
  };

  const validation = () => {
    let validated = false;

    setMessage(() => {
      let password = passwordInput.password;
      if (!password) {
        return {
          show: true,
          type: 'error',
          message: 'Please enter your new password'
        };
      }
      validated = true;
      if (validated) {
        confirmAndLogin();
      }
      return {
        show: false,
        type: 'success',
        message: 'success'
      };
    });
  };

  const handlePasswordChange = (e: {target: {id: any; value: any}}) => {
    const {id, value} = e.target;
    setPasswordInput((input) => {
      return {
        ...input,
        [id]: value
      };
    });
  };

  // Added loading state.
  const toggleLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter') {
      validation();
      toggleLoading(true);
    }
  };

  const handleSubmit = () => {
    validation();
    toggleLoading(true);
  };

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <AuthCard title="Set New Password" message={message}>
      <div className=" ">
        <FormInput
          label="New Password"
          placeHolder="Enter new password"
          type="password"
          id="password"
          name="password"
          value={passwordInput.password}
          onChange={handlePasswordChange}
          onKeyDown={handleEnter}
        />

        <div className="my-3">
          <RememberMe isChecked={isChecked} toggleCheckBox={toggleCheckBox} />
        </div>
      </div>

      <div className="relative h-4.5/10 flex flex-col justify-center items-center">
        <button
          disabled={isLoading}
          className={`p-3 mb-4 ${getAsset(
            clientKey,
            'authButtonColor'
          )} text-gray-200 rounded-xl font-semibold`}
          onKeyPress={handleEnter}
          onClick={handleSubmit}>
          {isLoading ? (
            <IconContext.Provider
              value={{
                size: '1.5rem',
                color: '#ffffff',
                className: 'relative animate-spin'
              }}>
              <AiOutlineLoading3Quarters />
            </IconContext.Provider>
          ) : (
            'Login'
          )}
        </button>

        {isLoading && (
          <IconContext.Provider
            value={{
              size: '1.5rem',
              color: '#488AC7',
              className: 'relative animate-spin'
            }}>
            <AiOutlineLoading3Quarters />
          </IconContext.Provider>
        )}
      </div>
    </AuthCard>
  );
};

export default ConfirmCode;
