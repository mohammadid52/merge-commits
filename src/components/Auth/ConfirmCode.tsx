import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaKey } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { useHistory, useLocation, Link, NavLink } from 'react-router-dom';
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
    const [ passwordInput, setPasswordInput ] = useState({
        password: '',
        match: '',
    })
    const [passToggle, setPassToggle] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [newPassToggle, setNewPassToggle] = useState(false);

    useEffect(() => {
      populateConfirmationCode();
    }, []);

    const populateConfirmationCode = () =>{
      const pathName = location.pathname.replace(/\/$/, "");                     // removed trailing slashes from the pathname.
      const confirmCode = pathName.substring(pathName.lastIndexOf('/') + 1);     
      const isValid = /^\d{6}$/gm.test(confirmCode)                              // validate element to have 6 digit number. e.g. 234567
      if(isValid){
        setConfirmInput({
          ...confirmInput,
          code:confirmCode
        })
      }else{
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
                        message: 'The email you entered was not found',
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

          if(error.code === 'NotAuthorizedException'){
            resetPassword();
          }else{            
            setMessage(()=>{
              switch(error.code){
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
                    message: 'Please enter registered email id',
                  }
              }
            });
            toggleLoading(false);
          }
        }
    }
  
    async function reset() {
      // if ( input.password !== input.match ) {
      //     return setMessage(() => {
      //         return {
      //             show: true,
      //             type: 'error',
      //             message: 'Passwords do not match',
      //         }
      //     })
      // }
  
      let username = confirmInput.email;
      let password = passwordInput.password;
      let match = passwordInput.match;
      let code = confirmInput.code;
  
      try {
        const forgot = await Auth.forgotPasswordSubmit(username, code, password);
        // .then(data => console.log(data))
        // .catch(err => console.log(err));
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
                message: 'The email you entered was not found',
              };
            case 'CodeMismatchException':
              return {
                show: true,
                type: 'error',
                message: 'The confirmation code you provided is not correct',
              };
            default:
              return {
                show: true,
                type: 'error',
                message: error.message,
              };
          }
        });
      }
    }
  
    const validation = () => {
      let validated = false;
  
      setMessage(() => {
        let username = confirmInput.email;
        let password = passwordInput.password;
        let match = passwordInput.match;
        let code = confirmInput.code;
        if (!username) {
          return {
            show: true,
            type: 'error',
            message: 'Please enter your email',
          };
        }
        if (!username.includes('@')) {
          return {
            show: true,
            type: 'error',
            message: 'Your email is not in the expected email address format',
          };
        }
        if (!code) {
          return {
            show: true,
            type: 'error',
            message: 'Invalid account confirmation URL. Please check your email',
          };
        }
        if (!password) {
          return {
            show: true,
            type: 'error',
            message: 'Please enter your new password',
          };
        }
        if (!match) {
          return {
            show: true,
            type: 'error',
            message: 'Please enter your confirmation password',
          };
        }
        if (password !== match) {
          return {
            show: true,
            type: 'error',
            message: 'Your new password and confirmation password do not match',
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
  
    const handleConfirmChange = (e: { target: { id: any; value: any } }) => {
      const { id, value } = e.target;
      setConfirmInput((input) => {
        if (id === 'email') {
          return {
            ...input,
            [id]: value.toLowerCase(),
          };
        } else {
          return {
            ...input,
            [id]: value,
          };
        }
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
                <div className='text-center text-sm text-gray-700'>
                  Password must be at least 8 characters and include uppercase and lowercase
                </div>
              </div>
  
              <div className='h-4.5/10 flex-grow flex flex-col justify-center'>
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
  
                <div className='input pt-0'>
                  <div className='icon pt-0'>
                    <IconContext.Provider value={{ size: '1.5rem' }}>
                      <MdEmail />
                    </IconContext.Provider>
                  </div>
                  <label className='hidden' htmlFor='email'>
                    Email
                  </label>
                  <input
                    className='w-full bg-off-white px-2 py-1 ml-2'
                    placeholder='Email'
                    type='text'
                    id='email'
                    name='email'
                    value={confirmInput.email}
                    onChange={handleConfirmChange}
                    onKeyDown={handleEnter}
                  />
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
  
                <div className='input relative w-full'>
                  <div style={{ right: 0 }} className='absolute w-6'>
                    <div
                      onClick={() => setPassToggle(!passToggle)}
                      className='text-gray-500 cursor-pointer hover:text-grayscale'>
                      {passToggle ? (
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
                  <label className='hidden' htmlFor='match'>
                    Confirm Password
                  </label>
                  <input
                    className='w-full bg-off-white px-2 py-1 ml-2'
                    placeholder='Confirm Password'
                    type={passToggle ? 'text' : 'password'}
                    id='match'
                    name='match'
                    value={passwordInput.match}
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
                      Enter Iconoclast Artists
                </div>
                {isLoading && (
                <IconContext.Provider
                  value={{ size: '1.5rem', color: '#488AC7', className: 'relative animate-spin' }}>
                  <AiOutlineLoading3Quarters />
                </IconContext.Provider>
              )}
                <NavLink to='/login'>
                  <div className='text-bold text-center text-blueberry hover:text-blue-500'>
                    Back to login
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
  
          <div className='login w-140 min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 bg-login-bg bg-cover bg-center'></div>
  
        </div>
      </div>
    );
  };

export default ConfirmCode;
