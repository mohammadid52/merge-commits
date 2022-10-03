import Auth from '@aws-amplify/auth';
import FormInput from '@components/Atoms/Form/FormInput';
import React, {useContext, useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {getAsset} from '../../assets';
import {GlobalContext} from '../../contexts/GlobalContext';
import AuthCard from './AuthCard';
const Forgot = () => {
  const history = useHistory();
  const {theme, state, dispatch, clientKey} = useContext(GlobalContext);
  let [message, setMessage] = useState<{show: boolean; type: string; message: string}>({
    show: false,
    type: '',
    message: ''
  });
  const [input, setInput] = useState({
    email: '',
    password: ''
  });

  async function forgotPassword() {
    let username = input.email;

    try {
      const user = await Auth.forgotPassword(username);
      setMessage(() => {
        return {
          show: true,
          type: 'success',
          message: 'Please check your email for further instructions.'
        };
      });
    } catch (error) {
      console.error('error signing in', error);
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
        switch (error.code) {
          case 'UserNotFoundException':
            return {
              show: true,
              type: 'error',
              message: 'The email you entered was not found'
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
      forgotPassword();
    }
  };

  const handleSubmit = () => {
    forgotPassword();
  };

  return (
    <AuthCard title="Forgot Password">
      <div className="">
        <FormInput
          label="Email"
          className="mb-4"
          placeHolder="Enter your email"
          type="email"
          value={input.email}
          id="email"
          onChange={handleChange}
        />
        <div className="w-auto ml-2 leading-5 text-xs text-gray-600 text-center">
          Enter your email to reset your password
        </div>
      </div>

      <div className="">
        <button
          className={`p-3 my-4 ${getAsset(
            clientKey,
            'authButtonColor'
          )} text-gray-200 rounded-xl font-semibold`}
          onKeyPress={handleEnter}
          onClick={handleSubmit}>
          Submit
        </button>
        <NavLink to="/login">
          <div className="text-center text-sm text-blueberry hover:text-blue-500">
            Go back to login!
          </div>
        </NavLink>
      </div>
    </AuthCard>
  );
};

export default Forgot;
