import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { MdEmail } from 'react-icons/md';
import { useHistory, NavLink } from 'react-router-dom';
// import { Auth } from 'aws-amplify';
import Auth from '@aws-amplify/auth';

const Forgot = () => {
  const history = useHistory();
  const { theme, state, dispatch } = useContext(GlobalContext);
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
    <div className='w-full h-screen flex flex-col items-center justify-center text-sm'>
      <div className='w-auto h-auto flex flex-row rounded-xl shadow-2xl'>
        <div className='login w-140 min-w-sm max-w-sm bg-white rounded-l-xl pt-0'>
          <div className='h-.7/10 w-full rounded-t-xl'></div>
          <div className='relative h-9.3/10 flex flex-col items-center justify-center p-8'>
            <div className='absolute text-center text-xs mb-3' style={{ bottom: '0' }}>
              <p>© Copyright 2020</p>
              <p>
                <NavLink className='underline text-sm hover:text-blue-500' to='/privacy-policy'>
                  Privacy Policy
                </NavLink>
              </p>
            </div>
            <div className='h-24 w-56'>
              <img
                src='https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg'
                alt='Iconoclast Artists'
              />
            </div>

            

            <div className='h-2.5/10 flex-grow flex flex-col justify-center'>
              <div className='w-full h-1/10 flex justify-center items-center'>
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

              <div className='input'>
                <div className='icon'>
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
                  value={input.email}
                  onChange={handleChange}
                />
              </div>
              <div className='h-2/10 flex justify-center items-center text-center text-sm text-gray-800'>
              Enter your email to reset your password
            </div>
            </div>

            <div className='h-3.5/10 flex flex-col justify-center items-center'>
              <button
                className='bg-dark-red text-gray-200 rounded-xl mb-4'
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
        <div className='login w-140 min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 bg-login-bg bg-cover bg-center'></div>
        {/* <div className="absolute w-full h-screen scale-110 bg-login-bg" style={{filter: 'blur(24px)', WebkitFilter: 'blur(24px)'}}></div> */}
      </div>
    </div>
  );
};

export default Forgot;
