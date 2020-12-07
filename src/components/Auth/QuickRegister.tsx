import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import DropdownForm from '../../components/Dashboard/Admin/UserManagement/DropdownForm';

interface newUserInput {
  key: number;
  authId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  grade: string;
  role: string;
  externalId: string;
  message: {
    show: boolean;
    text: string;
    type: string;
  };
}

const initialState = {
  id: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  dob: '',
  test: '',
  message: {
    show: false,
    text: '',
    type: '',
  },
};

const QuickRegister = () => {
  const history = useHistory();

  const [newUserInputs, setNewUserInputs] = useState(initialState);

  const [message, setMessage] = useState<{
    show: boolean;
    type: string;
    message: string;
    field: string;
  }>({
    show: false,
    type: '',
    message: '',
    field: '',
  });

  const handleMessage = (type: string, text: string) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        message: {
          show: true,
          text: text,
          type: type,
        },
      };
    });
  };

  async function registerUser(authId: string) {
    let userData = {
      authId: newUserInputs.id,
      status: 'ACTIVE',
      role: 'ST',
      email: newUserInputs.email,
      firstName: newUserInputs.firstName,
      lastName: newUserInputs.lastName,
      // insitution: '1',
      phone: newUserInputs.phone,
      // birthdate: input.dob,
      language: 'EN',
    };

    try {
      const newPerson = await API.graphql(
        graphqlOperation(mutations.createPerson, { input: userData })
      );
      handleMessage('success', 'User registered successfully');
      setNewUserInputs((prev) => {
        return {
          ...prev,
          authId: newUserInputs.id,
          status: 'ACTIVE',
          role: 'ST',
          email: newUserInputs.email,
          firstName: newUserInputs.firstName,
          lastName: newUserInputs.lastName,
          // insitution: '1',
          phone: newUserInputs.phone,
          // birthdate: input.dob,
          language: 'EN',
        };
      });
    } catch (error) {
      console.error('error registering user:', error);
      handleMessage('error', error.message);
    } finally {
      setNewUserInputs(initialState);
    }
  }

  async function signUp() {
    let username = newUserInputs.email;
    let password = newUserInputs.password;
    try {
      const user = await Auth.signUp({
        username,
        password,
      });
      setNewUserInputs(() => {
        return {
          ...newUserInputs,
          authId: user.userSub,
        };
      });
      registerUser(user.userSub);
    } catch (error) {
      console.log('error signing up:', error);
      setMessage(() => {
        switch (error.code) {
          case 'InvalidParameterException':
            return {
              show: true,
              type: 'success',
              message: "Please make sure the user's email is correct",
              field: 'email',
            };
          case 'UsernameExistsException':
            return {
              show: true,
              type: 'error',
              message: 'An account with this email exists',
              field: 'email',
            };
          default:
            return {
              show: true,
              type: 'error',
              message: error.message,
              field: 'email',
            };
        }
      });
      handleMessage('error', error.message);
    }
  }

  const validation = () => {
    let validated = false;

    setMessage(() => {
      let username = newUserInputs.email;
      let password = newUserInputs.password;
      if (!newUserInputs.firstName) {
        return {
          show: true,
          type: 'error',
          message: "User's first name cannot be blank",
          field: 'firstName',
        };
      }
      if (!newUserInputs.lastName) {
        return {
          show: true,
          type: 'error',
          message: "User's last name cannot be blank",
          field: 'lastName',
        };
      }
      if (!username) {
        return {
          show: true,
          type: 'error',
          message: "User's email cannot be blank",
          field: 'email',
        };
      }
      if (!username.includes('@')) {
        return {
          show: true,
          type: 'error',
          message: "User's email is not in the expected email address format",
          field: 'email',
        };
      }

      validated = true;
      if (validated) {
        signUp();
      }
      return {
        show: true,
        type: 'loading',
        message: 'Loading...',
        field: '',
      };
    });
  };

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setNewUserInputs(() => {
      if (id === 'email') {
        return {
          ...newUserInputs,
          [id]: value.toLowerCase(),
        };
      } else {
        return {
          ...newUserInputs,
          [id]: value,
        };
      }
    });
  };

  const handleChangeRole = (item: { name: string; code: string }) => {
    setNewUserInputs(() => {
      return {
        ...newUserInputs,
        role: item.code,
      };
    });
  };

  const handleSubmit = (e: any) => {
    validation();
  };

  return (
    <>
      <div className='flex flex-col w-128 p-4 overflow-hidden bg-white shadow-xl rounded-lg'>
        <div className='w-full flex flex-col justify-between'>
          <h1 className='text-3xl font-open font-medium'>Quick Register</h1>
        </div>

        {newUserInputs.message.type === 'success' ? (
          <>Congrats</>
        ) : (
          <form>
            <div>
              <div className='border border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm'>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  onChange={handleChange}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                  value={`${newUserInputs.firstName}`}
                  placeholder='First Name'
                />
              </div>
              <span className={'text-xs text-dark-red'}>
                {message.type === 'error' && message.field === 'firstName' ? message.message : null}
              </span>
            </div>

            <div>
              <div className='border border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm'>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  onChange={handleChange}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                  value={`${newUserInputs.lastName}`}
                  placeholder='Last Name'
                />
              </div>
              <span className={'text-xs text-dark-red'}>
                {message.type === 'error' && message.field === 'lastName' ? message.message : null}
              </span>
            </div>

            <div>
              <div className='border border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  onChange={handleChange}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                  value={`${newUserInputs.email}`}
                  placeholder='email@email.com'
                />
              </div>
              <span className={'text-xs text-dark-red'}>
                {message.type === 'error' && message.field === 'email' ? message.message : null}
              </span>
            </div>
          </form>
        )}
        <span className={'text-xs text-dark-red'}>
          {message.type === 'error' && message.field === 'lastName' ? message.message : null}
        </span>

        <div className='w-full flex flex-col justify-center'>
          <span className='w-full flex inline-flex rounded-xl shadow-sm'>
            <button
              type='submit'
              onClick={handleSubmit}
              className=' bg-sea-green hover:bg-green-500 text-white focus:border-green-100 focus:shadow-outline-indigo  inline-flex justify-center w-full rounded-xl border border-transparent px-4 py-2 mt-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5'>
              Submit
            </button>
          </span>
          <p className={'mt-2 text-xs text-center'}>
            The students will now receive an e-mail to confirm their registration (please ask them
            to check their spam folder!)
          </p>
        </div>
      </div>
    </>
  );
};

export default QuickRegister;
