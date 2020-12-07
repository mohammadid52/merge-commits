import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaKey } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useHistory, useLocation, NavLink } from 'react-router-dom';
// import { Auth } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';

const ConfirmCode = () => {
  const history = useHistory();
  const location = useLocation();

  const { dispatch } = useContext(GlobalContext);
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
  })
  const [isLoading, setIsLoading] = useState(false);
  const [newPassToggle, setNewPassToggle] = useState(false);

  useEffect(() => {
    populateCodeAndEmail();
  }, []);

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const populateCodeAndEmail = () => {
    const params = useQuery();
    const confirmCode = params.get('code');                                                                            // Find a code from params.
    const emailId = params.get('email');                                                                               // Find an email from params.
    const isValidCode = confirmCode && ((/^\d{6}$/gm)).test(confirmCode);                                             // validate element to have 6 digit number. e.g. 234567
    const isValidEmail = emailId && ((/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi).test(emailId));         // validate email id.

    if (isValidCode && isValidEmail) {
      setConfirmInput({
        ...confirmInput,
        code: confirmCode,
        email: emailId
      })
    } else {
      setMessage({
        show: true,
        type: 'error',
        message: 'Invalid account confirmation URL. Please check your email',
      })
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
                'Password must be at least 8 characters, include uppercase, lowercase and numbers',
            };
          case 'InvalidParameterException':
            return {
              show: true,
              type: 'error',
              message:
                'Password must be at least 8 characters, include uppercase, lowercase and numbers',
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
          default:
            return {
              show: true,
              type: 'error',
              message: error.message,
            };
        }
      });
      toggleLoading(false)
    }
  }

  const confirmAndLogin = async () => {
    let username = confirmInput.email;
    let tempPassword = 'xIconoclast.5x';
    let password = passwordInput.password;
    let code = confirmInput.code;
    toggleLoading(true)
    try {
      const confirmRes = await Auth.confirmSignUp(username, code);
      console.log(confirmRes);

      const user = await Auth.signIn(username, tempPassword);
      const changePasswordRes = await Auth.changePassword(user, tempPassword, password);
      console.log(changePasswordRes);

      dispatch({ type: 'LOG_IN', payload: { email: username, authId: user.username } });

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
              }
          }
        });
        toggleLoading(false);
      }
    }
  }

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
    }
  };

  const handleSubmit = () => {
    validation();
  };

  return (
    <div className='w-full h-screen flex flex-row items-center justify-center bg-opacity-10 text-sm'>
      <div className='w-auto h-auto flex flex-row rounded-xl shadow-2xl'>
        <div className='login w-140 min-w-sm max-w-sm bg-white rounded-l-xl pt-0'>
          <div className='h-.7/10  w-full rounded-tl-xl'></div>
          <div className='relative h-9.3/10 flex flex-col items-center p-8'>
            <div className='absolute text-center text-xs mb-4' style={{ bottom: '0' }}>
              <p>© Copyright 2020</p>
              <p>
                <NavLink className='underline text-sm hover:text-blue-500' to='/privacy-policy'>
                  Privacy Policy
                  </NavLink>
              </p>
            </div>
            <div className='h-24 w-56'>
              <img
                className=''
                src='https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg'
                alt='Iconoclast Artists'
              />
            </div>

            <div className='w-full h-1/10 flex flex-col justify-around'>
              <div className='text-3xl text-xl text-center text-base mb-4 text-gray-800 font-bold'>
                Enter New Password
              </div>
            </div>
            <div className='w-full h-1/10 flex flex-col justify-around'>
              <div className='text-center text-sm text-gray-700'>
                Your password must be at least 8 characters long and include uppercase and lowercase
              </div>
            </div>

            <div className='h-3.5/10 flex-grow flex flex-col justify-center'>
              <div className='w-full h-1/10 flex flex-col justify-around items-center'>
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
              <div className='input relative w-full'>
                <div style={{ right: 0 }} className='absolute w-6'>
                  <div
                    onClick={() => setNewPassToggle(!newPassToggle)}
                    className='text-gray-500 cursor-pointer hover:text-grayscale'>
                    {newPassToggle ? (
                      <IconContext.Provider value={{ size: '1.5rem' }}>
                        <AiOutlineEye />
                      </IconContext.Provider>
                    ) : (
                        <IconContext.Provider value={{ size: '1.5rem' }}>
                          <AiOutlineEyeInvisible />
                        </IconContext.Provider>
                      )}
                  </div>
                </div>

                <div className='icon'>
                  <IconContext.Provider value={{ size: '1.5rem' }}>
                    <FaKey />
                  </IconContext.Provider>
                </div>
                <label className='hidden' htmlFor='password'>
                  New Password
                  </label>
                <input
                  className='w-full bg-off-white px-2 py-1 ml-2'
                  placeholder='New Password'
                  type={newPassToggle ? 'text' : 'password'}
                  id='password'
                  name='password'
                  value={passwordInput.password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleEnter}
                />
              </div>
            </div>

            <div className='h-3/10 flex flex-col justify-center items-center'>
              <div
                className='cursor-pointer text-center rounded-lg bg-dark-red text-gray-200 mb-2'
                style={{ borderRadius: '2rem', padding: '.75rem' }}
                onKeyPress={handleEnter}
                onClick={handleSubmit}>
                Login
                </div>
              {isLoading && (
                <IconContext.Provider
                  value={{ size: '1.5rem', color: '#488AC7', className: 'relative animate-spin' }}>
                  <AiOutlineLoading3Quarters />
                </IconContext.Provider>
              )}
              {/* <NavLink to='/login'>
                <div className='text-bold text-center text-blueberry hover:text-blue-500'>
                  Back to login
                  </div>
              </NavLink> */}
            </div>
          </div>
        </div>

        <div className='login w-140 min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 bg-login-bg bg-cover bg-center'></div>

      </div>
    </div>
  );
};

export default ConfirmCode;
