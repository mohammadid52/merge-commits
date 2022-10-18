import React, {useContext, useState} from 'react';
// import { Auth } from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import {getAsset} from 'assets';
import AuthCard from 'components/Auth/AuthCard';
import {GlobalContext} from 'contexts/GlobalContext';
import {useCookies} from 'react-cookie';
import {FaUnlockAlt} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {MdEmail} from 'react-icons/md';
import {NavLink, useHistory} from 'react-router-dom';
const Registration = () => {
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['confirm_user']);
  const {clientKey} = useContext(GlobalContext);
  const [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [input, setInput] = useState({
    email: '',
    code: ''
  });

  async function confirmSignUp() {
    let username = input.email;
    let code = input.code;
    try {
      setCookie('confirm_user', input.email);
      let res = await Auth.confirmSignUp(username, code);
      // console.log(res);
      history.push('/new-password');
    } catch (error) {
      console.log('error confirming sign up', error);
      /////change the error code
      setMessage(() => {
        if (!username) {
          return {
            show: true,
            type: 'error',
            message: 'Please enter your email'
          };
        }
        if (!username.includes('@')) {
          return {
            show: true,
            type: 'error',
            message: 'Your email is not in the expected email address format'
          };
        }
        if (!code) {
          return {
            show: true,
            type: 'error',
            message: 'Please enter your confirmation code'
          };
        }
        switch (error.code) {
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message: 'The email you entered was not found'
            };
          default:
            return {
              show: true,
              type: 'error',
              message: error.message
            };
        }
      });
    }
  }

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
      confirmSignUp();
    }
  };

  const handleSubmit = (e: any) => {
    confirmSignUp();
  };

  return (
    <AuthCard>
      <div className="w-full h-screen flex flex-row items-center justify-center bg-opacity-10 text-sm">
        <div className="w-auto h-auto flex flex-row rounded-xl">
          <div className="login w-140 min-w-sm max-w-sm bg-white rounded-l-xl pt-0">
            <div className="h-.7/10  w-full rounded-tl-xl"></div>
            <div className="relative h-9.5/10 flex flex-col items-center p-8">
              <div className="absolute text-center text-xs mb-4" style={{bottom: '0'}}>
                <p>© Copyright 2021</p>
                <p>
                  <NavLink
                    className="underline text-sm hover:text-blue-500"
                    to="/privacy-policy">
                    Privacy Policy
                  </NavLink>
                </p>
              </div>
              <div className="h-24 w-56">
                <img
                  className=""
                  src={getAsset(clientKey, 'login_page_logo')}
                  alt="Logo"
                />
              </div>
              <div className="h-4.5/10 flex-grow flex flex-col justify-center">
                <div className="w-full h-1/10 flex justify-center items-center">
                  {message.show ? (
                    <p
                      className={`text-sm text-center ${
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

                <div className="input">
                  <div className="icon">
                    <IconContext.Provider value={{size: '1.5rem'}}>
                      <MdEmail />
                    </IconContext.Provider>
                  </div>
                  <label className="hidden" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full px-2 py-1 ml-2 bg-off-white"
                    placeholder="Email"
                    type="text"
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="input">
                  <div className="icon">
                    <IconContext.Provider value={{size: '1.5rem'}}>
                      <FaUnlockAlt />
                    </IconContext.Provider>
                  </div>
                  <label className="hidden" htmlFor="code">
                    Confirmation Code
                  </label>
                  <input
                    className="w-full bg-off-white px-2 py-1 ml-2"
                    placeholder="Confirmation Code"
                    type="text"
                    id="code"
                    name="code"
                    value={input.code}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="h-3/10 flex flex-col justify-center items-center">
                <button
                  className={`${getAsset(
                    clientKey,
                    'authButtonColor'
                  )} text-gray-200 rounded shadow-elem-light mb-4`}
                  onKeyPress={handleEnter}
                  onClick={handleSubmit}>
                  Confirm Code
                </button>
              </div>
            </div>
          </div>

          <div
            className={`login w-140 min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 ${getAsset(
              clientKey,
              'authBackground'
            )} bg-cover bg-center`}></div>
        </div>
      </div>
    </AuthCard>
  );
};

export default Registration;
