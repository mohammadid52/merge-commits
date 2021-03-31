import React, { useState } from 'react';
import { Auth } from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';


/**
 * About the QuickRegister functionality:
 *
 *
 *
 */


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

const initialState: newUserInput = {
  key: 0,
  authId: '',
  email: '',
  password: 'xIconoclast.5x',
  firstName: '',
  lastName: '',
  phone: '',
  birthdate: '',
  grade: '',
  role: '',
  externalId: '',
  message: {
    show: false,
    text: '',
    type: '',
  },
};

interface QuickRegisterProps {
  active: boolean;
  setQuickRegister: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuickRegister = (props: QuickRegisterProps) => {
  const { active, setQuickRegister } = props;

  const [newUserInputs, setNewUserInputs] = useState(initialState);
  const [waiting, setWaiting] = useState<boolean>(false);

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
      authId: authId,
      status: 'ACTIVE',
      role: 'ST',
      email: newUserInputs.email,
      firstName: newUserInputs.firstName,
      lastName: newUserInputs.lastName,
      phone: newUserInputs.phone,
      birthdate: newUserInputs.birthdate,
      externalId: newUserInputs.externalId,
      grade: newUserInputs.grade,
      language: 'EN',
    };

    try {
      await API.graphql(graphqlOperation(mutations.createPerson, { input: userData }));
      handleMessage('success', 'User registered successfully');
      setNewUserInputs((prev) => {
        return {
          ...prev,
          key: 0,
          authId: '',
          email: '',
          password: 'xIconoclast.5x',
          firstName: '',
          lastName: '',
          phone: '',
          birthdate: '',
          grade: '',
          role: '',
          externalId: '',
        };
      });
    } catch (error) {
      if (error.errors[0].message.includes('coerced')) {
        handleMessage('success', 'User registered successfully');
      } else {
        handleMessage('error', error.message);
      }
    } finally {
      setTimeout(() => {
        setNewUserInputs(initialState);
        setWaiting(false);
      }, 1000);
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



  const handleSubmit = () => {
    setWaiting(true);
    validation();
  };

  return (
    <div
      className={`${
        !active ? 'hidden' : 'display'
      } fixed z-100 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50`}>
      <div className="flex flex-col w-128 p-4 overflow-hidden bg-white shadow-xl rounded-lg">
        <div className="w-full flex flex-row justify-between">
          <h1 className="text-3xl font-open font-medium">Quick Register</h1>
          <span
            className={`text-right font-bold hover:text-blueberry text-gray-700 hover:text-lg hover:cursor-pointer`}
            onClick={() => setQuickRegister(false)}>
            Close
          </span>
        </div>

        {newUserInputs.message.type === 'success' ? <>Registration succeeded!</> : null}

        <form>
          <div>
            <div className="border border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm">
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={handleChange}
                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                value={`${newUserInputs.firstName}`}
                placeholder="First Name"
              />
            </div>
            <span className={'text-xs text-dark-red'}>
              {message.type === 'error' && message.field === 'firstName' ? message.message : null}
            </span>
          </div>

          <div>
            <div className="border border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm">
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={handleChange}
                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                value={`${newUserInputs.lastName}`}
                placeholder="Last Name"
              />
            </div>
            <span className={'text-xs text-dark-red'}>
              {message.type === 'error' && message.field === 'lastName' ? message.message : null}
            </span>
          </div>

          <div>
            <div className="border border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm">
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                value={`${newUserInputs.email}`}
                placeholder="email@email.com"
              />
            </div>
            <span className={'text-xs text-dark-red'}>
              {message.type === 'error' && message.field === 'email' ? message.message : null}
            </span>
          </div>
        </form>

        <span className={'text-xs text-dark-red'}>
          {message.type === 'error' && message.field === 'lastName' ? message.message : null}
        </span>

        <div className="w-full flex flex-col justify-center">
          <span className="w-full flex inline-flex rounded-xl shadow-sm">
            {waiting ? (
              <button className=" bg-light-gray bg-opacity-20 text-white  inline-flex justify-center w-full rounded-xl border border-transparent px-4 py-2 mt-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                Registering...
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className=" bg-sea-green hover:bg-green-500 text-white focus:border-green-100 focus:shadow-outline-indigo  inline-flex justify-center w-full rounded-xl border border-transparent px-4 py-2 mt-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                Submit
              </button>
            )}
          </span>

          <p className={'mt-2 text-xs text-center'}>
            The students will receive an e-mail to confirm their registration (please ask them to check their spam
            folder!)
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickRegister;
