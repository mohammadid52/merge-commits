import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { MdEmail } from 'react-icons/md';
import { useHistory, NavLink } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import { getAsset } from '../../assets';
const Forgot = () => {
  const history = useHistory();
  const { theme, state, dispatch, clientKey } = useContext(GlobalContext);
  let [message, setMessage] = useState<{ show: boolean; type: string; message: string }>({
    show: false,
    type: '',
    message: '',
  });
  const [input, setInput] = useState({
    email: '',
    password: '',
  });

  async function forgotPassword() {
    let username = input.email;

    try {
      const user = await Auth.forgotPassword(username);
      setMessage(() => {
        return {
          show: true,
          type: 'success',
          message: 'Please check your email for further instructions.',
        };
      })
      
    } catch (error) {
      console.error('error signing in', error);
      setMessage(() => {
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
        switch (error.code) {
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message: 'The email you entered was not found',
            };
          // case "UserNotFoundException":
          //         return {
          //                     show: true,
          //                     type: 'error',
          //                     message: 'Email was not found',
          //                 }
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

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setInput((input) => {
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

  const handleEnter = (e: any) => {
    if (e.key === 'Enter') {
      forgotPassword();
    }
  };

  const handleSubmit = () => {
    forgotPassword();
  };

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center bg-opacity-10 text-sm md:bg-none sm:bg-cover sm:bg-center">
      <div className="w-full md:max-w-160 sm:max-w-100 h-full max-h-160 flex flex-row rounded-xl shadow-2xl">
        <div className="min-w-sm max-w-sm bg-white md:rounded-l-xl sm:rounded-xl pt-0">
          <div className="h-.7/10  w-full rounded-tl-xl"></div>
          <div className="relative h-9.3/10 flex flex-col items-center p-8">
            <div className={`absolute bottom-0 text-center mb-4 leading-5 text-xs text-gray-600`}>
              <p>© Copyright 2021</p>
              <p>
                <NavLink className="underline text-xs hover:text-blue-500" to="/privacy-policy">
                  Privacy Policy
                </NavLink>
              </p>
            </div>
            <div className="h-24 w-56">
              <img className="" src={getAsset(clientKey, 'login_page_logo')} alt="login_page_logo" />
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

              <div className='input'>
                <label className='hidden' htmlFor='email'>
                  Email
                </label>
                <input
                  className='"w-full p-3 border border-medium-gray border-opacity-20 rounded-lg bg-light-gray bg-opacity-10'
                  placeholder='Email'
                  type='text'
                  id='email'
                  name='email'
                  value={input.email}
                  onChange={handleChange}
                />
              </div>
              <div className='w-auto ml-2 leading-5 text-xs text-gray-600 text-center'>
              Enter your email to reset your password
            </div>
            </div>

            <div className='h-3.5/10 flex flex-col justify-center items-center'>
              <button
                className={`p-3 mb-4 ${getAsset(clientKey, 'authButtonColor')} text-gray-200 rounded-xl font-semibold`}
                onKeyPress={handleEnter}
                onClick={handleSubmit}>
                Submit
              </button>
              <NavLink to='/login'>
                <div className='text-center text-sm text-blueberry hover:text-blue-500'>Go back to login!</div>
              </NavLink>
            </div>
          </div>
        </div>
        <div className={`md:inline-block sm:hidden xs:hidden min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 ${getAsset(clientKey, 'authBackground')} bg-cover bg-center`}></div>
      </div>
    </div>
  );
};

export default Forgot;
