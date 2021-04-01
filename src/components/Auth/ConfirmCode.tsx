import React, { useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { GlobalContext } from '../../contexts/GlobalContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaKey } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useHistory, useLocation, NavLink } from 'react-router-dom';
import { Auth } from '@aws-amplify/auth';
import { getAsset } from '../../assets';

const ConfirmCode = () => {
  const history = useHistory();
  const location = useLocation();

  const { dispatch, clientKey } = useContext(GlobalContext);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [message, setMessage] = useState<{ show: boolean; type: string; message: string }>({
    show: false,
    type: '',
    message: '',
  });
  const [confirmInput, setConfirmInput] = useState({
    email: '',
    code: '',
  });
  const [passwordInput, setPasswordInput] = useState({
    password: '',
    match: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newPassToggle, setNewPassToggle] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [expiredLink, setExpiredLink] = useState(false)

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
    const isValidEmail = emailId && /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi.test(emailId); // validate email id.

    if (isValidCode && isValidEmail) {
      setConfirmInput({
        ...confirmInput,
        code: confirmCode,
        email: emailId,
      });
    } else {
      setMessage({
        show: true,
        type: 'error',
        message: 'Invalid account confirmation URL. Please check your email',
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
              message: 'Password must be at least 8 characters, include uppercase, lowercase and numbers',
            };
          case 'InvalidParameterException':
            return {
              show: true,
              type: 'error',
              message: 'Password must be at least 8 characters, include uppercase, lowercase and numbers',
            };
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message: 'Invalid account confirmation URL. Please check your email or Register first',
            };
          case 'CodeMismatchException':
            return {
              show: true,
              type: 'error',
              message: 'Invalid account confirmation URL. Please check your email',
            };
          case 'ExpiredCodeException': {
            setExpiredLink(true)
            sendNewCode(username);
            return {
              show: true,
              type: 'error',
              message: 'The link has expired. A new link is sent to your email.',
            }
          }
          default:
            return {
              show: true,
              type: 'error',
              message: error.message,
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
          message: error.message,
        };
      })
    }
  }

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
      dispatch({ type: 'LOG_IN', payload: { email: username, authId: user.username } });
      if (isChecked) {
        setCookie('cred', {
          email: username,
          isChecked: isChecked,
          password: password,
        });
      } else {
        removeCookie('cred');
      }
      setCookie('auth', { email: username, authId: user.username }, { path: '/' });
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
                message: 'Invalid account confirmation URL. Please check your email or try again.',
              };
            case 'UserNotFoundException':
              return {
                show: true,
                type: 'error',
                message: 'Invalid account confirmation URL. Please check your email or Register first',
              };
            case 'ExpiredCodeException': 
              setExpiredLink(true);
              sendNewCode(username, true)
              return {
                show: true,
                type: 'error',
                message: 'The link has expired. A new link is sent to your email.',
              }
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
          message: 'Please enter your new password',
        };
      }
      validated = true;
      if (validated) {
        confirmAndLogin();
      }
      return {
        show: false,
        type: 'success',
        message: 'success',
      };
    });
  };

  const handlePasswordChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setPasswordInput((input) => {
      return {
        ...input,
        [id]: value,
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
    <div className="w-full h-screen flex flex-row items-center justify-center bg-opacity-10 text-sm md:bg-none sm:bg-cover sm:bg-center">
      <div className="w-full md:max-w-160 sm:max-w-100 h-full max-h-160 flex flex-row rounded-xl shadow-2xl">
        <div className="min-w-sm max-w-sm bg-white md:rounded-l-xl sm:rounded-xl pt-0">
          <div className="h-.7/10  w-full rounded-tl-xl"></div>
          <div className="relative h-9.3/10 flex flex-col items-center p-8">
            <div className="absolute text-center text-xs mb-4" style={{ bottom: '0' }}>
              <p>© Copyright 2021</p>
              <p>
                <NavLink className="underline text-xs hover:text-blue-500" to="/privacy-policy">
                  Privacy Policy
                </NavLink>
              </p>
            </div>
            <div className="h-24 w-56">
              <img className="" src={getAsset(clientKey, 'login_page_logo')} alt="Logo" />
            </div>

            <div className={`text-center mb-4 leading-5 text-lg font-semibold text-gray-800`}>
              <p>Set New Password</p>
            </div>
            <div className={`text-center mb-4 leading-5 text-xs text-gray-600`}>
              <p>Your password must be at least 8 characters long and include uppercase and lowercase</p>
            </div>

            <div className="h-3.5/10 flex-grow flex flex-col justify-center">
              <div className="w-full mb-2 flex flex-col justify-around items-center">
                {message.show ? (
                  <p
                    className={`text-xs text-center ${
                      message.type === 'success' ? 'text-green-500' : message.type === 'error' ? 'text-red-500' : null
                    }`}>
                    {message.message}
                  </p>
                ) : null}
              </div>

              <div className="input relative w-full">
                <div className="absolute w-6 right-0 transform -translate-x-1">
                  <div
                    onClick={() => setNewPassToggle(!newPassToggle)}
                    className="mr-2 text-gray-500 cursor-pointer hover:text-grayscale transform translate-y-1/2">
                    {newPassToggle ? (
                      <IconContext.Provider value={{ className: 'w-auto '}}>
                        <AiOutlineEye size={24}/>
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider value={{ className: 'w-auto '}}>
                        <AiOutlineEyeInvisible  size={24}/>
                      </IconContext.Provider>
                    )}
                  </div>
                </div>

                <label className="hidden" htmlFor="password">
                  New Password
                </label>
                <input
                  className="w-full p-3  border-0 border-medium-gray border-opacity-20 rounded-lg bg-light-gray bg-opacity-10"
                  placeholder="New Password"
                  type={newPassToggle ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={passwordInput.password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleEnter}
                />
              </div>

              <div className="my-3">
                <label className="flex items-center justify-end">
                  <input
                    type="checkbox"
                    className="form-checkbox w-4 h-10"
                    checked={isChecked}
                    onChange={toggleCheckBox}
                  />
                  <span className={`w-auto ml-2 leading-5 text-xs text-gray-600`}>Remember Me</span>
                </label>
              </div>
            </div>

            <div className="relative h-4.5/10 flex flex-col justify-center items-center">
              <button
                disabled={isLoading}
                className={`p-3 mb-4 ${getAsset(clientKey, 'authButtonColor')} text-gray-200 rounded-xl font-semibold`}
                onKeyPress={handleEnter}
                onClick={handleSubmit}>
                {isLoading ? (
                  <IconContext.Provider
                    value={{ size: '1.5rem', color: '#ffffff', className: 'relative animate-spin' }}>
                    <AiOutlineLoading3Quarters />
                  </IconContext.Provider>
                ) : (
                  'Login'
                )}
              </button>

              {isLoading && (
                <IconContext.Provider value={{ size: '1.5rem', color: '#488AC7', className: 'relative animate-spin' }}>
                  <AiOutlineLoading3Quarters />
                </IconContext.Provider>
              )}
            </div>
          </div>
        </div>

        <div className={`login w-140 min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 ${getAsset(clientKey, 'authBackground')} bg-cover bg-center`}></div>
      </div>
    </div>
  );
};

export default ConfirmCode;
