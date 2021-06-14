import React, {useState, useEffect} from 'react';
import {Auth} from '@aws-amplify/auth';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import * as customMutations from '../../customGraphql/customMutations';
import {useCookies} from 'react-cookie';
import axios from 'axios';
import { createUserUrl } from '../../utilities/urls';

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
  const {active, setQuickRegister} = props;
  const [newUserInputs, setNewUserInputs] = useState(initialState);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [cookies] = useCookies(['room_info']);
  const roomInfoCookie = cookies['room_info'];
  const [classID, setClassID] = useState(roomInfoCookie.classID);

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

  const handleChange = (e: {target: {id: any; value: any}}) => {
    const {id, value} = e.target;
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

  const handleSubmit = async () => {
    setWaiting(true);
    const isValid = validation();
    if (isValid) {
      let userData = await cognitoSignUp();
      const registeredUser = await registerUser(userData);
      await addToClass({...userData, id: registeredUser.id});
      setNewUserInputs(initialState);
      setWaiting(false);
    }
    return;
  };

  const addToClass = async (user: any) => {
    const input = {
      classID,
      studentID: user.id,
      studentAuthID: user.authId,
      studentEmail: user.email,
      status: 'Active',
    };
    let newStudent: any = await API.graphql(
      graphqlOperation(customMutations.createClassStudent, {input})
    );
    newStudent = newStudent.data.createClassStudent;
    return;
  };

  const registerUser = async (userData: any) => {
    let user = {
      authId: userData.authId,
      status: 'ACTIVE',
      role: 'ST',
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      // birthdate: userData.birthdate,
      externalId: userData.externalId,
      grade: userData.grade,
      language: 'EN',
    };
    try {
      let createdPerson: any = await API.graphql(
        graphqlOperation(mutations.createPerson, {input: user})
      );
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
      return createdPerson.data.createPerson;
    } catch (error) {
      if (error.errors[0].message.includes('coerced')) {
        handleMessage('success', 'User registered successfully');
      } else {
        handleMessage('error', error.message);
      }
    }
  };

  const cognitoSignUp = async () => {
    let username = newUserInputs.email;
    try {
      const response = await axios.post(createUserUrl, {
        email: username
      })
      const user = response.data.User;
      let userData = {...newUserInputs, authId: user.Username};
      setNewUserInputs(() => {
        return userData;
      });
      return userData;
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
  };

  const validation = () => {
    let username = newUserInputs.email;
    let isValid = true;
    let msg = {show: true, type: 'loading', message: 'Loading...', field: ''};
    if (!newUserInputs.firstName) {
      isValid = false;
      msg.message = `User's first name cannot be blank`;
      msg.field = 'firstName';
    } else if (!newUserInputs.lastName) {
      isValid = false;
      msg.message = `User's last name cannot be blank`;
      msg.field = 'lastName';
    } else if (!username) {
      isValid = false;
      msg.message = `User's email cannot be blank`;
      msg.field = 'email';
    } else if (!username.includes('@')) {
      isValid = false;
      msg.message = `User's email is not in the expected email address format`;
      msg.field = 'email';
    }
    setMessage(msg);
    return isValid;
  };

  return (
    <div
      className={`${
        !active ? 'hidden' : 'display'
      } fixed z-100 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-50`}>
      <div className="flex flex-col w-128 p-4 overflow-hidden bg-white shadow-xl rounded-lg">
        <div className="w-full flex flex-row justify-between">
          <h1 className="text-3xl  font-medium">Quick Register</h1>
          <span
            className={`text-right font-bold hover:text-blueberry text-gray-700 hover:text-lg hover:cursor-pointer`}
            onClick={() => setQuickRegister(false)}>
            Close
          </span>
        </div>

        {newUserInputs.message.type === 'success' ? <>Registration succeeded!</> : null}

        <form>
          <div>
            <div className="border-0 border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm">
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
              {message.type === 'error' && message.field === 'firstName'
                ? message.message
                : null}
            </span>
          </div>

          <div>
            <div className="border-0 border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm">
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
              {message.type === 'error' && message.field === 'lastName'
                ? message.message
                : null}
            </span>
          </div>

          <div>
            <div className="border-0 border-gray-300 py-2 px-4 my-2  rounded-xl shadow-sm">
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
              {message.type === 'error' && message.field === 'email'
                ? message.message
                : null}
            </span>
          </div>
        </form>

        <span className={'text-xs text-dark-red'}>
          {message.type === 'error' && message.field === 'lastName'
            ? message.message
            : null}
        </span>

        <div className="w-full flex flex-col justify-center">
          <span className="w-full flex inline-flex rounded-xl shadow-sm">
            {waiting ? (
              <button className=" bg-light-gray bg-opacity-20 text-white  inline-flex justify-center w-full rounded-xl  border-0 border-transparent px-4 py-2 mt-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                Registering...
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className=" bg-sea-green hover:bg-green-500 text-white focus:border-green-100 focus:ring-indigo  inline-flex justify-center w-full rounded-xl  border-0 border-transparent px-4 py-2 mt-2 text-base leading-6 font-medium shadow-sm focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                Submit
              </button>
            )}
          </span>

          <p className={'mt-2 text-xs text-center'}>
            The students will receive an e-mail to confirm their registration (please ask
            them to check their spam folder!)
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickRegister;
