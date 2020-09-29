import React, { useContext, useState } from 'react';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import { useHistory } from 'react-router-dom';
import DropdownForm from './DropdownForm';
import { UserInfo } from './User';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';

interface UserInfoProps {
  user: UserInfo;
  status: string;
  getUserById: (id: string) => void;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const UserEdit = (props: UserInfoProps) => {
  const history = useHistory();
  const { user, status, getUserById, setStatus } = props;
  const [editUser, setEditUser] = useState(user);

  async function updatePerson() {
    const input = {
      id: editUser.id,
      authId: editUser.authId,
      firstName: editUser.firstName,
      grade: editUser.grade,
      image: editUser.image,
      language: editUser.language,
      lastName: editUser.lastName,
      preferredName: editUser.preferredName,
      role: editUser.role,
      status: editUser.status,
      phone: editUser.phone,
      birthdate: editUser.birthdate,
      email: editUser.email,
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, { input: input })
      );
      setStatus('loading');
      history.goBack();
    } catch (error) {
      console.error(error);
    }
  }

  async function setPerson() {
    const updateUser = await updatePerson();
    const get = await getUserById(editUser.id);
  }

  const onSubmit = (e: any) => {
    setPerson();
    e.preventDefault();
  };

  const onChange = (e: any) => {
    const { id, value } = e.target;
    setEditUser(() => {
      return {
        ...editUser,
        [id]: value,
      };
    });
  };

  const handleChangeStatus = (item: { name: string; code: string }) => {
    setEditUser(() => {
      return {
        ...editUser,
        status: item.code,
      };
    });
  };

  const handleChangeRole = (item: { name: string; code: string }) => {
    setEditUser(() => {
      return {
        ...editUser,
        role: item.code,
      };
    });
  };

  const Status = [
    {
      code: 'ACTIVE',
      name: 'Active',
    },
    {
      code: 'SUSPENDED',
      name: 'Suspended',
    },
    {
      code: 'INACTIVE',
      name: 'Inactive',
    },
    {
      code: 'HOLD',
      name: 'Hold',
    },
  ];

  const Role = [
    {
      code: 'ADM',
      name: 'Admin',
    },
    {
      code: 'BLD',
      name: 'Builder',
    },
    {
      code: 'FLW',
      name: 'Fellow',
    },
    {
      code: 'CRD',
      name: 'Coordinator',
    },
    {
      code: 'TR',
      name: 'Teacher',
    },
    {
      code: 'ST',
      name: 'Student',
    },
  ];

  if (status !== 'done') {
    return <LessonLoading />;
  }
  {
    return (
      <div className='h-full w-full md:px-2 pt-2'>
        <form onSubmit={onSubmit}>
          <div className='h-full shadow-5 bg-white sm:rounded-lg mb-4'>
            <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Edit Information
              </h3>
            </div>

            <div className='h-full px-4 py-5 sm:px-6'>
              <div className='grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6'>
                <div className='sm:col-span-3 px-2'>
                  <label
                    htmlFor='firstName'
                    className='block text-m font-medium leading-5 text-gray-700'>
                    First name
                  </label>
                  <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                    <input
                      id='firstName'
                      type='text'
                      onChange={onChange}
                      className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                      defaultValue={user.firstName}
                    />
                  </div>
                </div>

                <div className='sm:col-span-3 px-2'>
                  <label
                    htmlFor='lastName'
                    className='block text-m font-medium leading-5 text-gray-700'>
                    Last name
                  </label>
                  <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                    <input
                      id='lastName'
                      type='text'
                      onChange={onChange}
                      className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                      defaultValue={user.lastName}
                    />
                  </div>
                </div>

                {/* <div className="sm:col-span-3">
                            <label htmlFor="photo" className="block text-m leading-5 font-medium text-gray-700">
                                Photo
                            </label>
                            <div className="mt-2 flex items-center">
                                <span className="h-8 w-8 rounded-full bg-gray-100">
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                </span>
                                <span className="ml-5 rounded-md shadow-sm">
                                <button type="button" className="py-2 px-3 border border-gray-300 rounded-md text-m leading-4 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
                                    Change
                                </button>
                                </span>
                            </div>
                        </div> */}

                <div className='sm:col-span-3 px-2'>
                  <label
                    htmlFor='preferredName'
                    className='block text-sm font-medium leading-5 text-gray-700'>
                    Nickname
                  </label>
                  <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                    <input
                      id='preferredName'
                      type='text'
                      onChange={onChange}
                      className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                      defaultValue={user.preferredName}
                    />
                  </div>
                </div>

                <div className='sm:col-span-3 px-2'>
                  <DropdownForm
                    value=''
                    style={false}
                    handleChange={handleChangeStatus}
                    userInfo={editUser.status}
                    label='Status'
                    id='status'
                    items={Status}
                  />
                </div>

                <div className='sm:col-span-3 px-2'>
                  <DropdownForm
                    value=''
                    style={false}
                    handleChange={handleChangeRole}
                    userInfo={editUser.role}
                    label='Role'
                    id='role'
                    items={Role}
                  />
                </div>

                <div className='sm:col-span-3 px-2'>
                  <label
                    htmlFor='phone'
                    className='block text-m font-medium leading-5 text-gray-700'>
                    Contact Number
                  </label>
                  <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                    <input
                      id='phone'
                      onChange={onChange}
                      className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                      defaultValue={user.phone}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='h-full bg-white shadow-5 sm:rounded-lg'>
            <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Edit Institution Information
              </h3>
            </div>

            <div className='h-full px-4 py-5 sm:px-6'>
              <div className='grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6'>
                <div className='sm:col-span-3 px-2'>
                  <label
                    htmlFor='institution'
                    className='block text-m font-medium leading-5 text-gray-700'>
                    Institution
                  </label>
                  <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                    <input
                      id='institution'
                      type='text'
                      onChange={onChange}
                      className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                      defaultValue={user.institution}
                    />
                  </div>
                </div>

                <div className='sm:col-span-3 px-2'>
                  <label
                    htmlFor='grade'
                    className='block text-m font-medium leading-5 text-gray-700'>
                    Grade
                  </label>
                  <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                    <input
                      id='grade'
                      onChange={onChange}
                      className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                      defaultValue={user.grade}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='px-4 pt-4 w-full flex justify-end'>
            <div className='flex w-4/10'>
              <span className='inline-flex rounded-md shadow-sm'>
                <button
                  type='button'
                  onClick={history.goBack}
                  className='py-2 px-4 border border-gray-300 rounded-md text-m leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out'>
                  Cancel
                </button>
              </span>
              <span className='ml-3 inline-flex rounded-md shadow-sm'>
                <button
                  type='submit'
                  className='inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out'>
                  Save
                </button>
              </span>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default UserEdit;
